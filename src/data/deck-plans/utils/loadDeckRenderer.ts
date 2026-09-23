import type { DeckPlan } from '@opentrainticketing/netex-deckplan-editor';

/** Custom-element tag registered by the editor's web-component entry. */
export const DECK_RENDERING_TAG = 'deck-rendering';

/**
 * How long to wait for that registration before giving up. Generous — it is a
 * deadlock detector, not a performance budget; the bundle has already loaded by
 * the time the clock starts.
 */
export const TAG_DEFINE_MS = 10_000;

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
    .then(m => awaitTag().then(() => m.default))
    .catch(e => {
      pending = null;
      throw e;
    }));
}

/**
 * Wait for the tag, but fail rather than hang.
 *
 * `whenDefined` has no rejection path: a bundle that loads without registering
 * the element — tree-shaken side effect, upstream rename, a `customElements.get`
 * short-circuit against a half-initialised registry — leaves the promise
 * pending forever, and `useDeckRenderer` sits at `loading: true` with no error
 * to retry from. Racing a timer converts that silence into the failure the
 * caller already knows how to show.
 */
function awaitTag(): Promise<void> {
  let timer: ReturnType<typeof setTimeout>;
  const expiry = new Promise<never>((_, rej) => {
    timer = setTimeout(
      () => rej(new Error(`<${DECK_RENDERING_TAG}> was not registered within ${TAG_DEFINE_MS} ms`)),
      TAG_DEFINE_MS
    );
  });
  return Promise.race([customElements.whenDefined(DECK_RENDERING_TAG), expiry])
    .then(() => undefined)
    .finally(() => clearTimeout(timer));
}
