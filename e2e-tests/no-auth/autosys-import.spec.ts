import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import {
  fixturesDir,
  targetConfig,
  REG_NR,
  interceptAutosysQuery,
  interceptVehicleTypesQuery,
} from './autosys-helpers';

test.describe('Autosys single-import dialog', () => {
  test.beforeAll(() => {
    fs.copyFileSync(`${fixturesDir}/config-no-auth.json`, targetConfig);
  });

  test(`query "${REG_NR}" returns confirm form with vehicle data`, async ({ page }) => {
    if (process.env.E2E_BACKEND !== 'true') {
      await interceptVehicleTypesQuery(page);
      await interceptAutosysQuery(page);
    }

    await page.goto('/vehicle-type');
    await page.waitForLoadState('networkidle');

    // Click the single-import Fab button
    const importButton = page.getByTestId('import-vehicle-single-button');
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
    const dialogContent = page.locator('[role="dialog"]');
    const contentText = await dialogContent.textContent();

    // Registration number must be present
    expect(contentText).toContain('Registration Number');

    // Strip all static label strings — whatever remains is actual backend data.
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
