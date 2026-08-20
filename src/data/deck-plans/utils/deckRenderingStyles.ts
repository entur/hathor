/**
 * Shadow-root styling for `<deck-rendering>`.
 *
 * The editor package ships its renderer's `<style>` block to
 * `dist/netex-deckplan-editor.css`, not into the element: `DeckRendering.vue`
 * is a plain SFC (not `.ce.vue`), so the Vue plugin extracts the styles, and
 * the web-component entry passes only Tailwind's `lib.css` to
 * `defineCustomElement`. That CSS file is also unreachable — the package's
 * `exports` map exposes only `.` and `./webcomponent`. Unstyled, seats render
 * solid black with black labels.
 *
 * So hathor owns the rendering's appearance, which also keeps it on the MUI
 * palette instead of the package's brand colours.
 *
 * Selectors mirror what the renderer actually emits — `seat__availability-*`,
 * not the `.seat-occupied` family in the package's own stylesheet, which
 * targets class names the model stopped producing. Availability variants are
 * omitted: this is a read-only view that never sets the `availability` prop.
 */

/** Colours the rendering needs, in the order the deck is painted. */
export interface DeckPalette {
  /** Backdrop behind the deck outline. */
  frame: string;
  /** Deck floor fill. */
  deck: string;
  /** Deck outline. */
  deckLine: string;
  /** Seat body fill. */
  seat: string;
  /** Seat outline and backrest. */
  seatLine: string;
  /** Seat label. */
  label: string;
}

const cache = new Map<string, CSSStyleSheet>();

/**
 * Build (and memoise) the constructable stylesheet for a palette.
 *
 * Constructable sheets are shareable, so every `<deck-rendering>` on the page
 * adopts one object per palette rather than parsing its own copy.
 *
 * @param p Colours to paint with, typically derived from the MUI theme.
 * @returns A sheet ready to push onto a shadow root's `adoptedStyleSheets`.
 */
export function mkDeckSheet(p: DeckPalette): CSSStyleSheet {
  const key = Object.values(p).join('|');
  const hit = cache.get(key);
  if (hit) return hit;

  const sheet = new CSSStyleSheet();
  sheet.replaceSync(`
    .vehicle-frame { background-color: ${p.frame}; border-radius: 4px; }
    .vehicle-deck  { fill: ${p.deck}; stroke: ${p.deckLine}; stroke-width: 2px; rx: 5px; }
    .seat .seat__base      { fill: ${p.seat}; stroke: ${p.seatLine}; stroke-width: 1px; rx: 5px; }
    .seat .seat__backrest  { fill: ${p.seatLine}; }
    .seat__text            { fill: ${p.label}; stroke: none; pointer-events: none; }
    .door                  { fill: ${p.seatLine}; stroke: ${p.seatLine}; stroke-width: 1px; }
    /* Read-only view — the element still emits \`select\`, but nothing consumes it. */
    .seat, .door { cursor: default; }
  `);

  cache.set(key, sheet);
  return sheet;
}

/**
 * Adopt the palette's sheet onto a shadow root, once.
 *
 * @param root Shadow root of a `<deck-rendering>` element.
 * @param sheet Sheet from {@link mkDeckSheet}.
 */
export function adoptDeckSheet(root: ShadowRoot, sheet: CSSStyleSheet): void {
  if (root.adoptedStyleSheets.includes(sheet)) return;
  root.adoptedStyleSheets = [...root.adoptedStyleSheets, sheet];
}
