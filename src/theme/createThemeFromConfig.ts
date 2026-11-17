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
// `--components-button-radius-*`; fields keep `shape.borderRadius` 4, chips stay pills.
const CARD_RADIUS_PX = 8,
  BUTTON_RADIUS_PX = 8,
  BUTTON_RADIUS_SMALL_PX = 6;
// Linje field border, `--components-form-baseform-standard-border-default`; navy on hover/focus.
const FIELD_BORDER_PX = 2,
  FIELD_BORDER = '#8284ab';
// Linje form fields, standard density (S5, #260): `base form/height/Default` Medium 48 /
// Small 32 px, inline padding 16 / 12 px, the label pinned 8 px above (`gap/vertical/Medium`).
const FIELD_HEIGHT_PX = 48,
  FIELD_HEIGHT_SMALL_PX = 32,
  FIELD_PAD_X_PX = 16,
  FIELD_PAD_X_SMALL_PX = 12,
  LABEL_GAP_PX = 8;
// The header's org picker is the one field that keeps MUI's outlined label in the notch,
// as enki's provider picker does: MUI small height, label at MUI's 16 px × 0.75 shrink.
const HEADER_FIELD_HEIGHT_PX = 40,
  NOTCH_LABEL_TRANSFORM = 'translate(14px, -9px) scale(0.75)',
  // Linje `Text/SubduedAlt` (Blue 30), 11.3:1 on the navy.
  HEADER_LABEL = '#d9dae8';
// MUI's Autocomplete input keeps its own left padding (5 px, small 8 px); the root adds the rest.
const AC_INPUT_PAD_LEFT_PX = 5,
  AC_INPUT_PAD_LEFT_SMALL_PX = 8;
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

/** Vertical input padding that centres MUI's one-line input (1.4375em) in `height` px. */
const padY = (height: number) => `calc((${height}px - 1.4375em) / 2)`;

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
  // Labels pinned above the field (S5), never floating in it: static in the FormControl's
  // column, the outline's notch closed (TextField sets `notched` itself, so CSS closes it).
  MuiInputLabel: {
    defaultProps: { shrink: true },
    styleOverrides: {
      root: ({ theme }) => ({
        ...theme.typography.body2,
        position: 'static',
        transform: 'none',
        maxWidth: '100%',
        whiteSpace: 'normal',
        marginBottom: LABEL_GAP_PX,
        color: theme.palette.text.primary,
      }),
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
      root: ({ theme }) => ({
        minHeight: FIELD_HEIGHT_PX,
        paddingInline: FIELD_PAD_X_PX,
        '& .MuiOutlinedInput-input': { padding: `${padY(FIELD_HEIGHT_PX)} 0` },
        '&.MuiInputBase-sizeSmall': {
          minHeight: FIELD_HEIGHT_SMALL_PX,
          paddingInline: FIELD_PAD_X_SMALL_PX,
        },
        '&.MuiInputBase-sizeSmall .MuiOutlinedInput-input': {
          padding: `${padY(FIELD_HEIGHT_SMALL_PX)} 0`,
        },
        '&.MuiInputBase-multiline .MuiOutlinedInput-input': { padding: 0 },
        [`& ${NOTCH} legend`]: { maxWidth: '0.01px' },
        [`& ${NOTCH}`]: { borderWidth: FIELD_BORDER_PX, borderColor: FIELD_BORDER },
        [`&${HOVER}`]: {
          borderColor: theme.palette.primary.main,
        },
        '&.Mui-focused': ring(theme.palette.primary.main, 0),
      }),
    },
  },
  // Autocomplete pads its input root itself; the field's min height does the sizing.
  MuiAutocomplete: {
    styleOverrides: {
      root: {
        '& .MuiOutlinedInput-root': {
          paddingTop: 0,
          paddingBottom: 0,
          paddingLeft: FIELD_PAD_X_PX - AC_INPUT_PAD_LEFT_PX,
        },
        '& .MuiOutlinedInput-root.MuiInputBase-sizeSmall': {
          paddingTop: 0,
          paddingBottom: 0,
          paddingLeft: FIELD_PAD_X_SMALL_PX - AC_INPUT_PAD_LEFT_SMALL_PX,
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
    // sits on the navy itself (the org picker), enki-style: label back in the outline's
    // notch (not pinned above, S5 is for forms), Blue 30 label, Lavender 40 outline, white text.
    styleOverrides: {
      root: ({ theme }) => ({
        '& .MuiButtonBase-root.Mui-focusVisible, & .MuiLink-root:focus-visible, & .MuiOutlinedInput-root.Mui-focused':
          { outlineColor: FOCUS_CONTRAST },
        '& .MuiInputLabel-root': {
          ...theme.typography.body1,
          position: 'absolute',
          top: 0,
          left: 0,
          transform: NOTCH_LABEL_TRANSFORM,
          transformOrigin: 'top left',
          maxWidth: 'calc(133% - 32px)',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          marginBottom: 0,
          color: HEADER_LABEL,
        },
        '& .MuiInputLabel-root.Mui-focused': { color: theme.palette.common.white },
        [`& .MuiOutlinedInput-root ${NOTCH} legend`]: { maxWidth: '100%' },
        '& .MuiOutlinedInput-root.MuiInputBase-sizeSmall': { minHeight: HEADER_FIELD_HEIGHT_PX },
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
