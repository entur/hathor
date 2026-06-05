---
name: e2e_backend_runner
description: >-
  Run AND verify hathor's Playwright e2e suite against a LIVE local Sobek backend
  (E2E_BACKEND=true) using the exact same sequential flow as a mocked run, so the two
  modes stay identical. Use this whenever the user wants to run e2e against a real
  database / local backend, set up the manual-login + JWT-in-session (storageState)
  handoff, debug the "Loading data…" organisation-selection stall or a 401 from Sobek
  :37999 in tests, make mocked and live e2e behave the same way, or audit that every
  spec follows the canonical login → select-org → navigate+count → create → edit-verify
  → edit sequence. Trigger eagerly on E2E_BACKEND, `e2e:local-backend`, "live backend
  e2e", "run e2e against the real DB", organisation-select stalls in tests, or "why do
  my backend e2e tests hang / 401" — even when the user doesn't name this skill.
---

# e2e_backend_runner

Hathor's e2e suite runs in two modes that are *supposed* to be interchangeable:

- **mocked** — `npm run e2e:no-auth`. GraphQL is intercepted with fixtures; counts are exact.
- **live** — `npm run e2e:local-backend` (`E2E_BACKEND=true E2E_SUITE=no-auth`). The same specs
  skip their interceptors and hit a real Sobek at `:37999`; data and counts vary.

The promise we want to keep: **the navigation and CRUD *flow* is identical in both modes — only
the data differs.** If that holds for every spec, we can trust the mocked suite as a fast proxy
for the live one. This skill both **runs** the live flow (including the human login handoff) and
**verifies** that every spec conforms to the canonical sequence.

This skill has two jobs. Decide which the user wants (often both):
1. **Run** the live-backend flow end to end, driving the manual-login → org-select → per-entity
   CRUD sequence and reporting where it breaks.
2. **Verify/audit** that the spec files all follow the same sequence so mocked == live.

## The canonical sequence (why order matters)

The DB is mutated, so the whole run is **sequential** — Playwright `workers: 1` +
`test.describe.configure({ mode: 'serial' })`. A later step reads what an earlier step wrote;
parallelism would race the database. The sequence, per entity:

1. **Auth status** — confirm logged-in vs logged-out is what this run expects.
2. **(live only) Login handoff** — open a headed browser, let the human log in, capture the
   JWT *from the browser session*, persist it for the serial run. See "Login handoff" below.
3. **Org presence** — is an organisation selected? Lists do nothing until one is.
4. **Select an org** — pick the first available organisation. This is a hard precondition:
   every list hook early-returns on `!currentOrganisation?.id` (the cause of the
   "Loading data…" stall). See `references/surfaces-and-testids.md`.
5. **Navigate + row count** — go to the entity list, read `total-entries[data-count]`.
   Mocked: assert the exact fixture count. Live: assert a *relative* check (`>= n`, or
   "increased by 1 after create") — never a hardcoded number.
6. **Create → edit-verify** — create a row, then open it for edit and confirm the values you
   wrote actually round-tripped (read-back, not just "mutation fired").
7. **Edit same row** — change a field, save, re-open, confirm the change persisted.
8. **Repeat 5–7 for the remaining entities.**

If steps 1–8 hold end-to-end across the suite, we're at peace: mocked and live are the same shape.

## Preflight (always run this first)

Before touching anything, establish the ground truth — this is the "prereq check":

```bash
# from the hathor repo root
grep -n 'e2e:' package.json                      # confirm e2e:local-backend exists
ss -ltn | grep -E ':37999|:5000' || true         # is Sobek up? is a dev server already up?
curl -s -o /dev/null -w '%{http_code}\n' -X POST \
  http://localhost:37999/services/vehicles/graphql \
  -H 'Content-Type: application/json' -d '{"query":"{__typename}"}'   # 200 = open, 401 = needs auth
```

Interpret:
- **Sobek down** → live mode is impossible; tell the user to start it (`sobek`: `docker compose up`
  then `mvn -pl sobek-app spring-boot:run`).
- **401 from Sobek** → live mode needs a real token. You MUST do the login handoff (next section);
  `config-no-auth.json` sends no token and will 401 against a secured Sobek.
- **A dev server already on :5000 from another checkout** → Playwright reuses it
  (`reuseExistingServer`) and will serve the *wrong* config/worktree. Make sure :5000 is free or
  served by *this* checkout before running, or every test renders the wrong app. (This exact trap
  has produced whole-suite false failures — a login page or a stale config served to all tests.)

Read `references/harness-internals.md` for the full mechanics (config swap, helpers, fixtures,
the `E2E_BACKEND` branch points) before editing specs or helpers.

## Login handoff (live mode, step 1b)

Sobek requires a Bearer token and there is **no automated login** in the harness today (no
`globalSetup`, no `storageState`, no OIDC completion). So a human logs in once and we capture the
session token. Use a config that actually enables OIDC *and* points at `:37999` —
`config-with-auth.json` already does both; `config-no-auth.json` does not.

Procedure:
1. Copy an OIDC-enabled config to `public/config.json` (e.g. `config-with-auth.json`).
2. Launch a **headed** browser to the app, navigate to a protected route, and **pause** for the
   human (`await page.pause()` in a tiny setup script, or a Playwright global-setup project).
3. The human completes the Entur login in that window.
4. **Capture the token from `sessionStorage`** — oidc-client-ts stores the signed-in user under
   `oidc.user:<authority>:<client_id>` in **sessionStorage**, and its `access_token` is the JWT.
   ⚠️ Playwright's `storageState` persists cookies + **localStorage only, not sessionStorage** —
   so you cannot rely on `storageState` alone. Read the `oidc.user:*` entry explicitly and re-seed
   it (via an `addInitScript` that writes it back into `sessionStorage` on each page) so the serial
   run stays authenticated. Details + a ready snippet live in `references/harness-internals.md`.
5. Decode the JWT and sanity-check it before running: it must carry the role/permission claim Sobek
   reads for `organisations(onlyUserAuthorized:true)` — a token missing role assignments makes the
   org dropdown throw, which cascades into the same "Loading data…" stall. If the org fetch throws,
   that's a token/permissions problem (or a Sobek bug), not a hathor query bug.

Never paste the JWT into chat or commit it. Keep it in a gitignored file (e.g. `/tmp/…`) for the
run only; tokens are short-lived.

## Running

```bash
# mocked (fast, deterministic) — the baseline the live run must match
npm run e2e:no-auth

# live backend — sequential, mutates the DB; do the login handoff first
npm run e2e:local-backend
```

Scope to one spec while iterating: append the spec name, e.g.
`E2E_BACKEND=true E2E_SUITE=no-auth npx playwright test vehicle-create-feedback`.

When a live run fails, first decide *which* layer broke before reading assertions:
- **login page / 401** → handoff or token problem (above).
- **"Loading data…" forever** → no org selected (step 4) — the list hook is still early-returning.
- **wrong app entirely** → stale `:5000` dev server from another checkout (preflight).
Only once the app is actually rendering the entity list do per-assertion failures mean anything.

## Verify / audit (conformance)

To confirm every spec is mode-agnostic, walk the suite against this checklist. Report findings as a
table (spec → which steps it covers, what's hardcoded, whether it skips a mode). Don't rewrite
blindly — surface the gaps and let the user decide.

A spec is **conformant** when:
- It selects (or, in mocked mode, provides) an organisation before asserting on a list — otherwise
  it stalls under live and only "passes" mocked by accident.
- Row-count assertions are **relative** under live (`>= n`, or delta-after-create), exact only in
  mocked. Hardcoded counts (`data-count='15'`, `'3'`, `'10'`) are the usual offenders.
- Save verification is a **read-back** (re-open the row, assert the rendered value), not a
  mock-only capture of the mutation input — captures can't work against a real backend.
- Any `test.skip(process.env.E2E_BACKEND …)` gate is justified (genuinely mode-specific), not a
  workaround for an assertion that *could* be written mode-agnostically.
- It relies only on stable testids (`editor-rail-edit/save/cancel/collapse`, `create-vehicle-fab`,
  `vtype-*`, `organisation-select`, `total-entries`) — see `references/surfaces-and-testids.md`.

**Known structural mismatch to call out, not paper over:** the three entities don't share a create
surface. Vehicles have a real create form (`/vehicles/new`, `create-vehicle-fab`); vehicle-types are
created only via the Autosys import dialog (`import-vehicle-multi-button`); deck-plans have no UI
create at all (route-based edit only). So "create → edit-verify → edit" maps cleanly to vehicles,
maps to *import* → edit-verify for vehicle-types, and to *edit-only* for deck-plans. Encode that
per-entity reality rather than pretending a uniform create exists.

## Reference files

- `references/harness-internals.md` — `E2E_BACKEND`/`E2E_SUITE`, config swapping, the
  sessionStorage/JWT capture wrinkle (+ snippet), reusable helpers (`interceptGraphQLQuery`,
  vehicle-list trio, `waitForVehicleInList`), fixtures, serial config. Read before editing helpers.
- `references/surfaces-and-testids.md` — per-entity create/edit surfaces, the full `data-testid`
  inventory, and which row-count assertions are hardcoded. Read before writing or auditing a spec.
