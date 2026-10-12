import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { expect, type BrowserContext, type Page, type Route } from '@playwright/test';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fixturesDir = path.join(__dirname, 'fixtures');
const authFile = path.join(__dirname, '..', 'playwright', '.auth', 'oidc-user.json');

/** Config profile → fixture file. 'auth-on' boots OIDC; 'auth-off' disables it. */
const CONFIG_FIXTURE = {
  'auth-on': 'config-with-auth.json',
  'auth-off': 'config-no-auth.json',
} as const;
export type ConfigProfile = keyof typeof CONFIG_FIXTURE;

/** Fixture bodies read once at module init — workers reuse them. */
const CONFIG_BODY: Record<ConfigProfile, string> = {
  'auth-on': fs.readFileSync(path.join(fixturesDir, CONFIG_FIXTURE['auth-on']), 'utf8'),
  'auth-off': fs.readFileSync(path.join(fixturesDir, CONFIG_FIXTURE['auth-off']), 'utf8'),
};

/**
 * Serve `public/config.json` to the app via route interception instead of
 * mutating the file on disk — each test/context gets its own config, so the
 * suite no longer needs `workers: 1`. The app fetches `${BASE_URL}config.json`
 * once at startup (`src/config/fetchConfig.ts`), so the route MUST be registered
 * before the first `goto`. Works on a `Page` or a `BrowserContext` (both expose
 * `.route`); context-level covers every page it opens.
 *
 * @param router Playwright `Page` or `BrowserContext`.
 * @param profile 'auth-on' (OIDC) or 'auth-off' (no oidcConfig).
 */
export const setConfig = (router: Page | BrowserContext, profile: ConfigProfile) =>
  router.route('**/config.json', route =>
    route.fulfill({ status: 200, contentType: 'application/json', body: CONFIG_BODY[profile] })
  );

/** Timeout (ms) for the org picker to render + auto-select after login. */
const ORG_READY_TIMEOUT = 20000;

/** True when the suite runs against a live Sobek (`E2E_BACKEND=true`). */
export const IS_LIVE = process.env.E2E_BACKEND === 'true';

/** localStorage key the app persists the selected org under (`OrganisationsContext.tsx`). */
const ORG_STORAGE_KEY = 'hathor:currentOrganisationId';
/** Live only: NeTEx id of the org to run against (`E2E_ORG_ID`); unset → the app's first authorized org. */
const LIVE_ORG_ID = process.env.E2E_ORG_ID;

/** Full NeTEx id, `Codespace:Type:Value`. */
const NETEX_ID = /[A-Za-z]+:[A-Za-z]+:[\w.-]+/;

/** A captured oidc-client-ts user entry: storage `k`ey + stored `v`alue. */
interface OidcUser {
  k: string;
  v: { access_token: string; expires_at?: number; [x: string]: unknown };
}

let cached: OidcUser | null = null;

// Derive authority + client_id from the fixture so MOCK_OIDC.k can't drift.
const _authCfg = JSON.parse(
  fs.readFileSync(path.join(fixturesDir, 'config-with-auth.json'), 'utf8')
).oidcConfig as { authority: string; client_id: string };

/**
 * Synthetic OIDC user for MOCK mode. Key derived from config-with-auth.json so it
 * stays in sync if authority or client_id ever changes. The token is never validated
 * (all GraphQL is intercepted) — a structurally-valid, far-future-expiry user is
 * enough to flip `isAuthenticated` true without a redirect.
 */
const MOCK_OIDC: OidcUser = {
  k: `oidc.user:${_authCfg.authority}:${_authCfg.client_id}`,
  v: {
    access_token: 'mock-access-token',
    token_type: 'Bearer',
    scope: 'openid',
    profile: {
      sub: 'mock',
      iss: _authCfg.authority,
      aud: 'mock',
      iat: 0,
      exp: 4102444800,
    },
    expires_at: 4102444800, // year 2100
  },
};

/** One synthetic organisation so `useOrganisations` auto-selects in mock (the
 *  list hooks early-return on `!currentOrganisation?.id`). */
const MOCK_ORGANISATIONS = {
  data: {
    organisations: {
      content: [{ netexId: 'MOCK:Authority:1', name: { value: 'Mock Org' }, type: 'AUTHORITY' }],
      totalElements: 1,
      page: 0,
      size: 10000,
    },
  },
};

/** Sobek's seeded code lists by `valueType` (V13__AddCodeValues.sql): value `Euro1`, label `Euro 1`. */
const MOCK_CODE_LISTS: Record<string, { label: string; value: string }[]> = {
  EMISSION_STANDARD: [1, 2, 3, 4, 5, 6, 7].map(n => ({ label: `Euro ${n}`, value: `Euro${n}` })),
};

const fulfillJson = (route: Route, body: unknown) =>
  route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(body) });

/**
 * Load the JWT captured by the login handoff (`playwright/.auth/capture.mjs`).
 * Throws with a runnable hint if absent OR expired — fail fast with the right
 * remedy (re-capture) instead of letting a stale token 401 and surface as a
 * confusing "Loading data…" org-select stall mid-run. `expires_at` is epoch
 * seconds (oidc-client-ts).
 */
export const loadOidcUser = (): OidcUser => {
  if (cached) return cached;
  const recapture = `Run \`npm run local\` (oidc + :37999), then \`node playwright/.auth/capture.mjs\` and log in.`;
  if (!fs.existsSync(authFile)) {
    throw new Error(`Live e2e needs a captured token at ${authFile}.\n${recapture}`);
  }
  const user = JSON.parse(fs.readFileSync(authFile, 'utf-8')) as OidcUser;
  if (user.v.expires_at && user.v.expires_at * 1000 < Date.now()) {
    throw new Error(`Captured token at ${authFile} has expired.\n${recapture}`);
  }
  cached = user;
  return cached;
};

/**
 * Seed an OIDC user into `sessionStorage` before any app code runs, so
 * `react-oidc-context` boots already-authenticated (no redirect) — the real
 * captured JWT under live, a synthetic user under mock. sessionStorage (not
 * localStorage) because oidc-client-ts defaults there and Playwright
 * `storageState` cannot carry it. Under mock it also intercepts the
 * `organisations` query with one synthetic org so the app auto-selects it,
 * letting the SAME spec body run in both modes.
 *
 * Under live, `E2E_ORG_ID=<netexId>` pre-selects that organisation (seeded into
 * the app's persisted-org localStorage key) instead of the first authorized one.
 *
 * Also serves the oidc-enabled `config.json` (`setConfig 'auth-on'`) in BOTH
 * modes — the app needs it to authenticate and render the org picker — so
 * callers no longer touch `public/config.json` on disk.
 */
export const seedAuth = async (context: BrowserContext) => {
  await setConfig(context, 'auth-on');
  const { k, v } = IS_LIVE ? loadOidcUser() : MOCK_OIDC;
  await context.addInitScript(([key, val]) => window.sessionStorage.setItem(key, val), [
    k,
    JSON.stringify(v),
  ] as const);
  if (IS_LIVE) {
    // Pin the org when the account's first authorized one holds no data — the
    // app restores this key before falling back to `organisations[0]`. Only
    // when unset, so a spec that switches org keeps its choice across reloads.
    if (LIVE_ORG_ID) {
      await context.addInitScript(
        ([key, id]) => {
          if (!window.localStorage.getItem(key)) window.localStorage.setItem(key, id);
        },
        [ORG_STORAGE_KEY, LIVE_ORG_ID] as const
      );
    }
    return;
  }
  await mockAppLookups(context);
};

/**
 * Mock: claim only the app-wide lookups — the `organisations` query and the
 * `codeValues` code lists; each spec's page-level list interceptors run first
 * and handle their own queries (they must `fallback()` non-matches so these
 * reach this route).
 *
 * @param router Playwright `Page` or `BrowserContext`.
 */
export const mockAppLookups = (router: Page | BrowserContext) =>
  router.route('**/graphql', async route => {
    const post = route.request().postDataJSON();
    const query: string = post?.query ?? '';
    if (query.includes('organisations')) {
      await fulfillJson(route, MOCK_ORGANISATIONS);
    } else if (query.includes('codeValues(')) {
      const content = MOCK_CODE_LISTS[post?.variables?.filter?.valueType] ?? [];
      await fulfillJson(route, { data: { codeValues: { content } } });
    } else {
      await route.fallback();
    }
  });

/** Mocked IdP endpoints, advertised via the discovery document `mockIdp` serves. */
const IDP = {
  discovery: `${_authCfg.authority}/.well-known/openid-configuration`,
  authorize: `${_authCfg.authority}/authorize`,
  token: `${_authCfg.authority}/oauth/token`,
} as const;
/** The app (localhost:5000) fetches discovery + token cross-origin. */
const IDP_CORS = { 'access-control-allow-origin': '*' };

/** Unsigned JWT — oidc-client-ts only decodes the payload (needs `sub`), never verifies it. */
const jwt = (payload: object): string =>
  [{ alg: 'none' }, payload]
    .map(x => Buffer.from(JSON.stringify(x)).toString('base64url'))
    .join('.') + '.';

/**
 * Mock the OIDC authority so a REAL signin round trip runs offline: discovery →
 * authorize (bounces straight back to `redirect_uri` with a code + the request's
 * `state`) → token exchange. Unlike `seedAuth` (boots already-authenticated),
 * this exercises the app's own redirect + signin-callback code.
 *
 * @param page Playwright `Page`; call before the first `goto`.
 * @returns the token endpoint URL — await a request to it to know the round trip ran.
 */
export const mockIdp = async (page: Page): Promise<string> => {
  await page.route(IDP.discovery, route =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      headers: IDP_CORS,
      body: JSON.stringify({
        issuer: _authCfg.authority,
        authorization_endpoint: IDP.authorize,
        token_endpoint: IDP.token,
      }),
    })
  );
  await page.route(`${IDP.authorize}?**`, route => {
    const q = new URL(route.request().url()).searchParams;
    const back = new URL(q.get('redirect_uri')!);
    back.searchParams.set('code', 'mock-code');
    back.searchParams.set('state', q.get('state')!);
    // A scripted bounce, not a 302 — fulfilling a navigation with a redirect
    // status is not portable across browsers.
    return route.fulfill({
      status: 200,
      contentType: 'text/html',
      body: `<script>location.replace(${JSON.stringify(back.href)})</script>`,
    });
  });
  await page.route(IDP.token, route =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      headers: IDP_CORS,
      body: JSON.stringify({
        access_token: MOCK_OIDC.v.access_token,
        token_type: 'Bearer',
        expires_in: 3600,
        scope: 'openid',
        id_token: jwt(MOCK_OIDC.v.profile as object),
      }),
    })
  );
  return IDP.token;
};

/**
 * Ensure an organisation is selected — the hard precondition for every list hook
 * (`useVehicles`/`useVehicleTypes`/`useDeckPlans` early-return on
 * `!currentOrganisation?.id`, the "Loading data…" stall). `useOrganisations`
 * auto-selects `options[0]` once the authorized-orgs query resolves; this waits
 * for that, and explicitly picks the first option if auto-select hasn't filled
 * the input. No-op in mock — the single synthetic org (seedAuth) auto-selects, so
 * no explicit pick is needed; this readiness wait is only for the live picker.
 * With `E2E_ORG_ID` set it only waits for the pinned org to be restored, and
 * fails if the app selected a different one (pin not among the authorized orgs).
 */
export const selectFirstOrg = async (page: Page) => {
  if (!IS_LIVE) return;
  // MUI Autocomplete generates its own input id and drops the aria-label from
  // the input node, so neither `#organisation-select` nor a role-name match
  // works. The org picker is the single Autocomplete combobox in the banner.
  const select = page.getByRole('banner').getByRole('combobox').first();
  await expect(select).toBeVisible({ timeout: ORG_READY_TIMEOUT });
  if (LIVE_ORG_ID) {
    // Pinned org (seedAuth): the app restores it once the org query resolves —
    // wait for that; clicking the first option here would override the pin.
    await expect(select).not.toHaveValue('', { timeout: ORG_READY_TIMEOUT });
    // A stale / misspelled / unauthorized pin is not restored: the app falls back
    // to `organisations[0]` and re-persists THAT id — fail here, not 50 tests later.
    await expect
      .poll(() => page.evaluate(key => window.localStorage.getItem(key), ORG_STORAGE_KEY), {
        message: `E2E_ORG_ID=${LIVE_ORG_ID} is not one of the token's authorized organisations`,
        timeout: ORG_READY_TIMEOUT,
      })
      .toBe(LIVE_ORG_ID);
    return;
  }
  await expect(async () => {
    if ((await select.inputValue()).trim()) return; // auto-selected already
    await select.click();
    await page.getByRole('option').first().click();
    expect((await select.inputValue()).trim().length).toBeGreaterThan(0);
  }).toPass({ timeout: ORG_READY_TIMEOUT });
};

/**
 * Read the current `total-entries[data-count]` as a number. Use for relative
 * row-count assertions under live data (`>= n`, or delta-after-create) instead
 * of the mock-mode exact counts.
 */
export const rowCount = async (page: Page): Promise<number> => {
  const raw = await page.getByTestId('total-entries').getAttribute('data-count');
  return Number(raw ?? '0');
};

/**
 * Derive the first `n` real NeTEx ids from the `netex-id` chips rendered in the
 * table — the live substitute for fixture ids, so filter/deep-link specs exercise
 * the real backend instead of hardcoded fixture ids that don't exist in the DB.
 *
 * @param page Playwright `Page`, already on a list with rows rendered.
 * @param n How many ids to read (fewer are returned if the list is shorter).
 * @returns Full `Codespace:Type:Value` ids, in row order.
 */
export const readNetexIds = async (page: Page, n: number): Promise<string[]> => {
  const rows = page.locator('table tbody tr');
  const total = Math.min(n, await rows.count());
  const out: string[] = [];
  for (let i = 0; i < total; i++) {
    // The row's own id is its first `netex-id` chip, whichever column it sits in
    // (lists are name-first, id-second). Read the id span — the one holding the
    // bold value — not the whole chip, whose text also carries the `vN` badge.
    const id = rows.nth(i).getByTestId('netex-id').first().locator('span:has(> strong)');
    const m = (await id.innerText()).replace(/\s+/g, '').match(NETEX_ID);
    if (m) out.push(m[0]);
  }
  return out;
};

/**
 * Derive a real, org-owned VehicleType numeric id from the live `/vehicle-types`
 * list — the valid `transportType` ref a live vehicle-create needs (the form
 * takes a bare int and prefixes `NMR:VehicleType:`). Fails loudly if the org has
 * no numeric-id vehicle types to build a ref from.
 */
export const liveVehicleTypeInt = async (page: Page): Promise<string> => {
  await page.goto('/vehicle-types');
  await selectFirstOrg(page);
  await page.waitForLoadState('networkidle');
  const [id] = await readNetexIds(page, 1);
  const m = id?.match(/:(\d+)$/);
  expect(m, 'expected a numeric live VehicleType id to build a transportType ref').toBeTruthy();
  return m![1];
};

/**
 * Click the first data row, assert its `?selected=` sidebar opened (title testid
 * visible), and return the decoded netexId. Assumes the page is already on the
 * list with an org selected. Shared by the vehicles + vehicle-types specs.
 */
export const openFirstRow = async (page: Page, titleTestId: string): Promise<string> => {
  await page.locator('table tbody tr').first().click();
  await expect(page).toHaveURL(/selected=/);
  await expect(page.getByTestId(titleTestId)).toBeVisible();
  return decodeURIComponent(new URL(page.url()).searchParams.get('selected') ?? '');
};

/**
 * Live create-form overrides: a per-run-unique registration number and a real
 * org-owned VehicleType int. Centralises the reg scheme so a future change (e.g.
 * a collision-avoiding prefix) lands in one place across the create specs.
 */
export const liveCreateOverrides = async (page: Page): Promise<{ reg: string; vtInt: string }> => ({
  reg: `E2E-${Date.now()}`,
  vtInt: await liveVehicleTypeInt(page),
});
