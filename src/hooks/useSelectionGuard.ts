import { useCallback, useLayoutEffect, useRef } from 'react';
import { useOrganisationsContext } from '../contexts/useOrganisationsContext.ts';

/** `true` while the selection a write started on is still the current one. */
export type IsCurrentSelection = () => boolean;

/**
 * Guard an editor's async write continuations against a selection change.
 * The sidebar editor stays mounted across `?selected=` changes, so a save,
 * create or deactivate started for record A can resume after the user moved
 * to B. Call the returned `capture` when a write starts; after every `await`
 * the predicate it returns must be `true` before the continuation touches
 * editor state, re-fetches the record or navigates (the create-advance).
 * Page state such as the list refresh is not the editor's and runs anyway.
 *
 * The selection is the id plus the current organisation. Any change — even a
 * round trip back to the same id, which resets the editor — invalidates every
 * earlier capture.
 *
 * @param {string} id - The editor's current `?selected=` id (incl. `NEW_SELECTION`).
 * @returns {() => IsCurrentSelection} `capture`: call at write start; its result
 *   is `false` once the id or organisation has changed since.
 */
export function useSelectionGuard(id: string): () => IsCurrentSelection {
  const { currentOrganisation } = useOrganisationsContext();
  const orgId = currentOrganisation?.id ?? null;
  const generation = useRef(0);

  // Layout effect: bumped before any passive effect or resumed continuation
  // can observe the new selection.
  useLayoutEffect(() => {
    generation.current += 1;
  }, [id, orgId]);

  return useCallback(() => {
    const started = generation.current;
    return () => generation.current === started;
  }, []);
}
