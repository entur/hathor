import { useEffect } from 'react';
import type { ThemeFontFace } from './theme-config';

const DEFAULT_WEIGHT = 400,
  DEFAULT_STYLE = 'normal',
  DEFAULT_DISPLAY = 'swap';
const STYLE_ATTR = 'data-theme-font';
const ABSOLUTE_URL = /^(https?:)?\/\//;

/** A theme path is served from the app's base; absolute URLs pass through (abzu `resolveThemeAssetUrl`). */
const assetUrl = (src: string) =>
  ABSOLUTE_URL.test(src) ? src : `${import.meta.env.BASE_URL}${src.replace(/^\//, '')}`;

/**
 * The `@font-face` rules for a theme's `fonts.faces` — the shape abzu's themes use, so a
 * deployment theme loads its own font files (Nationale lives in the deployment, not here).
 *
 * @param {ThemeFontFace[]} faces the theme's font faces
 * @returns {string} one `@font-face` rule per face
 */
export const fontFaceCss = (faces: ThemeFontFace[]): string =>
  faces
    .map(f =>
      [
        `font-family: "${f.family}"`,
        `src: url("${assetUrl(f.src)}")${f.format ? ` format("${f.format}")` : ''}`,
        `font-weight: ${f.weight ?? DEFAULT_WEIGHT}`,
        `font-style: ${f.style ?? DEFAULT_STYLE}`,
        `font-display: ${f.display ?? DEFAULT_DISPLAY}`,
        ...(f.unicodeRange ? [`unicode-range: ${f.unicodeRange}`] : []),
      ].join('; ')
    )
    .map(body => `@font-face { ${body}; }`)
    .join('\n');

/**
 * Puts the theme's font faces in `<head>` as one `<style>`, swapped when the theme changes.
 *
 * @param {ThemeFontFace[] | undefined} faces the active theme's `fonts.faces`
 */
export function useThemeFonts(faces: ThemeFontFace[] | undefined) {
  useEffect(() => {
    if (!faces?.length) return;
    const style = document.createElement('style');
    style.setAttribute(STYLE_ATTR, '');
    style.textContent = fontFaceCss(faces);
    document.head.appendChild(style);
    return () => style.remove();
  }, [faces]);
}
