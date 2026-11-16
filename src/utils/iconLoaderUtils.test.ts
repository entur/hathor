import { describe, it, expect } from 'vitest';
import { getIconUrl } from './iconLoaderUtils';

/**
 * Parity guard for the icon resolution ladder:
 * custom svg → custom png → default svg → default png → `default.*` → ''.
 *
 * Note: Vite inlines small SVGs as `data:image/svg+xml,…` URIs (no file
 * path), so we assert on *format*: an SVG for menu / data proves the custom
 * tier wins over their default PNG.
 * Asset fixtures (see src/static/{custom,default}Icons):
 *  - menu / data: custom svg + default png (no custom png, no default svg)
 *  - train:       default png only         (no custom, no svg anywhere)
 */
const isSvg = (url: string) => url.startsWith('data:image/svg') || /\.svg(\?|$)/.test(url);
const isPng = (url: string) => url.startsWith('data:image/png') || /\.png(\?|$)/.test(url);

describe('getIconUrl resolution ladder', () => {
  it('prefers the custom SVG over the default PNG', () => {
    expect(isSvg(getIconUrl('menu'))).toBe(true);
    expect(isSvg(getIconUrl('data'))).toBe(true);
  });

  it('uses the default PNG when no custom or svg variant exists', () => {
    expect(getIconUrl('train')).toMatch(/defaultIcons\/train\.png/);
  });

  it('falls back to default.* for an unknown name (never empty)', () => {
    const url = getIconUrl('this-icon-does-not-exist');
    expect(url).not.toBe('');
    expect(isPng(url) || isSvg(url)).toBe(true);
  });
});
