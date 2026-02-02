import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OIDC_HOST = 'partner.dev.entur.org';
const LOAD_AUTH_TXT = 'Loading authentication status...';
const REDIRECT_AUTH_TXT = 'Redirecting to login provider...';
const APP_CSS_ID = '.app-content';

test.describe('Authentication', () => {
  test.beforeAll(async () => {
    // Ensure config with oidcConfig is in place
    const authConfig = path.join(__dirname, '..', 'fixtures', 'config-with-auth.json');
    const targetConfig = path.join(__dirname, '..', '..', 'public', 'config.json');
    fs.copyFileSync(authConfig, targetConfig);
  });

  test('app loads and OIDC provider is active', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    await expect(page).toHaveTitle(/Hathor|Vehicle/i);
    await expect(page.locator(APP_CSS_ID)).toBeVisible();

    // Verify OIDC is active: navigating to a protected route must trigger auth
    await page.goto('/vehicle-type');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const url = page.url();
    const showsAuthUI =
      (await page
        .getByText(LOAD_AUTH_TXT)
        .isVisible()
        .catch(() => false)) ||
      (await page
        .getByText(REDIRECT_AUTH_TXT)
        .isVisible()
        .catch(() => false));

    // When OIDC is active, user must be redirected or see an auth loading state
    expect(url.includes(OIDC_HOST) || showsAuthUI).toBe(true);
  });

  test('protected route requires authentication', async ({ page }) => {
    // Go directly to a protected route without authentication
    await page.goto('/vehicle-type');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const url = page.url();
    const showsAuthUI =
      (await page
        .getByText(LOAD_AUTH_TXT)
        .isVisible()
        .catch(() => false)) ||
      (await page
        .getByText(REDIRECT_AUTH_TXT)
        .isVisible()
        .catch(() => false));

    // Must redirect to OIDC provider or show auth loading/redirect text
    expect(url.includes(OIDC_HOST) || showsAuthUI).toBe(true);
  });

  test('unauthenticated user sees login button', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // When OIDC is active and the user is not logged in, the header
    // must show a "Log in" button instead of the authenticated user icon.
    const loginButton = page.getByRole('button', { name: /log in/i });
    await expect(loginButton).toBeVisible();
  });
});
