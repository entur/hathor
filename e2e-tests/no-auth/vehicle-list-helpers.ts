import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import type { Page } from '@playwright/test';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fixturesDir = path.join(__dirname, '..', 'fixtures');

/**
 * Mock `vehicleTypes` query payload tailored to `/vehicles` scenarios — richer
 * than the shared `vehicle-types-mock.json` so we can exercise TransportMode
 * variety (rail / bus / unknown-from-backend) and a 15-row dataset that
 * spans two pages at the default `rowsPerPage=10`.
 */
const MOCK_VEHICLES_LIST: unknown = JSON.parse(
  fs.readFileSync(path.join(fixturesDir, 'vehicles-list-mock.json'), 'utf-8')
);

/**
 * Intercept the GraphQL `vehicleTypes` query and return the vehicles-list
 * fixture. Other GraphQL operations on the same endpoint pass through.
 *
 * Mirrors the `interceptVehicleTypesQuery` helper in `autosys-helpers.ts` but
 * binds a different fixture — keep the two in parallel rather than sharing,
 * since `/vehicle-types` tests rely on the leaner shape.
 */
export const interceptVehicleListQuery = (page: Page) =>
  page.route('**/graphql', async route => {
    const postData = route.request().postDataJSON();
    if (postData?.query?.includes('vehicleTypes')) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(MOCK_VEHICLES_LIST),
      });
    } else {
      await route.continue();
    }
  });
