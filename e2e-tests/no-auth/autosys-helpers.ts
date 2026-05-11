import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const fixturesDir = path.join(__dirname, '..', 'fixtures');
export const targetConfig = path.join(__dirname, '..', '..', 'public', 'config.json');

/**
 * Read a JSON fixture file from `e2e-tests/fixtures/` synchronously at module init.
 * Test-only — Playwright workers each load fixtures once.
 *
 * @param name Fixture file name (e.g. 'vehicle-types-mock.json').
 * @returns Parsed JSON value.
 */
const loadFixture = (name: string): unknown =>
  JSON.parse(fs.readFileSync(path.join(fixturesDir, name), 'utf-8'));

/**
 * Intercept any GraphQL request whose query body contains `queryName` and
 * fulfill it with `body` as JSON. Other requests pass through to the network.
 *
 * @param page Playwright Page instance.
 * @param queryName Substring to match against `postData.query` (e.g. 'vehicleTypes').
 * @param body JSON payload to return; will be `JSON.stringify`ed.
 */
const interceptGraphQLQuery = async (
  page: import('@playwright/test').Page,
  queryName: string,
  body: unknown
) => {
  await page.route('**/graphql', async route => {
    const postData = route.request().postDataJSON();
    if (postData?.query?.includes(queryName)) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(body),
      });
    } else {
      await route.continue();
    }
  });
};

const MOCK_VEHICLE_TYPES = loadFixture('vehicle-types-mock.json');
const MOCK_DECK_PLANS = loadFixture('deck-plans-mock.json');

/**
 * Intercept the GraphQL vehicleTypes query and return mock data.
 * Required for tests that load /vehicle-type without a real backend.
 */
export const interceptVehicleTypesQuery = (page: import('@playwright/test').Page) =>
  interceptGraphQLQuery(page, 'vehicleTypes', MOCK_VEHICLE_TYPES);

/**
 * Intercept the GraphQL DeckPlans query and return mock data.
 * Required for tests that load /deck-plan without a real backend.
 */
export const interceptDeckPlansQuery = (page: import('@playwright/test').Page) =>
  interceptGraphQLQuery(page, 'DeckPlans', MOCK_DECK_PLANS);

/** Registration number to query — default "A-1", override via E2E_AUTOSYS_REG_NR. */
export const REG_NR = process.env.E2E_AUTOSYS_REG_NR || 'A-1';

/** Fixture file for the Autosys response, keyed by registration number. */
const autosysFixturePath = path.join(fixturesDir, `autosys-response-${REG_NR}.xml`);

/**
 * Intercept the Autosys GET request and always serve from the static fixture.
 * The fixture uses "?" for transient values (frame ids, timestamps) that
 * change on every backend response — tests must not assert on those fields.
 */
export async function interceptAutosysQuery(page: import('@playwright/test').Page) {
  await page.route('**/autosys?registrationNumber=**', async route => {
    if (fs.existsSync(autosysFixturePath)) {
      const body = fs.readFileSync(autosysFixturePath, 'utf-8');
      await route.fulfill({
        status: 200,
        contentType: 'application/xml',
        body,
      });
    } else {
      await route.fulfill({
        status: 503,
        contentType: 'text/plain',
        body: `No fixture at ${autosysFixturePath}. Commit a static fixture XML for reg number "${REG_NR}".`,
      });
    }
  });
}
