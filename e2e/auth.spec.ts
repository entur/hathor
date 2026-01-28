import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OIDC_HOST = 'partner.dev.entur.org';
const LOAD_AUTH_TXT = 'Loading authentication status...';
const APP_CSS_ID = '.app-content';

test.describe('Authentication', () => {
  test.beforeAll(async () => {
    // Ensure config with oidcConfig is in place
    const authConfig = path.join(__dirname, 'fixtures', 'config-with-auth.json');
    const targetConfig = path.join(__dirname, '..', 'public', 'config.json');
    fs.copyFileSync(authConfig, targetConfig);
  });

  test('app loads with authentication configured', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    // The app should load
    await expect(page).toHaveTitle(/Hathor|Vehicle/i);

    // The app content should be visible (home page is not protected)
    await expect(page.locator(APP_CSS_ID)).toBeVisible();
  });

  test('protected route requires authentication', async ({ page }) => {
    // Go directly to a protected route without authentication
    await page.goto('/vehicle-type');
    await page.waitForLoadState('networkidle');

    const currentUrl = page.url();

    // Check if redirected to OIDC provider
    const redirectedToOidc = currentUrl.includes(OIDC_HOST);

    // Or check if showing loading/redirect state
    const showingAuthLoading = await page
      .getByText(LOAD_AUTH_TXT)
      .isVisible()
      .catch(() => false);

    // Either redirected to OIDC or showing auth loading state
    if (!redirectedToOidc && !showingAuthLoading) {
      // Give time for redirect to happen
      await page.waitForTimeout(2000);
      const finalUrl = page.url();
      const finallyRedirected = finalUrl.includes(OIDC_HOST);
      const finallyShowingAuth = await page
        .getByText(LOAD_AUTH_TXT)
        .isVisible()
        .catch(() => false);

      // Should have redirected or be showing auth state
      expect(finallyRedirected || finallyShowingAuth).toBe(true);
    } else {
      expect(redirectedToOidc || showingAuthLoading).toBe(true);
    }
  });

  test('home page accessible without authentication', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    // Should load the home page without redirect
    await expect(page).toHaveTitle(/Hathor|Vehicle/i);
    await expect(page.locator(APP_CSS_ID)).toBeVisible();

    // Should NOT redirect to OIDC for the home page
    expect(page.url()).not.toContain(OIDC_HOST);
  });
});
