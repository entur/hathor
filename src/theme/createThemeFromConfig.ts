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
// InputGroupLabel.scss): one 48 px box, 16 px inline padding, radius 8. The label rests
// inside at 16 px and moves to the box's top at 12 px once focused or filled; the value sits
// under it, 4 px off the bottom. Offsets are for MUI's 1.4375em (23 px) line.
const FIELD_HEIGHT_PX = 48,
  FIELD_PAD_X_PX = 16,
  FIELD_RADIUS_PX = 8,
  VALUE_PAD_BOTTOM_PX = 4,
  LABEL_REST_Y_PX = 12.5,
  LABEL_TOP_Y_PX = 5,
  // Linje `Text/Subdued`, 5.6:1 on white.
  LABEL_COLOR = '#626493';
// Linje disabled field (`BaseFormControl.scss` `--disabled`): grey fill, no border, grey text.
const DISABLED_FILL = '#cfd2d4',
  DISABLED_TEXT = '#6e6f73';
// Linje `Text/SubduedAlt` (Blue 30), 11.3:1 on the navy: the header picker's label.
const HEADER_LABEL = '#d9dae8';
// MUI's Autocomplete input keeps its own padding (7.5 px vertical, 5 px left).
const AC_INPUT_PAD_Y_PX = 7.5,
  AC_INPUT_PAD_LEFT_PX = 5,
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

// Form-size fields; small ones (toolbar, filters, the header picker) keep MUI's 40 px,
// the label in the outline's notch: a Linje small field (32 px) has no room for it inside.
const MEDIUM = ':not(.MuiInputBase-sizeSmall)';
const LABEL_MEDIUM = '&.MuiInputLabel-outlined:not(.MuiInputLabel-sizeSmall)';
// A field with a label: its value sits under the label, at the bottom of the box.
const LABELLED = `.MuiInputLabel-root + &${MEDIUM}`,
  LABELLED_ROOT = `.MuiInputLabel-root + .MuiOutlinedInput-root${MEDIUM}`;
/** Top padding that puts MUI's one-line value 4 px off the bottom of the 48 px box. */
const VALUE_PAD_TOP = `calc(${FIELD_HEIGHT_PX}px - 1.4375em - ${VALUE_PAD_BOTTOM_PX}px)`;
/** Vertical padding that centres MUI's one-line value in the 48 px box (no label). */
const VALUE_PAD_Y = `calc((${FIELD_HEIGHT_PX}px - 1.4375em) / 2)`;

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
  // Linje's label inside the box: resting mid-field, at the top once focused or filled.
  MuiInputLabel: {
    styleOverrides: {
      root: {
        color: LABEL_COLOR,
        '&.Mui-disabled': { color: DISABLED_TEXT },
        [LABEL_MEDIUM]: {
          transform: `translate(${FIELD_PAD_X_PX}px, ${LABEL_REST_Y_PX}px) scale(1)`,
          maxWidth: `calc(100% - ${2 * FIELD_PAD_X_PX}px)`,
        },
        [`${LABEL_MEDIUM}.MuiInputLabel-shrink`]: {
          transform: `translate(${FIELD_PAD_X_PX}px, ${LABEL_TOP_Y_PX}px) scale(0.75)`,
          maxWidth: `calc(133% - ${(2 * FIELD_PAD_X_PX * 4) / 3}px)`,
        },
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
      // Hover uses MUI's own selector to outrank it; focus, error and disabled keep MUI's
      // colours (focus is already a 2 px primary border), plus Linje's outline on focus.
      // The label lives inside the box, so the outline's notch stays closed (TextField
      // sets `notched` itself, so CSS closes it).
      root: ({ theme }) => ({
        [`&${MEDIUM}`]: {
          minHeight: FIELD_HEIGHT_PX,
          paddingInline: FIELD_PAD_X_PX,
          borderRadius: FIELD_RADIUS_PX,
        },
        // Block and left only: a Select's own right padding keeps its text off the arrow.
        [`&${MEDIUM} .MuiOutlinedInput-input`]: { paddingBlock: VALUE_PAD_Y, paddingLeft: 0 },
        [`${LABELLED} .MuiOutlinedInput-input`]: {
          paddingBlock: `${VALUE_PAD_TOP} ${VALUE_PAD_BOTTOM_PX}px`,
        },
        // shortcut: a labelled multiline field isn't laid out for the label inside (its first
        // line would sit under the label); style it when a form gets a textarea.
        [`&${MEDIUM} ${NOTCH} legend`]: { maxWidth: '0.01px' },
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
        '& .MuiInputBase-input.Mui-disabled': {
          color: DISABLED_TEXT,
          WebkitTextFillColor: DISABLED_TEXT,
        },
      }),
    },
  },
  // Autocomplete pads its input root itself: the same 48 px box, value under the label.
  MuiAutocomplete: {
    styleOverrides: {
      root: {
        [`& .MuiOutlinedInput-root${MEDIUM}`]: {
          paddingBlock: `calc((${FIELD_HEIGHT_PX}px - 1.4375em - ${2 * AC_INPUT_PAD_Y_PX}px) / 2)`,
          paddingLeft: FIELD_PAD_X_PX - AC_INPUT_PAD_LEFT_PX,
        },
        // Outranks the field's value padding, which would zero the input's own.
        [`& .MuiOutlinedInput-root${MEDIUM} .MuiAutocomplete-input`]: {
          paddingBlock: AC_INPUT_PAD_Y_PX,
          paddingLeft: AC_INPUT_PAD_LEFT_PX,
        },
        [`& ${LABELLED_ROOT}`]: {
          paddingTop: VALUE_PAD_TOP,
          paddingBottom: VALUE_PAD_BOTTOM_PX,
          rowGap: CHIP_ROW_GAP_PX,
        },
        [`& ${LABELLED_ROOT} .MuiAutocomplete-input`]: { paddingBlock: 0 },
        // Chips sit on the value's line, inside the 48 px box, lined up with the label.
        [`& ${LABELLED_ROOT} .MuiAutocomplete-tag`]: {
          marginBlock: 0,
          marginLeft: AC_INPUT_PAD_LEFT_PX,
          height: '1.4375em',
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
