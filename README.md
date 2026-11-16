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
| `npm run e2e` | Playwright tests (mocked GraphQL) |
| `npm run e2e:local-backend` | Playwright tests against a live local Sobek |

## Releases

The Build workflow opens or updates `automation/version-bump` after changes reach
`main`. The PR increments the minor version in `package.json` and
`package-lock.json`; it does not push directly to `main`.

Merge the version-bump PR after its required checks pass. Only a push to `main`
that changes the package version creates the corresponding `v<version>` tag and
triggers deployment. Merging the bump does not create another bump PR.

Repository administrators must enable **Settings > Actions > General > Workflow
permissions > Allow GitHub Actions to create and approve pull requests**.
The workflow requests `contents: write`, `pull-requests: write`, and
`actions: write`. It explicitly dispatches the Tests workflow on the bump branch
because PRs created with `GITHUB_TOKEN` do not automatically trigger PR workflows.
No ruleset bypass or additional token is required.

## Folder semantics

Hathor's `src/` mixes two organizational styles. Before adding files, know which one you're touching.

**Vertical (feature) folders:**

- `auth/` — OIDC bootstrap, ProtectedRoute, login flow, auth utilities.
- `config/` — runtime config fetch (`fetchConfig.ts`).
- `theme/` — `createThemeFromConfig`, MUI theme module augmentation (`theme-config.d.ts`).
- `data/<feature>/` — production domain folders (`vehicles/`, `vehicle-types/`, `deck-plans/`, `vehicle-imports/`). Each holds one entity's data hook, collection config + page, editor (`*Details`, `*Sections`, `*DetailsPage`) and types.
- `graphql/` — GraphQL operations grouped by feature.
- `locales/` — i18next translation files (`en/`, `nb/`).

**Horizontal (file-kind) folders:**

- `components/` — UI components grouped by sub-area (`collection/`, `form-layout/`, `header/`, `sidebar/` (the form page's `EditorFrame`), `dialogs/`, `common/`, `auth/`).
- `hooks/` — global hooks shared across features.
- `pages/` — generic infrastructure (`shell/`: the page frames) and the `Home` page. Entity pages live in `data/<feature>/`, not here.
- `utils/` — domain-neutral helpers (`iconLoaderUtils.ts`).
- `contexts/` — top-level React contexts not yet hosted in feature folders (`configContext`, `CustomizationContext`, `EditingContext`, `SessionContext`).
- `static/` — static assets.

**Where new files go:**

- New entity → `data/<feature>/`. Data hook, collection config + page, editor and types live together. Add its two routes in `App.tsx` (see CLAUDE.md, *Collection + form pages*).
- New non-entity routed page → `pages/`.
- New hook used by ≥2 features → `hooks/`. Single-feature hook → next to its caller in `data/<feature>/`.
- New `*Types.ts` file → next to its primary consumer. Feature types under `data/<feature>/`; types that pair with shared infrastructure go with that infra (e.g. `components/collection/types.ts`, `graphql/paginationTypes.ts`, `components/form-layout/types.ts`). Don't recreate `src/types/`.
- JSX → `.tsx`. No JSX → `.ts`.

Some contexts (`configContext`, `CustomizationContext`, `SessionContext`) and a few hooks haven't migrated to their feature folders yet.

## Customization

Hathor is a fork of [Inanna](https://github.com/entur/inanna), Entur's React data-registry starter. Extending it — new entity views, theming, custom icons — follows the Inanna *extend-fork* workflow; see [DEV_GUIDE.md](DEV_GUIDE.md) for the pointer.

Known design ambiguities are tracked in [OPEN_QUESTIONS.md](OPEN_QUESTIONS.md).
