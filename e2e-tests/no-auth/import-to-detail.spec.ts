import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import { fixturesDir, targetConfig, REG_NR, interceptAutosysQuery } from './autosys-helpers';

test.describe('Import → detail page navigation', () => {
  test.describe.configure({ mode: 'serial' });

  test.beforeAll(() => {
    fs.copyFileSync(`${fixturesDir}/config-no-auth.json`, targetConfig);
  });

  test.skip(() => process.env.E2E_BACKEND !== 'true', 'Requires local Sobek backend');

  test(`import "${REG_NR}", click VehicleType ID, navigate to detail`, async ({ page }) => {
    await interceptAutosysQuery(page);

    await page.goto('/vehicle-type');
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
    await page.goto('/vehicle-type');
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
