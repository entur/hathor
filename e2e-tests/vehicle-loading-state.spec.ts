import { test, expect } from '@playwright/test';
import { interceptVehicleByIdQuery, vehicleRow } from './vehicle-list-helpers';
import { IS_LIVE, seedAuth } from './live-auth-helpers';

const SELECTED_ID = 'NMR:Vehicle:bus-1';

/**
 * /vehicles slider loading guards — the editor's by-id fetch (useEntityRecord)
 * must resolve a not-found single-vehicle fetch to the not-found body, never a
 * stuck skeleton (PR #74 B1).
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
 *   → "Loading vehicle…" skeleton hides → "Vehicle not found" + the requested
 *   id shown → form field absent.
 * Covers:
 *   - the editor reads Sobek by id, not the list row: a row the list has but
 *     Sobek's by-id fetch lacks opens on the not-found body (skeleton gone,
 *     id surfaced, form stays hidden).
 * Modes:
 *   - mock (E2E_BACKEND unset): seedAuth provides a synthetic user + org so
 *     the list resolves; intercepts the `/graphql` route for the list + by-id
 *     queries; stages list-has-row vs byid-empty.
 *   - live (E2E_BACKEND=true): no live path — the describe skips.
 *   - skip-live: "a single-vehicle fetch with no match" needs a list-has-row +
 *     byid-empty mismatch a real backend cannot produce.
 */

/**
 * Regression test for B1 (PR #74 review): the editor must never hang on the
 * "Loading vehicle…" skeleton — a `vehicles(filter:{netexIds})` fetch that
 * resolves to no row must land on the not-found body. The list query still
 * returns the row, so this also pins that the editor ignores the list (#217).
 */
test.describe('vehicle editor — a single-vehicle fetch with no match shows not-found, never hangs (no-auth)', () => {
  // Stages a row that the LIST returns but the by-id fetch does not — a
  // contradiction only a mock can produce (a live row found in the list is
  // always fetchable by id). The not-found error branch is therefore mock-only.
  test.skip(IS_LIVE, 'requires a list-has-row + byid-empty mismatch a real backend cannot produce');

  test.beforeEach(async ({ page, context }) => {
    if (process.env.E2E_BACKEND === 'true') return;
    await seedAuth(context);

    // List query (no `filter.netexIds`) → the row exists in the table.
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

  test('a single-vehicle fetch that returns no row shows not-found, not a stuck skeleton', async ({
    page,
  }) => {
    await page.goto(`/vehicles?selected=${SELECTED_ID}`);
    await page.waitForLoadState('networkidle');

    // Loading resolves — the skeleton disappears. Auto-wait to its default
    // disappearance timeout.
    await expect(page.getByRole('status', { name: 'Loading vehicle…' })).toBeHidden();

    // User sees the reason and the id that was asked for.
    await expect(page.getByText('Vehicle not found')).toBeVisible();
    await expect(page.locator('.sidebar-desktop').getByText(SELECTED_ID)).toBeVisible();

    // Form area stays hidden: there is no record to edit.
    await expect(page.locator('#vehicle-registration-number')).toHaveCount(0);
  });
});
