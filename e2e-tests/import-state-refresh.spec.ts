import { test, expect, type Page } from '@playwright/test';
import { REG_NR, interceptDeckPlansQuery } from './autosys-helpers';
import { interceptVehicleListQuery, interceptVehicleTypesQuery } from './vehicle-list-helpers';
import { IS_LIVE, seedAuth, selectFirstOrg, rowCount } from './live-auth-helpers';

/**
 * #141 — after an Autosys import, the id-filter from the post-import redirect leaks into the sibling
 * list views: /vehicles and /deck-plans keep showing a "Filtering on IDs" chip (and the filtered,
 * wrong list) instead of the org's full list, until a full reload (F5). Reproduces in BOTH modes —
 * it is a pure frontend SearchContext bug, independent of the backend.
 *
 * Workflow:
 *   seedAuth → reach the post-import filtered state (/vehicle-types?filter=<typeIds>):
 *     live  — select org, drive the real Autosys import (Submit), which redirects there;
 *     mock  — goto that URL directly (exactly what the import's onImportComplete navigate() does).
 *   → confirm the "Filtering on IDs" chip IS shown on /vehicle-types (the filter is genuinely applied)
 *   → for each sibling list (/vehicles, /deck-plans): record the full-reload (F5) count, then
 *     re-establish the filtered state and client-nav via the nav-rail (NOT page.goto — a full load ≈ F5
 *     that clears the leak) and assert the list count equals the F5 count. The leak filters the sibling
 *     list (count collapses to 0/1) while F5 shows the full org list — so the two counts diverge.
 * Covers:
 *   - The exact #141 symptom on both affected surfaces, asserted mode-agnostically as F5-count == client-nav-count.
 *   - Same red in mock and live — the bug is SearchContext state, not data, so the fixture suite shows it too.
 * Modes:
 *   - mock (E2E_BACKEND unset): intercepts the three list queries; reaches the filtered state by URL. Self-contained.
 *   - live (E2E_BACKEND=true): real import via Shepet/Sobek — needs both backends, a FRESH plate
 *     (E2E_AUTOSYS_REG_NR, e.g. a row from fixtures/some-busses.csv) and the local Shepet
 *     responsibilitySet temp-fix (Shepet HEAD omits the responsibilitySets Sobek import requires).
 *   - regression guard: runs in the mock CI suite and passes with the #141 fix in place; reverting
 *     the fix in src/components/search/SearchContext.tsx turns it red again. (Live needs both backends + a fresh plate.)
 *
 * ROOT CAUSE (verified 2026-06-22 — live plate VJ12248 AND mock; FIXED in this branch): the URL
 * `?filter=` drives SearchContext.activeFilters (via useUrlFilters on /vehicle-types & /deck-plans),
 * and every list filters its rows by activeFilters (useDataViewTableLogic). But activeFilters is
 * GLOBAL and was only cleared on a search-CONTEXT change — sibling lists share the 'data' context and
 * /vehicles doesn't even use useUrlFilters — so navigating from the filtered /vehicle-types to
 * /vehicles left the filter set, collapsing the list to 0/1 until F5. FIX: SearchContext clears
 * search + filters on route (pathname) change (src/components/search/SearchContext.tsx). A filter-state
 * leak, not a refetch failure (the GraphQL query runs and returns rows — the report's stale-list symptom).
 */

/** A vehicle-type id present in the mock fixture — used to fake the post-import redirect under mock. */
const MOCK_FILTER_TYPE_ID = 'NMR:VehicleType:1';

/** Matches when the page is on exactly `href` (ignoring any query string). A URL predicate avoids
 *  building a RegExp from a string (CodeQL: incomplete regex escaping) and is exact, not substring. */
const atPath = (href: string) => (url: URL) => url.pathname === href;

/**
 * Navigate via the persistent left nav-rail's real <a href> — a CLIENT-SIDE route change. This is
 * the crux: page.goto/page.reload do a full document load (≈ F5) which resets SearchContext and HIDES
 * #141. The leak only survives SPA navigation.
 */
async function railNavigate(page: Page, href: string): Promise<void> {
  await page.locator(`[data-testid="nav-rail"] a[href="${href}"]`).click();
  await expect(page).toHaveURL(atPath(href));
}

/**
 * Drive the Autosys multi-import wizard for one reg-nr through a successful Submit (live only).
 * Throws if Submit errors — #141 needs a genuinely NEW import; a duplicate surfaces as a submit error.
 */
async function importRegViaAutosys(page: Page, reg: string): Promise<void> {
  await page.getByTestId('import-vehicle-multi-button').click();
  const dialog = page.locator('[role="dialog"]');
  await expect(dialog).toBeVisible();

  await dialog.getByRole('button', { name: /skip/i }).click();
  const addInput = page.getByTestId('multi-import-add-input').locator('input');
  await expect(addInput).toBeVisible();
  await addInput.fill(reg);
  await page.getByTestId('multi-import-add-button').click();
  await expect(page.getByTestId('multi-import-tags').getByText(reg)).toBeVisible();
  await dialog.getByRole('button', { name: /next/i }).click();

  const summary = dialog.locator('.MuiAlert-standardSuccess');
  await expect(summary).toBeVisible({ timeout: 15_000 });
  await expect(summary).toContainText('1 of 1');
  await dialog.getByRole('button', { name: /submit/i }).click();

  const closed = expect(dialog)
    .not.toBeVisible({ timeout: 15_000 })
    .then(() => 'ok' as const);
  const errored = expect(dialog.locator('.MuiAlert-standardError'))
    .toBeVisible({ timeout: 15_000 })
    .then(() => 'err' as const);
  if ((await Promise.race([closed, errored])) === 'err') {
    throw new Error(
      `Import of "${reg}" failed (likely already imported). #141 needs a FRESH reg-nr — set E2E_AUTOSYS_REG_NR to a plate this org does not own.`
    );
  }
  await expect(page).toHaveURL(atPath('/vehicle-types'));
}

/**
 * Put the app into the post-import filtered state (/vehicle-types?filter=<typeIds>) and return that
 * URL so it can be re-established for each sibling. Live drives the real import; mock navigates to the
 * URL the import's redirect produces.
 */
async function establishFilteredState(page: Page): Promise<string> {
  if (!IS_LIVE) {
    await page.goto(`/vehicle-types?filter=${MOCK_FILTER_TYPE_ID}`);
    await page.waitForLoadState('networkidle');
    return page.url();
  }
  await page.goto('/vehicle-types');
  await selectFirstOrg(page);
  await page.waitForLoadState('networkidle');
  await importRegViaAutosys(page, REG_NR); // redirects to /vehicle-types?filter=<ids>
  return page.url();
}

test.describe('#141 import filter leaks into sibling lists', () => {
  test.describe.configure({ mode: 'serial' });

  test.beforeEach(async ({ context, page }) => {
    await seedAuth(context);
    if (!IS_LIVE) {
      await interceptVehicleListQuery(page);
      await interceptVehicleTypesQuery(page);
      await interceptDeckPlansQuery(page);
    }
  });

  test('post-import filter must not survive client-nav (F5 count == client-nav count)', async ({
    page,
  }) => {
    // Reach the post-import filtered state and confirm the filter is genuinely applied here.
    const filterUrl = await establishFilteredState(page);
    await expect(
      page.getByTestId('url-filter-chip'),
      'filter is applied on /vehicle-types'
    ).toBeVisible();

    // Each sibling list, re-established from the filtered state so the leak isn't "consumed" by a
    // prior hop. The #141 signature is exactly the report's: what a full reload (F5) shows must equal
    // what client-side navigation shows. The leak filters the sibling list (count drops to 0/1) while
    // F5 shows the full org list — so the two counts diverge.
    for (const href of ['/vehicles', '/deck-plans']) {
      // Ground truth: a full reload of the list (F5 clears the leak).
      await page.goto(href);
      await selectFirstOrg(page);
      await page.waitForLoadState('networkidle');
      const fullCount = await rowCount(page);

      // Client-navigate to the same list FROM the filtered state — must match the F5 count.
      await page.goto(filterUrl);
      await selectFirstOrg(page);
      await page.waitForLoadState('networkidle');
      await railNavigate(page, href);
      await expect(
        page.getByTestId('total-entries'),
        `#141: ${href} via client-nav must show all ${fullCount} rows (the F5 count) — the import filter leaked into it`
      ).toHaveAttribute('data-count', String(fullCount));
    }
  });
});
