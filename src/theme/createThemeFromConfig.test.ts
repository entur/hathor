import { describe, expect, it } from 'vitest';
import type { Theme } from '@mui/material/styles';
import { createThemeFromConfig, mergeComponents } from './createThemeFromConfig';
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
    expect(slot(theme, 'MuiButton', 'root')).toEqual({ textTransform: 'none', borderRadius: 2 });
    expect(slot(theme, 'MuiButton', 'sizeSmall')).toEqual({ borderRadius: 6 });
    expect(theme.components?.MuiTooltip?.defaultProps).toEqual({ arrow: true });
  });

  it('keeps a base slot the theme file leaves alone', () => {
    const theme = createThemeFromConfig({ ...CFG, components: {} });
    expect(slot(theme, 'MuiButton', 'root')).toEqual({ borderRadius: 8 });
    expect(slot(theme, 'MuiChip', 'root')).toEqual({ fontSize: theme.typography.body2.fontSize });
  });

  it('merges function and object slots', () => {
    const merged = mergeComponents(
      { MuiChip: { styleOverrides: { root: () => ({ a: 1, b: 1 }) } } },
      { MuiChip: { styleOverrides: { root: { b: 2 } } } }
    );
    const root = merged.MuiChip?.styleOverrides?.root as (p: object) => object;
    expect(root({})).toEqual({ a: 1, b: 2 });
  });

  it('keeps an array-valued slot as an interpolation list, the theme file last', () => {
    const merged = mergeComponents(
      { MuiChip: { styleOverrides: { root: { a: 1 } } } },
      { MuiChip: { styleOverrides: { root: [{ color: 'red' }] } } }
    );
    const root = merged.MuiChip?.styleOverrides?.root as (p: object) => unknown;
    expect(root({})).toEqual([{ a: 1 }, [{ color: 'red' }]]);
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
