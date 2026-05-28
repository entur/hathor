# VehicleType list — TransportMode column + filter-dropdown icons

**Issue:** [hathor #23](https://github.com/entur/hathor/issues/23) (umbrella: #24)
**Date:** 2026-05-26
**Status:** Approved design; ready for implementation plan.

## Context

The `VehicleType` list on `/vehicle-types` is missing a `TransportMode` column.
Data has been flowing through GraphQL for some time (`fetchVehicleTypes.ts:16`,
`VehicleType.transportMode?: string` at `vehicleTypeTypes.ts:22`), and a
shared infrastructure layer already exists for transport modes:

- `src/data/netex/transportMode.ts` — `TransportMode` union, `toTransportMode()`,
  `transportModeLabelKey()`, `transportModeSortValue()`,
  `transportModeFilters`, `UNKNOWN_TRANSPORT_MODE`, `isTransportMode()`.
- `transportMode.*` i18n keys (14 modes + `unknown`) in `en/translation.json`
  and `nb/translation.json`.
- `TransportModeChip` (label-only chip, no icon) in
  `src/data/vehicles/projection/cells/`, used on `/vehicles` for the
  `transportTypeMode` column.

The 2026-05-11 brainstorming on #23 picked a file-per-icon strategy via the
existing `iconLoaderUtils.ts` two-tier (`defaultIcons/` + `customIcons/`).
That decision lived only on the issue and was never codified in
`FORK_DECISIONS.md`. As of 2026-05-26 we are reversing that informal call in
favour of the inline SVG sprite developed in
`concept-sandbox/claude-design.html` on the `ui-sandboxing` branch — see
**ADR change** below.

## Goals

1. Render a sortable `TransportMode` column on `/vehicle-types` between
   `name` and `dimensions`, icon-only with a tooltip showing the localized
   label.
2. Surface the same icons inside the header filter dropdown
   (`SearchFilterControl`) so transport-mode filter checkboxes carry their
   glyph alongside the text label.
3. Introduce `TransportModeIcon` and `TransportModeSprite` as the canonical
   rendering primitives for any future view that needs a transport-mode
   glyph (notably #24 chip filters).
4. Record the sprite-vs-file-per-icon decision as a new ADR in
   `FORK_DECISIONS.md`.

## Non-goals

- Filter-chip wiring on TransportMode for the `/vehicle-types` list — that
  is **#24**, tracked separately, and uses these components but is not part
  of #23.
- Reuse of `TransportModeIcon` inside the existing `/vehicles`
  `TransportModeChip`. The chip stays label-only for now; a follow-up may
  slot a leading `TransportModeIcon` inside it.
- Norway-specific glyph variants (T-banen "T", national-rail variant, etc.).
  Lands when design provides those — see "Future work".
- Moving the `--tm-*` color tokens into the theme JSON loader.
- The `--nx-*` NetexID type color tokens defined in the same POC. Belong
  with #21/#22 (NetexId pill colors) and are not lifted here.
- The `tm-all` symbol from the POC. Not a NeTEx mode; a chip-filter
  affordance that #24 may revisit.

## Decisions

### 1. Sprite over file-per-icon (ADR change)

Transport-mode icons render via a single inline SVG sprite mounted once at
app root. They do not go through `getIconUrl()`. See the new
`FORK_DECISIONS.md` entry "Transport-mode icon strategy: inline SVG sprite
over file-per-icon" (text proposed at the end of this spec).

`iconLoaderUtils.ts` and the `defaultIcons/` + `customIcons/` two-tier are
untouched and continue to serve every other icon class (menu, settings,
home, etc.). The divergence is purely additive.

### 2. Component layout

```
src/components/icons/
├── TransportModeSprite.tsx   — hidden <svg><defs><symbol id="tm-*"></defs></svg>,
│                               mounted once at app root.
└── TransportModeIcon.tsx     — <svg><use href="#tm-{mode}"/>, optional inline label.

src/theme/
└── transportModeTokens.css   — :root { --tm-bus: …; --tm-tram: …; … }, imported once.
```

No `TransportModeCell.tsx`. The cell renders `<TransportModeIcon mode={...}/>`
directly — with the new API (see §3), the icon-only-with-tooltip variant is
built in, so a thin wrapper file would add nothing.

### 3. `TransportModeIcon` API

```ts
type TransportModeIconProps = {
  mode: TransportMode;
  /**
   * When set, render the localized label inline; the icon sits on the
   * given side relative to the text. When omitted, render icon only —
   * the localized label is still exposed as `aria-label` and as a MUI
   * tooltip on hover.
   */
  iconPosition?: 'left' | 'right';
};
```

Three modes:

| Caller | Props | Render |
|---|---|---|
| VehicleType list cell | `<TransportModeIcon mode={m} />` | icon only, tooltip + aria-label |
| Filter dropdown | `<TransportModeIcon mode={m} iconPosition="left" />` | `[icon] [label]` |
| (future) right-aligned chip | `<TransportModeIcon mode={m} iconPosition="right" />` | `[label] [icon]` |

The text, when shown, is always the localized label resolved via
`t(transportModeLabelKey(mode))`. No `label` prop override — single source
of truth per locale.

Symbol-level fallback: if `mode` is not in the lifted sprite set (the 7
covered modes plus `unknown`), `<use href="#tm-unknown">` is rendered.
Color-level fallback: `color: var(--tm-${mode}, var(--tm-unknown))` so any
mode without a `--tm-X` token falls through to the gray placeholder.

### 4. Sprite content

Lifted verbatim from `ui-sandboxing:concept-sandbox/claude-design.html`
lines 2079–2167, with two edits at lift time:

| Edit | Reason |
|---|---|
| Rename `id="tm-ferry"` → `id="tm-water"` | Match NeTEx `TransportModeEnumeration`. The CSS variable `--tm-water` already exists in the POC. |
| Add `<symbol id="tm-unknown">` (`?` glyph in a circle) | Catch-all for the synthetic `'unknown'` mode and for any NeTEx mode the sprite hasn't drawn yet (taxi, cableway, funicular, lift, trolleyBus, snowAndIce). |

Drop `tm-all` — not a NeTEx mode.

Final sprite contains 8 `<symbol>` blocks: `bus, coach, rail, tram, metro,
water, air, unknown`. The 6 NeTEx modes the sandbox sprite never drew
(`taxi, cableway, funicular, lift, trolleyBus, snowAndIce`) resolve to
`tm-unknown` at render time via the symbol-level fallback in
`TransportModeIcon`.

The `--tm-*` CSS variables are lifted verbatim into
`src/theme/transportModeTokens.css`, except for `--tm-ferry` which renames
to `--tm-water`.

### 5. Sprite mount point

`TransportModeSprite` is mounted in `src/App.tsx` immediately after the
context providers and before `<Routes>`. Rationale: the sprite serves
routed UI; keeping its mount adjacent to `<Routes>` is more discoverable
than burying it in `main.tsx` next to the provider tree.

### 6. View config wiring

`src/data/vehicle-types/vehicleTypeViewConfig.tsx` gains a new column
between `name` and `dimensions`:

```tsx
{
  id: 'transportMode',
  headerLabel: 'Transport Mode',
  isSortable: true,
  renderCell: item =>
    <TransportModeIcon mode={toTransportMode(item.transportMode)} />,
  align: 'center',
  display: 'always',
}
```

- `OrderBy` in `useVehicleTypes.ts` gains the `'transportMode'` member.
- `getVehicleTypeSortValue` in `vehicleTypeSortValue.ts` gains a
  `case 'transportMode'` returning
  `transportModeSortValue(toTransportMode(item.transportMode))`. This
  returns `''` for `'unknown'` so `compareWithEmptyLast` parks unknown
  rows at the end, matching the empty-last behaviour established for
  `name` and `deckPlanName`.

### 7. Filter dropdown wiring

`src/components/search/SearchFilterControl.tsx` branches on
`isTransportMode(filter.id)` when building the `FormControlLabel.label`
prop:

```tsx
label={
  isTransportMode(type.id)
    ? <TransportModeIcon mode={type.id} iconPosition="left" />
    : t(type.labelKey, type.defaultLabel)
}
```

No change to `FilterDefinition`. The dropdown remains data-driven for
non-transport-mode filters; transport-mode filters get the icon variant
automatically. The check is one `Set.has()` call — cheap, generic.

### 8. i18n

Existing `transportMode.*` keys cover all 14 modes plus `unknown` — used by
`TransportModeIcon` for the visible label (when `iconPosition` is set) and
for the icon-only tooltip / `aria-label`. No new i18n keys are required.

The column header uses the bare English literal `'Transport Mode'` to
match the convention of adjacent columns on `/vehicle-types`
(`'ID'`, `'Name'`, `'Dimensions'`, `'Deck Plan'`, `'Vehicles'`).
`DataTableHeader` runs `t(headerLabel, headerLabel)`, so the literal
falls through cleanly. i18n-ification of `/vehicle-types` column headers
is a separate cleanup, out of scope here.

### 9. Tests

- `src/data/vehicle-types/vehicleTypeSortValue.test.ts` gains a
  `describe('compareVehicleTypes — transportMode', …)` block covering:
  - asc keeps rows with `transportMode === undefined` (→ `'unknown'`) at
    the end;
  - desc same;
  - populated modes sort alphabetically by NeTEx id.
- No new E2E test. The column-rendering smoke is already covered by
  `e2e-tests/no-auth/vehicle-type-filter.spec.ts`, and the sort
  behaviour is unit-level.

## File touch list

| File | Change |
|---|---|
| `src/components/icons/TransportModeSprite.tsx` | NEW — hidden SVG sprite, ~50 lines including 9 `<symbol>` blocks. |
| `src/components/icons/TransportModeIcon.tsx` | NEW — rendering primitive, ~45 lines including the three-mode `iconPosition` branch. |
| `src/theme/transportModeTokens.css` | NEW — `:root { --tm-* }` color tokens, ~20 lines. |
| `src/App.tsx` | Add `import './theme/transportModeTokens.css'`; mount `<TransportModeSprite />` adjacent to `<Routes>`. |
| `src/data/vehicle-types/vehicleTypeViewConfig.tsx` | + column definition; import `TransportModeIcon` and `toTransportMode`. |
| `src/data/vehicle-types/useVehicleTypes.ts` | `OrderBy` union gains `'transportMode'`. |
| `src/data/vehicle-types/vehicleTypeSortValue.ts` | + `case 'transportMode'`. |
| `src/data/vehicle-types/vehicleTypeSortValue.test.ts` | + describe block for transportMode sort. |
| `src/components/icons/__tests__/transportModeIconHelpers.test.ts` | NEW — vitest unit tests for the pure helpers (`symbolIdFor`, `colorVarFor`). |
| `src/components/search/SearchFilterControl.tsx` | branch on `isTransportMode(filter.id)` when composing the label. |
| `e2e-tests/no-auth/vehicle-type-transport-mode.spec.ts` | NEW — Playwright spec covering the new column rendering and the filter-dropdown icon variant on `/vehicles`. |
| `FORK_DECISIONS.md` | + new ADR section "Transport-mode icon strategy: inline SVG sprite over file-per-icon" (proposed text below). |
| `concept-sandbox/README.md` | NEW — short stub noting that the sprite block in `claude-design.html` (on the `ui-sandboxing` branch) is mirrored into `src/components/icons/TransportModeSprite.tsx`. Edits to either side need mirroring. |

`TransportModeSprite.tsx` also carries a JSDoc header citing the sandbox
source path + branch, so the link is visible from both ends.

10 source files (incl. 2 new test files) + 2 doc files
(`FORK_DECISIONS.md`, `concept-sandbox/README.md`). No new dependencies.
Sprite is one inline SVG, ≈1.5 KB minified.

## Risks & open notes

- **Sandbox-to-prod source drift.** The sandbox sprite is now upstream of
  production code. The new `concept-sandbox/README.md` + the JSDoc header on
  `TransportModeSprite.tsx` together cross-link the two sides; both edits
  are part of this PR.
- **Filter dropdown a11y.** `<TransportModeIcon iconPosition="left">`
  renders a localized label as visible text inside the
  `FormControlLabel.label` slot, so a11y is preserved (the screen reader
  still announces the label). The icon has `aria-hidden` because the text
  carries the semantics.
- **Sort stability across locales.** `transportModeSortValue` returns the
  raw NeTEx id (e.g. `'bus'`, `'rail'`), not the localized label. Sort
  order is locale-independent; this matches the column's mental model
  ("by mode") and avoids surprise reorderings when switching language.

## Future work (out of scope)

- **#24 filter chips.** Will reuse `TransportModeIcon` with
  `iconPosition="left"` inside chips above the table.
- **Norway-specific variants.** New `<symbol id="tm-metro-nb">` etc. inside
  the same sprite, toggled by the existing `useCustomFeatures` localStorage
  flag inside `TransportModeIcon`. No `customIcons/` files involved.
- **Theme-token integration.** Move `--tm-*` into the theme JSON loader if
  a deployment ever needs per-theme rebrand of transport-mode glyphs.
- **`/vehicles` icon adoption.** Slot `<TransportModeIcon mode={…}
  iconPosition="left" />` inside the existing `TransportModeChip` so the
  chip carries a glyph too. Defer until UX confirms the visual fit.
- **Drawing the 7 missing glyphs** (taxi, cableway, funicular, lift,
  trolleyBus, snowAndIce, plus an unknown alternative). They render as
  `tm-unknown` until design provides shapes.

## Proposed ADR entry for `FORK_DECISIONS.md`

```markdown
## Transport-mode icon strategy: inline SVG sprite over file-per-icon
   _(2026-05-26)_

### Context

VehicleType list (#23) and Vehicle list (#24, partially shipped via #26)
both need to render a `TransportMode` cell. Two infrastructures were on
the table:

1. Hathor's existing two-tier icon resolver (`src/utils/iconLoaderUtils.ts`),
   which serves menu/settings/home icons from `defaultIcons/` with optional
   `customIcons/` override.
2. The inline SVG sprite developed in
   `concept-sandbox/claude-design.html` on the `ui-sandboxing` branch, with
   `<symbol id="tm-…">` defs and per-mode `--tm-<mode>` CSS color tokens.

The 2026-05-11 brainstorming on #23 picked option 1. That decision was
never codified here; it lived only in the issue body. As of 2026-05-26,
with the sprite POC visually settled and the per-mode color dimension
confirmed as a UX requirement, we are landing the sprite choice formally
and recording file-per-icon as the considered alternative.

### Decision

Transport-mode icons render via a single inline SVG sprite, mounted once
at app root. The sprite is the **only** rendering primitive for
transport-mode icons; they do not go through `getIconUrl()`.

Concrete contract:

- `src/components/icons/TransportModeSprite.tsx` mounts a hidden
  `<svg style="display:none"><defs><symbol id="tm-…"></defs></svg>` block
  at app root.
- `src/components/icons/TransportModeIcon.tsx` is the rendering primitive:
  `<svg><use href={`#tm-${mode}`}/></svg>` with
  `color: var(--tm-${mode}, var(--tm-unknown))`. Symbol-level fallback maps
  any mode not in the sprite to `#tm-unknown`. The component exposes a
  single optional prop `iconPosition: 'left' | 'right'` that, when set,
  renders the localized label inline.
- Per-mode color tokens (`--tm-bus`, `--tm-tram`, …) live in
  `src/theme/transportModeTokens.css`, imported once. Future move into
  the theme JSON loader is out of scope.
- Norway-specific glyph variants (T-banen, etc.) are modelled as
  alternate symbol ids (`tm-metro-nb`), toggled in the same component by
  the existing `useCustomFeatures` flag. They are NOT served via
  `customIcons/`.
- `iconLoaderUtils.ts` and the `defaultIcons/` + `customIcons/` two-tier
  remain untouched and continue to serve every other icon class (menu,
  settings, home, etc.).

### Alternatives considered

| Option | Why rejected |
|---|---|
| **File-per-icon via `getIconUrl`** (the original 2026-05-11 pick) | Forces hand-tinted SVGs for the 15 NeTEx modes (no `currentColor` route), 15× the asset work for the same visual result. The `customIcons/` two-tier was attractive as Norway-variant mechanism, but alternate `<symbol>` ids do the same job without runtime FS access. |
| **MUI `<DirectionsBus />` etc. inline** | Bypasses the asset pipeline entirely but loses fine control over visual weight and per-mode color tokens. Couples the cell shape to MUI's icon-naming taxonomy. |
| **Lift sprite AND keep `customIcons/<mode>.svg` override** | Double mechanism. The cell would need to choose between sprite and resolver per mode, doubling surface area for no current consumer. YAGNI. |

### Consequences

- Hathor's `iconLoaderUtils.ts` remains byte-identical to Inanna's. The
  divergence is purely additive: a new component class that Inanna doesn't
  yet have.
- Inanna issue #5's `getIconKey` resolver-prop refactor still applies to
  every other icon class; transport modes are simply outside its scope.
- Adding a new transport-mode glyph is a single PR that adds a `<symbol>`
  block to `TransportModeSprite.tsx` plus a `--tm-<mode>` token. No file
  drop into `defaultIcons/`, no resolver change.
- The `concept-sandbox/claude-design.html` POC is now the canonical
  source for the lifted symbol shapes. The sandbox itself is unchanged;
  only its sprite block is mirrored into `src/components/icons/`.
- Future filter chips (#24) reuse `TransportModeIcon` directly, so the
  icon dimension on /vehicles can be added later without changing the
  cell layer.

### Out of scope

- Theme integration of `--tm-*`.
- Norway-variant `<symbol>` blocks.
- Reuse on the existing `/vehicles` `TransportModeChip` cell.
```
