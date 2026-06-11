import { test, expect } from '@playwright/test';
import { interceptVehicleByIdQuery, vehicleRow } from './vehicle-list-helpers';
import { IS_LIVE, writeConfig, seedAuth } from './live-auth-helpers';

const SELECTED_ID = 'NMR:Vehicle:bus-1';
const NOT_FOUND_ERROR = `Vehicle "${SELECTED_ID}" not found`;

/**
 * /vehicles slider loading guards — useVehicle must resolve a not-found single-
 * vehicle fetch to a visible error, never a stuck spinner (PR #74 B1).
 *
 * The companion "save with no applicationBaseUrl" describe was retired with
 * PR #121: the standalone `/vehicles/new` route is gone and the sidebar create
 * form is reachable only AFTER the list query resolves, which the broken
 * config fixture deliberately blocks — `useVehiclePairSave`'s base-URL guard
 * is therefore no longer reachable through the UI. The guard still exists at
 * `useVehiclePairSave.ts:32-36`; it would need a unit test, not an e2e one.
 *
 * Workflow:
 *   NOT-FOUND: copy config-no-auth → intercept list `vehicles(` (no
 *   filter.netexIds) to return the row → intercept by-id
 *   `vehicles(filter:{netexIds})` to return empty → goto /vehicles?selected=<id>
 *   → slider opens with title → "Loading vehicle…" hides → "<id> not found"
 *   shown → form field absent.
 * Covers:
 *   - useVehicle not-found branch sets error + loading=false (spinner
 *     disappears, reason surfaced, form stays hidden).
 * Modes:
 *   - mock (E2E_SUITE=no-auth): seedAuth provides a synthetic user + org so
 *     the list resolves; intercepts the `/graphql` route for the list + by-id
 *     queries; stages list-has-row vs byid-empty.
 *   - live (E2E_BACKEND=true): no live path — the describe skips.
 *   - skip-live: "useVehicle — single-vehicle fetch with no match" needs a
 *     list-has-row + byid-empty mismatch a real backend cannot produce.
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

  test.beforeEach(async ({ page, context }) => {
    if (process.env.E2E_BACKEND === 'true') return;
    await seedAuth(context);

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
