import { useEffect, useRef } from 'react';
import { NEW_SELECTION } from './useUrlEditorSelection.tsx';
import type { Selection } from './useSelectionGuard.ts';

/**
 * Whether a selection change is a create advancing to the id it just minted
 * (`new` → `<newId>`, same organisation): the one move that keeps the form
 * and its success snackbar.
 *
 * @param {Selection} prev - The selection moved from.
 * @param {Selection} next - The selection moved to.
 * @param {string | null} bridgeId - The id a create is advancing to, if any.
 * @returns {boolean} `true` for the create-advance.
 */
export const isCreateAdvance = (
  prev: Selection,
  next: Selection,
  bridgeId: string | null
): boolean =>
  prev.id === NEW_SELECTION &&
  bridgeId !== null &&
  next.id === bridgeId &&
  prev.orgId === next.orgId;

/**
 * Reset a sidebar editor whenever its selection (organisation + id, from
 * {@link useSelectionGuard}) changes. The editor outlives `?selected=` and
 * organisation changes, so transient state — mode, snackbars, warnings,
 * `refreshing` — must not carry over, even when a write continuation that
 * would have cleared it was invalidated by the move. `reset` runs after the
 * change commits and is told whether to keep the form: only for the
 * create-advance ({@link isCreateAdvance}); any other move must also drop the
 * previous selection's form, so neither its unsaved edits nor its dirty flag
 * outlive it.
 *
 * @param {Selection} selection - The guard's current selection.
 * @param {string | null} bridgeId - The id a create is advancing to, if any.
 * @param {(keepForm: boolean) => void} reset - Clears the editor's state; may be an inline closure.
 * @returns {void}
 */
export function useSelectionReset(
  selection: Selection,
  bridgeId: string | null,
  reset: (keepForm: boolean) => void
): void {
  const prevRef = useRef(selection);
  // No deps: compares keys on every commit, so `reset` may close over fresh state.
  useEffect(() => {
    const prev = prevRef.current;
    if (prev.key === selection.key) return;
    prevRef.current = selection;
    reset(isCreateAdvance(prev, selection, bridgeId));
  });
}
