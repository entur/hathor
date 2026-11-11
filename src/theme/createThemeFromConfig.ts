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
// Linje card corner, `--border-radiuses-large`; fields and buttons keep `shape.borderRadius` 4.
const CARD_RADIUS_PX = 8;

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

/**
 * Card corners, and one keyboard-focus ring for the whole app, `:focus-visible` only (no ring
 * on a mouse click). Items flush in a clipping box (menus, the nav rail, tabs, grid cells) draw
 * it inset. A theme file's own entry for one of these components replaces it.
 */
const BASE_COMPONENTS: Components<Theme> = {
  MuiCard: { styleOverrides: { root: { borderRadius: CARD_RADIUS_PX } } },
  MuiButtonBase: {
    styleOverrides: {
      root: ({ theme }) => ({
        '&.Mui-focusVisible': ring(theme.palette.primary.main),
        '&.Mui-focusVisible:is(.MuiMenuItem-root, .MuiListItemButton-root, .MuiTab-root), .MuiDataGrid-root &.Mui-focusVisible':
          { outlineOffset: -FOCUS_PX },
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
};

export function createThemeFromConfig(cfg: ThemeConfig): Theme {
  const { logoUrl, ...themeOptions } = cfg;
  const userTableRow = themeOptions.components?.MuiTableRow;
  const userRootStyles =
    typeof userTableRow?.styleOverrides?.root === 'object'
      ? (userTableRow.styleOverrides.root as Record<string, unknown>)
      : {};

  return createTheme({
    ...themeOptions,
    logoUrl,
    typography: { ...TYPE_SCALE, ...(themeOptions.typography as TypographyVariantsOptions) },
    components: {
      ...BASE_COMPONENTS,
      ...themeOptions.components,
      // Override table row hover from opaque action.hover to a subtle
      // primary tint. The default palette action.hover is a solid color
      // that drowns out Chip/Button hover states in rows, making
      // navigation elements invisible on hover. Affected routes:
      //   /vehicle-types  — ID chip links, vehicle list expand
      //   /deck-plans     — edit buttons
      //   /vehicle-types/:id — detail tabs using @entur/data-view-table
      MuiTableRow: {
        ...userTableRow,
        styleOverrides: {
          ...userTableRow?.styleOverrides,
          root: ({ theme }: { theme: Theme }) => ({
            '&.MuiTableRow-hover:hover': {
              backgroundColor: alpha(theme.palette.primary.main, 0.08),
            },
            // Selected row sits two stops above hover and carries a left
            // accent stripe; hover-while-selected nudges one stop further so
            // the hover affordance still reads but never collapses back to
            // an unselected look.
            '&.Mui-selected': {
              backgroundColor: alpha(theme.palette.primary.main, 0.18),
              borderLeft: `3px solid ${theme.palette.primary.main}`,
            },
            '&.Mui-selected.MuiTableRow-hover:hover': {
              backgroundColor: alpha(theme.palette.primary.main, 0.24),
            },
            ...userRootStyles,
          }),
        },
      },
    },
  });
}
