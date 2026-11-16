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
 * @returns {{ theme: Theme, themeError: string | null }} the theme, and why loading failed
 */
export function useAppTheme(themePath: string | undefined): {
  theme: Theme;
  themeError: string | null;
} {
  const [cfg, setCfg] = useState<ThemeConfig | null>(null);
  const [themeError, setThemeError] = useState<string | null>(null);

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
        if (!live) return;
        setCfg(next);
        setThemeError(null);
      })
      .catch((error: unknown) => {
        if (!live) return;
        const message = error instanceof Error ? error.message : String(error);
        console.error('Theme loading error:', message);
        setThemeError(message);
        setCfg(null);
      });
    return () => {
      live = false;
    };
  }, [themePath]);

  useThemeFonts(cfg?.fonts?.faces);

  const theme = useMemo(() => (cfg ? createThemeFromConfig(cfg) : createTheme()), [cfg]);

  return { theme, themeError };
}
