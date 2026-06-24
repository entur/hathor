import { test, expect, type Page } from '@playwright/test';
import { setConfig } from './live-auth-helpers';

/**
 * Navigate to /vehicle-types and return locators for the protected content area.
 */
async function openProtectedRoute(page: Page) {
  await page.goto('/vehicle-types');
  await page.waitForLoadState('domcontentloaded');
  return {
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

/**
 * Auth-config UI — the app reflects whether oidcConfig is present, without ever logging in or selecting an org.
 *
 * Workflow (each test serves its own config.json via route interception — no shared disk state, parallel-safe):
 *   1. Auth-off profile: setConfig 'auth-off' (oidcConfig undefined) → goto /vehicle-types renders .app-content; goto / shows "Auth off" chip and no Log in button; nav rail toggle flips aria-expanded false↔true↔false.
 *   2. Auth-on profile: setConfig 'auth-on' (oidcConfig defined) → goto /vehicle-types triggers client-side OIDC redirect (URL → partner.dev.entur.org) or shows loading/redirect auth UI; goto / shows Log in button and hides the "Auth off" chip.
 * Covers:
 *   - oidcConfig undefined → protected content renders unguarded + header "Auth off" chip.
 *   - oidcConfig defined → protected route demands auth (redirect/loading UI) + header Log in button.
 *   - Nav rail collapsed/expanded toggle (localStorage hathor:navRailExpanded cleared first).
 * Modes:
 *   - mode-agnostic: NO E2E_BACKEND branching, NO seedAuth, NO org selection — it deliberately does not authenticate or pick an org, asserting only the pre-login auth-config UI. Runs identically regardless of E2E_BACKEND.
 */

// ── Auth-off scenario ────────────────────────────────────────────────────────

test.describe('Auth-off profile (oidcConfig undefined)', () => {
  test.beforeEach(async ({ page }) => setConfig(page, 'auth-off'));

  test('protected route renders content without auth', async ({ page }) => {
    const { appContent } = await openProtectedRoute(page);
    await expect(appContent).toBeVisible();
  });

  test('header shows auth-disabled (no login button)', async ({ page }) => {
    const { loginButton, authDisabledLabel } = await openHomePage(page);
    await expect(loginButton).not.toBeVisible();
    await expect(authDisabledLabel).toBeVisible();
    await expect(authDisabledLabel).toContainText('Auth off');
  });

  test('nav rail toggles between collapsed and expanded', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => window.localStorage.removeItem('hathor:navRailExpanded'));
    await page.reload();
    await page.waitForLoadState('domcontentloaded');

    const rail = page.getByTestId('nav-rail');
    const toggle = page.getByTestId('nav-rail-toggle');

    await expect(rail).toBeVisible();
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');

    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');

    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  });
});

// ── Auth-on scenario ───────────────────────────────────────────────────────────

test.describe('Auth-on profile (oidcConfig defined)', () => {
  test.beforeEach(async ({ page }) => setConfig(page, 'auth-on'));

  test('protected route requires authentication', async ({ page }) => {
    const { loadingAuth, redirectAuth } = await openProtectedRoute(page);
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
