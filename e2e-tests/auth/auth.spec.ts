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

/**
 * Auth profile (OIDC enabled) — verify the app enforces OIDC and shows the unauthenticated UI.
 *
 * Workflow:
 *   beforeAll: copy fixtures/config-with-auth.json → public/config.json (oidcConfig present)
 *   Test 1 "app loads + OIDC active": goto / → assert title /Hathor|Vehicle/ + .app-content visible
 *     → goto /vehicle-types (protected) → assert URL hit OIDC host (partner.dev.entur.org) OR auth loading/redirect text shown.
 *   Test 2 "protected route requires auth": goto /vehicle-types directly (no login) → same redirect-or-auth-UI assertion.
 *   Test 3 "login button shown": goto / unauthenticated → assert header "Log in" button visible.
 * Covers:
 *   - Protected routes redirect to the OIDC provider (or surface "Loading authentication status..." / "Redirecting to login provider...").
 *   - Unauthenticated header renders a "Log in" button instead of the user icon.
 * Modes:
 *   - mock (E2E_SUITE=auth): the whole suite IS this mode — runs the real React app under config-with-auth.json; no GraphQL is reached (auth gate fires first).
 *   - live (E2E_BACKEND=true): n/a — these assert pre-login OIDC behaviour, independent of any backend.
 */
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
    await page.goto('/vehicle-types');
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
    await page.goto('/vehicle-types');
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
