import { alpha, createTheme, type Theme } from '@mui/material/styles';
import type { ThemeConfig } from './theme-config';

export function createThemeFromConfig(cfg: ThemeConfig): Theme {
  const { logoUrl, ...themeOptions } = cfg;
  const userTableRow = themeOptions.components?.MuiTableRow;

  return createTheme({
    ...themeOptions,
    logoUrl,
    components: {
      ...themeOptions.components,
      MuiTableRow: {
        ...userTableRow,
        styleOverrides: {
          ...userTableRow?.styleOverrides,
          root: ({ theme }: { theme: Theme }) => ({
            '&.MuiTableRow-hover:hover': {
              backgroundColor: alpha(theme.palette.primary.main, 0.08),
            },
          }),
        },
      },
    },
  });
}
