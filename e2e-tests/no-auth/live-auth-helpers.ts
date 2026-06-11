import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { expect, type BrowserContext, type Page } from '@playwright/test';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fixturesDir = path.join(__dirname, '..', 'fixtures');
const targetConfig = path.join(__dirname, '..', '..', 'public', 'config.json');
const authFile = path.join(__dirname, '..', '..', 'playwright', '.auth', 'oidc-user.json');

/** Timeout (ms) for the org picker to render + auto-select after login. */
const ORG_READY_TIMEOUT = 20000;

/** True when the suite runs against a live Sobek (`E2E_BACKEND=true`). */
export const IS_LIVE = process.env.E2E_BACKEND === 'true';

/** A captured oidc-client-ts user entry: storage `k`ey + stored `v`alue. */
interface OidcUser {
  k: string;
  v: { access_token: string; expires_at?: number; [x: string]: unknown };
}

let cached: OidcUser | null = null;

/**
 * Synthetic OIDC user for MOCK mode. Key = config-with-auth's authority+client_id
 * so react-oidc-context reads it. The token is never validated (all GraphQL is
 * intercepted), so a structurally-valid, far-future-expiry user is enough to flip
 * `isAuthenticated` true without a redirect — the mock counterpart to the live
 * captured JWT, so the SAME spec body runs in both modes (only the data differs).
 */
const MOCK_OIDC: OidcUser = {
  k: 'oidc.user:https://partner.dev.entur.org:0gQVx7xpSkg7lJDYuewMSr1sXKr7OJ3z',
  v: {
    access_token: 'mock-access-token',
    token_type: 'Bearer',
    scope: 'openid',
    profile: {
      sub: 'mock',
      iss: 'https://partner.dev.entur.org',
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
 * Write `public/config.json` for this run — the oidc-enabled localhost config in
 * BOTH modes so the app authenticates and renders the org picker. Live seeds a
 * real JWT + hits Sobek `:37999`; mock seeds a synthetic user + intercepts all
 * GraphQL (so the `:37999` URL is never reached). Call from `beforeAll`.
 */
export const writeConfig = () => {
  fs.copyFileSync(path.join(fixturesDir, 'config-with-auth.json'), targetConfig);
};

/**
 * Seed an OIDC user into `sessionStorage` before any app code runs, so
 * `react-oidc-context` boots already-authenticated (no redirect) — the real
 * captured JWT under live, a synthetic user under mock. sessionStorage (not
 * localStorage) because oidc-client-ts defaults there and Playwright
 * `storageState` cannot carry it. Under mock it also intercepts the
 * `organisations` query with one synthetic org so the app auto-selects it,
 * letting the SAME spec body run in both modes.
 */
export const seedAuth = async (context: BrowserContext) => {
  const { k, v } = IS_LIVE ? loadOidcUser() : MOCK_OIDC;
  await context.addInitScript(([key, val]) => window.sessionStorage.setItem(key, val), [
    k,
    JSON.stringify(v),
  ] as const);
  if (IS_LIVE) return;
  // Mock: claim only the `organisations` query at the context level; each spec's
  // page-level list interceptors run first and handle their own queries (they
  // must `fallback()` non-matches so the org query reaches this route).
  await context.route('**/graphql', async route => {
    const query: string = route.request().postDataJSON()?.query ?? '';
    if (query.includes('organisations')) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(MOCK_ORGANISATIONS),
      });
    } else {
      await route.fallback();
    }
  });
};

/**
 * Ensure an organisation is selected — the hard precondition for every list hook
 * (`useVehicles`/`useVehicleTypes`/`useDeckPlans` early-return on
 * `!currentOrganisation?.id`, the "Loading data…" stall). `useOrganisations`
 * auto-selects `options[0]` once the authorized-orgs query resolves; this waits
 * for that, and explicitly picks the first option if auto-select hasn't filled
 * the input. No-op in mock — the single synthetic org (seedAuth) auto-selects, so
 * no explicit pick is needed; this readiness wait is only for the live picker.
 */
export const selectFirstOrg = async (page: Page) => {
  if (!IS_LIVE) return;
  // MUI Autocomplete generates its own input id and drops the aria-label from
  // the input node, so neither `#organisation-select` nor a role-name match
  // works. The org picker is the single Autocomplete combobox in the banner.
  const select = page.getByRole('banner').getByRole('combobox').first();
  await expect(select).toBeVisible({ timeout: ORG_READY_TIMEOUT });
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
 */
export const readNetexIds = async (page: Page, n: number): Promise<string[]> => {
  const rows = page.locator('table tbody tr');
  const total = Math.min(n, await rows.count());
  const out: string[] = [];
  for (let i = 0; i < total; i++) {
    // Id-first lists (e.g. vehicle-types) render the NeTEx id chip in the first
    // cell as plain text — no `netex-id` testid — so read the cell directly.
    const m = (await rows.nth(i).locator('td').first().innerText())
      .replace(/\s+/g, '')
      .match(/[A-Za-z]+:[A-Za-z]+:[\w.-]+/);
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
