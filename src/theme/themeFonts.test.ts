import { describe, expect, it } from 'vitest';
import { fontFaceCss } from './themeFonts';

describe('fontFaceCss', () => {
  it('writes one rule per face, with the given fields', () => {
    const css = fontFaceCss([
      {
        family: 'Brand',
        src: '/fonts/v1/brand-500.woff2',
        format: 'woff2',
        weight: '500',
        unicodeRange: 'U+0000-00FF',
      },
      { family: 'Brand', src: 'fonts/brand-600.woff2', weight: '600', display: 'block' },
    ]);
    const rules = css.split('\n');
    expect(rules).toHaveLength(2);
    expect(rules[0]).toBe(
      '@font-face { font-family: "Brand"; src: url("/fonts/v1/brand-500.woff2") format("woff2"); ' +
        'font-weight: 500; font-style: normal; font-display: swap; unicode-range: U+0000-00FF; }'
    );
    // relative src resolves from the app base, not the current route
    expect(rules[1]).toContain('src: url("/fonts/brand-600.woff2");');
    expect(rules[1]).toContain('font-display: block;');
  });

  it('passes absolute URLs through', () => {
    expect(fontFaceCss([{ family: 'X', src: 'https://cdn.example/x.woff2' }])).toContain(
      'url("https://cdn.example/x.woff2")'
    );
  });
});
