import { describe, it, expect } from 'vitest';
import { getIconUrl } from './iconLoaderUtils';

/**
 * Parity guard for the icon resolution ladder:
 * custom svg → custom png → default svg → default png → `default.*` → ''.
 *
 * Note: Vite inlines small SVGs as `data:image/svg+xml,…` URIs (no file
 * path), so we assert on *format* + that custom-on differs from custom-off
 * — that divergence is what proves the custom tier is selected when on.
 * Asset fixtures (see src/static/{custom,default}Icons):
 *  - menu / data: custom svg + default png (no custom png, no default svg)
 *  - train:       default png only         (no custom, no svg anywhere)
 */
const isSvg = (url: string) => url.startsWith('data:image/svg') || /\.svg(\?|$)/.test(url);
const isPng = (url: string) => url.startsWith('data:image/png') || /\.png(\?|$)/.test(url);

describe('getIconUrl resolution ladder', () => {
  it('prefers a custom SVG when custom features are on', () => {
    expect(isSvg(getIconUrl('menu', true))).toBe(true);
  });

  it('falls back to the default PNG when custom features are off', () => {
    const url = getIconUrl('menu', false);
    expect(isPng(url)).toBe(true);
    expect(url).toContain('defaultIcons');
  });

  it('selects a different asset depending on the custom flag', () => {
    // menu has a custom svg but only a default png → on vs off must diverge.
    expect(getIconUrl('menu', true)).not.toBe(getIconUrl('menu', false));
  });

  it('uses the default PNG when no custom or svg variant exists', () => {
    expect(getIconUrl('train', true)).toMatch(/defaultIcons\/train\.png/);
    // no custom/svg variant → flag makes no difference.
    expect(getIconUrl('train', true)).toBe(getIconUrl('train', false));
  });

  it('falls back to default.* for an unknown name (never empty)', () => {
    const url = getIconUrl('this-icon-does-not-exist');
    expect(url).not.toBe('');
    expect(isPng(url) || isSvg(url)).toBe(true);
  });

  it('honours custom features for another custom-svg icon', () => {
    expect(isSvg(getIconUrl('data', true))).toBe(true);
    expect(isPng(getIconUrl('data', false))).toBe(true);
  });
});
