import {
  alpha,
  createTheme,
  type Components,
  type Theme,
  type TypographyVariantsOptions,
} from '@mui/material/styles';
import type {} from '@mui/x-data-grid/themeAugmentation';
import type { ThemeConfig } from './theme-config';

// Linje focus ring (WCAG 2.4.7, #256): `outlines.focus` / `outlineOffsets.focus` 2 px, in
// `--stroke-focus-standard` (primary) on light surfaces and `--stroke-focus-contrast`
// (Lavender 40) on the navy header.
const FOCUS_PX = 2,
  FOCUS_CONTRAST = '#aeb7e2';
// Linje `--font-weights-*` (#258): Nationale ships only these two.
const BODY_WEIGHT = 500,
  HEADING_WEIGHT = 600;
// Linje corners, standard density (#258): cards `--border-radiuses-large`, buttons
// `--components-button-radius-*`; small fields keep `shape.borderRadius` 4, chips stay pills.
const CARD_RADIUS_PX = 8,
  BUTTON_RADIUS_PX = 8,
  BUTTON_RADIUS_SMALL_PX = 6;
// Linje field border, `--components-form-baseform-standard-border-default`; navy on hover/focus.
const FIELD_BORDER_PX = 2,
  FIELD_BORDER = '#8284ab';
// Linje TextField / Dropdown, standard density (`@entur/form` BaseFormControl.scss,
// InputGroupLabel.scss): one 48 px box with the label inside, resting mid-field and moving to
// the top once focused or filled. That is MUI's small `filled` field (48 px, value 21 / 4 px
// in, ADR 2026-11-17); hathor adds the white fill, the border, radius 8 and Linje's 16 px
// indent (MUI's is 12).
const FIELD_PAD_X_PX = 16,
  FIELD_INDENT_SHIFT_PX = 4,
  FIELD_RADIUS_PX = 8,
  // Linje `Text/Subdued`, 5.6:1 on white.
  LABEL_COLOR = '#626493';
// Linje disabled field (`BaseFormControl.scss` `--disabled`): grey fill, no border, grey text.
const DISABLED_FILL = '#cfd2d4',
  DISABLED_TEXT = '#6e6f73';
// Linje `Text/SubduedAlt` (Blue 30), 11.3:1 on the navy: the header picker's label.
const HEADER_LABEL = '#d9dae8';
// MUI's filled Autocomplete input keeps 4 px of its own left padding; the root adds the rest.
const AC_INPUT_PAD_LEFT_PX = 4,
  CHIP_ROW_GAP_PX = 4; // between wrapped chip rows
// Linje buttons, `button/height/horizontal content` Small / Medium / Large.
const BUTTON_HEIGHT_SMALL_PX = 32,
  BUTTON_HEIGHT_PX = 48,
  BUTTON_HEIGHT_LARGE_PX = 64;
// Heading sizes (rem) on Linje's 32 / 24 / 20 px steps, one line height for all.
const HEADING_LINE_HEIGHT = 1.25,
  H1_REM = 2,
  H_PAGE_REM = 1.5,
  H_SECTION_REM = 1.25;
// Table row tint: hover, selected, selected + hover (primary alpha); selected row's left stripe.
const ROW_HOVER_ALPHA = 0.08,
  ROW_SELECTED_ALPHA = 0.18,
  ROW_SELECTED_HOVER_ALPHA = 0.24,
  ROW_STRIPE_PX = 3;

const ring = (color: string, offset = FOCUS_PX) => ({
  outline: `${FOCUS_PX}px solid ${color}`,
  outlineOffset: offset,
});

const heading = (rem: number) => ({
  fontSize: `${rem}rem`,
  fontWeight: HEADING_WEIGHT,
  lineHeight: HEADING_LINE_HEIGHT,
});

/**
 * Linje's type scale (#258), 12 · 14 · 16 · 20 · 24 · 32 px: MUI's body, subtitle, button,
 * caption and overline sizes already sit on it; headings step 32 / 24 / 20. A page title is
 * `h5` (24), a section `h6` (20), the Home hero `h1` (32).
 */
const TYPE_SCALE: TypographyVariantsOptions = {
  fontWeightLight: BODY_WEIGHT,
  fontWeightRegular: BODY_WEIGHT,
  fontWeightMedium: BODY_WEIGHT,
  fontWeightBold: HEADING_WEIGHT,
  h1: heading(H1_REM),
  h2: heading(H_PAGE_REM),
  h3: heading(H_PAGE_REM),
  h4: heading(H_PAGE_REM),
  h5: heading(H_PAGE_REM),
  h6: heading(H_SECTION_REM),
};

// Spelled out: emotion splits selectors on every comma, inside `:is()` / `:not()` too.
const INSET_RING = ['.MuiMenuItem-root', '.MuiListItemButton-root', '.MuiTab-root']
  .map(c => `&.Mui-focusVisible${c}`)
  .concat('.MuiDataGrid-root &.Mui-focusVisible')
  .join(', ');
const NOTCH = '.MuiOutlinedInput-notchedOutline';
// MUI's own field-hover selector: matching it is the only way to outrank it.
const HOVER = `:hover:not(.Mui-disabled):not(.Mui-error) ${NOTCH}`;

/** A filled field's border, as an inset shadow: it keeps MUI's 48 px box 48 px. */
const edge = (color: string) => ({ boxShadow: `inset 0 0 0 ${FIELD_BORDER_PX}px ${color}` });

/**
 * Linje's component look on MUI: corners, chip text, field borders, and one focus ring for
 * the whole app. Buttons and links ring on `:focus-visible` only (no ring on a mouse click);
 * a text field rings whenever it has focus, as browsers treat any text-field focus as
 * focus-visible. Items flush in a clipping box (menus, the nav rail, tabs, grid cells) draw
 * the ring inset.
 */
const BASE_COMPONENTS: Components<Theme> = {
  MuiCard: { styleOverrides: { root: { borderRadius: CARD_RADIUS_PX } } },
  MuiButton: {
    styleOverrides: {
      root: { borderRadius: BUTTON_RADIUS_PX, minHeight: BUTTON_HEIGHT_PX },
      sizeSmall: { borderRadius: BUTTON_RADIUS_SMALL_PX, minHeight: BUTTON_HEIGHT_SMALL_PX },
      sizeLarge: { minHeight: BUTTON_HEIGHT_LARGE_PX },
    },
  },
  MuiInputLabel: {
    styleOverrides: {
      root: {
        color: LABEL_COLOR,
        '&.Mui-disabled': { color: DISABLED_TEXT },
        // MUI's own moves, nudged to Linje's indent: `translate` adds to its `transform`.
        '&.MuiInputLabel-filled': { translate: `${FIELD_INDENT_SHIFT_PX}px 0` },
      },
    },
  },
  MuiChip: {
    styleOverrides: {
      root: ({ theme }) => ({ fontSize: theme.typography.body2.fontSize }),
      sizeSmall: ({ theme }) => ({ fontSize: theme.typography.caption.fontSize }),
    },
  },
  MuiOutlinedInput: {
    styleOverrides: {
      // Outlined fields are the small ones — toolbar, filters, the header picker — the label
      // in the outline's notch. Hover uses MUI's own selector to outrank it; focus and error
      // keep MUI's colours (focus is already a 2 px primary border), plus Linje's outline.
      root: ({ theme }) => ({
        [`& ${NOTCH}`]: { borderWidth: FIELD_BORDER_PX, borderColor: FIELD_BORDER },
        [`&${HOVER}`]: {
          borderColor: theme.palette.primary.main,
        },
        // Read-only too, unlike Linje: view-mode fields stay in the tab order (WCAG 2.4.7).
        '&.Mui-focused': ring(theme.palette.primary.main, 0),
        // Linje read-only (view mode, #267): no border, no hover.
        [`&.MuiInputBase-readOnly ${NOTCH}, &.MuiInputBase-readOnly${HOVER}`]: {
          borderColor: 'transparent',
        },
        '&.Mui-disabled': { backgroundColor: DISABLED_FILL },
        [`&.Mui-disabled ${NOTCH}`]: { borderColor: 'transparent' },
      }),
    },
  },
  // Form fields (`FormFields.tsx`): MUI's small filled field, dressed as Linje's.
  MuiFilledInput: {
    defaultProps: { disableUnderline: true },
    styleOverrides: {
      root: ({ theme }) => ({
        backgroundColor: theme.palette.common.white,
        borderRadius: FIELD_RADIUS_PX,
        ...edge(FIELD_BORDER),
        '&:hover': {
          backgroundColor: theme.palette.common.white,
          ...edge(theme.palette.primary.main),
        },
        // Read-only too, unlike Linje: view-mode fields stay in the tab order (WCAG 2.4.7).
        '&.Mui-focused': {
          backgroundColor: theme.palette.common.white,
          ...edge(theme.palette.primary.main),
          ...ring(theme.palette.primary.main, 0),
        },
        '&.Mui-error': edge(theme.palette.error.main),
        '&.Mui-error.Mui-focused': ring(theme.palette.error.main, 0),
        // Linje read-only (view mode, #267): no border, no hover.
        '&.MuiInputBase-readOnly': { boxShadow: 'none' },
        '&.Mui-disabled': { backgroundColor: DISABLED_FILL, boxShadow: 'none' },
      }),
      // A Select's own `&&&` right padding still wins, keeping its text off the arrow.
      input: { paddingInline: FIELD_PAD_X_PX },
    },
  },
  // Linje disabled text, either field variant (MUI's own is ~2.6:1).
  MuiInputBase: {
    styleOverrides: {
      root: {
        '& .MuiInputBase-input.Mui-disabled': {
          color: DISABLED_TEXT,
          WebkitTextFillColor: DISABLED_TEXT,
        },
      },
    },
  },
  // MUI pads its filled Autocomplete itself; only Linje's indent and the chip-row gap differ.
  MuiAutocomplete: {
    styleOverrides: {
      root: {
        '& .MuiFilledInput-root': {
          paddingLeft: FIELD_PAD_X_PX - AC_INPUT_PAD_LEFT_PX,
          rowGap: CHIP_ROW_GAP_PX,
        },
      },
    },
  },
  // Helper text lines up with the field's edge, under a label that does too.
  MuiFormHelperText: { styleOverrides: { contained: { marginInline: 0 } } },
  MuiButtonBase: {
    styleOverrides: {
      root: ({ theme }) => ({
        '&.Mui-focusVisible': ring(theme.palette.primary.main),
        [INSET_RING]: { outlineOffset: -FOCUS_PX },
      }),
    },
  },
  MuiLink: {
    styleOverrides: {
      root: ({ theme }) => ({ '&:focus-visible': ring(theme.palette.primary.main) }),
    },
  },
  MuiAppBar: {
    // One class more specific than each ring, which its component inserts later. A field
    // sits on the navy itself (the org picker), enki-style: MUI's small field, its label in
    // the outline's notch; Blue 30 label, Lavender 40 outline, white text.
    styleOverrides: {
      root: ({ theme }) => ({
        '& .MuiButtonBase-root.Mui-focusVisible, & .MuiLink-root:focus-visible': {
          outlineColor: FOCUS_CONTRAST,
        },
        // No ring on the picker: an outline is a plain box and would strike through the
        // notched label. Its focus shows as the outline turning white, as in enki.
        '& .MuiOutlinedInput-root.Mui-focused': { outline: 'none' },
        '& .MuiInputLabel-root': { color: HEADER_LABEL },
        '& .MuiInputLabel-root.Mui-focused': { color: theme.palette.common.white },
        '& .MuiOutlinedInput-root, & .MuiAutocomplete-popupIndicator, & .MuiAutocomplete-clearIndicator':
          { color: theme.palette.common.white },
        [`& .MuiOutlinedInput-root ${NOTCH}`]: { borderColor: FOCUS_CONTRAST },
        [`& .MuiOutlinedInput-root${HOVER}, & .MuiOutlinedInput-root.Mui-focused ${NOTCH}`]: {
          borderColor: theme.palette.common.white,
        },
      }),
    },
  },
  MuiDataGrid: {
    styleOverrides: {
      root: ({ theme }) => ({
        '& .MuiDataGrid-columnHeader:focus-visible, & .MuiDataGrid-cell:focus-visible': ring(
          theme.palette.primary.main,
          -FOCUS_PX
        ),
      }),
    },
  },
  // A subtle primary tint for row hover: the opaque action.hover drowns out Chip/Button
  // hover states in rows. Selected sits two stops above hover with a left accent stripe;
  // hover-while-selected nudges one stop further, never back to an unselected look.
  MuiTableRow: {
    styleOverrides: {
      root: ({ theme }) => ({
        '&.MuiTableRow-hover:hover': {
          backgroundColor: alpha(theme.palette.primary.main, ROW_HOVER_ALPHA),
        },
        '&.Mui-selected': {
          backgroundColor: alpha(theme.palette.primary.main, ROW_SELECTED_ALPHA),
          borderLeft: `${ROW_STRIPE_PX}px solid ${theme.palette.primary.main}`,
        },
        '&.Mui-selected.MuiTableRow-hover:hover': {
          backgroundColor: alpha(theme.palette.primary.main, ROW_SELECTED_HOVER_ALPHA),
        },
      }),
    },
  },
};

type Style = Record<string, unknown>;
type Slots = Record<string, unknown>;
type Entry = { styleOverrides?: Slots } & Record<string, unknown>;

const resolve = (style: unknown, props: object): Style =>
  (typeof style === 'function' ? style(props) : style) as Style;

/**
 * A slot both sides style: each resolved, then shallow-merged, the theme file winning. An
 * array (an MUI interpolation list) can't be spread, so it stays a list, the theme file last.
 */
const mergeSlot = (base: unknown, user: unknown) =>
  base === undefined
    ? user
    : user === undefined
      ? base
      : (props: object) => {
          const b = resolve(base, props),
            u = resolve(user, props);
          return Array.isArray(b) || Array.isArray(u) ? [b, u] : { ...b, ...u };
        };

/**
 * Lays a theme file's `components` over the base ones per style slot, so a theme's
 * `MuiButton.root` adds to the base corners rather than replacing them.
 *
 * @param {Components<Theme>} base the app's component defaults
 * @param {Components<Theme>} [user] the theme file's entries; it wins on a shared property
 * @returns {Components<Theme>} both, merged
 */
export function mergeComponents(
  base: Components<Theme>,
  user: Components<Theme> = {}
): Components<Theme> {
  const b = base as Record<string, Entry>,
    u = user as Record<string, Entry>;
  return Object.fromEntries(
    [...new Set([...Object.keys(b), ...Object.keys(u)])].map(name => {
      const slots = { ...b[name]?.styleOverrides, ...u[name]?.styleOverrides };
      const styleOverrides = Object.fromEntries(
        Object.keys(slots).map(slot => [
          slot,
          mergeSlot(b[name]?.styleOverrides?.[slot], u[name]?.styleOverrides?.[slot]),
        ])
      );
      return [name, { ...b[name], ...u[name], styleOverrides }];
    })
  );
}

const isStyle = (v: unknown): v is Style => typeof v === 'object' && v !== null;

/**
 * Lays a theme file's `typography` over the type scale per variant, so a theme's
 * `h1: { fontSize }` keeps the scale's heading weight and line height.
 *
 * @param {TypographyVariantsOptions} [user] the theme file's typography
 * @returns {TypographyVariantsOptions} the type scale with the theme's values on top
 */
export function mergeTypography(user: TypographyVariantsOptions = {}): TypographyVariantsOptions {
  const b = TYPE_SCALE as Style,
    u = user as Style;
  return Object.fromEntries(
    [...new Set([...Object.keys(b), ...Object.keys(u)])].map(key => [
      key,
      isStyle(b[key]) && isStyle(u[key]) ? { ...b[key], ...u[key] } : (u[key] ?? b[key]),
    ])
  );
}

export function createThemeFromConfig(cfg: ThemeConfig): Theme {
  const { logoUrl, ...themeOptions } = cfg;

  return createTheme({
    ...themeOptions,
    logoUrl,
    typography: mergeTypography(themeOptions.typography as TypographyVariantsOptions),
    components: mergeComponents(BASE_COMPONENTS, themeOptions.components as Components<Theme>),
  });
}
