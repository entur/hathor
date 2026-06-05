# Harness internals

How the e2e harness switches modes, swaps config, and what's reusable. Paths are relative to the
hathor repo root. Line numbers drift — grep to confirm.

## Contents
- [Mode switches](#mode-switches)
- [Config swapping](#config-swapping)
- [The sessionStorage / JWT capture wrinkle](#the-sessionstorage--jwt-capture-wrinkle)
- [Reusable helpers](#reusable-helpers)
- [Fixtures](#fixtures)
- [Serial execution](#serial-execution)

## Mode switches

Two env vars, both read in specs (not in `playwright.config.ts`, which only reads `E2E_SUITE`):

- `E2E_SUITE` — `no-auth` | `auth`. Selects `testDir` (`./e2e-tests/no-auth` vs `./e2e-tests/auth`)
  in `playwright.config.ts` (~L14-15) and forces `workers: 1` for no-auth (~L32).
- `E2E_BACKEND` — `'true'` makes specs **skip their GraphQL interceptors** so requests hit live
  Sobek. Set only by `package.json` → `e2e:local-backend` (`E2E_BACKEND=true E2E_SUITE=no-auth`).

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

## Config swapping

`playwright.config.ts` does **not** set `public/config.json`. Each suite copies a fixture into it
in `beforeAll` (e.g. `no-auth.spec.ts` ~L44, `auth.spec.ts` ~L19):
```ts
fs.copyFileSync(`${fixturesDir}/config-no-auth.json`, 'public/config.json');
```
Because all specs mutate that one on-disk file, the no-auth suite must stay serial.

Fixtures (`e2e-tests/fixtures/`):
| File | oidcConfig | backend URL | use |
|---|---|---|---|
| `config-no-auth.json` | absent | `http://localhost:37999/services/vehicles/graphql` | default no-auth + `e2e:local-backend` |
| `config-with-auth.json` | present (partner.dev.entur) | same `:37999` | auth suite; **the one to use for live login** |
| `config-no-baseurl.json` | absent | missing baseUrl | mock-only error test |

Key consequence: `e2e:local-backend` ships `config-no-auth.json` → **no OIDC, no token** → 401
against a secured Sobek. For an authenticated live run, use an OIDC-enabled config pointing at
`:37999` (`config-with-auth.json`, or a new `config-localhost-auth.json`).

## The sessionStorage / JWT capture wrinkle

`oidc-client-ts` (under `react-oidc-context`) stores the signed-in user in **sessionStorage** by
default, under key `oidc.user:<authority>:<client_id>`; its `.access_token` is the Bearer JWT
(`src/auth/Auth.tsx`).

Playwright `storageState` saves cookies + **localStorage only** — *not* sessionStorage. So a saved
`storageState` will **not** keep you logged in. Two workable options:

1. **Capture + re-seed sessionStorage** (closest to "JWT in session"):
   ```ts
   // after the human logs in, in the same page:
   const oidc = await page.evaluate(() => {
     const k = Object.keys(sessionStorage).find(k => k.startsWith('oidc.user:'));
     return k ? { k, v: sessionStorage.getItem(k)! } : null;
   });
   // persist `oidc` to a gitignored file, then for the serial run:
   await context.addInitScript(({ k, v }) => sessionStorage.setItem(k, v), oidc);
   ```
2. **Inject the Bearer directly** — pull `access_token` out of that JSON and add
   `Authorization: Bearer <jwt>` via `context.setExtraHTTPHeaders` / a route handler. Simpler, but
   bypasses the app's own auth wiring (less faithful to real usage).

Decode the JWT (`base64 -d` the middle segment) and confirm it carries the role/permission claim
Sobek's `RoleAssignmentExtractor` reads — without it, `organisations(onlyUserAuthorized:true)`
throws and the org dropdown never fills → "Loading data…" stall.

## Reusable helpers

`e2e-tests/no-auth/autosys-helpers.ts`:
- `loadFixture(name)` — sync-load a JSON fixture.
- `interceptGraphQLQuery(page, queryName, body)` — generic: fulfill on query-substring match, else
  `continue()`. The primitive all other GQL mocks build on.
- `interceptVehicleTypesQuery(page)` / `interceptDeckPlansQuery(page)` — list mocks.
- `interceptVehicleTypesWithSave(page, opts)` — **stateful** VT save mock; returns `{ lastInput }`
  to assert the captured mutation input (mock-only).
- `interceptAutosysQuery(page)` — serves the Autosys XML fixture.

`e2e-tests/no-auth/vehicle-list-helpers.ts` — composable trio (register in this order):
- `interceptVehicleListQuery(page)` — unfiltered `vehicles(...)` → 15-row fixture; ignores by-id.
- `interceptVehicleByIdQuery(page, resolve)` — claims `filter.netexIds` queries.
- `interceptVehicleSaveMutation(page, newId, onSaved?)` — captures `createOrUpdateVehicle` input.
- `interceptStatefulVehicleListQuery(page)` + `addCreated(id, lagCalls)` — models read-after-write
  replica lag (first N list reads omit the new id, then it appears); `callCount()` for asserts.
- `vehicleRow(id, over)` / `mockVehicleById(id)` — row factories.

App-side polling (works in both modes): `src/data/vehicles/api/waitForVehicleInList.ts` — polls the
unfiltered list up to 5×/250ms for a freshly-created id; swallows transient errors. Used by
`VehicleCreatePage.tsx` "View in list". This is the model for read-after-write under a live DB.

## Serial execution

`playwright.config.ts` ~L32: `workers: process.env.CI || isNoAuth ? 1 : undefined`. Serial for
no-auth (shared `config.json`) and in CI. Multi-step / mutating specs add
`test.describe.configure({ mode: 'serial' })` (`no-auth.spec.ts` ~L38, `import-to-detail.spec.ts`
~L6) so a step can read what the previous one wrote.
