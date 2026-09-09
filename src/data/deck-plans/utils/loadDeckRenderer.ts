import type { DeckPlan } from '@opentrainticketing/netex-deckplan-editor';

/** Custom-element tag registered by the editor's web-component entry. */
export const DECK_RENDERING_TAG = 'deck-rendering';

/** The slice of the entry's default export we depend on. */
export interface DeckRendererModule {
  parseNeTEx: (xml: string) => DeckPlan[];
}

let pending: Promise<DeckRendererModule> | null = null;

/**
 * Load the deck-renderer bundle once per session and resolve once
 * `<deck-rendering>` is upgradeable.
 *
 * The specifier is a literal so Vite code-splits it: Vue is bundled into that
 * entry, and keeping it in its own chunk means only `/deck-plans` pays for it.
 * Registering the element is an import side effect, guarded upstream by
 * `customElements.get`.
 *
 * `parseNeTEx` is re-exported from the same bundle deliberately — the `Deck`
 * instances it returns are matched against that bundle's classes with
 * `instanceof`, so parsing through any other copy of the models yields decks
 * that render without seats.
 *
 * Memoised: concurrent callers share one fetch. A failed load clears the memo
 * so a later mount can retry.
 *
 * @returns Resolves with the module once the custom element is defined.
 */
export function loadDeckRenderer(): Promise<DeckRendererModule> {
  return (pending ??= import('@opentrainticketing/netex-deckplan-editor/webcomponent')
    .then(m => customElements.whenDefined(DECK_RENDERING_TAG).then(() => m.default))
    .catch(e => {
      pending = null;
      throw e;
    }));
}
