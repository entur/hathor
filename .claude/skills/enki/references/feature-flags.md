# Feature flags in config — enki and abzu

How Entur's two sibling frontends switch features on and off from runtime config, and what that
means for hathor. Read this before adding any flag, toggle or per-installation customisation to
hathor's `config.json`. Hathor's own rule is already decided (FORK_DECISIONS 2026-10-21, #204):
every flag lives in `sandboxFeatures`, one flag per feature — see "Hathor today" below.

Verified against enki `0.710.0` (`3f8d31cb`; `src/config/` and `src/ext/` unchanged at `145536b5`)
and abzu `1.660.0` (`1dae3802`). Re-check before relying on a detail.

## Where abzu lives

abzu is the stop-place registry frontend (NSR, backed by Tiamat). It is a sibling checkout at
`../abzu` (<https://github.com/entur/abzu>). Like enki, it is read-only from a hathor session. The
local checkout goes stale, so read the fetched remote ref instead of the working tree:

```bash
git -C ../abzu fetch -q
git -C ../abzu show 'origin/HEAD:src/config/FeatureFlags.ts'      # quote ref:path in zsh
git -C ../abzu grep -n featureFlags origin/HEAD -- src
```

In zsh, quote `ref:path`. Unquoted `$R:src/...` makes zsh read `:s` as a history modifier and fail
with "bad substitution".

## Both apps share one base

- **Runtime config:** `public/bootstrap.json` is fetched at startup by `src/config/fetchConfig.ts`.
  Env vars override single values (`VITE_REACT_APP_UTTU_API_URL` in enki,
  `VITE_REACT_APP_TIAMAT_BASE_URL` in abzu). Each environment has its own file in
  `.github/environments/<env>.json`. hathor's equivalent is `public/config.json`, built from
  `config-<env>.json`.
- **Missing means off.** Every flag is optional and code reads it with `?? false` or `!!`.
- **Lazy-loaded features:** both use `@entur/react-component-toggle`. Both adopted it on
  2025-02-07 (enki `0b0cc3cb` "Swith to lib version of sandbox component system", abzu
  `11069173`), so the library appears to have been extracted from enki's own sandbox system.
  The provider wiring is the same in both:

  ```tsx
  <ComponentToggleProvider
    flags={config.sandboxFeatures /* abzu: config.featureFlags */}
    maxFeatureDepth={2}
    importFn={([a, b]) => b ? import(`./ext/${a}/${b}/index.ts`) : import(`./ext/${a}/index.ts`)}
  >
  ```

  (enki `src/index.tsx:76`, abzu `src/index.jsx:81`. The real code branches on
  `featurePathComponents.length` and throws past depth 2.)
- **`<ComponentToggle feature="X" componentProps={…} renderFallback={…} />`** renders nothing, or
  the fallback, when the flag is off. When it is on, it lazy-loads `src/ext/X/index.ts` (default
  export). Rules from enki's `src/ext/README.md`:
  - Each feature is its own chunk, and a browser with the flag off never downloads it.
  - Each feature has a `types.d.ts` with its props type, so the main code is type-checked without
    importing the feature's runtime code.
  - Stylesheets are imported with `?url` and rendered inside `<Helmet>`. A plain import is
    preloaded whatever the flag says.
  - Features nest two levels deep (`Fintraffic/CustomLogo`). Only the top-level name is a flag.
- **The separate chunks come from the build, not the runtime library.** The toggle repo
  (<https://github.com/entur/react-component-toggle>) is a pnpm-workspace monorepo with two
  packages, both at `1.1.2`:
  - `@entur/react-component-toggle`: the runtime part (provider, `ComponentToggle`,
    `useToggledImport`).
  - `@entur/rollup-plugin-react-component-toggle`: a Rollup/Vite plugin that gives every
    subfolder of `componentsPath` its own chunk.

  Both apps install both packages and set `componentsPath: '/src/ext'` in `vite.config.mts`.
  enki also passes `manualChunks` to group code into `vendor` and `index`. Adopting the runtime
  library without the plugin gives you lazy imports, but not a guaranteed one-chunk-per-feature
  split.
  - Measured (Vite 8 / rolldown 1.0.3): the plugin's `manualChunks` pulls shared vendor code into
    `component-<F>` and the entry then `modulepreload`s it — abzu `1dae3802` downloads 943.8 kB gz
    at boot with the plugin vs 872.4 kB without. Without it, the template-literal `import()` in
    `importFn` already yields one lazy chunk per `src/ext/` folder. rolldown also marks
    `manualChunks` deprecated. For hathor: runtime library yes, plugin no.
- **`useToggledImport<T>(feature, fallback)`** is the non-component form, for importing a value
  such as a theme (enki `src/EnkiThemeProvider.tsx:8`).
- **`extPath`** names a company folder under `src/ext/` (`Fintraffic`, `Entur`). The app loads
  that company's versions of fixed slots, each with a built-in fallback:
  - enki: `${extPath}/LandingPage`, `/CustomIntlProvider`, `/CustomTheme`
  - abzu: `/CustomLogo`, `/AdditionalMenuSection`, `/CustomStyle`, `/CustomThemeProvider`
  
  The company folder is itself a feature (`Fintraffic: boolean`), so its flag must also be on.

## Where they differ

| | enki | abzu |
| --- | --- | --- |
| Flag map key | `sandboxFeatures` | `featureFlags` |
| Flag map type | `SandboxFeatureConfig` in `src/config/config.ts:13` (JSDoc per flag) | `FeatureFlags` in its own file `src/config/FeatureFlags.ts`; `Features = keyof FeatureFlags` |
| Flags that only hide or show something | top-level `enableX` / `hideX` / `disableX` / `xDefault` on `Config`: `enableLineMigration` (`scenes/App/Routes.tsx:40`), `enableServiceJourneyVehicleTypeRef`, `hideExportDryRun`, `optionalPublicCodeOnLine` | mostly **inside the same `featureFlags` map** as the lazy ones: `StopPlaceUrl`, `StopPlacePostalAddress` (`EditStopPage/PostalAddress.tsx:42`), `LoadTimerBadge`. Some are top-level too: `disableMoveQuaysToNewStopPlace`, `modalityConfig.disable*Creation`, `hiddenStopTypes` |
| What the flag map holds | only features with code in `src/ext/` (`JourneyPatternStopPointMap`, `MatomoTracker`, `CookieInformation`, `Fintraffic`) | lazy-loaded features (`SVVStreetViewLink`, `KartverketFlyFotoLayer`, `CookieInformation`, `MatomoTracker`, `Fintraffic`) mixed with the plain checks above |
| Big UI migration | none | `uiMode: "legacy" \| "dual" \| "modern"` (`1f873040`, 2026-04-23). `"dual"` adds a switch in the header menu (`UICustomizationSection.tsx:63`); the user's choice lives in Redux `state.user.uiMode` |
| Theme | compiled TS in `ext/<extPath>/CustomTheme/theme.ts`, through `useToggledImport` | runtime JSON: `themeConfigs: ["theme/default-theme.json", …]` under `public/theme/`. With two or more listed, users pick one in Settings (`SettingsControl.tsx:61`). `containers/modern/App.tsx:183-191` says deployment theming belongs in that JSON, not in `ext/` |
| Defaults | `defaultConfig` merged first in `fetchConfig.ts` | none; caches the fetched config and sets `window.config` |
| Known drift | — | `.github/environments/dev.json` sets `"ModernUI": true`, which is not in `FeatureFlags` and is used nowhere (left over from before `uiMode`). The JSON is never type-checked against the type |

Both apps also read a lazy feature's flag directly when the layout around it changes. For example,
enki has `const isMapEnabled = sandboxFeatures?.JourneyPatternStopPointMap`
(`GenericStopPointsEditor.tsx:32`).

## Translating to hathor

| Need | Take from | Hathor shape |
| --- | --- | --- |
| Hide or show a route, field or control per environment | enki's `sandboxFeatures` name — **not** its top-level `enableX` | a key on `SandboxFeatures` (`src/contexts/configContext.ts`), set in `.github/environments/config-<env>.json`, read with `useIsFeatureOn()` (`src/config/featureFlags.ts`). List entries (menu items, Home `SiteType`s, table columns) take `flag?` instead of an inline check. References to a feature on other screens share its flag |
| Feature left out of the download when off, or a per-installation slot | the shared `@entur/react-component-toggle` setup | the same `sandboxFeatures` key plus a `src/ext/<Feature>/index.ts` folder and the runtime library; skip the rollup plugin (measured above). Needs an ADR in `FORK_DECISIONS.md` |
| Migrate a whole UI step by step | abzu `uiMode` | a three-way config setting, not a boolean. It matches hathor's rule that a togglable affordance is `'show' \| 'hide' \| 'onHover'`-style tri-state |
| Per-deployment theme | abzu `themeConfigs` | already what hathor does: `theme-<env>.json` → `src/theme/createThemeFromConfig.ts`. Don't port enki's TS theme |
| Tests | enki passes a config with the flag set (`ServiceJourneyEditor.test.tsx:87`) | vitest renders with a config-context value; e2e serves a fixture through `setConfig` in `e2e-tests/live-auth-helpers.ts` |

## Hathor today

Decided in review of #203 and recorded in `FORK_DECISIONS.md` (2026-10-21):

- **One place:** `sandboxFeatures` carries every flag, lazy or not — closer to abzu's single map
  than to enki's split. No top-level `enableX` booleans; two ways to read a flag was rejected.
- **One flag per feature:** `sandboxFeatures.DeckPlans` gates the deck-plan screens *and* the
  references to them elsewhere (vehicle-type column, import count). A separate "refs" flag was
  rejected: referencing something you can neither register nor see is not useful.
- **Missing = off;** each environment opts in. Environment configs live in
  `entur/hathor-deployment-config`; only dev and localhost are in this repo.
- **Keep it small:** no config-key registry or unit tests for flag reading; e2e
  (`e2e-tests/deck-plans-flag.spec.ts`, `seedAuth(context, overrides)`) covers on/off.
