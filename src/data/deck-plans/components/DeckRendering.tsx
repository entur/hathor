import { useEffect, useMemo, useRef, useState } from 'react';
import { Box, useTheme } from '@mui/material';
import type { Deck } from '@opentrainticketing/netex-deckplan-editor';
import { DECK_RENDERING_TAG, loadDeckRenderer } from '../utils/loadDeckRenderer.ts';
import { adoptDeckSheet, mkDeckSheet } from '../utils/deckRenderingStyles.ts';

/** Render scale in px per metre. A deck is ~26.4m × 2.8m at real-world size. */
export const DECK_SCALE = 12;

interface DeckRenderingProps {
  /** Deck to draw — must come from the renderer bundle's own `parseNeTEx`. */
  deck: Deck;
  /** px per metre; omitting it upstream collapses the SVG to 10×10. */
  scale?: number;
  /** Rotate 90° so the deck draws as a tall column instead of a wide strip. */
  vertical?: boolean;
  /** Forwarded to the host element for test targeting. */
  'data-testid'?: string;
}

/**
 * Read-only SVG rendering of a single deck, backed by the editor package's
 * `<deck-rendering>` custom element.
 *
 * The element is created and populated imperatively rather than written as
 * JSX. Vue renders custom elements in `connectedCallback`, and the component's
 * `stageSize` dereferences `deck.getBoundingBox()` on that first pass — so a
 * React-inserted element would throw before any effect could assign `deck`.
 * Creating it detached, assigning props, then inserting sidesteps that and
 * removes the need to augment `JSX.IntrinsicElements`.
 *
 * Renders nothing until the bundle has loaded; callers own the loading UI.
 */
export default function DeckRendering({
  deck,
  scale = DECK_SCALE,
  vertical = false,
  'data-testid': testId,
}: DeckRenderingProps) {
  const host = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);
  const { palette } = useTheme();

  // The package's own renderer styles never reach the shadow root, so hathor
  // supplies them — see `deckRenderingStyles`.
  const sheet = useMemo(
    () =>
      mkDeckSheet({
        frame: palette.background.default,
        deck: palette.background.paper,
        deckLine: palette.divider,
        seat: palette.action.selected,
        seatLine: palette.text.secondary,
        label: palette.text.primary,
      }),
    [palette]
  );

  useEffect(() => {
    const node = host.current;
    let live = true;
    loadDeckRenderer()
      .then(() => {
        if (!live || !node) return;
        const el = document.createElement(DECK_RENDERING_TAG);
        // Both before insertion: Vue renders in `connectedCallback`, so props
        // must be set by then, and adopting early avoids an unstyled flash.
        Object.assign(el, { deck, scale, vertical });
        if (el.shadowRoot) adoptDeckSheet(el.shadowRoot, sheet);
        node.replaceChildren(el);
      })
      .catch(() => {
        if (live) setFailed(true);
      });
    return () => {
      live = false;
      node?.replaceChildren();
    };
  }, [deck, scale, vertical, sheet]);

  if (failed) return null;
  return <Box ref={host} data-testid={testId} sx={{ lineHeight: 0 }} />;
}
