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
