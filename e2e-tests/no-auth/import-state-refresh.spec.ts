import { test, expect, type Page } from '@playwright/test';
import { REG_NR } from './autosys-helpers';
import { IS_LIVE, writeConfig, seedAuth, selectFirstOrg, rowCount } from './live-auth-helpers';

/**
 * #141 — app state goes stale after an Autosys import: the Vehicles and Deck Plans lists
 * do not reflect newly-imported rows until a full page reload (F5), even though their
 * GraphQL queries ran and returned the new rows. LIVE-ONLY reproduction.
 *
 * Workflow:
 *   seedAuth → goto /vehicle-types → selectFirstOrg → baseline totals for /vehicles + /deck-plans
 *   (read via client-side nav-rail navigation, never page.goto)
 *   → back to /vehicle-types → drive the Autosys multi-import wizard for a FRESH reg-nr and Submit
 *   (creates 1 vehicle type + 1 vehicle + 1 deck plan; app redirects to /vehicle-types?filter=<ids>)
 *   → control: the vehicle-types list reflects the import (it watches ?filter)
 *   → THE BUG: client-nav (nav-rail click, no reload) to /vehicles → assert total grew by the import
 *     → then page.reload() (the "F5") → assert the new vehicle is now present AND that the
 *       client-nav total equalled the post-reload total (the #141 signature: nav state == reload state)
 *   → repeat the same nav-vs-reload comparison for /deck-plans.
 * Covers:
 *   - Post-import list freshness on client-side navigation (the exact repro steps in #141).
 *   - Proof it is a STATE bug not a DATA bug: a full reload surfaces what client-nav missed.
 *   - Both affected surfaces named in the report: /vehicles and /deck-plans.
 * Modes:
 *   - mock (E2E_SUITE=no-auth): n/a — live-only; the whole describe is skipped when !IS_LIVE.
 *     (The stale state is a real-app React-context effect that a clean mocked remount does not
 *     exhibit, so a mocked repro would go green and give a false all-clear — hence live-only.)
 *   - live (E2E_BACKEND=true): needs a running, authenticated Sobek (:37999) AND Shepet (:37998),
 *     and a FRESH, not-yet-imported reg-nr — set E2E_AUTOSYS_REG_NR to a real SVV plate the org
 *     does not already own (the default fixture reg "A-1" is not a real Autosys plate).
 *   - landed RED on purpose: `test.fixme` documents the open bug so CI/live suites stay green.
 *     Change `test.fixme` → `test` to reproduce it red; it flips green once #141 is fixed.
 */

/** Per-href URL matcher anchored so /vehicles never matches /vehicle-types. */
const onPath = (href: string) => new RegExp(href.replace(/[/-]/g, '\\$&') + '(\\?|$)');

/**
 * Navigate via the persistent left nav-rail's real <a href> — a CLIENT-SIDE route
 * change. This is the crux of the repro: `page.goto`/`page.reload` do a full document
 * load (≈ F5) which resets app state and HIDES #141. The bug only shows under SPA nav.
 *
 * @param page Playwright page.
 * @param href Route to click (`/vehicles`, `/deck-plans`, `/vehicle-types`).
 */
async function railNavigate(page: Page, href: string): Promise<void> {
  await page.locator(`[data-testid="nav-rail"] a[href="${href}"]`).click();
  await expect(page).toHaveURL(onPath(href));
}

/**
 * Drive the Autosys multi-import wizard for one reg-nr through to a successful Submit.
 * (Same wizard flow as autosys-multi-import.spec.ts, carried through Submit.) Throws if
 * Submit errors — #141 needs a genuinely
 * NEW import, and a duplicate (already-imported reg) surfaces as a submit error with no
 * new rows, which cannot demonstrate the bug.
 *
 * @param page Playwright page, already on /vehicle-types with an org selected.
 * @param reg Registration number to import (must be fresh in the live DB).
 */
async function importRegViaAutosys(page: Page, reg: string): Promise<void> {
  await page.getByTestId('import-vehicle-multi-button').click();
  const dialog = page.locator('[role="dialog"]');
  await expect(dialog).toBeVisible();

  // Step 0: skip file upload. Step 1: add the reg-nr chip. Next → Autosys fetch.
  await dialog.getByRole('button', { name: /skip/i }).click();
  const addInput = page.getByTestId('multi-import-add-input').locator('input');
  await expect(addInput).toBeVisible();
  await addInput.fill(reg);
  await page.getByTestId('multi-import-add-button').click();
  await expect(page.getByTestId('multi-import-tags').getByText(reg)).toBeVisible();
  await dialog.getByRole('button', { name: /next/i }).click();

  // Step 2: confirm summary, then Submit (persists to Sobek).
  const summary = dialog.locator('.MuiAlert-standardSuccess');
  await expect(summary).toBeVisible({ timeout: 15_000 });
  await expect(summary).toContainText('1 of 1');
  await dialog.getByRole('button', { name: /submit/i }).click();

  // Success closes the dialog and the app redirects to /vehicle-types?filter=<ids>.
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
  await expect(page).toHaveURL(onPath('/vehicle-types'));
}

test.describe('#141 import → lists stale until reload — LIVE', () => {
  test.describe.configure({ mode: 'serial' });
  test.skip(() => !IS_LIVE, 'Requires running, authenticated Sobek (:37999) + Shepet (:37998)');

  test.beforeAll(() => writeConfig());
  test.beforeEach(async ({ context }) => seedAuth(context));

  test.fixme('imported vehicle + deck plan appear via client-nav without F5', async ({ page }) => {
    // Org selection is the hard precondition for every list hook.
    await page.goto('/vehicle-types');
    await selectFirstOrg(page);
    await page.waitForLoadState('networkidle');

    // Baseline totals (client-nav, never goto) so we can prove the import added rows.
    await railNavigate(page, '/vehicles');
    await page.waitForLoadState('networkidle');
    const vehiclesBefore = await rowCount(page);
    await railNavigate(page, '/deck-plans');
    await page.waitForLoadState('networkidle');
    const deckPlansBefore = await rowCount(page);

    // Import a fresh reg-nr → 1 vehicle type + 1 vehicle + 1 deck plan; redirects to
    // /vehicle-types?filter=<newTypeIds>.
    await railNavigate(page, '/vehicle-types');
    await page.waitForLoadState('networkidle');
    await importRegViaAutosys(page, REG_NR);

    // Control: the vehicle-types list DID update (it watches ?filter).
    await expect(page.locator('table tbody tr')).not.toHaveCount(0);

    // ── THE BUG on /vehicles ──────────────────────────────────────────────────
    await railNavigate(page, '/vehicles');
    await page.waitForLoadState('networkidle');
    const vehiclesAfterNav = await rowCount(page);
    expect(
      vehiclesAfterNav,
      '#141: /vehicles via client-nav should include the imported vehicle, but the list is stale until F5'
    ).toBeGreaterThan(vehiclesBefore);

    // Prove it is a STATE bug: a full reload (the "F5") surfaces the new vehicle.
    await page.reload();
    await selectFirstOrg(page);
    await page.waitForLoadState('networkidle');
    const vehiclesAfterReload = await rowCount(page);
    expect(vehiclesAfterReload).toBeGreaterThan(vehiclesBefore);
    expect(
      vehiclesAfterNav,
      '#141 signature: the client-nav total must equal the post-F5 total'
    ).toBe(vehiclesAfterReload);

    // ── Same bug on /deck-plans ───────────────────────────────────────────────
    await railNavigate(page, '/deck-plans');
    await page.waitForLoadState('networkidle');
    const deckPlansAfterNav = await rowCount(page);
    expect(
      deckPlansAfterNav,
      '#141: imported deck plan should appear on /deck-plans via client-nav, but is missing until F5'
    ).toBeGreaterThan(deckPlansBefore);

    await page.reload();
    await selectFirstOrg(page);
    await page.waitForLoadState('networkidle');
    const deckPlansAfterReload = await rowCount(page);
    expect(deckPlansAfterReload).toBeGreaterThan(deckPlansBefore);
    expect(
      deckPlansAfterNav,
      '#141 signature: the client-nav deck-plan total must equal the post-F5 total'
    ).toBe(deckPlansAfterReload);
  });
});
