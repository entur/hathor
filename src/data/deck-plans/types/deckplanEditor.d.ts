/**
 * Ambient types for the deck-plan editor's web-component entry.
 *
 * The package ships `dist/webcomponent/webcomponent.d.ts` but its `exports`
 * map has no `types` condition for `./webcomponent`, so `moduleResolution:
 * "bundler"` resolves the runtime file and nothing else. The map also blocks
 * deep imports, so the shipped declaration cannot be re-exported — the shape
 * is restated here instead, narrowed to what `loadDeckRenderer` uses.
 *
 * `DeckRenderingElement` is deliberately omitted: typing it drags in `vue`'s
 * `VueElementConstructor`, and the element is consumed through the DOM by tag
 * name rather than through the constructor.
 *
 * Remove this file if upstream adds a `types` condition for the subpath.
 */
declare module '@opentrainticketing/netex-deckplan-editor/webcomponent' {
  import type { DeckPlan } from '@opentrainticketing/netex-deckplan-editor';

  const wc: {
    /** Parse a NeTEx `PublicationDelivery` into the bundle's own model classes. */
    parseNeTEx: (xml: string) => DeckPlan[];
  };

  export default wc;
}
