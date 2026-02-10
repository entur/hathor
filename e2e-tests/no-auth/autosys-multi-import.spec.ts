import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import {
  fixturesDir,
  targetConfig,
  REG_NR,
  interceptAutosysQuery,
  interceptVehicleTypesQuery,
} from './autosys-helpers';

test.describe('Autosys multi-import dialog', () => {
  test.beforeAll(() => {
    fs.copyFileSync(`${fixturesDir}/config-no-auth.json`, targetConfig);
  });

  test(`skip upload, add "${REG_NR}", confirm shows 1/1/1/1`, async ({ page }) => {
    if (process.env.E2E_BACKEND !== 'true') {
      await interceptVehicleTypesQuery(page);
      await interceptAutosysQuery(page);
    }

    await page.goto('/vehicle-type');
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
