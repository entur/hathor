import type { Deck } from '@opentrainticketing/netex-deckplan-editor';
import { useEffect, useRef } from 'react';

type DeckRenderingElement = HTMLElement & {
  deck?: Deck;
};

export const DeckPlanEditor = (props: { deck: Deck }) => {
  const deckRef = useRef<DeckRenderingElement | null>(null);
  useEffect(() => {
    if (deckRef.current) {
      // Set DOM property, not attribute
      deckRef.current.deck = props.deck;
    }
  }, [props.deck]);

  return <deck-rendering ref={deckRef} scale={20.0}></deck-rendering>;
};
