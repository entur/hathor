import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { interceptVehicleByIdQuery, vehicleRow } from './vehicle-list-helpers';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fixturesDir = path.join(__dirname, '..', 'fixtures');
const targetConfig = path.join(__dirname, '..', '..', 'public', 'config.json');

const SELECTED_ID = 'NMR:Vehicle:bus-1';
const NOT_FOUND_ERROR = `Vehicle "${SELECTED_ID}" not found`;

/**
 * Regression test for B1 (PR #74 review): `useVehicle` must never hang on the
 * "Loading vehicle…" spinner — it must resolve `loading=false` and surface a
 * user-visible error.
 *
 * Realigned to the GraphQL read path after #101 retired the NeTEx-XML single
 * fetch. The obsolete trigger (missing `applicationImportBaseUrl`) no longer
 * applies: `useVehicle` now reads `applicationBaseUrl`, shared with the list,
 * so a missing-config scenario can't isolate the slider. The surviving
 * equivalent — a `vehicles(filter:{netexIds})` fetch that resolves to no row —
 * is exercised here: the list query still returns the row (so the slider opens
 * with a title), while the single-vehicle query returns empty `content`,
 * driving `useVehicle` into its not-found error branch.
 */
test.describe('useVehicle — a single-vehicle fetch with no match errors, never hangs (no-auth)', () => {
  test.beforeAll(() => {
    fs.copyFileSync(path.join(fixturesDir, 'config-no-auth.json'), targetConfig);
  });

  test.beforeEach(async ({ page }) => {
    if (process.env.E2E_BACKEND === 'true') return;

    // List query (no `filter.netexIds`) → the row exists, so the slider opens
    // on a found row and renders a title.
    await page.route('**/graphql', async route => {
      const body = route.request().postDataJSON();
      const q: string = body?.query ?? '';
      if (q.includes('vehicles(') && !body?.variables?.filter?.netexIds) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            data: {
              vehicles: {
                content: [
                  vehicleRow(SELECTED_ID, {
                    registrationNumber: 'BUS-001',
                    transportType: {
                      netexId: 'NMR:VehicleType:bus',
                      version: 1,
                      name: { value: 'Bus Type' },
                      transportMode: 'bus',
                    },
                  }),
                ],
                totalElements: 1,
                page: 0,
                size: 10000,
              },
            },
          }),
        });
      } else {
        await route.fallback();
      }
    });

    // Single-vehicle query (with `filter.netexIds`) → empty content → not found.
    await interceptVehicleByIdQuery(page, () => null);
  });

  test('a single-vehicle fetch that returns no row surfaces an error, not a stuck spinner', async ({
    page,
  }) => {
    await page.goto(`/vehicles?selected=${SELECTED_ID}`);
    await page.waitForLoadState('networkidle');

    await expect(page.getByTestId('vehicle-details-title')).toBeVisible();

    // Loading resolves — the not-found branch sets error + loading=false, so
    // the spinner disappears. Auto-wait to its default disappearance timeout.
    await expect(page.getByText('Loading vehicle…')).toBeHidden();

    // User sees the actual reason.
    await expect(page.getByText(NOT_FOUND_ERROR)).toBeVisible();

    // Form area stays hidden because the fetch errored.
    await expect(page.locator('#vehicle-registration-number')).toHaveCount(0);
  });
});
