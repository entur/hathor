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
 * Whether a real backend is available for pass-through requests.
 * CI sets E2E_BACKEND=false — locally it defaults to true.
 */
const backendAvailable = process.env.E2E_BACKEND !== 'false';

/** Read applicationGetAutosysUrl from config for error messages. */
function getAutosysUrl(): string {
  try {
    const cfg = JSON.parse(fs.readFileSync(path.join(fixturesDir, 'config-no-auth.json'), 'utf-8'));
    return cfg.applicationGetAutosysUrl || '(not set in config.json)';
  } catch {
    return '(config.json not found)';
  }
}

/**
 * Intercept the Autosys GET request.
 *
 * Priority order:
 * 1. Backend available → pass through to real Sobek, save response as fixture.
 * 2. Fixture exists    → serve it (CI path, no backend needed).
 * 3. Neither           → fail with a clear message.
 */
async function interceptAutosysQuery(page: import('@playwright/test').Page) {
  await page.route('**/autosys?registrationNumber=**', async route => {
    if (backendAvailable) {
      // Real backend — fetch live and record as fixture for CI.
      let response;
      try {
        response = await route.fetch();
      } catch (err) {
        await route.fulfill({
          status: 503,
          contentType: 'text/plain',
          body: `E2E_BACKEND is not "false" (real backend expected) but the request failed.\n`
            + `Autosys URL from config: ${getAutosysUrl()}\n`
            + `Is Sobek running? Set E2E_BACKEND=false to use fixtures instead.\n\n${err}`,
        });
        return;
      }
      const body = await response.text();
      fs.writeFileSync(autosysFixturePath, body, 'utf-8');
      await route.fulfill({ response });
    } else if (fs.existsSync(autosysFixturePath)) {
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
        body: `No fixture at ${autosysFixturePath} and E2E_BACKEND=false. Run locally against Sobek first to record the fixture.`,
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
