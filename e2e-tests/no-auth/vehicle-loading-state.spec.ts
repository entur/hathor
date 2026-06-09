import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { interceptVehicleByIdQuery, vehicleRow } from './vehicle-list-helpers';
import { IS_LIVE, writeConfig } from './live-auth-helpers';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fixturesDir = path.join(__dirname, '..', 'fixtures');
const targetConfig = path.join(__dirname, '..', '..', 'public', 'config.json');

const SELECTED_ID = 'NMR:Vehicle:bus-1';
const NOT_FOUND_ERROR = `Vehicle "${SELECTED_ID}" not found`;

/**
 * /vehicles slider loading guards — useVehicle/useVehiclePairSave must resolve to a visible error, never a stuck spinner or silent failure (PR #74 B1).
 *
 * Workflow:
 *   1. NOT-FOUND: copy config-no-auth → intercept list `vehicles(` (no filter.netexIds) to return the row → intercept by-id `vehicles(filter:{netexIds})` to return empty → goto /vehicles?selected=<id> → slider opens with title → "Loading vehicle…" hides → "<id> not found" shown → form field absent.
 *   2. NO-BASE-URL: copy config-no-baseurl (deliberately broken) → goto /vehicles/new → fill Registration Number + Vehicle Type ID → Save → "Application base URL is not configured" snackbar, no "View in list", URL stays /vehicles/new → afterAll restores config-no-auth.
 * Covers:
 *   - useVehicle not-found branch sets error + loading=false (spinner disappears, reason surfaced, form stays hidden).
 *   - useVehiclePairSave base-URL guard short-circuits before any request (error snackbar, no navigation).
 * Modes:
 *   - mock (E2E_SUITE=no-auth): both describes intercept the `/graphql` route for the list + by-id queries; not-found stages list-has-row vs byid-empty; no-base-url uses a broken config fixture.
 *   - live (E2E_BACKEND=true): no live path — both describes skip (no seedAuth/org select here).
 *   - skip-live: "useVehicle — single-vehicle fetch with no match" (needs a list-has-row + byid-empty mismatch a real backend cannot produce) and "save with no applicationBaseUrl" (mock-only — drives a deliberately broken config).
 */

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
  // Stages a row that the LIST returns but the by-id fetch does not — a
  // contradiction only a mock can produce (a live row found in the list is
  // always fetchable by id). The not-found error branch is therefore mock-only.
  test.skip(IS_LIVE, 'requires a list-has-row + byid-empty mismatch a real backend cannot produce');

  test.beforeAll(() => writeConfig());

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

const MISSING_BASE_URL_ERROR = 'Application base URL is not configured';

/**
 * Restores coverage of the PR #74 B1 invariant — a missing `applicationBaseUrl`
 * must surface a user-visible error, never fail silently. `useVehicle`'s copy
 * of this guard can't be isolated end-to-end (it shares the key with the list
 * hook, which simply renders no rows when the key is absent), but its sibling
 * in `useVehiclePairSave` is reachable: `/vehicles/new` renders the form with
 * no list, so a save with no base URL drives the guard directly.
 */
test.describe('save with no applicationBaseUrl surfaces a config error, not silent failure (no-auth)', () => {
  test.skip(process.env.E2E_BACKEND === 'true', 'mock-only — drives a deliberately broken config');

  test.beforeAll(() => {
    fs.copyFileSync(path.join(fixturesDir, 'config-no-baseurl.json'), targetConfig);
  });

  // Restore via writeConfig() so a live run lands config-with-auth (not a raw
  // config-no-auth) for the next serial spec.
  test.afterAll(() => writeConfig());

  test('saving a new vehicle with no base URL shows the config error and does not navigate', async ({
    page,
  }) => {
    await page.goto('/vehicles/new');
    await page.waitForLoadState('networkidle');

    await page.getByLabel('Registration Number').fill('NEW-001');
    await page.getByLabel(/Vehicle Type ID/).fill('2');
    await page.getByRole('button', { name: 'Save' }).click();

    // The guard short-circuits before any request: error snackbar, no success
    // action, still on /vehicles/new.
    await expect(page.getByText(MISSING_BASE_URL_ERROR)).toBeVisible();
    await expect(page.getByRole('button', { name: 'View in list' })).toHaveCount(0);
    await expect(page).toHaveURL(/\/vehicles\/new$/);
  });
});
