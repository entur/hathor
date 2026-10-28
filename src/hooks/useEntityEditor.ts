import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { createFormState, type FormState } from './useFormState.ts';
import { useDirtyFormBlock } from './useDirtyFormBlock.ts';
import { useSelectionGuard, type IsCurrentSelection } from './useSelectionGuard.ts';
import { useSelectionReset } from './useSelectionReset.ts';
import { NEW_SELECTION } from './useUrlEditorSelection.tsx';
import type { EntityRecord } from './useEntityRecord.ts';

const DEFAULT_MODE = 'view' as const;
const NO_ID_KEY = 'common.saveNoIdReturned',
  STALE_KEY = 'common.saveRecordStale';

/** A committed write, reported to the host so it can refresh what it shows. */
export type EntityWrite<R> = {
  type: 'saved' | 'created' | 'deactivated';
  id: string;
  /** The re-fetched record; `null` when it could not (or need not) be read back. */
  record: R | null;
};

/** What a feature's save / deactivate resolves to; a throw is treated as `{ error }`. */
type WriteResult = { newId?: string | null; error?: string | null };

/** {@link useEntityEditor}'s inputs. */
export interface EntityEditorOptions<R, F> {
  /** The record's netexId, or `NEW_SELECTION` for a create. */
  id: string;
  /** The by-id record ({@link useEntityRecord}) for `id`. */
  record: EntityRecord<R>;
  /** Map the record to a form; `null` → the blank create form. Treated as fixed. */
  toForm: (record: R | null) => F;
  /** Canonicalise a form before the dirty compare. Treated as fixed. */
  normalise?: (form: F) => F;
  /**
   * Mode on open and after every selection change (default `'view'`); re-read
   * at each reset. A host whose create opens in edit passes
   * `id === NEW_SELECTION ? 'edit' : mode`.
   */
  initialMode?: 'view' | 'edit';
  /**
   * Stamp a created id onto the submitted form (the post-create bridge, which
   * Cancel restores until the record lands). Required for any form whose id is
   * not a top-level `id` (e.g. `{ vehicle: { id } }`); default: the form unchanged.
   */
  withNewId?: (form: F, newId: string) => F;
  /** The feature's write; resolves `{ error }` on failure and `{ newId }` on a create. */
  save: (form: F) => Promise<WriteResult>;
  /** The feature's deactivate; omitted → no deactivate action. */
  deactivate?: (record: R) => Promise<{ error?: string | null }>;
  /** Whether the current form may be saved (default: always). */
  canSubmit?: (form: F) => boolean;
  /** Leave the editor (after a deactivate's success is dismissed). */
  onClose: () => void;
  /** Move the editor to the id a create just minted. */
  onCreated: (newId: string) => void;
  /** Fire-and-forget report of each committed write; never awaited. */
  onWritten?: (write: EntityWrite<R>) => void;
}

/** {@link useEntityEditor}'s result — everything an editor body and its rail need. */
export interface EntityEditorApi<F> {
  form: F;
  setForm: (form: F) => void;
  /** Whether there is a form to show: creating, `record.data` present, or the post-create bridge holds this id. */
  hasRecord: boolean;
  mode: 'view' | 'edit';
  /** `undefined` while unavailable: refreshing, loading, deactivated or already editing. */
  enterEdit?: () => void;
  cancel: () => void;
  save: () => Promise<void>;
  saving: boolean;
  isDirty: boolean;
  canSubmit: boolean;
  /** `undefined` while creating, without a record, editing, saving, refreshing, or once deactivated. */
  deactivate?: () => Promise<void>;
  saveError: string | null;
  clearSaveError: () => void;
  warning: string | null;
  clearWarning: () => void;
  savedOpen: boolean;
  closeSaved: () => void;
  deactivatedOpen: boolean;
  /** Dismiss the deactivated success and leave the editor (`onClose`). */
  closeDeactivated: () => void;
}

type FormAction<R, F> =
  | { type: 'hydrate'; src: R | null }
  | { type: 'edit'; form: F }
  | { type: 'restore' }
  | { type: 'commit'; form: F };

const errMsg = (err: unknown): string => (err instanceof Error ? err.message : String(err));

/** Run a write, folding a throw (sync or async) into `{ error }`. */
const settle = async <T extends WriteResult>(write: () => Promise<T>): Promise<WriteResult> => {
  try {
    return await write();
  } catch (err: unknown) {
    return { error: errMsg(err) };
  }
};

/** Call the host's `onWritten` without awaiting it or letting it throw into the editor. */
const report = <R>(cb: ((w: EntityWrite<R>) => void) | undefined, write: EntityWrite<R>): void => {
  try {
    const r: unknown = cb?.(write);
    if (r instanceof Promise) r.catch(() => {});
  } catch {
    // The host's failure is the host's to show.
  }
};

/**
 * Host-agnostic state for an entity editor: the form (hydrated from the
 * by-id `record`, re-baselined on each new `record.data`), view/edit mode and
 * the save / cancel / deactivate orchestration. No I/O, router or sidebar —
 * the host injects `save`, `deactivate`, `onCreated` (e.g. a URL advance) and
 * `onClose`, and gets each committed write back through `onWritten`.
 *
 * - Save (existing id): commit the submitted form (clean, view) → re-fetch the
 *   record → success, or the `common.saveRecordStale` warning.
 * - Create: commit the form with its new id → success → `onCreated(newId)`;
 *   `onWritten('created')` fires once the new id's record lands.
 * - Deactivate: no re-fetch; read-only success; dismissing it calls `onClose`.
 *
 * Every continuation is guarded by {@link useSelectionGuard}: once the
 * selection (org + id) moved or the editor unmounted it changes no state,
 * re-fetches nothing and skips `onCreated`, but still reports the committed
 * write to `onWritten` with `record: null`. Transient state resets on the same
 * key ({@link useSelectionReset}); the create-advance keeps form and success.
 *
 * @param {EntityEditorOptions<R, F>} opts - Record, form mapping and the host's write callbacks.
 * @returns {EntityEditorApi<F>} Form state, mode and the editor's actions.
 */
export function useEntityEditor<R, F>(opts: EntityEditorOptions<R, F>): EntityEditorApi<F> {
  const { id, record } = opts;
  const { t } = useTranslation();
  const toFormRef = useRef(opts.toForm);
  const normaliseRef = useRef(opts.normalise ?? ((f: F) => f));
  const actions = useMemo(
    () =>
      createFormState<F, R>({
        blank: toFormRef.current(null),
        formFromSource: src => toFormRef.current(src ?? null),
        normalise: f => normaliseRef.current(f),
      }),
    []
  );
  const reducer = useCallback(
    (state: FormState<F>, a: FormAction<R, F>): FormState<F> => {
      switch (a.type) {
        case 'hydrate':
          return actions.hydrate(state, a.src);
        case 'edit':
          return actions.edit(state, a.form);
        case 'restore':
          return actions.restore(state);
        case 'commit':
          return actions.commit(state, a.form);
      }
    },
    [actions]
  );
  const [state, dispatch] = useReducer(reducer, record.data, src =>
    actions.hydrate(actions.initial, src)
  );

  const [mode, setMode] = useState<'view' | 'edit'>(opts.initialMode ?? DEFAULT_MODE);
  const [saving, setSaving] = useState(false);
  // A committed save's record re-fetch is running; Edit is withheld until it ends.
  const [refreshing, setRefreshing] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [savedOpen, setSavedOpen] = useState(false);
  const [deactivated, setDeactivated] = useState(false);
  const [deactivatedOpen, setDeactivatedOpen] = useState(false);
  // The id a create is advancing to; keeps form + success across that one move.
  const [bridgeId, setBridgeId] = useState<string | null>(null);
  // A create whose `onWritten('created')` waits for the new id's first load.
  const pendingCreate = useRef<string | null>(null);
  const onWrittenRef = useRef(opts.onWritten);
  useEffect(() => {
    onWrittenRef.current = opts.onWritten;
  });

  const { selection, captureSelection } = useSelectionGuard(id);

  /** Report a pending create as unread (`record: null`) — its selection is gone. */
  const flushPendingCreate = useCallback(() => {
    const pending = pendingCreate.current;
    if (pending === null) return;
    pendingCreate.current = null;
    report(onWrittenRef.current, { type: 'created', id: pending, record: null });
  }, []);

  // Declared before the hydrate effect, so a reset and the next record landing
  // in one commit end with the record, not the blank form.
  useSelectionReset(selection, bridgeId, keepForm => {
    setMode(opts.initialMode ?? DEFAULT_MODE);
    setSaving(false);
    setRefreshing(false);
    setSaveError(null);
    setWarning(null);
    setDeactivated(false);
    setDeactivatedOpen(false);
    if (keepForm) return;
    flushPendingCreate();
    setSavedOpen(false);
    setBridgeId(null);
    dispatch({ type: 'hydrate', src: null });
  });

  // Baseline = Sobek's record, on open and after every re-fetch.
  useEffect(() => {
    if (!record.data) return;
    dispatch({ type: 'hydrate', src: record.data });
    setBridgeId(null);
  }, [record.data]);

  // The created record's first load settled: report it once (`null` if it failed).
  useEffect(() => {
    if (pendingCreate.current !== id || record.loading) return;
    if (record.data === null && record.error === null && !record.notFound) return;
    pendingCreate.current = null;
    report(onWrittenRef.current, { type: 'created', id, record: record.data });
  }, [id, record.data, record.error, record.notFound, record.loading]);

  useEffect(() => flushPendingCreate, [flushPendingCreate]);

  const isDirty = actions.isDirty(state);
  useDirtyFormBlock(isDirty);

  const finishCreate = (isCurrent: IsCurrentSelection, submitted: F, newId: string | null) => {
    if (!newId) {
      if (isCurrent()) setWarning(t(NO_ID_KEY));
      return;
    }
    if (!isCurrent()) {
      report(onWrittenRef.current, { type: 'created', id: newId, record: null });
      return;
    }
    const bridged = opts.withNewId ? opts.withNewId(submitted, newId) : submitted;
    dispatch({ type: 'commit', form: bridged });
    setBridgeId(newId);
    setMode('view');
    setSavedOpen(true);
    pendingCreate.current = newId;
    opts.onCreated(newId);
  };

  const finishSave = async (isCurrent: IsCurrentSelection, submitted: F) => {
    if (!isCurrent()) {
      report(onWrittenRef.current, { type: 'saved', id, record: null });
      return;
    }
    dispatch({ type: 'commit', form: submitted });
    setMode('view');
    setRefreshing(true);
    // A reload that resolves nothing (the record is gone) is a failed reload.
    const fresh = await record.refetch().catch(() => null);
    const current = isCurrent();
    if (current) {
      setRefreshing(false);
      if (fresh !== null) setSavedOpen(true);
      else setWarning(t(STALE_KEY));
    }
    report(onWrittenRef.current, { type: 'saved', id, record: current ? fresh : null });
  };

  const save = async (): Promise<void> => {
    const isCurrent = captureSelection();
    const submitted = state.form;
    setSaveError(null);
    setWarning(null);
    setSaving(true);
    const result = await settle(() => opts.save(submitted));
    if (isCurrent()) setSaving(false);
    if (result.error) {
      if (isCurrent()) setSaveError(result.error);
      return;
    }
    if (id === NEW_SELECTION) finishCreate(isCurrent, submitted, result.newId ?? null);
    else await finishSave(isCurrent, submitted);
  };

  const target = record.data;
  const deactivateWrite = opts.deactivate;
  // Withheld in edit and across a write: the rail only offers it in view mode,
  // and a deactivate racing a save's re-fetch would act on a stale version.
  const deactivateAvailable =
    id !== NEW_SELECTION && !deactivated && mode !== 'edit' && !saving && !refreshing;
  const deactivate =
    !deactivateAvailable || !target || !deactivateWrite
      ? undefined
      : async (): Promise<void> => {
          const isCurrent = captureSelection();
          const result = await settle(() => deactivateWrite(target));
          if (result.error) {
            if (isCurrent()) setWarning(result.error);
            return;
          }
          if (isCurrent()) {
            setMode('view');
            setDeactivated(true);
            setDeactivatedOpen(true);
          }
          report(onWrittenRef.current, { type: 'deactivated', id, record: null });
        };

  const editAvailable = !refreshing && !record.loading && !deactivated && mode !== 'edit';

  return {
    form: state.form,
    hasRecord: id === NEW_SELECTION || record.data !== null || bridgeId === id,
    setForm: useCallback((form: F) => dispatch({ type: 'edit', form }), []),
    mode,
    enterEdit: editAvailable ? () => setMode('edit') : undefined,
    cancel: () => {
      dispatch({ type: 'restore' });
      setMode('view');
    },
    save,
    saving,
    isDirty,
    canSubmit: opts.canSubmit ? opts.canSubmit(state.form) : true,
    deactivate,
    saveError,
    clearSaveError: () => setSaveError(null),
    warning,
    clearWarning: () => setWarning(null),
    savedOpen,
    closeSaved: () => setSavedOpen(false),
    deactivatedOpen,
    closeDeactivated: () => {
      setDeactivatedOpen(false);
      opts.onClose();
    },
  };
}
