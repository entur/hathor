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
 * Load the JWT captured by the login handoff (`playwright/.auth/capture.mjs`).
 * Throws with a runnable hint if absent — live mode is impossible without it.
 */
export const loadOidcUser = (): OidcUser => {
  if (cached) return cached;
  if (!fs.existsSync(authFile)) {
    throw new Error(
      `Live e2e needs a captured token at ${authFile}.\n` +
        `Run \`npm run local\` (oidc + :37999), then \`node playwright/.auth/capture.mjs\` and log in.`
    );
  }
  cached = JSON.parse(fs.readFileSync(authFile, 'utf-8')) as OidcUser;
  return cached;
};

/**
 * Write `public/config.json` for this run. Live mode ships the oidc-enabled
 * localhost config (partner.dev + Sobek `:37999` + `claimsNamespace`) so the app
 * authenticates and renders the organisation picker; mock mode ships the
 * no-auth config the interceptors expect. Call from `beforeAll`.
 */
export const writeConfig = () => {
  const src = IS_LIVE ? 'config-with-auth.json' : 'config-no-auth.json';
  fs.copyFileSync(path.join(fixturesDir, src), targetConfig);
};

/**
 * Seed the captured OIDC user into `sessionStorage` before any app code runs, so
 * `react-oidc-context` boots already-authenticated and skips the login redirect.
 * sessionStorage (not localStorage) because oidc-client-ts defaults there and
 * Playwright `storageState` cannot carry it. No-op in mock mode.
 */
export const seedAuth = async (context: BrowserContext) => {
  if (!IS_LIVE) return;
  const { k, v } = loadOidcUser();
  await context.addInitScript(([key, val]) => window.sessionStorage.setItem(key, val), [
    k,
    JSON.stringify(v),
  ] as const);
};

/**
 * Ensure an organisation is selected — the hard precondition for every list hook
 * (`useVehicles`/`useVehicleTypes`/`useDeckPlans` early-return on
 * `!currentOrganisation?.id`, the "Loading data…" stall). `useOrganisations`
 * auto-selects `options[0]` once the authorized-orgs query resolves; this waits
 * for that, and explicitly picks the first option if auto-select hasn't filled
 * the input. No-op in mock mode (no picker is rendered).
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
