import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import type { Page } from '@playwright/test';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fixturesDir = path.join(__dirname, 'fixtures');

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
 * Intercept the unfiltered GraphQL `vehicles(...)` list query and return the
 * vehicles-list fixture. Other GraphQL operations pass through.
 *
 * Matches on the field name `vehicles(` (not on a token like `vehicleTypes`)
 * so the matcher survives query-shape changes that keep the field name
 * stable but rename surrounding operation names. A `filter.netexIds` query is
 * a *single-vehicle* fetch — this handler falls through on it (symmetric with
 * {@link interceptStatefulVehicleListQuery}) so it stays safe to register
 * standalone: it never answers a by-id fetch with the full list.
 */
export const interceptVehicleListQuery = (page: Page) =>
  page.route('**/graphql', async route => {
    const postData = route.request().postDataJSON();
    const query: string = postData?.query ?? '';
    const netexIds: string[] | undefined = postData?.variables?.filter?.netexIds;
    if (query.includes('vehicles(') && !netexIds) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(MOCK_VEHICLES_LIST),
      });
    } else {
      // Fall through to any handler registered earlier (by-id query, save
      // mutation) rather than straight to the network — `page.route` runs
      // handlers in reverse registration order and `fallback()` chains them.
      await route.fallback();
    }
  });

/**
 * Resolve a single vehicle from the list fixture by NeTEx id — the faithful
 * by-id resolver for specs that deep-link into the slider on a row that exists
 * in {@link interceptVehicleListQuery}'s dataset. Returns `null` for an unknown
 * id (modelling not-found). Pass straight to {@link interceptVehicleByIdQuery}.
 */
export const mockVehicleById = (id: string): VehicleRow | null => {
  const list = MOCK_VEHICLES_LIST as { data: { vehicles: { content: VehicleRow[] } } };
  return list.data.vehicles.content.find(v => v.netexId === id) ?? null;
};

/**
 * Stateful vehicles list interceptor used by create-flow specs. The baseline
 * 15-row fixture is returned until `addCreated(id)` is called with a positive
 * `lagCalls` — for the next `lagCalls` GraphQL list responses the new id is
 * **still missing** (read-after-write replica lag), and from then on every
 * response includes it. `lagCalls = 0` (the default) makes the row available
 * immediately. Tracks every `vehicles(` request count so specs can assert on
 * extra fetches.
 */
export const interceptStatefulVehicleListQuery = async (page: Page) => {
  const state = {
    extraId: null as string | null,
    lagCalls: 0,
    callCount: 0,
  };
  await page.route('**/graphql', async route => {
    const postData = route.request().postDataJSON();
    const query: string = postData?.query ?? '';
    // Only the unfiltered *list* query is this handler's concern. A
    // `filter.netexIds` query is a single-vehicle fetch — let the by-id
    // handler answer it; the save mutation likewise belongs elsewhere.
    const netexIds: string[] | undefined = postData?.variables?.filter?.netexIds;
    if (!query.includes('vehicles(') || netexIds) {
      await route.fallback();
      return;
    }
    state.callCount += 1;
    const includeExtra = state.extraId !== null && state.lagCalls <= 0;
    if (state.lagCalls > 0) state.lagCalls -= 1;
    const base = JSON.parse(JSON.stringify(MOCK_VEHICLES_LIST)) as {
      data: {
        vehicles: { content: { netexId?: string }[]; totalElements: number };
      };
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

const makeExtraVehicle = (id: string) =>
  vehicleRow(id, {
    name: { value: 'Newly created' },
    registrationNumber: 'NEW-001',
    transportType: {
      netexId: 'NMR:VehicleType:bus',
      version: 1,
      name: { value: 'Bus Type' },
      transportMode: 'BUS',
    },
  });

/** A single-vehicle GraphQL row. Mirrors the `vehicles(...)` selection in
 *  `src/graphql/vehicles/queries/fetchVehicles.ts` field-for-field so the mock
 *  exercises `fetchVehicle`'s projection against the real wire shape. All
 *  nullable fields default to null; override per test via {@link vehicleRow}. */
export interface VehicleRow {
  netexId: string;
  version: number;
  name: { value: string } | null;
  registrationNumber: string;
  operationalNumber: string | null;
  buildDate: string | null;
  chassisNumber: string | null;
  description: { value: string } | null;
  registrationDate: string | null;
  transportType: {
    netexId: string;
    version: number;
    name: { value: string } | null;
    transportMode: string | null;
  } | null;
}

/** Build a full single-vehicle row for `id`, with `over` patching any field.
 *  Defaults to a rail vehicle so the row is renderable without every test
 *  re-stating the common fields. */
export const vehicleRow = (id: string, over: Partial<VehicleRow> = {}): VehicleRow => ({
  netexId: id,
  version: 1,
  name: null,
  registrationNumber: 'REG-001',
  operationalNumber: null,
  buildDate: null,
  chassisNumber: null,
  description: null,
  registrationDate: null,
  transportType: {
    netexId: 'NMR:VehicleType:rail',
    version: 1,
    name: { value: 'Rail Type' },
    transportMode: 'RAIL',
  },
  ...over,
});

/**
 * Intercept the single-vehicle GraphQL fetch — a `vehicles(...)` query carrying
 * a `filter.netexIds` — and answer it from `resolve(id)`. This is the GraphQL
 * replacement for the retired NeTEx-XML single-vehicle GET: production
 * `useVehicle` now reads `fetchVehicle` → `vehicles(filter:{netexIds:[id]})`.
 *
 * `resolve` returns the row to serve, or `null` to model "not found" (empty
 * `content`, which surfaces as `useVehicle`'s not-found error). Unfiltered
 * list queries and the save mutation fall through to their own handlers.
 *
 * Register AFTER the list interceptor so it is checked first and only claims
 * the filtered query.
 */
export const interceptVehicleByIdQuery = (page: Page, resolve: (id: string) => VehicleRow | null) =>
  page.route('**/graphql', async route => {
    const postData = route.request().postDataJSON();
    const query: string = postData?.query ?? '';
    const netexIds: string[] | undefined = postData?.variables?.filter?.netexIds;
    if (!query.includes('vehicles(') || !netexIds?.length) {
      await route.fallback();
      return;
    }
    const row = resolve(netexIds[0]);
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        data: {
          vehicles: {
            content: row ? [row] : [],
            totalElements: row ? 1 : 0,
            page: 0,
            size: 10000,
          },
        },
      }),
    });
  });

/** A single VehicleType row in the `vehicleTypes(...)` mock fixture — only
 *  the fields VehicleEditForm's picker reads + a minimum to round-trip the
 *  GraphQL → projectVehicleType pipeline. */
export interface VehicleTypeRow {
  netexId: string;
  version: number;
  name: { value: string } | null;
  transportMode: string | null;
}

const DEFAULT_VEHICLE_TYPES: VehicleTypeRow[] = [
  { netexId: 'NMR:VehicleType:1', version: 1, name: { value: 'Bus Type' }, transportMode: 'BUS' },
  { netexId: 'NMR:VehicleType:2', version: 1, name: { value: 'Rail Type' }, transportMode: 'RAIL' },
];

/**
 * Intercept the `vehicleTypes(...)` query the VehicleEditForm picker fires on
 * mount. Other GraphQL operations pass through. The matcher checks
 * `vehicleTypes(` so it never claims `vehicles(...)` (the list/by-id field) —
 * the two are distinct field names that happen to share a prefix. Safe to
 * register in any order vs. the vehicles list/by-id/save handlers.
 *
 * Fields the projection layer doesn't see (deckPlan, vehicles, the env extras,
 * etc.) are returned as null — the picker only reads name.value + netexId.
 */
export const interceptVehicleTypesQuery = (
  page: Page,
  rows: VehicleTypeRow[] = DEFAULT_VEHICLE_TYPES
) =>
  page.route('**/graphql', async route => {
    const postData = route.request().postDataJSON();
    const query: string = postData?.query ?? '';
    if (!query.includes('vehicleTypes(')) {
      await route.fallback();
      return;
    }
    const content = rows.map(r => ({
      netexId: r.netexId,
      version: r.version,
      name: r.name,
      shortName: null,
      description: null,
      transportMode: r.transportMode,
      length: null,
      width: null,
      height: null,
      weight: null,
      lowFloor: null,
      propulsionTypes: null,
      fuelTypes: null,
      selfPropelled: null,
      euroClass: null,
      maximumVelocity: null,
      maximumRange: null,
      formDragCoefficient: null,
      rollResistanceCoefficient: null,
      maximumEngineEffectKW: null,
      hybridCategory: null,
      passengerCapacity: null,
      created: null,
      changed: null,
      changedBy: null,
      deckPlan: null,
      vehicles: null,
    }));
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        data: {
          vehicleTypes: {
            content,
            totalElements: content.length,
            page: 0,
            size: content.length,
          },
        },
      }),
    });
  });

/**
 * Intercept the `createOrUpdateVehicle` mutation — the GraphQL replacement for
 * the retired NeTEx-XML import POST. Captures the mutation's `input` for
 * assertions, invokes `onSaved(input)` (e.g. to flip a stateful list's
 * `addCreated`), and returns `newId` as the mutation's scalar result so
 * `useVehiclePairSave` surfaces it as `result.newId`.
 *
 * Register AFTER the list/by-id interceptors. Non-mutation operations fall
 * through.
 */
export const interceptVehicleSaveMutation = (
  page: Page,
  newId: string,
  onSaved?: (input: Record<string, unknown>) => void
) => {
  const state = { lastInput: null as Record<string, unknown> | null };
  page.route('**/graphql', async route => {
    const postData = route.request().postDataJSON();
    const query: string = postData?.query ?? '';
    if (!query.includes('createOrUpdateVehicle')) {
      await route.fallback();
      return;
    }
    state.lastInput = postData?.variables?.input ?? null;
    onSaved?.(state.lastInput ?? {});
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ data: { createOrUpdateVehicle: newId } }),
    });
  });
  return { input: () => state.lastInput };
};
