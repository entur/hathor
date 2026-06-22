import { test, expect } from '@playwright/test';
import { REG_NR, interceptAutosysQuery, interceptVehicleTypesQuery } from './autosys-helpers';
import { IS_LIVE, writeConfig, seedAuth } from './live-auth-helpers';

/**
 * /vehicle-types Autosys multi-import dialog — drive the multi-vehicle import wizard to its 1/1/1/1 confirm summary.
 *
 * Workflow:
 *   copy config-no-auth.json → (mock) intercept VehicleTypes + Autosys queries → goto /vehicle-types
 *   → click import-vehicle-multi-button → dialog opens
 *   → Step 0: click "Skip" (no file upload)
 *   → Step 1 (Review): fill multi-import-add-input = REG_NR → click add-button → assert chip in multi-import-tags
 *   → click "Next" (triggers Autosys fetch)
 *   → Step 2 (Confirm): wait for success Alert → assert "1 of 1" and counts Vehicles 1 / Vehicle types 1 / Deck plans 1 / Vehicle models 1
 * Covers:
 *   - Three-step wizard navigation (Skip → add reg-nr → Next → Confirm).
 *   - Aggregated import summary parsed from a single REG_NR fixture (1/1/1/1).
 * Modes:
 *   - mock (E2E_SUITE=no-auth): intercepts the VehicleTypes + Autosys GraphQL queries with fixtures; full dialog flow runs offline.
 *   - live (E2E_BACKEND=true): fetches real Autosys data via shepet on :37998 (no query intercepts).
 *     Needs a real plate — set E2E_AUTOSYS_REG_NR (the fixture "A-1" is not a real Autosys plate);
 *     the 1/1/1/1 summary is plate-dependent under live.
 */
test.describe('Autosys multi-import dialog', () => {
  // Runs in BOTH modes now that shepet (:37998) is available locally: mock serves the
  // Autosys fixture; live fetches real Autosys via shepet. The shepet-not-running guard
  // was a temporary skip and has been removed.

  // writeConfig() (not a raw config-no-auth copy) so a live run leaves
  // config-with-auth on disk for the next serial spec, even though this one
  // skips under live — avoids clobbering the shared public/config.json.
  test.beforeAll(() => writeConfig());
  test.beforeEach(async ({ context }) => seedAuth(context));

  test(`skip upload, add "${REG_NR}", confirm shows 1/1/1/1`, async ({ page }) => {
    if (!IS_LIVE) {
      await interceptVehicleTypesQuery(page);
      await interceptAutosysQuery(page);
    }

    await page.goto('/vehicle-types');
    await page.waitForLoadState('networkidle');

    // Open the multi-import dialog
    const multiButton = page.getByTestId('import-vehicle-multi-button');
    await expect(multiButton).toBeVisible();
    await multiButton.click();

    const dialog = page.locator('[role="dialog"]');
    await expect(dialog).toBeVisible();

    // Step 0: skip the file upload
    const nextButton = dialog.getByRole('button', { name: /skip/i });
    await nextButton.click();

    // Step 1 (Review): type registration number and add it
    const addInput = page.getByTestId('multi-import-add-input').locator('input');
    await expect(addInput).toBeVisible();
    await addInput.fill(REG_NR);

    const addButton = page.getByTestId('multi-import-add-button');
    await addButton.click();

    // Verify the chip appeared
    const tags = page.getByTestId('multi-import-tags');
    await expect(tags.getByText(REG_NR)).toBeVisible();

    // Click Next to trigger fetch
    const fetchNext = dialog.getByRole('button', { name: /next/i });
    await fetchNext.click();

    // Step 2 (Confirm): wait for summary to appear
    const summaryAlert = dialog.locator('.MuiAlert-standardSuccess');
    await expect(summaryAlert).toBeVisible({ timeout: 15_000 });

    // The summary alert should confirm 1 of 1 fetched
    await expect(summaryAlert).toContainText('1 of 1');

    // Verify each label is followed by its count in the text content
    const content = dialog.locator('.MuiDialogContent-root');
    const contentText = await content.textContent();
    expect(contentText).toMatch(/Vehicles\s*1/);
    expect(contentText).toMatch(/Vehicle types\s*1/);
    expect(contentText).toMatch(/Deck plans\s*1/);
    expect(contentText).toMatch(/Vehicle models\s*1/);
  });
});
