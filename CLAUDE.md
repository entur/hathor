# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What Is Hathor

Hathor is the frontend for **Sobek** (Entur's national vehicle registry / Nasjonalt Materiellregister). It is a React 19 + TypeScript app built with Vite, using Material UI v7 and GraphQL to communicate with the Sobek backend.

Hathor is a **fork of [Inanna](https://github.com/entur/inanna)**, Entur's React data-registry starter. Extending this codebase — new entity views, domain modelling, the Generic Data View pattern — follows the Inanna *extend-fork* workflow, documented in the global **`inanna-fork`** skill rather than in-repo. `FORK_DECISIONS.md` records the design choices specific to this fork.

## Key Documentation

- **`README.md`** — brief project overview, tech stack, quick start, scripts, and `src/` folder semantics (where new files go).
- **`DEV_GUIDE.md`** — a stub pointer. Hathor is an Inanna fork; the developer guide for adding entity views and extending the app lives in the global **`inanna-fork`** skill (extend mode), not in-repo.
- **`FORK_DECISIONS.md`** — the project's Architecture Decision Record (ADR) log. **Single source of truth for *why* design choices were made on this fork.** Each section captures one decision with its context, alternatives, and consequences. Add a new ADR section here for any non-obvious design call; do **not** restate the rationale in this file (CLAUDE.md describes *what* the patterns are; FORK_DECISIONS describes *why*).
- **`OPEN_QUESTIONS.md`** — unresolved design ambiguities. Companion to `FORK_DECISIONS.md`; entries graduate from here to there once decided.

## Commands

```bash
# Development (copies localhost config files first via predev hook)
npm run dev              # Vite dev server on port 5000

# Build
npm run build            # tsc -b && vite build (output to build/)

# Lint & format
npm run lint             # ESLint
npm run check            # Prettier check
npm run format           # Prettier auto-format

# E2E tests (Playwright)
npm run e2e              # Run the suite (mocked GraphQL), both browsers, multi-worker
npm run e2e:local-backend  # Same specs against a live local Sobek (E2E_BACKEND=true, --workers=1)
```

Pre-commit hooks (`.husky/pre-commit`) run `npm run check` (Prettier `--check` on the whole project) followed by `npx lint-staged` (Prettier `--write` + ESLint `--fix` on staged files). The developer uses `prettierd` in nvim for format-on-save, which picks up the repo-root `.prettierrc` automatically.

**Note:** `.prettierignore` must be kept in sync with `.gitignore` for generated/copied files (e.g. `public/config.json`, `public/theme-*.json`). Prettier does not respect `.gitignore` by default, so any gitignored file that Prettier would check needs an explicit entry in `.prettierignore` as well.

## Architecture

### Generic Data View Pattern

The core architectural pattern is a reusable data table system:

1. **ViewConfig** (`src/pages/viewConfigTypes.ts`) — defines columns, filters, sort, search, data hooks, and editor components for an entity
2. **GenericDataViewPage** (`src/pages/GenericDataViewPage.tsx`) — orchestrates layout with search bar, data table, and resizable sidebar editor
3. **Page component** (e.g. `src/data/vehicle-types/components/VehicleTypeView.tsx`) — assembles a ViewConfig and passes it to GenericDataViewPage

To add a new data table page: define types → create data hook → create editor component → create cell components → create search hook → assemble ViewConfig → create page → add route. For the detailed step-by-step tutorial, use the global **`inanna-fork`** skill in extend mode.

**Feature folder layout.** Each entity lives under `src/data/<feature>/` segmented bulletproof-react style — `api/` · `components/` (incl. `cells/`) · `hooks/` · `types/` · `utils/` (FORK_DECISIONS 2026-05-28). Note: cross-feature backend-model types (`Name`, `DeckPlan`, enums) currently sit in `data/vehicle-types/types/` + `data/netex/` and are reached into by sibling features — a known coupling being reworked onto a shared, codegen-shaped model layer (**#107**).

### State Management

No state library — uses React Context API exclusively:

- **ConfigContext** — runtime config (API URLs, OIDC settings) loaded from `public/config.json`
- **SearchContext** — global search with debouncing, filters, suggestions
- **EditingContext** — sidebar editor state (which entity is being edited)
- **CustomizationContext** — theme/icon toggle, persisted to localStorage
- **SessionContext** — OIDC token expiry monitoring
- **NavRailContext** — persistent left nav-rail expanded/collapsed state + CSS reflow (#65)

Data fetching uses custom hooks per entity with local `useState` (e.g. `useVehicleTypes`).

### Backend Integration

- **GraphQL (read)**: `graphql-request`, queries in `src/graphql/vehicles/queries/`
- **GraphQL (write)**: `createOrUpdateVehicle` / `createOrUpdateVehicleType` mutations in `src/graphql/vehicles/mutations/`. Sobek's `createOrUpdate*` is a **full-document replace** — an absent/blank input field is nulled, so serializers must send the complete document (not omit-blank).
- **REST**: NeTEx XML import via `src/data/vehicle-imports/vehicleImportServices.ts` (Autosys bulk import). The route-based VehicleType *create-via-XML* editor was removed — VehicleType save is now the GraphQL mutation above.
- **Auth**: OIDC via `react-oidc-context` + `oidc-client-ts`, all API calls use Bearer tokens
- **Config**: API URLs and OIDC settings loaded at startup from `public/config.json`

Localhost backend config (`.github/environments/config-localhost.json`) points to two backends:
- **Sobek** at `http://127.0.0.1:37999/services/vehicles/` — GraphQL and NeTEx import
- **Shepet** at `http://127.0.0.1:37998/services/autosys` — Autosys vehicle data (separate app/port)

**IMPORTANT — GQL fixtures must stay in sync with the GQL fetcher code.** Every mock and fixture that simulates a Sobek GraphQL response (vitest mocks in `*.test.ts` files, Playwright fixtures under `e2e-tests/fixtures/*-mock.json`) must mirror the exact wire shape the corresponding query in `src/graphql/vehicles/queries/` requests. When a query selection changes (field rename, addition, removal, or aliasing), the matching mocks/fixtures **must** be updated in the same change — otherwise tests pass against stale shapes and silently mask runtime breakage against the real backend. Mock values must also reflect real Sobek semantics: e.g. NeTEx ids are full `Codespace:Type:Number` form, never bare DB row ids.

**IMPORTANT — check the Sobek schema upfront in any hathor session.** Before touching GraphQL queries, mutations, fixtures, or data-shape code, verify hathor's queries have not drifted from Sobek's live schema. A vendored snapshot lives at `src/graphql/sobek.schema.graphqls`; the canonical source is `curl -s https://entur.github.io/sobek/schema.graphqls`. Diff the two (`curl -s https://entur.github.io/sobek/schema.graphqls | diff src/graphql/sobek.schema.graphqls -`) at the start of any schema-adjacent work — Sobek evolves independently of hathor, so the snapshot goes stale silently. If they differ, refresh the snapshot (`curl -s https://entur.github.io/sobek/schema.graphqls -o src/graphql/sobek.schema.graphqls`), confirm every field selected by `src/graphql/vehicles/**` still exists in the live schema, and flag any breaking removal/rename before proceeding.

When in doubt about whether a single hathor query has drifted, grep the canonical schema for the type/field in question.

### Routing

React Router v6 in `src/App.tsx`, wrapped in the persistent left **Nav Rail** shell (`NavRailProvider` / `AppShell`, #65). Protected routes use `<ProtectedRoute>` (OIDC check). Entity editing is a deep-linkable `?selected=<netexId>` **sidebar** editor (vehicle-types, vehicles); `/deck-plans/:id` stay route-based.

### Internationalization

i18next with English (`src/locales/en/`) and Norwegian Bokmål (`src/locales/nb/`).

### Theming

JSON-based theme config loaded at runtime and converted to an MUI theme by `src/theme/createThemeFromConfig.ts`; custom theme fields are declared via module augmentation in `src/theme/theme-config.d.ts`. Custom icons system with `defaultIcons/` vs `customIcons/` directories under `src/static/`, resolved by `src/utils/iconLoaderUtils.ts`.

## E2E Testing (Playwright)

### Overview

End-to-end tests use Playwright (`@playwright/test`) — one flat suite under `e2e-tests/`. The two auth profiles (OIDC configured vs absent) are no longer separate suites; `auth-modes.spec.ts` exercises both, and any spec picks its profile per-test via `setConfig`. `E2E_BACKEND=true` switches a spec from mocked GraphQL to a live local Sobek (see `e2e:local-backend`).

### Directory Structure

```
e2e-tests/
├── *.spec.ts                     # all specs, flat (auth-modes.spec.ts, vehicle*.spec.ts, …)
├── live-auth-helpers.ts          # setConfig (config route), seedAuth, org selection
├── autosys-helpers.ts            # GraphQL/Autosys intercept helpers
├── vehicle-list-helpers.ts       # vehicles() mock builders
└── fixtures/
    ├── config-with-auth.json     # config.json with oidcConfig set    ('auth-on')
    └── config-no-auth.json       # config.json without oidcConfig      ('auth-off')
```

### How It Works

Each test serves its own `public/config.json` to the app via **route interception** — `setConfig(router, 'auth-on' | 'auth-off')` fulfills the `**/config.json` fetch (`src/config/fetchConfig.ts`) with the chosen fixture body, registered before the first `goto`. `seedAuth(context)` serves `'auth-on'` itself, so most specs never name a config. Nothing touches `public/config.json` on disk, so:

- There is **no shared on-disk state** — the suite is parallel-safe and runs at the default worker count (cpu cores) locally and in CI.
- The **live-backend run pins `--workers=1`** (`e2e:local-backend`) because parallel writes against one live Sobek would race.

### Config & Browsers

`playwright.config.ts` configures:
- **Base URL**: `http://localhost:5000`
- **Browsers**: Desktop Chrome and Firefox (WebKit commented out)
- **Dev server**: Auto-started via `npm run dev` (reused locally, fresh in CI)
- **Retries**: 2 in CI, 0 locally
- **Traces**: Collected on first retry of failed tests
- **Report**: HTML report at `playwright-report/`

### Test Data Attributes

Tests rely on these `data-testid` attributes in the application:

| Attribute | Component | Purpose |
|-----------|-----------|---------|
| `auth-not-configured-warning` | `ProtectedRoute` | Warning banner when `oidcConfig` is undefined |
| `auth-disabled-label` | `HeaderActions` | "Auth off" chip in header |

Tests also check for the `.app-content` CSS class and the "Log in" button text.

### CI Workflow

`.github/workflows/playwright.yml` runs on push/PR to `main`/`master` as three jobs:
1. **`schema`** — Sobek schema-drift guard (curl + diff, no `npm ci`); gates `e2e`.
2. **`unit`** — `npm ci` + `npm run test:coverage`; sibling of `e2e` (no `needs`, so neither blocks the other).
3. **`e2e`** — `needs: schema`; browser matrix `project=[chromium, firefox]` (`fail-fast: false`), each `npm run e2e -- --project=$p` in the preinstalled Playwright container. HTML report uploaded per leg (`playwright-report-<project>`, 30-day retention).

## Legacy Cleanup TODO

Pure dead-code chores from the Tiamat/stop-place fork that can be deleted in a PR. *Design-level* ambiguities (couplings, naming leaks, filter shape) live in [OPEN_QUESTIONS.md](./OPEN_QUESTIONS.md) instead.

- **Commented-out code** — `useDataViewSearch.ts:14-27` (Tiamat filter logic with `ParentStopPlace`/`stopPlaceType`), `DesktopSearchBar.tsx` and `MobileSearchBar.tsx` (disabled `SearchAutocomplete` rendering), `Header.tsx` (unused `useTranslation` and mobile search callback).
- **Unused translation keys** — ~49 dead keys across `en/translation.json` and `nb/translation.json`, including `data.table.*`, `map.*`, `types.*` (stop-place types), `session.expired.message`, `product.*`.

## Key Files

| File | Purpose |
|------|---------|
| `src/App.tsx` | Routes and app shell |
| `src/main.tsx` | Entry point, wraps app in context providers |
| `src/pages/viewConfigTypes.ts` | Core ViewConfig type definitions |
| `src/pages/GenericDataViewPage.tsx` | Reusable data table page |
| `src/components/search/SearchContext.tsx` | Search state management |
| `src/contexts/configContext.ts` | Runtime config types and context |
| `public/config.json` | Runtime API/OIDC configuration |
| `.github/environments/` | Environment-specific config files |
| `playwright.config.ts` | Playwright config (testDir, browsers, workers) |
| `e2e-tests/auth-modes.spec.ts` | Both auth profiles (OIDC on/off) via `setConfig` |
| `e2e-tests/live-auth-helpers.ts` | `setConfig` (config route), `seedAuth`, org selection |
| `e2e-tests/fixtures/` | Config fixture files (`config-with-auth` / `config-no-auth`) |
| `.github/workflows/playwright.yml` | CI workflow: schema · unit · e2e browser matrix |
