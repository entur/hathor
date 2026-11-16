import { useEffect, useMemo, useState } from 'react';
import { createTheme, type Theme } from '@mui/material/styles';
import { createThemeFromConfig } from '../theme/createThemeFromConfig';
import type { ThemeConfig } from '../theme/theme-config';
import { useThemeFonts } from '../theme/themeFonts';

/**
 * The MUI theme built from one theme JSON, plus its font faces in `<head>`. No path,
 * or a failed load, gives MUI's plain theme (abzu does the same).
 *
 * @param {string | undefined} themePath URL of the theme JSON, one of `themeConfigs`
 * @returns {Theme} the theme
 */
export function useAppTheme(themePath: string | undefined): Theme {
  const [cfg, setCfg] = useState<ThemeConfig | null>(null);

  useEffect(() => {
    if (!themePath) {
      setCfg(null);
      return;
    }
    let live = true;
    fetch(themePath)
      .then(res => {
        if (!res.ok)
          throw new Error(`Theme '${themePath}' failed to load (status: ${res.status}).`);
        return res.json() as Promise<ThemeConfig>;
      })
      .then(next => {
        if (live) setCfg(next);
      })
      .catch((error: unknown) => {
        if (!live) return;
        console.error('Theme loading error:', error instanceof Error ? error.message : error);
        setCfg(null);
      });
    return () => {
      live = false;
    };
  }, [themePath]);

  useThemeFonts(cfg?.fonts?.faces);

  return useMemo(() => (cfg ? createThemeFromConfig(cfg) : createTheme()), [cfg]);
}
