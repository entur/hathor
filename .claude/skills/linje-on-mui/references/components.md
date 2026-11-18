# Linje components → hathor's MUI 9

State as of `1788ebc` (PR #354 on MUI 9.5.0). Linje checkout `907aa8a8b`; Linje paths are
relative to `~/entur/linje/design-system/`. Theme = `src/theme/createThemeFromConfig.ts`.
Refer to theme symbols by name, not line number; the file moves.

Status: **done** · **partial** · **open** (with its issue) · **not covered yet** (nobody has
checked this one).

## Contents
- Theme layout and cross-cutting traps
- Button (Primary / Secondary)
- Checkbox
- Contrast surface and TopNavigation (header)
- DatePicker
- Dropdown (Select)
- FeedbackText (helper text)
- Fieldset and form layout (FormSections)
- Focus outline
- IconButton
- Loader
- MultiSelect / SearchableDropdown (Autocomplete)
- Skeleton
- SquareButton
- Switch
- TagChip / Chip
- TextArea
- TextField
- Tooltip

---

## Theme layout and cross-cutting traps

- **Constants block** at the top of the theme. Each constant quotes its Linje source:
  `FOCUS_*`, `CARD/BUTTON_RADIUS_*`, `FIELD_BORDER*`, `FIELD_PAD_X_PX`, `FIELD_INDENT_SHIFT_PX`,
  `FIELD_RADIUS_PX`, `LABEL_COLOR`, `DISABLED_*`, `HEADER_LABEL`, `AC_INPUT_PAD_LEFT_PX`,
  `CHIP_GAP_PX`, `AC_PAD_BOTTOM_PX`, `BUTTON_HEIGHT_*`, the heading sizes.
- **Helpers**: `ring(color, offset)`, `edge(color)` (inset-shadow border), `NOTCH`, `HOVER`,
  `INSET_RING`.
- `baseComponents(theme)` returns the per-component overrides as plain style objects,
  resolved against the theme built in step one.
- `createThemeFromConfig` composes in MUI's two steps (#390): `createTheme` with the palette and
  `deepmerge(TYPE_SCALE, typography)`, then `createTheme(theme, { components:
  deepmerge(baseComponents(theme), file components) })`, so a theme file's slot adds to the
  base one (e.g. theme-dev's `MuiButton.root.textTransform: none`). `action.active` defaults
  to `primary.main` there.
- Shared Linje fills are exported (`HOVER_FILL`, `PRESSED_FILL`, …) for components that draw
  their own parts (`SquareButton`, `FormCheckboxField`).
- Theme JSON (`.github/environments/theme-*.json`, `entur/hathor-deployment-config`) is data:
  palette (`primary.main` #181C56), fonts, logo, an optional `applicationName` (header title
  override; the app's own is `app.shortTitle`). The rules live in code.
- ADRs: `FORK_DECISIONS.md` 2026-11-16 (themes, Nationale) and 2026-11-17 (label inside the box).

Cross-cutting traps:
1. **Specificity, then order.** Theme `styleOverrides` are emitted after MUI's base styles in
   the same class, so an equal-specificity rule wins. To beat a state rule, write the same
   state selector (`&.Mui-focused`, `&.Mui-error`, `&.Mui-disabled`).
2. **Emotion splits selectors on every comma**, even inside `:is()` / `:not()`. Spell lists
   out (see `INSET_RING`).
3. **MUI 9.**
   - No Box system props: layout goes in `sx`.
   - An Autocomplete's `renderInput` `params` carry `params.slotProps`. Spread them whenever you
     override `slotProps` (main `9788f0b`, `SelectOrganisation.tsx`), or the input loses its
     ref and handlers.
   - A Select's label renders as a `<div>`, not a `<label>`. Query `.MuiInputLabel-root`.
   - State classes include `.Mui-readOnly`.
4. **Reduced motion**: label transitions are off under `REDUCED_MOTION_MEDIA`
   (`src/utils/motion.ts`). Loaders honour it too.
5. **Playwright skew on main** (playwright 1.65 vs @playwright/test 1.60). Run e2e as
   `node node_modules/@playwright/test/cli.js test`.

---

## Button (Primary / Secondary)

- **Linje**: `packages/button/src/Button.scss:5-8` (medium), `:90-91` (small), `:99-100` (large).
  Tokens `button/height/horizontal content` 32 / 48 / 64, `button/radius` 6 / 8 / 8, padding
  12 / 16 / 24, border 2.
  - Primary: #181c56, hover #393d79, active #11143c, text white.
  - Secondary: transparent, border #8284ab, hover #d9ddf2, active #aeb7e2 (border becomes
    #181c56), text #181c56.
- **MUI**: `Button` `variant="contained"` (primary) and `"outlined"` (secondary). Theme
  `MuiButton`: `BUTTON_RADIUS_PX` 8 / `BUTTON_RADIUS_SMALL_PX` 6, min-heights
  `BUTTON_HEIGHT_*`.
- **Status: partial.** Sizes and radius are done. Still open:
  - The contained hover uses MUI's `primary.dark`, which is darker; Linje's hover #393d79 is
    lighter. Set `palette.primary.dark`, or use `&:hover` in `MuiButton.contained`.
  - Outlined is 1 px `alpha(primary, .5)`; Linje is 2 px #8284ab with a #d9ddf2 hover.
  - Inline padding is MUI's 10 / 16 / 22.

## Checkbox

- **Linje**: `packages/form/src/Checkbox.scss:180-204`.
  - 20 px box, 2 px border #181c56, radius legacy 4/2.
  - Selected: fill #181c56, white tick. Hover fill #d9ddf2.
  - Error border #d31b1b; disabled border #e3e6e8.
- **Guidance** (`apps/documentation/src/pages/komponenter/skjemaelementer/checkbox.mdx:60`): a
  value saved with the form's Save button is a Checkbox. Switch is only for changes that apply
  immediately.
- **MUI**: `FormCheckboxField` (`src/components/FormFields.tsx`): MUI `Checkbox` in a
  `FormControlLabel`, Linje's box drawn as `icon` / `checkedIcon` (no theme entry, so the
  DataGrid's selection checkboxes keep MUI's look). Selected hover #393d79
  (`Fill-SelectedHover`); ring on the box at offset 2, no ripple; 11 px padding puts the box on
  the field edge under FormControlLabel's −11 px margin (42 px target).
- **Deviation**: read-only border #8284ab, not Linje's #e3e6e8 (1.25:1, WCAG 1.4.11); read-only
  checked is a navy tick on no fill (`Icon-ReadOnly`).
- **Status: done (#389).** No error state yet (no yes/no field is required).

## Contrast surface and TopNavigation (header)

- **Linje**: `.eds-contrast` on Lavender/90.
  - Fields stay white with navy text (`BaseFormControl.scss:36,45`; `Base form/Contrast/*`
    tokens). Border #8284ab, interactive #aeb7e2, error #ff9494.
  - Focus `Stroke/Focus-Contrast` #aeb7e2.
  - Navigation: `packages/menu/src/TopNavigationItem.tsx`. There's no TopbarB2B in the
    checkout; #185 cites it.
- **MUI**: theme `MuiAppBar`:
  - button and link rings in `FOCUS_CONTRAST`
  - the org picker (`src/data/organisations/components/SelectOrganisation.tsx`) as a small
    outlined Autocomplete, label in the notch (explicit `shrink`)
  - label `HEADER_LABEL` #d9dae8, white when focused
  - outline #aeb7e2, white on hover and focus
  - no outline ring, since a box outline would strike through the notched label
- **Status: deviation, by decision.** This is enki's style, not Linje's white field
  (ADR 2026-11-17). Open (#185):
  - Done (#389): the title is `app.shortTitle` unless the theme sets `applicationName`.
  - Option labels are `name (TYPE)` (`SelectOrganisation.tsx:30`); show the name only, the
    localised type as secondary text, sorted with `Intl.Collator(i18n.language)`.

## DatePicker

- **Linje**: `packages/datepicker/src/DatePicker/` (react-aria). The format follows `locale`
  (`DateField.tsx:67-70`), so nb gives dd.mm.yyyy. `NativeDatePicker.tsx` wraps
  `<input type=date>`.
- **MUI**: there is no MUI X date picker (not in `package.json`). `FormTextField type="date"`
  is a native input, with its label pinned by `fieldBase(…, pinLabel)` (`shrink: true`),
  because the always-visible mask would overlap a resting label.
- **Status: open (U3; needs a new issue).** A native input's format follows the browser's UI
  language and ignores `lang`, and an empty field shows the mask. Smallest fix: when
  `readOnly`, render text with `Intl.DateTimeFormat('nb', {day:'2-digit', month:'2-digit', year:'numeric'})`
  and "—" when empty. Editing keeps the native input.

## Dropdown (Select)

- **Linje**: `packages/dropdown/src/Dropdown.scss`. It is the same 48 px base form as
  TextField.
- **MUI**: `FormSelectField` = `TextField select` with `FIELD_BASE` (filled, small). It
  inherits every TextField rule.
- **Status: done.** Measured: text stops 1 px before the arrow (`selectOverlapPx -1`).
  - Menu: Linje opens it below the field, `offset(space.extraSmall2)` (`Dropdown.tsx:200`),
    list at most `--list-max-height` 15 rem (`DropdownList.scss:18`). Theme `MuiSelect`
    `defaultProps.MenuProps`: anchored bottom-left, `mt` `POPUP_OFFSET_PX` 4,
    `maxHeight` `LIST_MAX_HEIGHT`. Without the cap a long menu doesn't fit below and MUI
    shifts it up over the field and its focus ring. Measured: 4 px below the field.
- **Traps**:
  - MUI's Select sets `'&&&': { paddingRight: 32 }` (specificity 0,3,0). The theme's
    `MuiFilledInput.input` sets `paddingInline` at 0,1,0, so the Select's right padding still
    wins.
  - Never write a `padding` shorthand at higher specificity on the input; it once hid text
    under the arrow (2b592cb, fixed in 720806c).
  - The label is a `<div>` (MUI 9).

## FeedbackText (helper text)

- **Linje**: `packages/form/src/FeedbackText.scss`. `margin-top: 4px`.
  - Info: indented `16 + 2` px so it lines up with the value, text #181c56.
  - Error: an icon (#d31b1b) before the text.
- **MUI**: `FormHelperText`. Theme `MuiFormHelperText.contained.marginInline: 0` lines it up
  with the field's edge. MUI's margin-top is 3 px.
- **Status: partial / not covered yet.** No icon, no 18 px indent. Five call sites use
  `helperText`; not measured.

## Fieldset and form layout (FormSections)

- **Linje**: there's no form-layout token. `packages/form/src/Fieldset.scss` sets no gap; its
  legend is `Heading5`. `base form/gap/*` (4/8/16) is spacing inside a component.
  - Heading margins (`packages/typography/src/index.scss`): h2 32 above / 8 below, h3 24 / 4,
    h4 / h5 24 / 0.
  - Spacing scale: `reading-linje.md`.
- **MUI**: `src/components/form-layout/components/FormSections.tsx`:
  - `columnSpacing FIELD_GAP` = 16
  - `rowSpacing ROW_GAP` = 24 (also the grid `rowGap` and the column `Stack`)
  - heading `mb HEADING_GAP` = 16, deliberately separate from the field gap
  - `SECTION_GAP` (`utils/formWidth.ts`) = 32
  - widths: `FieldWidth = 'full' | '1/2'` (`types.ts`), `KIND_WIDTH` in `utils/sections.ts`
    (numbers `1/2`)
- **Status: done, #283.** At most 2 fields per row: a third-width box truncates a resting
  label.

## Focus outline

- **Linje**: `outlines.focus` 2 px, offset 2. `Stroke/Focus-Standard` #181c56; on contrast
  `Focus-Contrast` #aeb7e2 (`packages/tokens/src/base.json:324-334`).
- **MUI**: `ring()`.
  - `MuiButtonBase` uses `.Mui-focusVisible` and `MuiLink` uses `:focus-visible`, both
    offset 2.
  - `INSET_RING` (menu items, list buttons, tabs, grid cells) and `MuiDataGrid` cells and
    headers use offset −2.
  - Fields: the ring at offset 0 plus the navy border (`edge`).
  - Header: `FOCUS_CONTRAST`.
- **Status: done (#256).** Read-only fields keep the ring (WCAG 2.4.7, deviates from Linje).

## IconButton

- **Linje**: `packages/button/src/IconButton.scss:4-13,24-27,29-45`; `Icon Button/*` tokens.
  - Transparent, padding 8 (`$space-extra-small`) plus a 2 px transparent border, radius
    **legacy** medium 4 (no Figma IconButton radius token). Small: 24 px, padding 0.
  - Hover #d9ddf2, active #aeb7e2, icon #181c56.
  - Contrast surface: hover #626493, active #8794d4, icon white.
  - Focus 2 px offset 2.
- **MUI**: `IconButton`. Theme `MuiIconButton`: radius 4, hover (in `@media (hover: hover)`) and
  `:active` fills as named constants (`HOVER_FILL`, `PRESSED_FILL`); MUI's sizes stay (medium
  padding 8 = Linje's). Icon colour is `action.active`, which `createThemeFromConfig` defaults to
  `primary.main` unless a theme file sets it. Under `MuiAppBar` the contrast fills; icon buttons
  there are `color="inherit"`, so no root colour is set (it would beat `colorInherit`).
- Used for: the grid / card Edit link (`EditLink.tsx`, pencil + Tooltip, name "Edit <title>"),
  the form page's `< Back` (`EditorFrame.tsx`, arrow + visible label, name = label, WCAG 2.5.3).
- **Trap**: a Tooltip whose title is a string sets `aria-label` on its child only when the child
  has none; the Edit link's own `aria-label` wins.
- **Deviation**: size. Linje medium is ~36 px (16 px icon + 8 px padding + 2 px border); MUI's
  is 40 px with a 24 px icon. Kept MUI's, so icons stay MUI-sized across the app.
- **Trap**: under `MuiAppBar` the `:active` rule must come after the `CAN_HOVER` hover rule
  (same specificity), and pressed takes the accent icon (`Contrast/Icon-Active` #181c56).
- **Status: done (#389).**

## Loader

- **Linje**: `apps/documentation/src/pages/komponenter/feedback/loader.mdx:40-56`.
  - A page-level loader with a short status text ("Laster inn", "Lagrer").
  - The progress bar (`packages/loader/src/Loader.scss:49-52`, 5 px) is for uploads, imports
    and exports.
  - `Spinner` and `LoadingDots` handle inline waits.
- **MUI**: enki's ring loader (`src/components/icons/LoadingIcon.tsx`) and
  `src/components/common/LoadingPage.tsx` (`text` prop, defaults to `data.loading`). They
  follow enki, by decision; see the `enki` skill. `CircularProgress` appears elsewhere.
  - Label (`Loader.tsx`, `Loader.scss`): `Heading5` at heading weight, 8 px
    (`$space-extra-small`) from the bar; the loader is centred, at most 20 rem wide.
- **Status: done.** `LoadingPage`: `subtitle1` (16 px, our scale has no 18) at `fontWeightBold`,
  as a `<p>` (`subtitle1` maps to `<h6>`), 8 px under the rings, centred, `maxWidth` 20 rem.
  Every loader uses it, the auth gates (`ProtectedRoute`, `LoginRedirect`) too.

## MultiSelect / SearchableDropdown (Autocomplete)

- **Linje**: `packages/dropdown/src/` (MultiSelect, SearchableDropdown). Selected items show as
  tags inside the box; `Dropdown.scss` `--multiselect … --filled`: padding 20 / 4, gap 8.
- **MUI**: `FormAutocompleteField` (`FormFields.tsx`), e.g. the vehicle-type propulsion and
  fuel types.
  - Theme `MuiAutocomplete.root`, `& .MuiFilledInput-root`: `paddingLeft` 16−4 = 12,
    `gap CHIP_GAP_PX` 4 (+ the chips' 2 px margins = 8). `& .MuiFilledInput-root.MuiInputBase-sizeSmall`
    `paddingBottom AC_PAD_BOTTOM_PX` 4 (MUI's is 1, which left the chips on the inset border).
  - Measured: 51 px with one chip row; chips 21 px from the top, 6 px from the bottom
    (4 clear of the 2 px border, as Linje); 8 px between chips, across and between rows.
- Popup: theme `MuiAutocomplete.popper` puts `POPUP_OFFSET_PX` 4 between the field and the
  paper (`data-popper-placement` bottom / top), as Linje's `offset(space.extraSmall2)`. Flush,
  it covered the bottom of the 2 px focus ring.
- **Status: done, with one nit.** The first chip starts at x14 while the label starts at x16
  (root 12 + chip margin 2). Not covered yet: collapsing to "+N" like Linje's MultiSelect.
- **Traps**:
  - Spread `params.slotProps` in `renderInput` (MUI 9).
  - The filled Autocomplete has its own input padding (`2.5px 4px`); the theme moves only the
    root's left padding.

## Skeleton

- **Linje**: `packages/loader/src/BaseSkeleton.scss:19-24`; `loader/skeleton/Standard/*`: fill
  #eaeaf1, shimmer #f6f6f9.
- **MUI**: theme `MuiSkeleton`: that fill, the `wave` shimmer in #f6f6f9, still under reduced
  motion. A form page loads as `FormSkeleton` (`form-layout/components/FormSkeleton.tsx`):
  `FormSections` over the form's own sections, a rounded block per control (48 px field, 42 px
  checkbox row, radius 8), `PictureSkeleton` (16:10) in column 3; each feature exports its
  `<Entity>SectionsSkeleton`, and `EditorFrame` draws it in the loaded page's frame below a
  title-row skeleton.
- **Status: done (#389).**

## SquareButton

- **Linje**: `packages/button/src/SquareButton.scss:23-31,45-53,62-90`; `Square secondary/*`
  tokens.
  - Square at the button heights (32 / 48 / 64), radius 6 / 8 / 8.
  - Border #8284ab, hover #d9ddf2, active #aeb7e2, icon #181c56.
- **MUI**: none in MUI; `src/components/SquareButton.tsx` on `ButtonBase`: icon in a 48 / 32 px
  square (medium / small), 2 px border, radius 8 / 6, label 8 / 4 px beside it; hover inside
  `@media (hover: hover)`; the ring on the square only (root outline off); `to` makes it a
  router link. Used by `NewEntityFab` and `SiteNavCards` (card footer, CreateRow).
- **Trap**: on a tinted ground (#d9ddf2) the border is 2.67:1 and hover invisible; keep it on
  white (the CreateRow tile is `background.paper`).
- **Status: done (#389).**

## Switch

- **Linje**: on #1a8e60, off #949699, knob white (`Switch/*` tokens).
  `apps/documentation/src/pages/komponenter/skjemaelementer/switch.mdx:54-57`: only for
  binary settings that apply immediately, without Save.
- **MUI**: none in the forms: yes/no fields are `FormCheckboxField` (see Checkbox). No
  `MuiSwitch` theme entry is needed unless a real immediate toggle appears.
- **Status: done (#389)**: `FormSwitchField` was removed.

## TagChip / Chip

- **Linje**: `packages/chip/src/BaseChip.scss`: radius 1rem; small 24 px / 12 px text
  (`:26-29`); medium 32 px / 14 px (`:40-43`). `chip.mdx:93`: TagChip is for predefined
  categories; FilterChip can be removed.
- **MUI**: `Chip`. Theme `MuiChip`: font `body2` (14), small `caption` (12). The heights 32 / 24
  and the pill shape already match.
  - Used in `HeaderActions.tsx`, `CardsView.tsx`, `NetexId.tsx`, `QueryField.tsx`, the
    vehicle-type controls and the Autocomplete tags.
- **Status: partial / not covered yet.** Colours are MUI's grey; the TagChip / FilterChip
  colour tokens haven't been compared.

## TextArea

- **Linje**: `packages/form/src/TextArea.scss`. Heights 72 / 96 / 120 (`base form/height/Textarea`).
- **MUI**: none in the forms yet.
- **Status: not covered yet.** A labelled filled multiline field hasn't been checked against
  the label-inside layout.

## TextField

- **Linje**: `packages/form/src/BaseFormControl.scss:19-49,193-217`, `InputGroupLabel.scss`.
  - 48 px, padding-inline 16, radius 8 (Figma; legacy SCSS says 4), border 2 px #8284ab.
  - Hover: border #181c56. Focus: border #181c56 plus a 2 px outline.
  - Value padding 20 / 4.
  - Label #626493: 16 px at `top:1rem` when resting, 12 px at `top:0.375rem` when focused or
    filled. No colour change on focus or error.
  - Disabled (`:56-90`): fill #cfd2d4, border transparent, text and label #6e6f73.
  - Read-only (`:92-120`): border and fill transparent, no outline.
  - Error (`:160-177`): border #d31b1b.
  - `required` adds ` *` (`InputGroupLabel.tsx:44`). There's no legend guidance.
- **MUI**: `FormTextField` / `FormNumberField` with
  `FIELD_BASE = { fullWidth, variant: 'filled', size: 'small' }`. MUI's small filled field is
  the 48 px label-inside box.
  - **Theme `MuiFilledInput`**:
    - `disableUnderline` by default; white fill; radius `FIELD_RADIUS_PX`.
    - Border as `edge(FIELD_BORDER)`, an inset box-shadow, so the box stays 48 px.
    - Hover and focus use `edge(primary)`; focus adds `ring(primary, 0)`.
    - Error uses `edge(error)`, and its focus ring turns red.
    - Read-only without error: `boxShadow: none`.
    - Disabled: `DISABLED_FILL`, no border.
    - `input.paddingInline` 16.
  - **`MuiInputLabel.root`**:
    - colour `LABEL_COLOR`, disabled `DISABLED_TEXT`
    - `&.MuiInputLabel-filled { translate: 4px 0 }` (`FIELD_INDENT_SHIFT_PX`)
    - no transition under reduced motion
  - **`MuiInputBase`**: disabled text `DISABLED_TEXT`, plus `WebkitTextFillColor`, or Chrome
    keeps MUI's grey.
  - **Numbers**: Linje has no stepper (a number is a plain TextField), so `MuiInputBase.input`
    hides the browser spin buttons (squashed to ~23 px by the label-inside padding);
    `FormNumberField` keeps `type="number"` (arrow keys still step) and adds
    `inputMode="decimal"`.
- **Measured** (vehicle-types edit):
  - root 48, radius 8
  - label x16, resting y13 (16 px), raised y4 (12 px)
  - value padding 21 / 4, left 16
  - border `inset 0 0 0 2px #8284ab`
  - matches Linje within about 2 px (Linje's resting glyph centre is about 26 px, MUI's 24.5)
- **Status: done** (2b592cb, then 76c78a2 and 03fb692).
- **Traps**:
  - Don't set `transform` on the label. MUI's variant and size transforms (rest and shrink)
    own it. The CSS `translate` property adds to them.
  - A real `border` would grow the 48 px box; use `edge()`.
  - Small fields stay outlined (`MuiOutlinedInput`: 2 px #8284ab notch, hover via the exact
    `HOVER` selector, focus ring, read-only and disabled). They are the toolbar, filter
    panel and header picker.
  - MUI 9's own outlined hover is `&:hover .MuiOutlinedInput-notchedOutline`
    (`node_modules/@mui/material/OutlinedInput/OutlinedInput.js:54`), reset under
    `@media (hover: none)`. Hathor's `HOVER` (`:hover:not(.Mui-disabled):not(.Mui-error) …`) is
    **more specific than MUI's**, so it beats that touch reset: on touch the navy hover border
    can stick after a tap, and read-only and the header each need a counter-override. Open
    (#354 review). Prefer MUI's own selector at equal specificity (overrides come later, so
    they win) and let disabled / error / read-only rules follow it.
  - Read-only keeps an error border (03fb692).

## Tooltip

- **Linje**: `packages/tooltip/src/Tooltip.scss:6-7,20-32`: fill #181c56, white 14 px text,
  padding 5 / 10, radius legacy 4.
- **MUI**: theme `MuiTooltip` `tooltip` + `arrow` slots. **Status: done (#389).**
