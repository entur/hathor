import { describe, it, expect } from 'vitest';
import { adoptDeckSheet } from './deckRenderingStyles.ts';

/** Identity is all `adoptDeckSheet` uses, so a bare object stands in fine. */
const SHEET = {} as CSSStyleSheet;

/**
 * `adoptDeckSheet` runs inside `DeckRendering`'s mount promise. A throw there
 * lands in the component's `.catch()` and blanks the deck slot, so an
 * environment without constructable stylesheets must cost styling, not the
 * rendering itself.
 */
describe('adoptDeckSheet', () => {
  it('degrades to unstyled where constructable stylesheets are unavailable', () => {
    const root = {} as unknown as ShadowRoot; // no `adoptedStyleSheets` at all

    expect(() => adoptDeckSheet(root, SHEET)).not.toThrow();
  });

  it('adopts the sheet, once, when the root supports it', () => {
    const root = { adoptedStyleSheets: [] as CSSStyleSheet[] } as unknown as ShadowRoot;

    adoptDeckSheet(root, SHEET);
    adoptDeckSheet(root, SHEET);

    expect(root.adoptedStyleSheets).toEqual([SHEET]);
  });

  it('appends rather than replacing sheets the root already carries', () => {
    const existing = {} as CSSStyleSheet;
    const root = { adoptedStyleSheets: [existing] } as unknown as ShadowRoot;

    adoptDeckSheet(root, SHEET);

    expect(root.adoptedStyleSheets).toEqual([existing, SHEET]);
  });
});
