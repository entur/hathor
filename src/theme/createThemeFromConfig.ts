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

const ring = (color: string, offset = FOCUS_PX) => ({
  outline: `${FOCUS_PX}px solid ${color}`,
  outlineOffset: offset,
});

const heading = (rem: number) => ({
  fontSize: `${rem}rem`,
  fontWeight: HEADING_WEIGHT,
  lineHeight: 1.25,
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
  h1: heading(2),
  h2: heading(1.5),
  h3: heading(1.5),
  h4: heading(1.5),
  h5: heading(1.5),
  h6: heading(1.25),
};

// Spelled out: emotion splits selectors on every comma, inside `:is()` / `:not()` too.
const INSET_RING = ['.MuiMenuItem-root', '.MuiListItemButton-root', '.MuiTab-root']
  .map(c => `&.Mui-focusVisible${c}`)
  .concat('.MuiDataGrid-root &.Mui-focusVisible')
  .join(', ');
const NOTCH = '.MuiOutlinedInput-notchedOutline';

/**
 * Linje's component look on MUI: corners, chip text, field borders, and one keyboard-focus
 * ring for the whole app, `:focus-visible` only (no ring on a mouse click). Items flush in a
 * clipping box (menus, the nav rail, tabs, grid cells) draw the ring inset.
 */
const BASE_COMPONENTS: Components<Theme> = {
  MuiCard: { styleOverrides: { root: { borderRadius: CARD_RADIUS_PX } } },
  MuiButton: {
    styleOverrides: {
      root: { borderRadius: BUTTON_RADIUS_PX },
      sizeSmall: { borderRadius: BUTTON_RADIUS_SMALL_PX },
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
        [`& ${NOTCH}`]: { borderWidth: FIELD_BORDER_PX, borderColor: FIELD_BORDER },
        [`&:hover:not(.Mui-disabled):not(.Mui-error) ${NOTCH}`]: {
          borderColor: theme.palette.primary.main,
        },
        '&.Mui-focused': ring(theme.palette.primary.main, 0),
      }),
    },
  },
  MuiButtonBase: {
    styleOverrides: {
      root: ({ theme }) => ({
        '&.Mui-focusVisible': ring(theme.palette.primary.main),
        [INSET_RING]: { outlineOffset: -FOCUS_PX },
      }),
    },
  },
  MuiAppBar: {
    // One class more specific than the ring itself, which the button inserts later.
    styleOverrides: {
      root: { '& .MuiButtonBase-root.Mui-focusVisible': { outlineColor: FOCUS_CONTRAST } },
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
        '&.MuiTableRow-hover:hover': { backgroundColor: alpha(theme.palette.primary.main, 0.08) },
        '&.Mui-selected': {
          backgroundColor: alpha(theme.palette.primary.main, 0.18),
          borderLeft: `3px solid ${theme.palette.primary.main}`,
        },
        '&.Mui-selected.MuiTableRow-hover:hover': {
          backgroundColor: alpha(theme.palette.primary.main, 0.24),
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

/** A slot both sides style: each resolved, then shallow-merged, the theme file winning. */
const mergeSlot = (base: unknown, user: unknown) =>
  base === undefined
    ? user
    : user === undefined
      ? base
      : (props: object) => ({ ...resolve(base, props), ...resolve(user, props) });

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

export function createThemeFromConfig(cfg: ThemeConfig): Theme {
  const { logoUrl, ...themeOptions } = cfg;

  return createTheme({
    ...themeOptions,
    logoUrl,
    typography: { ...TYPE_SCALE, ...(themeOptions.typography as TypographyVariantsOptions) },
    components: mergeComponents(BASE_COMPONENTS, themeOptions.components as Components<Theme>),
  });
}
