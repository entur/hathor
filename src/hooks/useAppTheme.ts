import { useEffect, useMemo, useState } from 'react';
import { createTheme, type Theme } from '@mui/material/styles';
import { createThemeFromConfig } from '../theme/createThemeFromConfig';
import type { ThemeConfig } from '../theme/theme-config';
import { useThemeFonts } from '../theme/themeFonts';

// A stalled theme request gives up and takes the plain-MUI fallback, so the app still mounts.
const THEME_TIMEOUT_MS = 10_000;

/**
 * The MUI theme built from one theme JSON, plus its font faces in `<head>`. No path,
 * or a failed or timed-out load, gives MUI's plain theme (abzu does the same). `null` until the
 * first theme settles, so the app never paints in MUI's default blue; a later switch
 * keeps the current theme until the next one arrives.
 *
 * @param {string | undefined} themePath URL of the theme JSON, one of `themeConfigs`
 * @returns {Theme | null} the theme, or `null` while the first one loads
 */
export function useAppTheme(themePath: string | undefined): Theme | null {
  // undefined = first theme still loading; null = none or failed (MUI's plain theme)
  const [cfg, setCfg] = useState<ThemeConfig | null | undefined>(undefined);

  useEffect(() => {
    if (!themePath) {
      setCfg(null);
      return;
    }
    let live = true;
    fetch(themePath, { signal: AbortSignal.timeout(THEME_TIMEOUT_MS) })
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

  return useMemo(
    () => (cfg === undefined ? null : cfg ? createThemeFromConfig(cfg) : createTheme()),
    [cfg]
  );
}
