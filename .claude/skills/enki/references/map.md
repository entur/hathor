# hathor ↔ enki map

Verified against enki `0.710.0` (`3f8d31cb`) and hathor `0.103.0`. Paths drift — when a row
matters, list the directory (`scripts/enki.sh ls <path>`) before relying on it.

## Contents

- [Folders](#folders)
- [Stack idioms](#stack-idioms)
- [Domain vocabulary](#domain-vocabulary)
- [Routes](#routes)
- [Config and environments](#config-and-environments)
- [Commands and ports](#commands-and-ports)
- [No counterpart](#no-counterpart)

## Folders

| enki | hathor | Note |
| --- | --- | --- |
| `src/scenes/<Entity>/` (`index.tsx` list, `Editor/`) | `src/data/<feature>/` (`api/ components/ hooks/ types/ utils/`) + `src/pages/GenericDataViewPage.tsx` | enki hand-writes a `Table` per scene; hathor declares a `ViewConfig` and reuses one page |
| `src/scenes/App/` | `src/App.tsx` + `src/components/header/` + `src/components/Menu.tsx` | app shell |
| `src/scenes/App/Header/index.tsx` | `src/components/header/{Header,HeaderBranding,HeaderActions}.tsx` | one file there, three here |
| `src/scenes/App/Header/LanguagePickerMenu.tsx` | — (language lives in `SettingsDialog`) | |
| `src/scenes/App/MenuDrawer/` | `src/contexts/NavRailContext.tsx` + `src/components/Menu.tsx` | enki: right-side temporary `Drawer`; hathor: persistent left Nav Rail (#65) |
| `src/scenes/App/SelectProvider/SelectProvider.tsx` | `src/data/organisations/components/SelectOrganisation.tsx` | header data-owner picker |
| `src/scenes/App/Routes.tsx` | `src/App.tsx` | |
| `src/model/` | `src/data/<feature>/types/` + `src/data/netex/` | |
| `src/api/uttu/{queries,mutations}.ts` | `src/graphql/vehicles/{queries,mutations}/` | |
| `src/actions/` + `src/reducers/` + `src/store/` | `src/contexts/` + `src/data/<feature>/hooks/` | Redux Toolkit vs Context + hooks |
| `src/helpers/`, `src/validation/`, `src/utils/` | `src/utils/` + `src/data/<feature>/utils/` | |
| `src/hooks/` | `src/hooks/` | |
| `src/components/` | `src/components/` | shared UI in both |
| `src/components/Page/` | — | enki's back-button + `h1` page frame |
| `src/auth/auth.tsx` | `src/auth/Auth.tsx` | both `react-oidc-context` |
| `src/config/{config.ts,fetchConfig.ts,ConfigContext.ts}` | `src/config/fetchConfig.ts` + `src/contexts/configContext.ts` | |
| `src/EnkiThemeProvider.tsx` + `src/ext/Entur/CustomTheme/theme.ts` | `src/theme/createThemeFromConfig.ts` + `.github/environments/theme-<env>.json` | TS theme vs JSON theme |
| `src/ext/Entur/CustomLogo/` | `src/components/header/HeaderBranding.tsx` + `theme.logoUrl` | |
| `src/i18n/translations/<loc>.ts` | `src/locales/<loc>/translation.json` | |
| `src/mocks/` (MSW) | Playwright `page.route` helpers in `e2e-tests/` | |
| `e2e/` | `e2e-tests/` | |
| `src/**/*.test.ts(x)` | same | Vitest in both |
| `AGENTS.md` | `CLAUDE.md` | agent guidance |

## Stack idioms

How an enki idiom is spelled in hathor. Port the behaviour, translate the idiom — a hathor diff
should not pull in Redux, Apollo, react-intl or SCSS unless the task is explicitly that migration.

| Concern | enki | hathor |
| --- | --- | --- |
| MUI | `@mui/material` 9.x | 7.x — see `shell-and-theme.md` § MUI 9 → 7 |
| State | `useAppSelector(s => s.userContext…)`, thunks in `src/actions/` | `useXContext()` from `src/contexts/`, per-entity hooks |
| GraphQL | Apollo Client, endpoint per provider `{uttuApiUrl}/{providerCode}/graphql` | `graphql-request`, single Sobek endpoint |
| i18n | `react-intl` — `formatMessage({ id: 'navBarDataProvider' })`, flat camelCase keys in TS | `react-i18next` — `t('organisations.select.label')`, nested keys in JSON |
| Locales | `en nb sv fi bg` | `en nb` |
| Styling | MUI `sx`; residual SCSS (`src/scenes/App/styles.scss`, `src/styles/`) | MUI `sx`; `src/index.css` |
| Imports | `baseUrl: src` — `import Loading from 'components/Loading'` | relative, with extension — `'../../../auth/index.ts'` |
| Component files | `Foo/index.tsx` folders, default exports common | flat `Foo.tsx` |
| Icons | `@mui/icons-material` components | `<img>` via `getIconUrl` (`src/utils/iconLoaderUtils.ts`) + some MUI icons |
| Theme access | `useTheme()` | `useTheme()` / `src/hooks/useAppTheme.ts` |
| Customisation | `src/ext/<extPath>/` via `@entur/react-component-toggle` + `sandboxFeatures` | `CustomizationContext`, `src/static/customIcons/` |
| API mocking in e2e | MSW, `VITE_ENABLE_MOCKS=true npm start` | Playwright route interception |
| Prettier | config in `package.json`, `prettier-plugin-organize-imports` | repo-root `.prettierrc` |

## Domain vocabulary

| enki | hathor |
| --- | --- |
| enki (repo) / **Nplan** (product, `appTitle`) | hathor (repo) |
| Uttu (backend) | Sobek (backend), Shepet (Autosys adapter) |
| Provider — `userContext.activeProviderCode`, persisted in `localStorage[ACTIVE_PROVIDER]` | Organisation — `OrganisationsContext.currentOrganisation` |
| "Choose data provider" / "Velg dataleverandør" (`navBarDataProvider`) | `organisations.select.label` |
| Line, FlexibleLine, JourneyPattern, ServiceJourney, DayType, Network, Branding, Export | Vehicle, VehicleType, DeckPlan |

## Routes

| enki | hathor |
| --- | --- |
| `/<entities>` list | `/<entities>` list |
| `/<entities>/create`, `/<entities>/edit/:id` full-page editor | `/<entities>?selected=<netexId>` sidebar editor; `/deck-plans/:id` route-based |
| `/` → redirect `/lines` | `/` → `Home` dashboard |

Both use plural kebab-case segments.

## Config and environments

| | enki | hathor |
| --- | --- | --- |
| Runtime config | `public/bootstrap.json` | `public/config.json` |
| Source | `.github/environments/<env>.json` (`dev`, `local`) | `.github/environments/config-<env>.json` (`dev`, `localhost`) |
| Theme | compiled TS under `src/ext/<extPath>/CustomTheme/` | `.github/environments/theme-<env>.json`, loaded at runtime |
| Auth bypass | `disableAuthentication: true` | omit `oidcConfig` |
| Interface | `src/config/config.ts` | `src/contexts/configContext.ts` |

## Commands and ports

| | enki | hathor |
| --- | --- | --- |
| Dev server | `npm start` → `:3001` | `npm run dev` → `:5000` |
| Build | `npm run build` (`tsc && vite build`) | `npm run build` (`tsc -b && vite build`) |
| Unit | `npm test` | `npm run test` |
| e2e | `npm run test:e2e` | `npm run e2e` |
| Format | `npm run check` / `npm run format` | same |
| Lint | — (Prettier only) | `npm run lint` |
| Node | 24 (pinned) | unpinned |
| Default branch | `master` | `main` |

## No counterpart

- **enki only:** `src/ext/` extension system, Leaflet map stack (`components/FormMap`), multi-step
  `LineEditorStepper`, `ConfirmNavigationDialog`, NeTEx export scenes, MSAL (Fintraffic).
- **hathor only:** `ViewConfig` / `GenericDataViewPage`, resizable sidebar editor, Nav Rail, global
  search (`SearchContext`), Storybook, DeckPlan editor web component, runtime JSON theme.
