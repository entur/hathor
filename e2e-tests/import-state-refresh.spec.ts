import { test, expect, type Page } from '@playwright/test';
import { REG_NR, interceptDeckPlansQuery } from './autosys-helpers';
import { interceptVehicleListQuery, interceptVehicleTypesQuery } from './vehicle-list-helpers';
import { IS_LIVE, seedAuth, selectFirstOrg } from './live-auth-helpers';

/**
 * #141 — after an Autosys import, its id filter (the redirect's `?filter=<typeIds>`) must stay on
 * /vehicle-types: the sibling lists /vehicles and /deck-plans show the org's full list, with no
 * filter chip, whether reached by a full load (F5) or the nav rail.
 *
 * Workflow:
 *   seedAuth → reach the post-import filtered state (/vehicle-types?filter=<typeIds>):
 *     live  — goto /, select org, drive the real Autosys import (Submit), which redirects there;
 *     mock  — goto that URL directly (exactly what the import's onImportComplete navigate() does).
 *   → confirm the filter chip IS shown on /vehicle-types (the filter is genuinely applied)
 *   → for each sibling list (/vehicles, /deck-plans): record the full-reload (F5) Edit-link count,
 *     then re-establish the filtered state and client-nav via the nav rail (NOT page.goto — a full
 *     load ≈ F5) and assert the same count and no filter chip.
 * Covers:
 *   - The #141 symptom on both sibling surfaces, asserted mode-agnostically as F5 count == client-nav count.
 * Modes:
 *   - mock (E2E_BACKEND unset): intercepts the three list queries; reaches the filtered state by URL. Self-contained.
 *   - live (E2E_BACKEND=true): real import via Shepet/Sobek — needs both backends, a FRESH plate
 *     (E2E_AUTOSYS_REG_NR, e.g. a row from fixtures/some-busses.csv) and a Shepet with the bulk
 *     endpoint (entur/shepet#39), which emits the responsibilitySets Sobek import requires.
 *
 * History: the old lists shared one global SearchContext filter, which leaked across client-side
 * route changes until F5 (fixed 2026-06-22). The collection pages keep the filter in the list's own
 * state (`initialFilters`, read from the URL on mount), so this now guards that it stays put.
 */

/** The collection's filter chips (each is its own remove button). */
const filterChip = (page: Page) => page.getByRole('button', { name: /remove filter/ });

/** The list's Edit links, once it has drawn (the grid loads lazily): the rows on its first page. */
const editCount = async (page: Page): Promise<number> => {
  const edits = page.getByRole('link', { name: /^Edit / });
  await expect(edits.first().or(page.getByTestId('collection-empty'))).toBeVisible();
  return edits.count();
};

/** A vehicle-type id present in the mock fixture — used to fake the post-import redirect under mock. */
const MOCK_FILTER_TYPE_ID = 'NMR:VehicleType:1';

/** Home's SVV bulk-import button — the import flow's only entry point. */
const IMPORT_BTN = 'home-bulk-import-svv';

/** Matches when the page is on exactly `href` (ignoring any query string). A URL predicate avoids
 *  building a RegExp from a string (CodeQL: incomplete regex escaping) and is exact, not substring. */
const atPath = (href: string) => (url: URL) => url.pathname === href;

/**
 * Navigate via the persistent left nav-rail's real <a href> — a CLIENT-SIDE route change. This is
 * the crux: page.goto/page.reload do a full document load (≈ F5), which would hide a leak that only
 * survives SPA navigation.
 */
async function railNavigate(page: Page, href: string): Promise<void> {
  await page.locator(`[data-testid="nav-rail"] a[href="${href}"]`).click();
  await expect(page).toHaveURL(atPath(href));
}

/**
 * Drive the Autosys multi-import wizard, launched from Home, for one reg-nr through a successful
 * Submit (live only).
 * Throws with the dialog's error if Submit errors — #141 needs a genuinely NEW import, and a plate
 * the org already owns fails too.
 */
async function importRegViaAutosys(page: Page, reg: string): Promise<void> {
  await page.getByTestId(IMPORT_BTN).click();
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
  const error = dialog.locator('.MuiAlert-standardError');
  const errored = expect(error)
    .toBeVisible({ timeout: 15_000 })
    .then(() => 'err' as const);
  if ((await Promise.race([closed, errored])) === 'err') {
    throw new Error(
      `Import of "${reg}" failed: ${(await error.innerText()).trim()}\nIf the org already owns this plate, set E2E_AUTOSYS_REG_NR to one it doesn't.`
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
    return page.url();
  }
  await page.goto('/'); // the import launches from Home
  await selectFirstOrg(page);
  await importRegViaAutosys(page, REG_NR); // redirects to /vehicle-types?filter=<ids>
  return page.url();
}

test.describe('#141 import filter leaks into sibling lists', () => {
  test.describe.configure({ mode: 'serial' });

  test.beforeEach(async ({ context, page }) => {
    await seedAuth(context, { sandboxFeatures: { DeckPlans: true, AutosysImport: true } });
    if (!IS_LIVE) {
      await interceptVehicleListQuery(page);
      await interceptVehicleTypesQuery(page);
      await interceptDeckPlansQuery(page);
    }
  });

  test('post-import filter must not survive client-nav (F5 count == client-nav count)', async ({
    page,
  }) => {
    // Five full page loads and two rail hops: past 30 s on a loaded Firefox run.
    test.slow();
    // Reach the post-import filtered state and confirm the filter is genuinely applied here.
    const filterUrl = await establishFilteredState(page);
    await expect(filterChip(page), 'filter is applied on /vehicle-types').toBeVisible();

    // Each sibling list, re-established from the filtered state so the leak isn't "consumed" by a
    // prior hop. The #141 signature is exactly the report's: what a full reload (F5) shows must equal
    // what client-side navigation shows. A leak would filter the sibling list (count drops to 0/1)
    // while F5 shows the full org list — so the two counts would diverge.
    for (const href of ['/vehicles', '/deck-plans']) {
      // Ground truth: a full reload of the list (F5 clears the leak).
      await page.goto(href);
      await selectFirstOrg(page);
      const fullCount = await editCount(page);

      // Client-navigate to the same list FROM the filtered state — must match the F5 count.
      await page.goto(filterUrl);
      await selectFirstOrg(page);
      await expect(filterChip(page)).toBeVisible();
      await railNavigate(page, href);
      expect(
        await editCount(page),
        `#141: ${href} via client-nav must show all ${fullCount} rows (the F5 count) — the import filter leaked into it`
      ).toBe(fullCount);
      expect(await filterChip(page).count()).toBe(0);
    }
  });
});
