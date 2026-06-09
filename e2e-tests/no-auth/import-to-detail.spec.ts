import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import { fixturesDir, targetConfig, REG_NR, interceptAutosysQuery } from './autosys-helpers';

/**
 * /vehicle-types Autosys import → VehicleType detail navigation — import one reg-nr, then open its route-based detail page.
 *
 * Workflow:
 *   copy config-no-auth.json → intercept Autosys query → goto /vehicle-types
 *   → open import-vehicle-multi-button dialog → Step 0 Skip → Step 1 add REG_NR (assert chip) → Next (Autosys fetch)
 *   → Step 2 assert success "1 of 1" → click "Submit"
 *   → race: dialog closes (success) OR error Alert (likely duplicate from a prior run → click Close)
 *   → goto /vehicle-types → click first row's VehicleType ID link → assert URL == its href
 *   → assert route-based detail page shows "Edit" and "XML Preview" tabs
 * Covers:
 *   - End-to-end import-then-inspect: Autosys import submitted to Sobek, then the imported VehicleType opened via its list-row link.
 *   - Idempotent re-runs: tolerates a duplicate-submit error by closing the dialog and continuing.
 *   - Route-based VehicleType detail surface (Edit / XML Preview tabs).
 * Modes:
 *   - mock (E2E_SUITE=no-auth): n/a — live-only; whole describe is unconditionally skipped.
 *   - live (E2E_BACKEND=true): would fetch via shepet Autosys (:37998) and submit the import to real Sobek.
 *   - skip: ALWAYS skipped (test.skip(true, ...)). Two blockers — (1) needs the shepet Autosys backend on :37998 (not running);
 *     (2) asserts a route-based VehicleType detail page (Edit / XML Preview tabs) whose surface must be re-verified, since
 *     CLAUDE.md notes the route editor was retired in favour of the `?selected=` sidebar.
 */
test.describe('Import → detail page navigation', () => {
  test.describe.configure({ mode: 'serial' });

  test.beforeAll(() => {
    fs.copyFileSync(`${fixturesDir}/config-no-auth.json`, targetConfig);
  });

  // Live-only flow that fetches from the shepet Autosys backend (:37998) and
  // submits the import to Sobek. shepet is a separate app outside this run (not
  // running), so this stays skipped until it is up. NOTE: it also asserts a
  // route-based VehicleType detail page (Edit / XML Preview tabs) — verify that
  // surface still exists before re-enabling (CLAUDE.md notes the route editor
  // was retired in favour of the `?selected=` sidebar).
  test.skip(true, 'requires the shepet Autosys backend (:37998); re-verify the detail route too');

  test(`import "${REG_NR}", click VehicleType ID, navigate to detail`, async ({ page }) => {
    await interceptAutosysQuery(page);

    await page.goto('/vehicle-types');
    await page.waitForLoadState('networkidle');

    // Open the multi-import dialog
    const fab = page.getByTestId('import-vehicle-multi-button');
    await expect(fab).toBeVisible();
    await fab.click();

    const dialog = page.locator('[role="dialog"]');
    await expect(dialog).toBeVisible();

    // Step 0: skip file upload
    await dialog.getByRole('button', { name: /skip/i }).click();

    // Step 1: add registration number
    const addInput = page.getByTestId('multi-import-add-input').locator('input');
    await expect(addInput).toBeVisible();
    await addInput.fill(REG_NR);
    await page.getByTestId('multi-import-add-button').click();
    await expect(page.getByTestId('multi-import-tags').getByText(REG_NR)).toBeVisible();

    // Fetch from Autosys
    await dialog.getByRole('button', { name: /next/i }).click();

    // Step 2: confirm summary
    const summary = dialog.locator('.MuiAlert-standardSuccess');
    await expect(summary).toBeVisible({ timeout: 15_000 });
    await expect(summary).toContainText('1 of 1');

    // Submit import — may fail if data already exists from a previous run
    await dialog.getByRole('button', { name: /submit/i }).click();

    // Wait for either: dialog closes (success) or submit error appears
    const submitErr = dialog.locator('.MuiAlert-standardError');
    const closed = expect(dialog)
      .not.toBeVisible({ timeout: 15_000 })
      .then(() => 'closed' as const);
    const errored = expect(submitErr)
      .toBeVisible({ timeout: 15_000 })
      .then(() => 'error' as const);
    const outcome = await Promise.race([closed, errored]);

    if (outcome === 'error') {
      // Import failed (likely duplicate) — close dialog, data already exists
      await dialog.getByRole('button', { name: /close/i }).click();
      await expect(dialog).not.toBeVisible();
    }

    // Navigate to list and find the first VehicleType ID link
    await page.goto('/vehicle-types');
    await page.waitForLoadState('networkidle');

    const firstIdLink = page.locator('table tbody tr').first().getByRole('link');
    await expect(firstIdLink).toBeVisible({ timeout: 10_000 });
    const href = await firstIdLink.getAttribute('href');

    await firstIdLink.click();
    await page.waitForLoadState('networkidle');

    // Verify we navigated to the detail page
    await expect(page).toHaveURL(href!);

    // Detail page renders the vtype-details Editor with Edit/XML tabs
    await expect(page.getByRole('tab', { name: 'Edit' })).toBeVisible({ timeout: 10_000 });
    await expect(page.getByRole('tab', { name: 'XML Preview' })).toBeVisible();
  });
});
