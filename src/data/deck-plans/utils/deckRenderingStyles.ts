/**
 * Shadow-root styling for `<deck-rendering>`.
 *
 * The editor package ships its renderer's `<style>` block to
 * `dist/netex-deckplan-editor.css`, not into the element: `DeckRendering.vue`
 * is a plain SFC (not `.ce.vue`), so the Vue plugin extracts the styles, and
 * the web-component entry passes only Tailwind's `lib.css` to
 * `defineCustomElement`. That CSS file is also unreachable through the
 * package's `exports` map, which exposes only `.` and `./webcomponent`.
 * Unstyled, seats render solid black with black labels.
 *
 * So hathor owns the rendering's appearance, which also keeps it on the MUI
 * palette instead of the package's brand colours.
 *
 * Delivered as a `<style>` element rather than a constructable stylesheet.
 * Both work wherever this can run — `adoptedStyleSheets` shipped alongside
 * custom elements in every engine (Chrome 73, Firefox 101, Safari 16.4), so a
 * runtime that can upgrade `<deck-rendering>` can always adopt. One path with
 * no capability branch beats two paths plus a fallback for a case that cannot
 * arise, and eight rules per deck is not worth a shared sheet object.
 *
 * Selectors mirror what the renderer actually emits — `seat__availability-*`,
 * not the `.seat-occupied` family in the package's own stylesheet, which
 * targets class names the model stopped producing. Availability variants are
 * omitted: this is a read-only view that never sets the `availability` prop.
 */

/** Marks the injected element so a repeat apply does not stack copies. */
const STYLE_MARK = 'data-deck-style';

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

/**
 * The rendering's rules for a palette, painted in deck order.
 *
 * Pure — no CSSOM, no DOM, nothing to memoise beyond the caller's own render.
 *
 * @param p Colours to paint with, typically derived from the MUI theme.
 * @returns CSS text for {@link applyDeckStyle}.
 */
export const mkDeckCss = (p: DeckPalette): string => `
    .vehicle-frame { background-color: ${p.frame}; border-radius: 4px; }
    .vehicle-deck  { fill: ${p.deck}; stroke: ${p.deckLine}; stroke-width: 2px; rx: 5px; }
    .seat .seat__base      { fill: ${p.seat}; stroke: ${p.seatLine}; stroke-width: 1px; rx: 5px; }
    .seat .seat__backrest  { fill: ${p.seatLine}; }
    .seat__text            { fill: ${p.label}; stroke: none; pointer-events: none; }
    .door                  { fill: ${p.seatLine}; stroke: ${p.seatLine}; stroke-width: 1px; }
    /* Read-only view — the element still emits \`select\`, but nothing consumes it. */
    .seat, .door { cursor: default; }
  `;

/**
 * Put the rendering's CSS on a shadow root, once.
 *
 * @param root Shadow root of a `<deck-rendering>` element.
 * @param css CSS from {@link mkDeckCss}.
 */
export function applyDeckStyle(root: ShadowRoot, css: string): void {
  if (root.querySelector(`style[${STYLE_MARK}]`)) return;
  const el = root.ownerDocument.createElement('style');
  el.setAttribute(STYLE_MARK, '');
  el.textContent = css;
  root.append(el);
}
