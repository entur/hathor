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
 * Two delivery paths, because the two halves fail in different places:
 * `mkDeckStyle` runs during `DeckRendering`'s *render* (outside the mount
 * promise's `.catch()`), so `new CSSStyleSheet()` must not be allowed to throw
 * out of it; `applyDeckStyle` runs inside that promise. Where constructable
 * stylesheets are unavailable either way, the same CSS goes in as a `<style>`
 * element — "unstyled" would mean black seats on a black label, which reads as
 * a broken rendering rather than a degraded one.
 *
 * Selectors mirror what the renderer actually emits — `seat__availability-*`,
 * not the `.seat-occupied` family in the package's own stylesheet, which
 * targets class names the model stopped producing. Availability variants are
 * omitted: this is a read-only view that never sets the `availability` prop.
 */

/** Marks the injected fallback element so a repeat apply does not stack copies. */
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

/** A palette's CSS, plus the adoptable sheet where the runtime allows one. */
export interface DeckStyle {
  /** Constructable sheet, or `null` where the runtime has no CSSOM for it. */
  sheet: CSSStyleSheet | null;
  /** The same rules as text, for the `<style>` fallback. */
  css: string;
}

// One slot, not a Map: `useAppTheme` memoises the theme, so exactly one palette
// is live at a time and a growing map would just pin every palette the session
// ever visited, each with its own sheet.
let memo: { key: string; style: DeckStyle } | null = null;

/** The rendering's rules, painted in deck order. */
const deckCss = (p: DeckPalette) => `
    .vehicle-frame { background-color: ${p.frame}; border-radius: 4px; }
    .vehicle-deck  { fill: ${p.deck}; stroke: ${p.deckLine}; stroke-width: 2px; rx: 5px; }
    .seat .seat__base      { fill: ${p.seat}; stroke: ${p.seatLine}; stroke-width: 1px; rx: 5px; }
    .seat .seat__backrest  { fill: ${p.seatLine}; }
    .seat__text            { fill: ${p.label}; stroke: none; pointer-events: none; }
    .door                  { fill: ${p.seatLine}; stroke: ${p.seatLine}; stroke-width: 1px; }
    /* Read-only view — the element still emits \`select\`, but nothing consumes it. */
    .seat, .door { cursor: default; }
  `;

/** Constructable sheets are absent (or non-constructable) in older runtimes. */
const mkSheet = (css: string): CSSStyleSheet | null => {
  try {
    const sheet = new CSSStyleSheet();
    sheet.replaceSync(css);
    return sheet;
  } catch {
    return null;
  }
};

/**
 * Build (and memoise) the style for a palette.
 *
 * Constructable sheets are shareable, so every `<deck-rendering>` on the page
 * adopts one object per palette rather than parsing its own copy. Called
 * during render, so it never throws — a runtime without constructable sheets
 * yields `{ sheet: null }` and `applyDeckStyle` injects the CSS instead.
 *
 * @param p Colours to paint with, typically derived from the MUI theme.
 * @returns The palette's sheet (where possible) and its CSS text.
 */
export function mkDeckStyle(p: DeckPalette): DeckStyle {
  const key = Object.values(p).join('|');
  if (memo?.key === key) return memo.style;

  const css = deckCss(p);
  const style: DeckStyle = { sheet: mkSheet(css), css };

  memo = { key, style };
  return style;
}

/**
 * Put the style on a shadow root, once.
 *
 * Runs inside `DeckRendering`'s mount promise, so a throw here lands in that
 * component's `.catch()` and costs the whole rendering. Adopts where the root
 * supports it, and appends a `<style>` where it does not.
 *
 * @param root Shadow root of a `<deck-rendering>` element.
 * @param style Style from {@link mkDeckStyle}.
 */
export function applyDeckStyle(root: ShadowRoot, style: DeckStyle): void {
  if (style.sheet && root.adoptedStyleSheets) {
    if (root.adoptedStyleSheets.includes(style.sheet)) return;
    root.adoptedStyleSheets = [...root.adoptedStyleSheets, style.sheet];
    return;
  }

  if (root.querySelector(`style[${STYLE_MARK}]`)) return;
  const el = root.ownerDocument.createElement('style');
  el.setAttribute(STYLE_MARK, '');
  el.textContent = style.css;
  root.append(el);
}
