import { test, expect, type Page } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fixturesDir = path.join(__dirname, '..', 'fixtures');
const targetConfig = path.join(__dirname, '..', '..', 'public', 'config.json');

/**
 * Navigate to /vehicle-type and return locators for the auth warning banner
 * and protected content area.
 */
async function openProtectedRoute(page: Page) {
  await page.goto('/vehicle-type');
  await page.waitForLoadState('domcontentloaded');
  return {
    authWarning: page.getByTestId('auth-not-configured-warning'),
    appContent: page.locator('.app-content'),
    loadingAuth: page.getByText('Loading authentication status...'),
    redirectAuth: page.getByText('Redirecting to login provider...'),
  };
}

/**
 * Navigate to / and return locators for the header auth UI elements.
 */
async function openHomePage(page: Page) {
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');
  return {
    loginButton: page.getByRole('button', { name: /log in/i }),
    authDisabledLabel: page.getByTestId('auth-disabled-label'),
  };
}

// Scenarios share config.json on disk — must run serially.
test.describe.configure({ mode: 'serial' });

// ── No-auth scenario ────────────────────────────────────────────────────────

test.describe('No-auth profile (oidcConfig undefined)', () => {
  test.beforeAll(() => {
    fs.copyFileSync(path.join(fixturesDir, 'config-no-auth.json'), targetConfig);
  });

  test('protected route shows auth warning BUT renders content', async ({ page }) => {
    const { authWarning, appContent } = await openProtectedRoute(page);
    await expect(authWarning).toBeVisible();
    await expect(authWarning).toContainText('Auth not configured');
    await expect(appContent).toBeVisible();
  });

  test('header shows auth-disabled (no login button)', async ({ page }) => {
    const { loginButton, authDisabledLabel } = await openHomePage(page);
    await expect(loginButton).not.toBeVisible();
    await expect(authDisabledLabel).toBeVisible();
    await expect(authDisabledLabel).toContainText('Auth off');
  });
});

// ── Auth scenario ────────────────────────────────────────────────────────────

test.describe('Auth profile (oidcConfig defined)', () => {
  test.beforeAll(() => {
    fs.copyFileSync(path.join(fixturesDir, 'config-with-auth.json'), targetConfig);
  });

  test('protected route requires authentication (no warning banner)', async ({ page }) => {
    const { authWarning, loadingAuth, redirectAuth } = await openProtectedRoute(page);
    await expect(authWarning).not.toBeVisible();
    // OIDC redirect is client-side — wait for URL change or auth UI to appear
    await expect(async () => {
      const redirected = page.url().includes('partner.dev.entur.org');
      const showsAuthUI =
        (await loadingAuth.isVisible().catch(() => false)) ||
        (await redirectAuth.isVisible().catch(() => false));
      expect(redirected || showsAuthUI).toBe(true);
    }).toPass({ timeout: 10_000 });
  });

  test('header now shows login button', async ({ page }) => {
    const { loginButton, authDisabledLabel } = await openHomePage(page);
    await expect(authDisabledLabel).not.toBeVisible();
    await expect(loginButton).toBeVisible();
  });
});
