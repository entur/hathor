import { useState, type ReactNode } from 'react';
import DiscardDialog from './DiscardDialog.tsx';

/**
 * Guard actions that would drop unsaved edits behind the {@link DiscardDialog}:
 * `ask(action)` runs it straight away on a clean form, or asks first on a dirty
 * one — Discard runs it, Save saves instead. The form page's Cancel asks through it.
 *
 * @param {boolean} isDirty the form has unsaved edits
 * @param {Record<A, (() => void) | undefined>} actions what each guarded action does
 * @param {() => void | Promise<void>} [onSave] offered in the dialog when set
 * @returns {{ ask: (action: A) => void, dialog: ReactNode }} the guard, and the dialog to render
 */
export function useDiscardConfirm<A extends string>(
  isDirty: boolean,
  actions: Record<A, (() => void) | undefined>,
  onSave?: () => void | Promise<void>
): { ask: (action: A) => void; dialog: ReactNode } {
  const [pending, setPending] = useState<A | null>(null);
  const ask = (action: A) => (isDirty ? setPending(action) : actions[action]?.());
  const dialog = (
    <DiscardDialog
      open={pending != null}
      onCancel={() => setPending(null)}
      onDiscard={() => {
        setPending(null);
        if (pending != null) actions[pending]?.();
      }}
      onSave={
        onSave
          ? async () => {
              setPending(null);
              await onSave();
            }
          : undefined
      }
    />
  );
  return { ask, dialog };
}
