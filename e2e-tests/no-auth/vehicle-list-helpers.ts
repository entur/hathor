import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import type { Page } from '@playwright/test';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fixturesDir = path.join(__dirname, '..', 'fixtures');

/**
 * Mock `vehicles(...)` query payload tailored to `/vehicles` scenarios — a
 * 15-row dataset that spans two pages at the default `rowsPerPage=10` and
 * exercises TransportMode variety (rail / bus / unknown-from-backend), with
 * each row carrying an inlined `transportType` per the post-issue-#72 flat
 * projection.
 */
const MOCK_VEHICLES_LIST: unknown = JSON.parse(
  fs.readFileSync(path.join(fixturesDir, 'vehicles-list-mock.json'), 'utf-8')
);

/**
 * Intercept the GraphQL `vehicles(...)` query and return the vehicles-list
 * fixture. Other GraphQL operations on the same endpoint pass through.
 *
 * Matches on the field name `vehicles(` (not on a token like `vehicleTypes`)
 * so the matcher survives query-shape changes that keep the field name
 * stable but rename surrounding operation names.
 */
export const interceptVehicleListQuery = (page: Page) =>
  page.route('**/graphql', async route => {
    const postData = route.request().postDataJSON();
    const query: string = postData?.query ?? '';
    if (query.includes('vehicles(')) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(MOCK_VEHICLES_LIST),
      });
    } else {
      await route.continue();
    }
  });

/**
 * Stateful vehicles list interceptor used by create-flow specs. The baseline
 * 15-row fixture is returned until `addCreated(id)` is called with a positive
 * `lagCalls` — for the next `lagCalls` GraphQL list responses the new id is
 * **still missing** (read-after-write replica lag), and from then on every
 * response includes it. `lagCalls = 0` (the default) makes the row available
 * immediately. Tracks every `vehicles(` request count so specs can assert on
 * wasted/extra fetches.
 */
export const interceptStatefulVehicleListQuery = async (page: Page) => {
  const state = { extraId: null as string | null, lagCalls: 0, callCount: 0 };
  await page.route('**/graphql', async route => {
    const postData = route.request().postDataJSON();
    const query: string = postData?.query ?? '';
    if (!query.includes('vehicles(')) {
      await route.continue();
      return;
    }
    state.callCount += 1;
    const includeExtra = state.extraId !== null && state.lagCalls <= 0;
    if (state.lagCalls > 0) state.lagCalls -= 1;
    const base = JSON.parse(JSON.stringify(MOCK_VEHICLES_LIST)) as {
      data: { vehicles: { content: unknown[]; totalElements: number } };
    };
    if (includeExtra && state.extraId) {
      base.data.vehicles.content.push(makeExtraVehicle(state.extraId));
      base.data.vehicles.totalElements = base.data.vehicles.content.length;
    }
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(base),
    });
  });
  return {
    addCreated: (id: string, lagCalls = 0) => {
      state.extraId = id;
      state.lagCalls = lagCalls;
    },
    callCount: () => state.callCount,
  };
};

const makeExtraVehicle = (id: string) => ({
  id,
  version: 1,
  registrationNumber: 'NEW-001',
  operationalNumber: null,
  transportType: {
    id: 'NMR:VehicleType:bus',
    version: 1,
    name: { value: 'Bus Type' },
    transportMode: 'bus',
  },
});

/** Sobek wraps every multilingual value in a nested `<Text>` element —
 *  `<Name><Text>…</Text></Name>` (confirmed via live probe). Mirror that exact
 *  shape in mocks so the parser is exercised against reality rather than a
 *  friendlier invented `<Name>value</Name>` shape that masks round-trip bugs. */
export const netexName = (value: string) => `<Name><Text>${value}</Text></Name>`;

/** Minimal PublicationDelivery wrapping a single Vehicle. `body` is inserted
 *  inside the `<Vehicle>` element — leave empty for a bare echo, or pass
 *  e.g. `${netexName('X')}<RegistrationNumber>R</RegistrationNumber>`. */
export const vehiclePublicationDelivery = (id: string, body = '') =>
  `<?xml version="1.0" encoding="UTF-8"?>
<PublicationDelivery xmlns="http://www.netex.org.uk/netex">
  <dataObjects>
    <ResourceFrame>
      <vehicles>
        <Vehicle id="${id}" version="1">${body}</Vehicle>
      </vehicles>
    </ResourceFrame>
  </dataObjects>
</PublicationDelivery>`;

/**
 * Intercept POST to the NeTEx import endpoint and return a PublicationDelivery
 * containing a Vehicle with the given id. `parseVehicleImportResponse` then
 * extracts this id as `result.newId`.
 */
export const interceptVehicleImportPost = (page: Page, newId: string) =>
  page.route('**/services/vehicles/netex', async route => {
    if (route.request().method() !== 'POST') {
      await route.continue();
      return;
    }
    await route.fulfill({
      status: 200,
      contentType: 'application/xml',
      body: vehiclePublicationDelivery(newId),
    });
  });

/**
 * Intercept GET on the single-vehicle NeTEx XML endpoint
 * (`/services/vehicles/netex/vehicles/{id}`) and return a minimal but valid
 * Vehicle PublicationDelivery for the requested id. Used so the slider's
 * `useVehicle` hook resolves to a parsed Vehicle (not "Vehicle not found").
 */
export const interceptVehicleNetexGet = (page: Page) =>
  page.route('**/services/vehicles/netex/vehicles/**', async route => {
    if (route.request().method() !== 'GET') {
      await route.continue();
      return;
    }
    const url = new URL(route.request().url());
    const id = decodeURIComponent(url.pathname.split('/').pop() ?? '');
    await route.fulfill({
      status: 200,
      contentType: 'application/xml',
      body: vehiclePublicationDelivery(
        id,
        `${netexName('Newly created')}<RegistrationNumber>NEW-001</RegistrationNumber>`
      ),
    });
  });
