---
name: e2e_runner
description: >-
  Run AND keep healthy hathor's Playwright e2e suite — both mocked and against a LIVE
  local Sobek backend (E2E_BACKEND=true) — using the exact same sequential flow so the
  two modes stay identical, AND keeping the suite slim and true (no duplicate coverage,
  no unit-test-shaped specs). Use this whenever the user wants to run e2e against a real
  database / local backend, set up the manual-login + JWT-in-session (storageState)
  handoff, debug the "Loading data…" organisation-selection stall or a 401 from Sobek
  :37999 in tests, make mocked and live e2e behave the same way, audit that every spec
  follows the canonical login → select-org → navigate+count → create → edit-verify →
  edit sequence, or prune the suite (flag pure duplicate coverage and e2e tests that
  belong in vitest). Trigger eagerly on E2E_BACKEND, `e2e:local-backend`, "live backend
  e2e", "run e2e against the real DB", organisation-select stalls in tests, "why do my
  e2e tests hang / 401", "is this spec a duplicate", or "should this be a unit test" —
  even when the user doesn't name this skill.
---

# e2e_runner

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
- **Sobek down** → live mode is impossible; bring it up (`sobek`: `docker compose up` then
  `mvn -pl sobek-app spring-boot:run`). For the **Autosys import** flow you also need **Shepet** on
  :37998. Both are Java-21 apps with non-obvious snags (JDK-26 default breaks the build, Sobek↔Shepet
  `sobek-common` API drift, Shepet's half-configured OAuth2 `internal` client) — full recipe + fixes
  in `references/bringing-up-backends.md`.
- **401 from Sobek** → live mode needs a real token. You MUST do the login handoff (next section);
  `config-no-auth.json` sends no token and will 401 against a secured Sobek.
- **A dev server already on :5000 from another checkout** → Playwright reuses it
  (`reuseExistingServer`) and will serve the *wrong* config/worktree. Make sure :5000 is free or
  served by *this* checkout before running, or every test renders the wrong app. (This exact trap
  has produced whole-suite false failures — a login page or a stale config served to all tests.)

Read `references/harness-internals.md` for the full mechanics (config swap, helpers, fixtures,
the `E2E_BACKEND` branch points) before editing specs or helpers.

### Suite-hygiene gate (part of preflight — alert, don't accept)

The live suite is slow and mutates a real DB, so every spec must earn its seat. Two failure
modes silently bloat it; catch both here and **raise them in the session rather than waving
them through**. This gate is not optional cleanup — a bloated or mis-targeted suite makes every
later step (run, audit, debug) slower and noisier.

- **No pure duplicate coverage.** Two specs (or two `test()`s) that assert the *same* behaviour
  over the same surface add runtime and maintenance for zero extra signal. Scan for it by
  comparing each spec's file-level JSDoc keynote — its `Workflow` and `Covers` sections (the same
  machine-readable summary the sibling **`spec-flowchart-viz`** skill renders). Overlapping
  `Covers` bullets on the same route + same testids are the tell. When you find a pure dup,
  **stop and surface it**: name both specs, show the overlapping coverage, and propose the merge
  or delete — then let the user decide. Do not proceed as though the duplication is fine.
- **No unit-test-shaped e2e.** An e2e test that pins pure logic (a formatter, serializer, reducer,
  parse/`restruct` helper) with no UI-visible, browser-or-backend-dependent behaviour belongs in
  vitest, not Playwright — there it runs in milliseconds and asserts the logic directly instead of
  through the DOM. Project rule of thumb: **UI-visible behaviour → Playwright `no-auth/`; pure
  logic → vitest.** When a spec is really exercising logic a unit test could pin, flag it and
  propose moving it down to a `*.test.ts`. Keeping these out is what keeps the e2e suite *slim and
  true* — every remaining spec is here because it genuinely needs a real browser + backend.

Treat both as **alerts to address in-flow**, at the natural point in the session — during the
audit, or right before a live run when the DB-mutation cost is about to be paid — not findings to
note and ignore. Pair this with the conformance checklist under "Verify / audit" below.

## Login handoff (live mode, step 1b)

Sobek requires a Bearer token and there is **no automated login** in the harness today (no
`globalSetup`, no `storageState`, no OIDC completion). So a human logs in once and we capture the
session token. This is the **proven recipe** (verified end-to-end):

1. **Serve the app authenticated against local Sobek:** `npm run local`. Its `prelocal` hook copies
   `.github/environments/config-localhost.json` → `public/config.json`, which already has **both**
   `oidcConfig` (partner.dev.entur) **and** the `:37999` backend — so this single command is the
   login vehicle. Don't hand-copy `config-with-auth.json`; and note `npm run dev` points at the dev
   API instead (`config-dev.json`), which is *not* what you want here.
2. **Run the capture script from INSIDE the repo tree — not `/tmp`.** It `import`s
   `@playwright/test`, so it must sit where node resolves `node_modules`; a `/tmp` script dies with
   `ERR_MODULE_NOT_FOUND`. Put it in a gitignored dir — `playwright/.auth/capture.mjs`
   (`/playwright/.auth/` is already gitignored). It launches a **headed** browser to
   `localhost:5000` and polls until the OIDC user appears. Ready-to-run script (and the re-seed +
   verify steps) are in `references/harness-internals.md`.
3. The human completes the Entur login in that window.
4. The script captures `oidc.user:<authority>:<client_id>`, checking **both** `sessionStorage` and
   `localStorage` (oidc-client-ts defaults to sessionStorage), and writes `{ k, v }` to a gitignored
   file; `.v.access_token` is the JWT.
   ⚠️ Playwright's `storageState` persists cookies + **localStorage only, not sessionStorage** — so
   you cannot rely on `storageState`. Capture the `oidc.user:*` entry explicitly and re-seed it via
   `addInitScript` for the serial run (snippet in harness-internals).
5. **Verify the token before running — make-or-break.** The JWT does **not** need a `roles` claim —
   Sobek resolves role assignments **backend-side** (from the token's `organisationID` claim via the
   permission store), so a partner.dev token with only `scope: openid` is fine. Verify the *effect*,
   not the claim: call `organisations(onlyUserAuthorized:true)` (filter type `OrganisationsFilter`)
   and confirm it returns the user's authorized orgs. Empirically (2026-06-22) a no-roles-claim
   partner.dev token returned 2 orgs (AtB + Agder) here. If that query **errors or comes back empty**,
   the account has **no role assignments provisioned backend-side** (or the permission-store lookup
   failed) → the org dropdown can't populate → `currentOrganisation` null → the "Loading data…"
   stall. That's a backend role-provisioning/permission issue, **not** a missing-JWT-claim or hathor
   query-shape problem (hathor's org query is correct). The non-authorized `organisations` path (no
   filter) returns all orgs regardless — use it only to sanity-check connectivity, not authorization.

Never paste the JWT into chat or commit it. Keep it in a gitignored file for the run only; short-lived.

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
- Its **file-level JSDoc keynote** (the `Title → Workflow → Covers → Modes` block above the first
  `test(`) still matches what the spec actually does. This keynote is the spec's curated,
  machine-readable summary — the sibling **`spec-flowchart-viz`** skill reads exactly these blocks
  (never the test bodies) to render the suite as flowcharts. So when an audit changes a spec's flow,
  modes, or coverage, update its keynote in the **same** edit; a stale keynote silently lies to both
  the next human reader and the diagram generator. Keep the `Modes:` section honest about
  mock / live / skip-live — that's the same mode-agnosticism this skill is verifying, just written down.

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
- `references/bringing-up-backends.md` — build + run recipes for Sobek (:37999) and Shepet (:37998)
  under JDK 21, health checks, and the three startup snags (JDK version, `sobek-common` cross-repo
  drift, Shepet's OAuth2 `internal` client). Read before starting the live backends.
