# Hathor

*Work in progress*  

Frontend for [Sobek](https://github.com/entur/sobek) — Entur's national vehicle registry (Nasjonalt Materiellregister).


↻ Deployment(s) : [dev](https://materiellregister.dev.entur.no)

💡 Sandbox/mind-maps : [entur.github.io/hathor](https://entur.github.io/hathor/)


## Tech Stack

- React 19 + TypeScript
- Vite
- Material UI v7
- GraphQL (`graphql-request`)
- OIDC authentication (`react-oidc-context`)

## Getting Started

```bash
npm install
npm run dev          # Dev server on http://localhost:5000
```

Requires a running [Sobek](https://github.com/entur/sobek) backend (default: `http://localhost:37999`).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (uses dev API) |
| `npm run local` | Start dev server (uses local Sobek at `127.0.0.1:37999`) |
| `npm run build` | Type-check and build (`build/`) |
| `npm run lint` | ESLint |
| `npm run format` | Prettier auto-format |
| `npm run e2e:auth` | Playwright tests (auth enabled) |
| `npm run e2e:no-auth` | Playwright tests (auth disabled) |

## Folder semantics

Hathor's `src/` mixes two organizational styles. Before adding files, know which one you're touching.

**Vertical (feature) folders:**

- `auth/` — OIDC bootstrap, ProtectedRoute, login flow, auth utilities.
- `config/` — runtime config fetch (`fetchConfig.ts`).
- `theme/` — `createThemeFromConfig`, MUI theme module augmentation (`theme-config.d.ts`).
- `data/<feature>/` — production domain folders (`vehicles/`, `vehicle-types/`, `deck-plans/`, `vehicle-imports/`). Each holds the data hook, view config, editor, cells, types, and View + Details components for one entity.
- `graphql/` — GraphQL operations grouped by feature.
- `locales/` — i18next translation files (`en/`, `nb/`).

**Horizontal (file-kind) folders:**

- `components/` — UI components grouped by sub-area (`data/`, `search/`, `header/`, `sidebar/`, `dialogs/`, `common/`, `auth/`).
- `hooks/` — global hooks shared across features.
- `pages/` — generic infrastructure (`GenericDataViewPage`, `GenericDetailsPage`) and the `Home` page. Entity Views live in `data/<feature>/`, not here.
- `utils/` — domain-neutral helpers (`iconLoaderUtils.ts`).
- `contexts/` — top-level React contexts not yet hosted in feature folders (`configContext`, `CustomizationContext`, `EditingContext`, `SessionContext`).
- `static/` — static assets.

**Where new files go:**

- New entity (data-table backed) → `data/<feature>/`. Data hook, view config, editor, cells, types, and the View component live together. Add a route in `App.tsx`.
- New non-entity routed page → `pages/`.
- New hook used by ≥2 features → `hooks/`. Single-feature hook → next to its caller in `data/<feature>/`.
- New `*Types.ts` file → next to its primary consumer. Feature types under `data/<feature>/`; types that pair with shared infrastructure go with that infra (e.g. `pages/viewConfigTypes.ts`, `graphql/paginationTypes.ts`, `components/data/dataTableTypes.ts`). Don't recreate `src/types/`.
- JSX → `.tsx`. No JSX → `.ts`.

Some contexts (`configContext`, `CustomizationContext`) and a few hooks haven't migrated to their feature folders yet — see [OPEN_QUESTIONS.md](OPEN_QUESTIONS.md) for tracked design ambiguities.

## Customization

Hathor is a fork of [Inanna](https://github.com/entur/inanna), Entur's React data-registry starter. Extending it — new entity views, theming, custom icons — follows the Inanna *extend-fork* workflow; see [DEV_GUIDE.md](DEV_GUIDE.md) for the pointer.

Known design ambiguities are tracked in [OPEN_QUESTIONS.md](OPEN_QUESTIONS.md).
