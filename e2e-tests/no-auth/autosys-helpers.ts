import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const fixturesDir = path.join(__dirname, '..', 'fixtures');
export const targetConfig = path.join(__dirname, '..', '..', 'public', 'config.json');

/** Mock vehicle types loaded from fixture file */
const MOCK_VEHICLE_TYPES = JSON.parse(
  fs.readFileSync(path.join(fixturesDir, 'vehicle-types-mock.json'), 'utf-8')
);

/**
 * Intercept the GraphQL vehicleTypes query and return mock data.
 * Required for tests that load /vehicle-type without a real backend.
 */
export async function interceptVehicleTypesQuery(page: import('@playwright/test').Page) {
  await page.route('**/graphql', async route => {
    const request = route.request();
    const postData = request.postDataJSON();

    if (postData?.query?.includes('vehicleTypes')) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(MOCK_VEHICLE_TYPES),
      });
    } else {
      await route.continue();
    }
  });
}

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
