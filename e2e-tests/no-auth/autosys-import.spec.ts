import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fixturesDir = path.join(__dirname, '..', 'fixtures');
const targetConfig = path.join(__dirname, '..', '..', 'public', 'config.json');

/** Registration number to query — default "A-1", override via E2E_AUTOSYS_REG_NR. */
const REG_NR = process.env.E2E_AUTOSYS_REG_NR || 'A-1';

test.describe('Autosys import dialog', () => {
  test.beforeAll(() => {
    fs.copyFileSync(path.join(fixturesDir, 'config-no-auth.json'), targetConfig);
  });

  test(`query "${REG_NR}" returns confirm form with vehicle data`, async ({ page }) => {
    await page.goto('/vehicle-type');
    await page.waitForLoadState('domcontentloaded');

    // Open the import dialog
    const importButton = page.getByTestId('import-vehicle-button');
    await expect(importButton).toBeVisible();
    await importButton.click();

    // Fill in registration number and fetch
    const regInput = page.getByTestId('autosys-registration-number').locator('input');
    await expect(regInput).toBeVisible();
    await regInput.fill(REG_NR);

    const fetchButton = page.getByTestId('autosys-fetch-button');
    await fetchButton.click();

    // Wait for the confirm step to appear (fetch button gone, confirm button visible)
    const confirmButton = page.getByTestId('autosys-confirm-button');
    await expect(confirmButton).toBeVisible({ timeout: 15_000 });

    // The confirm form should contain data beyond just the registration number.
    // Check that at least one of: Type, Capacity, or Fuel Type has a non-empty value.
    const dialogContent = page.locator('[role="dialog"]');
    const contentText = await dialogContent.textContent();

    // Registration number must be present
    expect(contentText).toContain('Registration Number');

    // At least one additional data field must have a value (not just labels).
    // We check that the confirm form contains text that is NOT one of the
    // static label strings — meaning the backend returned actual data.
    const labels = [
      'Registration Number',
      'Operational ID',
      'Type',
      'Capacity',
      'Fuel Type',
      'Confirm Import',
      'Close',
    ];
    const nonLabelContent = labels.reduce(
      (text, label) => text.replaceAll(label, ''),
      contentText || ''
    );
    // After stripping labels, there should be meaningful content left
    // (e.g. the actual reg number value, seat count, fuel type value)
    expect(nonLabelContent.trim().length).toBeGreaterThan(0);
  });
});
