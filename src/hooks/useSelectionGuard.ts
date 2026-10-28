import { useCallback, useLayoutEffect, useMemo, useRef } from 'react';
import { useOrganisationsContext } from '../contexts/useOrganisationsContext.ts';

/** `true` while the selection a write started on is still the current one. */
export type IsCurrentSelection = () => boolean;

/** What a sidebar editor is showing: the `?selected=` id within an organisation. */
export interface Selection {
  id: string;
  orgId: string | null;
  /** `${orgId}|${id}` — equal keys are the same selection. */
  key: string;
}

/** {@link useSelectionGuard}'s result. */
export interface SelectionGuard {
  /** The current selection; editors reset their transient state when its `key` changes. */
  selection: Selection;
  /** Call at write start; the predicate is `false` once the selection changed since. */
  captureSelection: () => IsCurrentSelection;
}

/**
 * The identity of a selection: one key per organisation + id.
 *
 * @param {string | null} orgId - Current organisation id, or `null` when none is selected.
 * @param {string} id - The `?selected=` id (incl. `NEW_SELECTION`).
 * @returns {string} The selection key.
 */
export const selectionKeyOf = (orgId: string | null, id: string): string => `${orgId}|${id}`;

/**
 * Guard an editor's async write continuations against a selection change.
 * The sidebar editor stays mounted across `?selected=` changes, so a save,
 * create or deactivate started for record A can resume after the user moved
 * to B. Call `captureSelection` when a write starts; after every `await`
 * the predicate it returns must be `true` before the continuation touches
 * editor state, re-fetches the record or navigates (the create-advance).
 * Page state such as the list refresh is not the editor's and runs anyway.
 *
 * The selection is the id plus the current organisation. Any change — even a
 * round trip back to the same id, which resets the editor — invalidates every
 * earlier capture, and so does unmounting the editor (the pane closed): a
 * continuation must not advance the URL of a row opened afterwards. The same
 * identity is returned as `selection`, so the editor's own reset
 * ({@link useSelectionReset}) follows exactly the changes the guard does.
 *
 * @param {string} id - The editor's current `?selected=` id (incl. `NEW_SELECTION`).
 * @returns {SelectionGuard} The current `selection` and a stable `captureSelection`.
 */
export function useSelectionGuard(id: string): SelectionGuard {
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

  const captureSelection = useCallback(() => {
    const started = generation.current;
    return () => generation.current === started;
  }, []);

  const selection = useMemo(() => ({ id, orgId, key: selectionKeyOf(orgId, id) }), [id, orgId]);

  return { selection, captureSelection };
}
