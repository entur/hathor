import { alpha, createTheme, type Components, type Theme } from '@mui/material/styles';
import type {} from '@mui/x-data-grid/themeAugmentation';
import type { ThemeConfig } from './theme-config';

// Linje focus ring (WCAG 2.4.7, #256): `outlines.focus` / `outlineOffsets.focus` 2 px, in
// `--stroke-focus-standard` (primary) on light surfaces and `--stroke-focus-contrast`
// (Lavender 40) on the navy header.
const FOCUS_PX = 2,
  FOCUS_CONTRAST = '#aeb7e2';

const ring = (color: string, offset = FOCUS_PX) => ({
  outline: `${FOCUS_PX}px solid ${color}`,
  outlineOffset: offset,
});

/**
 * One keyboard-focus ring for the whole app, `:focus-visible` only (no ring on a mouse
 * click). Items flush in a clipping box (menus, the nav rail, tabs, grid cells) draw it inset.
 * A theme file's own entry for one of these components replaces it.
 */
const FOCUS_RING: Components<Theme> = {
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
    components: {
      ...FOCUS_RING,
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
