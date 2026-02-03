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

/** Fixture file for the Autosys response, keyed by registration number. */
const autosysFixturePath = path.join(fixturesDir, `autosys-response-${REG_NR}.xml`);

/**
 * Intercept the Autosys GET request and always serve from the static fixture.
 * The fixture uses "?" for transient values (frame ids, timestamps) that
 * change on every backend response — tests must not assert on those fields.
 */
async function interceptAutosysQuery(page: import('@playwright/test').Page) {
  await page.route('**/autosys?registrationNumber=**', async route => {
    if (fs.existsSync(autosysFixturePath)) {
      const body = fs.readFileSync(autosysFixturePath, 'utf-8');
      await route.fulfill({
        status: 200,
        contentType: 'application/xml',
        body,
      });
    } else {
      await route.fulfill({
        status: 503,
        contentType: 'text/plain',
        body: `No fixture at ${autosysFixturePath}. Commit a static fixture XML for reg number "${REG_NR}".`,
      });
    }
  });
}

test.describe('Autosys import dialog', () => {
  test.beforeAll(() => {
    fs.copyFileSync(path.join(fixturesDir, 'config-no-auth.json'), targetConfig);
  });

  test(`query "${REG_NR}" returns confirm form with vehicle data`, async ({ page }) => {
    await interceptAutosysQuery(page);

    await page.goto('/vehicle-type');
    await page.waitForLoadState('domcontentloaded');

    // Hover the speed-dial to expand it, then click single import
    const speedDial = page.getByLabel('Import actions');
    await expect(speedDial).toBeVisible();
    await speedDial.hover();

    const importAction = page.getByLabel('Import vehicle');
    await expect(importAction).toBeVisible();
    await importAction.click();

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
