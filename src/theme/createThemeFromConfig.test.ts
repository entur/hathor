import { describe, expect, it } from 'vitest';
import type { Theme } from '@mui/material/styles';
import { createThemeFromConfig } from './createThemeFromConfig';
import type { ThemeConfig } from './theme-config';

const CFG = {
  applicationName: 'App',
  companyName: 'Entur',
  logoUrl: '/logo.png',
  logoHeight: 20,
  components: {
    MuiButton: { styleOverrides: { root: { textTransform: 'none', borderRadius: 2 } } },
    MuiTooltip: { defaultProps: { arrow: true } },
  },
} as ThemeConfig;

/** A slot's style as MUI would resolve it. */
const slot = (theme: Theme, name: 'MuiButton' | 'MuiChip', key: string) => {
  const style = (theme.components?.[name]?.styleOverrides as Record<string, unknown>)[key];
  return typeof style === 'function' ? style({ theme }) : style;
};

describe('createThemeFromConfig', () => {
  it("lays the theme file's component styles over the base ones, the file winning", () => {
    const theme = createThemeFromConfig(CFG);
    expect(slot(theme, 'MuiButton', 'root')).toEqual({
      textTransform: 'none',
      borderRadius: 2,
      minHeight: 48,
    });
    expect(slot(theme, 'MuiButton', 'sizeSmall')).toEqual({ borderRadius: 6, minHeight: 32 });
    expect(theme.components?.MuiTooltip?.defaultProps).toEqual({ arrow: true });
  });

  it('keeps a base slot the theme file leaves alone', () => {
    const theme = createThemeFromConfig({ ...CFG, components: {} });
    expect(slot(theme, 'MuiButton', 'root')).toEqual({ borderRadius: 8, minHeight: 48 });
    expect(slot(theme, 'MuiChip', 'root')).toEqual({ fontSize: theme.typography.body2.fontSize });
  });

  it('colours icons (action.active) in primary unless the theme file sets it', () => {
    const palette = { primary: { main: '#181c56' } };
    expect(createThemeFromConfig({ ...CFG, palette }).palette.action.active).toBe('#181c56');
    const own = { ...palette, action: { active: '#123456' } };
    expect(createThemeFromConfig({ ...CFG, palette: own }).palette.action.active).toBe('#123456');
  });

  it('keeps Linje header colours on navy, the bar text where they would fail', () => {
    const bar = (main: string) => {
      const root = createThemeFromConfig({ ...CFG, palette: { primary: { main } } }).components
        ?.MuiAppBar?.styleOverrides?.root as Record<string, Record<string, string>>;
      return {
        ring: root['& .MuiButtonBase-root.Mui-focusVisible, & .MuiLink-root:focus-visible']
          .outlineColor,
        label: root['& .MuiInputLabel-root'].color,
      };
    };
    expect(bar('#181c56')).toEqual({ ring: '#aeb7e2', label: '#d9dae8' });
    // the green header in theme-picker.spec.ts: Lavender 40 is 2.6:1 there
    expect(bar('#008000')).toEqual({ ring: '#fff', label: '#fff' });
  });

  it("keeps the scale's heading weight and line height under a theme's h1 size", () => {
    // the deployed themes still carry `h1: { fontSize: '3rem' }`
    const theme = createThemeFromConfig({
      ...CFG,
      typography: { fontFamily: 'Arial, sans-serif', h1: { fontSize: '3rem' } },
    });
    expect(theme.typography.h1).toMatchObject({
      fontSize: '3rem',
      fontWeight: 600,
      lineHeight: 1.25,
    });
    expect(theme.typography.fontFamily).toBe('Arial, sans-serif');
    expect(theme.typography.fontWeightRegular).toBe(500);
  });
});
