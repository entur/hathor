import { describe, it, expect } from 'vitest';
import { applyDeckStyle, mkDeckCss, type DeckPalette } from './deckRenderingStyles.ts';

const PALETTE: DeckPalette = {
  frame: '#000',
  deck: '#111',
  deckLine: '#222',
  seat: '#333',
  seatLine: '#444',
  label: '#555',
};

/**
 * A shadow root that records what was appended. The unit project runs in the
 * `node` environment (vite.config.ts), so there is no DOM to attach a real one
 * to; `applyDeckStyle` touches only these three members.
 */
const mkRoot = () => {
  const kids: { tag: string; text: string }[] = [];
  return {
    kids,
    root: {
      ownerDocument: {
        createElement: (tag: string) => ({
          tagName: tag.toUpperCase(),
          textContent: '',
          setAttribute: () => {},
        }),
      },
      append: (el: { tagName: string; textContent: string }) =>
        kids.push({ tag: el.tagName, text: el.textContent }),
      querySelector: () => (kids.length ? {} : null),
    } as unknown as ShadowRoot,
  };
};

describe('mkDeckCss', () => {
  it('paints every role from the palette', () => {
    const css = mkDeckCss(PALETTE);

    for (const colour of Object.values(PALETTE)) expect(css).toContain(colour);
  });
});

describe('applyDeckStyle', () => {
  it('appends the CSS as a <style> element', () => {
    const { root, kids } = mkRoot();

    applyDeckStyle(root, '.seat { fill: red }');

    expect(kids).toEqual([{ tag: 'STYLE', text: '.seat { fill: red }' }]);
  });

  it('does not stack duplicates', () => {
    const { root, kids } = mkRoot();

    applyDeckStyle(root, '.seat { fill: red }');
    applyDeckStyle(root, '.seat { fill: red }');

    expect(kids).toHaveLength(1);
  });
});
