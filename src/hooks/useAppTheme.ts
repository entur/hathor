import { useEffect, useMemo, useRef, useState } from 'react';
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
 * keeps the current theme until the next one arrives, and a failed one keeps it for good.
 *
 * @param {string | undefined} themePath URL of the theme JSON, one of `themeConfigs`
 * @param {(path: string) => void} [onFailedSwitch] called with the shown theme's path when a
 *   switch away from it fails, so the pick can go back to it
 * @returns {Theme | null} the theme, or `null` while the first one loads
 */
export function useAppTheme(
  themePath: string | undefined,
  onFailedSwitch?: (path: string) => void
): Theme | null {
  // undefined = first theme still loading; null = none or failed (MUI's plain theme)
  const [cfg, setCfg] = useState<ThemeConfig | null | undefined>(undefined);
  const shown = useRef<string>(undefined); // the path `cfg` came from

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
        if (!live) return;
        shown.current = themePath;
        setCfg(next);
      })
      .catch((error: unknown) => {
        if (!live) return;
        console.error('Theme loading error:', error instanceof Error ? error.message : error);
        // Plain MUI only while nothing has loaded: a failed switch keeps the current theme,
        // and the pick goes back to it.
        setCfg(prev => (prev === undefined ? null : prev));
        if (shown.current && shown.current !== themePath) onFailedSwitch?.(shown.current);
      });
    return () => {
      live = false;
    };
  }, [themePath, onFailedSwitch]);

  useThemeFonts(cfg?.fonts?.faces);

  return useMemo(
    () => (cfg === undefined ? null : cfg ? createThemeFromConfig(cfg) : createTheme()),
    [cfg]
  );
}
