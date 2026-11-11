import { decomposeColor, hslToRgb, recomposeColor } from '@mui/material/styles';

/** A colour's r, g, b (0–255) and alpha; `hsl()` is converted first, not mixed as r/g/b. */
const rgba = (c: string): number[] =>
  decomposeColor(c.trim().startsWith('hsl') ? hslToRgb(c) : c).values;

/**
 * Composites colour `c` (maybe translucent) over the opaque colour `under`.
 *
 * @param {string} under the colour behind, opaque
 * @param {string} c the colour on top: hex, `rgb()`/`rgba()` or `hsl()`/`hsla()`
 * @returns {string} the result as `rgb()`; `c` itself when either colour can't be parsed
 *   (`transparent`, a named colour, a CSS variable)
 */
export const over = (under: string, c: string): string => {
  try {
    const u = rgba(under);
    const o = rgba(c);
    const a = o[3] ?? 1;
    const rgb = [0, 1, 2].map(i => Math.round(u[i] * (1 - a) + o[i] * a));
    return recomposeColor({ type: 'rgb', values: rgb as [number, number, number] });
  } catch {
    return c;
  }
};
