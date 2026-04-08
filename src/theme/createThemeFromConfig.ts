import { alpha, createTheme, type Theme } from '@mui/material/styles';
import type { ThemeConfig } from './theme-config';

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
      ...themeOptions.components,
      // Override table row hover from opaque action.hover to a subtle
      // primary tint. The default palette action.hover is a solid color
      // that drowns out Chip/Button hover states in rows, making
      // navigation elements invisible on hover. Affected routes:
      //   /vehicle-type  — ID chip links, vehicle list expand
      //   /deck-plan     — edit buttons
      //   /vehicle-type/:id — detail tabs using @entur/data-view-table
      MuiTableRow: {
        ...userTableRow,
        styleOverrides: {
          ...userTableRow?.styleOverrides,
          root: ({ theme }: { theme: Theme }) => ({
            '&.MuiTableRow-hover:hover': {
              backgroundColor: alpha(theme.palette.primary.main, 0.08),
            },
            ...userRootStyles,
          }),
        },
      },
    },
  });
}
