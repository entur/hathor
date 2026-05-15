import type { Deck } from '@opentrainticketing/netex-deckplan-editor';
import React from 'react';

declare module 'react/jsx-runtime' {
  namespace JSX {
    interface IntrinsicElements {
      'deck-rendering': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        deck?: Deck;
        scale?: number;
      };
    }
  }
}
export {};
