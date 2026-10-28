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
 * earlier capture, and so does unmounting the editor (the pane closed): a
 * continuation must not advance the URL of a row opened afterwards.
 *
 * @param {string} id - The editor's current `?selected=` id (incl. `NEW_SELECTION`).
 * @returns {() => IsCurrentSelection} `capture`: call at write start; its result
 *   is `false` once the id or organisation has changed since.
 */
export function useSelectionGuard(id: string): () => IsCurrentSelection {
  const { currentOrganisation } = useOrganisationsContext();
  const orgId = currentOrganisation?.id ?? null;
  const generation = useRef(0);

  // Bumped in the layout-effect cleanup — on every id/org change and on
  // unmount — so it lands before any passive effect or resumed continuation
  // can observe the new selection (or the closed pane).
  useLayoutEffect(
    () => () => {
      generation.current += 1;
    },
    [id, orgId]
  );

  return useCallback(() => {
    const started = generation.current;
    return () => generation.current === started;
  }, []);
}
