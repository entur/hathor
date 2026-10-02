import { test, expect, type Page } from '@playwright/test';
import { interceptVehicleTypesQuery } from './autosys-helpers';
import { mockIdp, mockOrgs, setConfig } from './live-auth-helpers';

/** Deep link a signed-out user opens; fixture id from vehicle-types-mock.json. */
const DEEP_LINK = '/vehicle-types?selected=NMR:VehicleType:1';

/**
 * Navigate to /vehicle-types and return locators for the protected content area.
 */
async function openProtectedRoute(page: Page) {
  await page.goto('/vehicle-types');
  await page.waitForLoadState('domcontentloaded');
  return {
    appContent: page.locator('.app-content'),
    loadingAuth: page.getByText('Checking authentication status...'),
    redirectAuth: page.getByText('Redirecting to login provider...'),
  };
}

/**
 * Navigate to / and return locators for the header and dashboard auth UI elements.
 *
 * Both the header and the signed-out dashboard carry a Log in button, so each
 * is selected by testid — `getByRole('button', { name: /log in/i })` matches
 * both and trips strict mode.
 */
async function openHomePage(page: Page) {
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');
  return {
    loginButton: page.getByTestId('header-login-button'),
    homeLoginButton: page.getByTestId('home-login-button'),
    authDisabledLabel: page.getByTestId('auth-disabled-label'),
  };
}

/**
 * Auth-config UI — the app reflects whether oidcConfig is present, without ever logging in or selecting an org.
 *
 * Workflow (each test serves its own config.json via route interception — no shared disk state, parallel-safe):
 *   1. Auth-off profile: setConfig 'auth-off' (oidcConfig undefined) → goto /vehicle-types renders .app-content; goto / shows "Auth off" chip and no Log in button in header or dashboard; nav rail toggle flips aria-expanded false↔true↔false.
 *   2. Auth-on profile: setConfig 'auth-on' (oidcConfig defined) → goto /vehicle-types triggers client-side OIDC redirect (URL → partner.dev.entur.org) or shows loading/redirect auth UI; goto / shows the header and dashboard Log in buttons and hides the "Auth off" chip.
 *   3. Post-login return (#31): mockIdp (discovery + authorize + token mocked) → signed-out goto /vehicle-types?selected=<vtId> → app redirects to the IdP → bounced back to redirect_uri (/) with code+state → token exchange → app lands on /vehicle-types?selected=<vtId> with the sidebar open and no Log in button.
 * Covers:
 *   - oidcConfig undefined → protected content renders unguarded + header "Auth off" chip + no login affordance anywhere.
 *   - oidcConfig defined → protected route demands auth (redirect/loading UI) + header Log in button + dashboard Log in button.
 *   - Login round trip returns to the originating route incl. its ?selected= query, not to / (#31).
 *   - Nav rail collapsed/expanded toggle (localStorage hathor:navRailExpanded cleared first).
 * Modes:
 *   - mode-agnostic: NO E2E_BACKEND branching, NO seedAuth — profiles 1-2 deliberately do not authenticate or pick an org, asserting only the pre-login auth-config UI. Runs identically regardless of E2E_BACKEND.
 *   - workflow 3 is always mocked (mockIdp + mockOrgs + interceptVehicleTypesQuery): it signs in through the app's own redirect/callback code against a fake IdP, so no live backend or captured JWT is involved.
 */

// ── Auth-off scenario ────────────────────────────────────────────────────────

test.describe('Auth-off profile (oidcConfig undefined)', () => {
  test.beforeEach(async ({ page }) => setConfig(page, 'auth-off'));

  test('protected route renders content without auth', async ({ page }) => {
    const { appContent } = await openProtectedRoute(page);
    await expect(appContent).toBeVisible();
  });

  test('header shows auth-disabled (no login button)', async ({ page }) => {
    const { loginButton, homeLoginButton, authDisabledLabel } = await openHomePage(page);
    await expect(loginButton).not.toBeVisible();
    await expect(homeLoginButton).not.toBeVisible();
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

  test('header and dashboard now show login buttons', async ({ page }) => {
    const { loginButton, homeLoginButton, authDisabledLabel } = await openHomePage(page);
    await expect(authDisabledLabel).not.toBeVisible();
    await expect(loginButton).toBeVisible();
    await expect(homeLoginButton).toBeVisible();
  });

  test('login returns to the originating deep link, not home (#31)', async ({ page }) => {
    const tokenUrl = await mockIdp(page);
    await mockOrgs(page);
    await interceptVehicleTypesQuery(page);

    // The URL equals DEEP_LINK before the redirect too — the token exchange
    // proves the IdP round trip (via redirect_uri `/`) actually happened.
    const exchanged = page.waitForRequest(tokenUrl);
    await page.goto(DEEP_LINK);
    await exchanged;

    await expect(page).toHaveURL(DEEP_LINK);
    await expect(page.getByTestId('vtype-tab-general')).toBeVisible();
    await expect(page.getByTestId('header-login-button')).not.toBeVisible();
  });
});
