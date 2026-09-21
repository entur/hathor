import { describe, it, expect, vi, afterEach } from 'vitest';
import { applyDeckStyle, mkDeckStyle, type DeckPalette } from './deckRenderingStyles.ts';

const PALETTE: DeckPalette = {
  frame: '#000',
  deck: '#111',
  deckLine: '#222',
  seat: '#333',
  seatLine: '#444',
  label: '#555',
};

/** Minimal constructable-stylesheet stand-in; the node env has no CSSOM. */
class FakeSheet {
  css = '';
  replaceSync(css: string) {
    this.css = css;
  }
}

/** A shadow root that records what was appended, with no DOM behind it. */
const mkRoot = (adopted?: CSSStyleSheet[]) => {
  const kids: { tag: string; text: string; attrs: Record<string, string> }[] = [];
  return {
    kids,
    root: {
      adoptedStyleSheets: adopted,
      ownerDocument: {
        createElement: (tag: string) => ({
          tagName: tag.toUpperCase(),
          textContent: '',
          setAttribute(k: string, v: string) {
            (this as unknown as { attrs: Record<string, string> }).attrs[k] = v;
          },
          attrs: {} as Record<string, string>,
        }),
      },
      append(el: { tagName: string; textContent: string; attrs: Record<string, string> }) {
        kids.push({ tag: el.tagName, text: el.textContent, attrs: el.attrs });
      },
      querySelector: (sel: string) =>
        kids.find(k => sel.includes(k.attrs['data-deck-style'] ?? '\0')) ?? null,
    } as unknown as ShadowRoot,
  };
};

afterEach(() => vi.unstubAllGlobals());

/**
 * `mkDeckStyle` runs during `DeckRendering`'s render, outside the mount
 * promise's `.catch()` — a throw there takes the whole component down rather
 * than costing styling, so it must never throw.
 */
describe('mkDeckStyle', () => {
  // Absent and non-constructable both land on the same `catch`, so one case
  // covers the pair.
  it('survives a runtime with no constructable stylesheets', () => {
    vi.stubGlobal('CSSStyleSheet', undefined);

    const style = mkDeckStyle(PALETTE);

    expect(style.sheet).toBeNull();
    expect(style.css).toContain(PALETTE.seat);
  });

  it('builds a sheet where the constructor works', () => {
    vi.stubGlobal('CSSStyleSheet', FakeSheet);

    const style = mkDeckStyle({ ...PALETTE, seat: '#bbb' });

    expect(style.sheet).toBeInstanceOf(FakeSheet);
    expect((style.sheet as unknown as FakeSheet).css).toBe(style.css);
  });

  it('memoises per palette so every deck on the page shares one sheet', () => {
    vi.stubGlobal('CSSStyleSheet', FakeSheet);
    const p = { ...PALETTE, seat: '#ccc' };

    expect(mkDeckStyle(p)).toBe(mkDeckStyle({ ...p }));
  });
});

/**
 * `applyDeckStyle` runs inside `DeckRendering`'s mount promise. A throw there
 * lands in the component's `.catch()` and blanks the deck slot, so a root that
 * cannot adopt must cost the adoption, not the rendering.
 */
describe('applyDeckStyle', () => {
  const SHEET = {} as CSSStyleSheet;

  it('adopts the sheet, once, when the root supports it', () => {
    const { root } = mkRoot([]);

    applyDeckStyle(root, { sheet: SHEET, css: 'x' });
    applyDeckStyle(root, { sheet: SHEET, css: 'x' });

    expect(root.adoptedStyleSheets).toEqual([SHEET]);
  });

  it('appends rather than replacing sheets the root already carries', () => {
    const existing = {} as CSSStyleSheet;
    const { root } = mkRoot([existing]);

    applyDeckStyle(root, { sheet: SHEET, css: 'x' });

    expect(root.adoptedStyleSheets).toEqual([existing, SHEET]);
  });

  it('falls back to a <style> element when there is no sheet to adopt', () => {
    const { root, kids } = mkRoot([]);

    applyDeckStyle(root, { sheet: null, css: '.seat { fill: red }' });

    expect(kids).toHaveLength(1);
    expect(kids[0].tag).toBe('STYLE');
    expect(kids[0].text).toBe('.seat { fill: red }');
    expect(root.adoptedStyleSheets).toEqual([]);
  });

  it('falls back to a <style> element, once, when the root cannot adopt', () => {
    const { root, kids } = mkRoot(); // no `adoptedStyleSheets` at all
    const style = { sheet: SHEET, css: '.seat { fill: red }' };

    applyDeckStyle(root, style);
    applyDeckStyle(root, style);

    expect(kids).toHaveLength(1);
    expect(kids[0].tag).toBe('STYLE');
  });
});
