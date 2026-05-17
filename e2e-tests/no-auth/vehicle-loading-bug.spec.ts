import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fixturesDir = path.join(__dirname, '..', 'fixtures');
const targetConfig = path.join(__dirname, '..', '..', 'public', 'config.json');

const MISSING_BASE_URL_ERROR = 'Application import base URL is not configured';

/**
 * Regression test for B1 (PR #74 review): when `applicationImportBaseUrl`
 * is missing from runtime config, `useVehicle` must short-circuit into
 * `loading=false` + a user-visible error — *not* hang forever on the
 * "Loading vehicle…" spinner.
 *
 * Before fix: `useVehicle.doFetch` returned early without
 * `setLoading(false)`. Initial `useState(!!id)` left loading=true forever
 * when id was truthy.
 *
 * After fix: missing-baseUrl branch sets `error` and `loading=false`
 * synchronously, surfacing the same message
 * `useVehiclePairSave` already emits for the save path.
 */
test.describe('useVehicle (B1) — missing applicationImportBaseUrl never stops loading', () => {
  test.beforeAll(() => {
    fs.copyFileSync(path.join(fixturesDir, 'config-no-import-baseurl.json'), targetConfig);
  });

  test.afterAll(() => {
    fs.copyFileSync(path.join(fixturesDir, 'config-no-auth.json'), targetConfig);
  });

  test.beforeEach(async ({ page }) => {
    if (process.env.E2E_BACKEND === 'true') return;

    await page.route('**/graphql', async route => {
      const body = route.request().postDataJSON();
      const q: string = body?.query ?? '';
      if (q.includes('vehicles(')) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            data: {
              vehicles: {
                content: [
                  {
                    id: 'NMR:Vehicle:bus-1',
                    version: 1,
                    registrationNumber: 'BUS-001',
                    operationalNumber: null,
                    transportType: {
                      id: 'NMR:VehicleType:bus',
                      version: 1,
                      name: { value: 'Bus Type' },
                      transportMode: 'bus',
                    },
                  },
                ],
                totalElements: 1,
                page: 0,
                size: 10000,
              },
            },
          }),
        });
      } else {
        await route.continue();
      }
    });
  });

  test('missing import baseUrl surfaces as an error, not a stuck spinner', async ({ page }) => {
    await page.goto('/vehicles?selected=NMR:Vehicle:bus-1');
    await page.waitForLoadState('networkidle');

    await expect(page.getByTestId('vehicle-details-title')).toBeVisible();

    // Loading resolves quickly — the missing-baseUrl branch should set
    // error + loading=false synchronously, so the spinner is gone almost
    // immediately. Auto-wait to its default disappearance timeout.
    await expect(page.getByText('Loading vehicle…')).toBeHidden();

    // User sees the actual reason, mirroring useVehiclePairSave's message.
    await expect(page.getByText(MISSING_BASE_URL_ERROR)).toBeVisible();

    // Form area stays hidden because xmlError is set.
    await expect(page.locator('#vehicle-registration-number')).toHaveCount(0);
  });
});
