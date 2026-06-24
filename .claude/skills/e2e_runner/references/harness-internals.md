# Harness internals

How the e2e harness switches modes, routes config, and what's reusable. Paths are relative to the
hathor repo root. Line numbers drift — grep to confirm.

## Contents
- [Mode switches](#mode-switches)
- [Config routing](#config-routing)
- [The sessionStorage / JWT capture wrinkle](#the-sessionstorage--jwt-capture-wrinkle)
- [Reusable helpers](#reusable-helpers)
- [Fixtures](#fixtures)
- [Worker model](#worker-model)

## Mode switches

One env var drives mode (`E2E_SUITE` is gone — there is a single flat suite under `e2e-tests/`,
`testDir: './e2e-tests'`, default multi-worker since config is no longer disk-shared):

- `E2E_BACKEND` — `'true'` makes specs **skip their GraphQL interceptors** so requests hit live
  Sobek. Set only by `package.json` → `e2e:local-backend` (`E2E_BACKEND=true … --workers=1`).
  Auth profile is chosen per-test via `setConfig(router, 'auth-on' | 'auth-off')` (route-intercepts
  `**/config.json`); `seedAuth` serves `'auth-on'` itself.

The branch pattern in specs (the thing to keep uniform):
```ts
test.beforeEach(async ({ page }) => {
  if (process.env.E2E_BACKEND !== 'true') {
    await interceptVehicleTypesQuery(page);   // mocked only; live falls through to :37999
  }
});
```
Three skip flavours exist in the suite:
- `if (E2E_BACKEND !== 'true') intercept…` — mock when not live (most specs).
- `test.skip(E2E_BACKEND === 'true', 'mock-bound assertions')` — mock-only specs
  (e.g. `vehicle-type-sidebar.spec.ts` save block, `vehicle-slider-form.spec.ts`).
- `test.skip(() => E2E_BACKEND !== 'true', 'needs local Sobek')` — live-only specs
  (`vehicle-type-save-live.spec.ts`, `import-to-detail.spec.ts`).

The conformance goal is to shrink categories 2 and 3 — most specs should be one body that works in
both modes (relative assertions + read-back), reserving skips for genuinely mode-specific checks.

## Config routing

Nothing touches `public/config.json` on disk. `setConfig(router, profile)` (`live-auth-helpers.ts`)
**route-intercepts** the app's `**/config.json` startup fetch (`src/config/fetchConfig.ts`) and
fulfills it with a fixture body — registered before the first `goto`:
```ts
await setConfig(page, 'auth-off');        // or 'auth-on'
// seedAuth(context) calls setConfig(context, 'auth-on') itself, so most specs never name a config
```
Because each test serves its own config on its own page/context, there is no shared state — the
suite is parallel-safe (default workers).

Fixtures (`e2e-tests/fixtures/`):
| File | profile | oidcConfig | backend URL | use |
|---|---|---|---|---|
| `config-no-auth.json` | `'auth-off'` | absent | `http://localhost:37999/services/vehicles/graphql` | auth-off UI + mocked list specs |
| `config-with-auth.json` | `'auth-on'` | present (partner.dev.entur) | same `:37999` | `seedAuth` default; **the one for live login** |

Live runs (`e2e:local-backend`) go through `seedAuth`, which serves `'auth-on'`
(`config-with-auth.json`, OIDC pointing at `:37999`) **and** seeds the captured JWT into
sessionStorage — so the app authenticates against the secured Sobek. A spec that skips `seedAuth`
on the live path would have no token → 401.

## The sessionStorage / JWT capture wrinkle

`oidc-client-ts` (under `react-oidc-context`) stores the signed-in user in **sessionStorage** by
default, under key `oidc.user:<authority>:<client_id>`; its `.access_token` is the Bearer JWT
(`src/auth/Auth.tsx`). Playwright `storageState` saves cookies + **localStorage only** — *not*
sessionStorage — so a saved `storageState` will **not** keep you logged in. Capture the entry
explicitly instead.

### 1. Serve + capture (proven)

Serve with `npm run local` (config-localhost = oidc + `:37999`). The capture script **must live
inside the repo** so node resolves `node_modules` — a `/tmp` copy fails `ERR_MODULE_NOT_FOUND`. Put
it at `playwright/.auth/capture.mjs` (gitignored). Output the token to a gitignored path too.

```js
// playwright/.auth/capture.mjs  — run: node playwright/.auth/capture.mjs (with npm run local up)
import { chromium } from '@playwright/test';
import fs from 'node:fs';
const OUT = 'playwright/.auth/oidc-user.json';                 // gitignored
const readOidc = () => {                                       // runs in the page
  const scan = (s) => { for (const k of Object.keys(s)) {
    if (!k.startsWith('oidc.user:')) continue;
    try { const v = JSON.parse(s.getItem(k)); if (v?.access_token) return { k, v }; } catch {}
  } return null; };
  return scan(sessionStorage) || scan(localStorage);           // sessionStorage first
};
const browser = await chromium.launch({ headless: false });    // headed: human logs in
const page = await browser.newPage();
await page.goto('http://localhost:5000', { waitUntil: 'domcontentloaded' }).catch(() => {});
let user = null;
for (let i = 0; i < 600; i++) {                                // poll ~10 min
  user = await page.evaluate(readOidc).catch(() => null);
  if (user) break;
  await page.waitForTimeout(1000);
}
if (!user) { console.log('NO_TOKEN_CAPTURED'); await browser.close(); process.exit(1); }
fs.writeFileSync(OUT, JSON.stringify(user));
console.log('CAPTURED ' + user.k); await browser.close();
```

### 2. Verify the token (do this before any run)

```bash
TOK=$(jq -r '.v.access_token' playwright/.auth/oidc-user.json)
# decode payload — MUST contain a `roles` claim
echo "$TOK" | cut -d. -f2 | sed 's/-/+/g;s/_/\//g' | base64 -d 2>/dev/null | jq 'keys'
# live: this throws INTERNAL_ERROR if the token has no roles claim
curl -s -X POST http://localhost:37999/services/vehicles/graphql -H "Authorization: Bearer $TOK" \
  -H 'Content-Type: application/json' \
  -d '{"query":"query($f:OrganisationsFilter){organisations(filter:$f,size:3){totalElements}}","variables":{"f":{"onlyUserAuthorized":true}}}'
# sanity (always works): the non-authorized path returns all orgs (~339)
curl -s -X POST http://localhost:37999/services/vehicles/graphql -H "Authorization: Bearer $TOK" \
  -H 'Content-Type: application/json' -d '{"query":"{organisations(size:3){totalElements}}"}'
```
A `partner.dev` token with `scope:openid` and **no `roles`** → `organisations(onlyUserAuthorized:true)`
`INTERNAL_ERROR` (confirmed 2026-06-05). That's the role-claim gap, not a hathor bug.

### 3. Use it in the run

- **Re-seed sessionStorage** (faithful): before each page,
  `await context.addInitScript(({k,v}) => sessionStorage.setItem(k, JSON.stringify(v)), oidc)` with
  the captured `{k,v}`. Pair with an oidc-enabled config (config-localhost).
- **Inject the Bearer directly** (simpler, less faithful): pull `.v.access_token` and add
  `Authorization: Bearer <jwt>` via `context.setExtraHTTPHeaders`.

## Reusable helpers

`e2e-tests/autosys-helpers.ts`:
- `loadFixture(name)` — sync-load a JSON fixture.
- `interceptGraphQLQuery(page, queryName, body)` — generic: fulfill on query-substring match, else
  `continue()`. The primitive all other GQL mocks build on.
- `interceptVehicleTypesQuery(page)` / `interceptDeckPlansQuery(page)` — list mocks.
- `interceptVehicleTypesWithSave(page, opts)` — **stateful** VT save mock; returns `{ lastInput }`
  to assert the captured mutation input (mock-only).
- `interceptAutosysQuery(page)` — serves the Autosys XML fixture.

`e2e-tests/vehicle-list-helpers.ts` — composable trio (register in this order):
- `interceptVehicleListQuery(page)` — unfiltered `vehicles(...)` → 15-row fixture; ignores by-id.
- `interceptVehicleByIdQuery(page, resolve)` — claims `filter.netexIds` queries.
- `interceptVehicleSaveMutation(page, newId, onSaved?)` — captures `createOrUpdateVehicle` input.
- `interceptStatefulVehicleListQuery(page)` + `addCreated(id, lagCalls)` — models read-after-write
  replica lag (first N list reads omit the new id, then it appears); `callCount()` for asserts.
- `vehicleRow(id, over)` / `mockVehicleById(id)` — row factories.

App-side polling (works in both modes): `src/data/vehicles/api/waitForVehicleInList.ts` — polls the
unfiltered list up to 5×/250ms for a freshly-created id; swallows transient errors. Used by
`VehicleCreatePage.tsx` "View in list". This is the model for read-after-write under a live DB.

## Worker model

`playwright.config.ts`: `workers: undefined` (default = cpu cores), both locally and in CI — the
config route-interception removed the shared-disk constraint. Specs that genuinely need ordered
steps (a later step reads what an earlier one wrote) still opt in with
`test.describe.configure({ mode: 'serial' })`. The **live** run (`e2e:local-backend`) pins
`--workers=1` because parallel writes against one real Sobek would race.
