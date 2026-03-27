# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What Is Hathor

Hathor is the frontend for **Sobek** (Entur's national vehicle registry / Nasjonalt Materiellregister). It is a React 19 + TypeScript app built with Vite, using Material UI v7 and GraphQL to communicate with the Sobek backend.

## Key Documentation

- **`README.md`** — brief project overview, tech stack, quick start, scripts.
- **`DEV_GUIDE.md`** — the main developer guide: theming, custom icons, TypeScript theme extensions, and a step-by-step tutorial for adding new data table pages. This is where customization and extension documentation lives. Keep it up to date when the architecture or patterns change.

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
npm run e2e:auth         # Run auth-enabled test suite
npm run e2e:no-auth      # Run no-auth test suite
```

Pre-commit hooks (`.husky/pre-commit`) run `npm run check` (Prettier `--check` on the whole project) followed by `npx lint-staged` (Prettier `--write` + ESLint `--fix` on staged files). The developer uses `prettierd` in nvim for format-on-save, which picks up the repo-root `.prettierrc` automatically.

**Note:** `.prettierignore` must be kept in sync with `.gitignore` for generated/copied files (e.g. `public/config.json`, `public/theme-*.json`). Prettier does not respect `.gitignore` by default, so any gitignored file that Prettier would check needs an explicit entry in `.prettierignore` as well.

## Architecture

### Generic Data View Pattern

The core architectural pattern is a reusable data table system:

1. **ViewConfig** (`src/types/viewConfigTypes.ts`) — defines columns, filters, sort, search, data hooks, and editor components for an entity
2. **GenericDataViewPage** (`src/pages/GenericDataViewPage.tsx`) — orchestrates layout with search bar, data table, and resizable sidebar editor
3. **Page component** (e.g. `src/pages/VehicleTypeView.tsx`) — assembles a ViewConfig and passes it to GenericDataViewPage

To add a new data table page: define types → create data hook → create editor component → create cell components → create search hook → assemble ViewConfig → create page → add route. See `DEV_GUIDE.md` for the detailed tutorial.

### State Management

No state library — uses React Context API exclusively:

- **ConfigContext** — runtime config (API URLs, OIDC settings) loaded from `public/config.json`
- **SearchContext** — global search with debouncing, filters, suggestions
- **EditingContext** — sidebar editor state (which entity is being edited)
- **CustomizationContext** — theme/icon toggle, persisted to localStorage
- **SessionContext** — OIDC token expiry monitoring

Data fetching uses custom hooks per entity with local `useState` (e.g. `useVehicleTypes`).

### Backend Integration

- **GraphQL**: `graphql-request` library, queries in `src/graphql/vehicles/queries/`
- **REST**: NeTEx XML import via `src/data/vehicle-imports/vehicleImportServices.tsx`
- **Auth**: OIDC via `react-oidc-context` + `oidc-client-ts`, all API calls use Bearer tokens
- **Config**: API URLs and OIDC settings loaded at startup from `public/config.json`

Localhost backend config (`.github/environments/config-localhost.json`) points to two backends:
- **Sobek** at `http://127.0.0.1:37999/services/vehicles/` — GraphQL and NeTEx import
- **Shepet** at `http://127.0.0.1:37998/services/autosys` — Autosys vehicle data (separate app/port)

### Routing

React Router v6 in `src/App.tsx`. Protected routes use `<ProtectedRoute>` which checks OIDC authentication.

### Internationalization

i18next with English (`src/locales/en/`) and Norwegian Bokmål (`src/locales/nb/`).

### Theming

JSON-based theme config loaded at runtime. Custom icons system with `defaultIcons` vs `customIcons` directories in `public/assets/`. See README for details.

## E2E Testing (Playwright)

### Overview

End-to-end tests use Playwright (`@playwright/test`) with two test suites selected via the `E2E_SUITE` environment variable:

- **`auth`** — tests behavior when OIDC is configured (redirects to login provider, login button visible)
- **`no-auth`** — tests behavior when OIDC is absent (warning banner shown, content still accessible, "Auth off" chip in header)

### Directory Structure

```
e2e-tests/
├── auth/
│   └── auth.spec.ts              # Tests with OIDC enabled
├── no-auth/
│   └── no-auth.spec.ts           # Tests with OIDC disabled
└── fixtures/
    ├── config-with-auth.json     # config.json with oidcConfig set
    └── config-no-auth.json       # config.json without oidcConfig
```

### How It Works

Tests switch auth mode by copying a fixture file to `public/config.json` in `beforeAll()`. The Vite dev server picks up the change at runtime. This means:

- The **no-auth suite runs serially** (`mode: 'serial'`, `workers: 1`) because tests mutate the shared config file on disk.
- The **auth suite** can run in parallel locally.
- In **CI**, both suites use `workers: 1`.

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

`.github/workflows/playwright.yml` runs on push/PR to `main`/`master`:
1. Install deps (`npm ci`)
2. Install Playwright browsers (`npx playwright install --with-deps`)
3. Run `npm run e2e:auth` then `npm run e2e:no-auth`
4. Upload HTML report as artifact (30-day retention)

## Legacy Cleanup TODO

Remaining Tiamat/stop-place traces and dead code from the fork that still need attention:

- **StopPlace naming in search layer** — `useDataViewSearch.ts` params (`allFetchedStopPlaces`, `stopPlacesLoading`, `searchStopPlaceData`) and `searchTypes.ts` type `StopPlaceTypeFilter` (used in `SearchContext.tsx`) still use Tiamat domain names.
- **Commented-out code** — `useDataViewSearch.ts:14-27` (Tiamat filter logic with `ParentStopPlace`/`stopPlaceType`), `DesktopSearchBar.tsx` and `MobileSearchBar.tsx` (disabled `SearchAutocomplete` rendering), `Header.tsx` (unused `useTranslation` and mobile search callback).
- **Unused translation keys** — ~49 dead keys across `en/translation.json` and `nb/translation.json`, including `data.table.*`, `map.*`, `types.*` (stop-place types), `session.expired.message`, `product.*`.
- **Unused map infrastructure** — `useLayerVisibility.ts` hook never imported; `'map'` variant in `SearchContextViewType` never used.
- **Dead auth export** — `AuthProvider` exported from `src/auth/index.ts` but never consumed.
- **Stub component** — `WorkAreaContent.tsx` accepts `onSave`/`onCancel`/`onDetailsOpen` props but ignores them; `handleSave()` is empty.
- **Non-functional filters** — `vehicleTypeViewConfig.tsx:84-93` defines filters with stop-place categories (Train, Bus, Tram, etc.) but filtering is never wired up.
- **Misplaced hook** — `useDataViewSearch.ts` is in global `src/hooks/` but only used by VehicleType; belongs in `src/data/vehicle-types/`.
- **Typo** — `vehicleImportServices.tsx:33`: `"Error impor vehicle data"` (missing "t").

## Key Files

| File | Purpose |
|------|---------|
| `src/App.tsx` | Routes and app shell |
| `src/main.tsx` | Entry point, wraps app in context providers |
| `src/types/viewConfigTypes.ts` | Core ViewConfig type definitions |
| `src/pages/GenericDataViewPage.tsx` | Reusable data table page |
| `src/components/search/SearchContext.tsx` | Search state management |
| `src/contexts/ConfigContext.tsx` | Runtime config types and context |
| `public/config.json` | Runtime API/OIDC configuration |
| `.github/environments/` | Environment-specific config files |
| `playwright.config.ts` | Playwright config (suite selection, browsers, workers) |
| `e2e-tests/auth/auth.spec.ts` | E2E tests with OIDC enabled |
| `e2e-tests/no-auth/no-auth.spec.ts` | E2E tests with OIDC disabled |
| `e2e-tests/fixtures/` | Config fixture files for auth/no-auth modes |
| `.github/workflows/playwright.yml` | CI workflow for e2e tests |
