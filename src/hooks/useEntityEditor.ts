import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { EditorRailProps } from '../components/sidebar/EditorRail.tsx';
import { useOrganisationsContext } from '../contexts/useOrganisationsContext.ts';
import { runDeactivate, runSave, type FlowCtx, type WriteResult } from './entityEditorFlow.ts';
import { useDirtyFormBlock } from './useDirtyFormBlock.ts';
import { useEntityDeactivate, type DeactivateRequest } from './useEntityDeactivate.ts';
import { useEntityRecord, type FetchById } from './useEntityRecord.ts';
import type { FormStateActions } from './useFormState.ts';
import { useLiftEditorDirty } from './useLiftEditorDirty.ts';

export type EditorMode = 'view' | 'edit';

export interface EntityEditorConfig<T, F> {
  /** NeTEx id to edit; `''` is the create pane. */
  id: string;
  initialMode?: EditorMode;
  fetchById: FetchById<T>;
  /** The feature's `createFormState` binding (module-level, stable). */
  formState: FormStateActions<F, T>;
  /** Persist the form; never throws. `record` is the last read (null on create). */
  write: (form: F, record: T | null) => Promise<WriteResult>;
  /** The form as committed by a create that minted `newId`. */
  withNewId: (form: F, newId: string) => F;
  deactivateRequest: DeactivateRequest;
  /** Host list reload after a save or deactivate; rejects → stale-list warning. */
  onSaved?: () => Promise<void>;
  /** Host: collapse the editor. */
  onClose: () => void;
  /** Host: move the selection from the create pane to the new id. */
  onCreated: (newId: string) => void;
}

export interface EntityEditor<T, F> {
  /** The id being edited; `''` is the create pane. */
  id: string;
  isCreate: boolean;
  record: T | null;
  loading: boolean;
  fetchError: string | null;
  refetch: () => Promise<T>;
  /** Not the create pane, the read finished, and Sobek returned nothing. */
  notFound: boolean;
  form: F;
  setForm: (form: F) => void;
  saveError: string | null;
  clearSaveError: () => void;
  warning: string | null;
  clearWarning: () => void;
  saved: boolean;
  clearSaved: () => void;
  /** Deactivated and the list reloaded. */
  deactivated: boolean;
  rail: Required<
    Pick<EditorRailProps, 'onCollapse' | 'mode' | 'isDirty' | 'saving' | 'onCancelEdit' | 'onSave'>
  > &
    Pick<EditorRailProps, 'onEnterEdit' | 'onDeactivate'>;
}

/**
 * The entity editor state machine shared by every sidebar editor: reads the
 * record by id, keeps the form and its baseline, and runs the canonical save /
 * cancel / deactivate ({@link runSave}, {@link runDeactivate}). Host-agnostic:
 * router I/O arrives as `onClose` / `onCreated`.
 *
 * A save or deactivate that outlives its editor (unmount = the selection moved
 * on) or its org publishes nothing. An org switch also resets mode and
 * snackbars to their initial state.
 *
 * @param cfg What the feature declares; see {@link EntityEditorConfig}.
 * @returns Editor state plus ready-made `EditorRail` props.
 */
export function useEntityEditor<T extends { id: string; version?: number | string }, F>(
  cfg: EntityEditorConfig<T, F>
): EntityEditor<T, F> {
  const { t } = useTranslation();
  const fs = cfg.formState;
  const isCreate = cfg.id === '';
  const initialMode = cfg.initialMode ?? 'view';
  const [mode, setMode] = useState<EditorMode>(initialMode);
  const [state, setState] = useState(fs.initial);
  const [saving, setSaving] = useState(false);
  // True from Save until the post-save reads land; Edit stays hidden so typing
  // can't be overwritten by the re-read's re-baseline.
  const [settling, setSettling] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  // 'stale' = deactivated, list not refreshed (yet): Edit blocked, no green.
  const [deactivated, setDeactivated] = useState<'ok' | 'stale' | null>(null);

  const {
    data: record,
    loading,
    error: fetchError,
    refetch,
  } = useEntityRecord(cfg.id, cfg.fetchById);
  const deactivate = useEntityDeactivate(cfg.deactivateRequest);

  // Re-baseline on every read of the record — the first one and each post-save re-read.
  useEffect(() => {
    if (record) setState(s => fs.hydrate(s, record));
  }, [record, fs]);

  const isDirty = fs.isDirty(state);
  useDirtyFormBlock(isDirty);
  useLiftEditorDirty(isDirty);

  // Bumped on unmount and org switch; a run whose captured scope is gone is not live.
  const scope = useRef(0);
  useEffect(() => () => void scope.current++, []);
  const orgId = useOrganisationsContext().currentOrganisation?.id;
  const shownOrg = useRef(orgId);
  useEffect(() => {
    if (shownOrg.current === orgId) return;
    shownOrg.current = orgId;
    scope.current++;
    setMode(initialMode);
    setDeactivated(null);
    setSaved(false);
    setWarning(null);
  }, [orgId, initialMode]);

  const flow = (): FlowCtx => {
    const started = scope.current;
    return {
      t,
      live: () => started === scope.current,
      toView: () => setMode('view'),
      reloadList: cfg.onSaved ?? (() => Promise.resolve()),
      warn: setWarning,
    };
  };

  const onSave = async () => {
    setSaveError(null);
    setWarning(null);
    setSettling(true);
    try {
      await runSave<F>({
        ...flow(),
        isCreate,
        form: state.form,
        write: async form => {
          setSaving(true);
          try {
            return await cfg.write(form, record);
          } finally {
            setSaving(false);
          }
        },
        withNewId: cfg.withNewId,
        rebase: form => setState(s => fs.rebase(s, form)),
        reread: refetch,
        fail: setSaveError,
        onCreated: cfg.onCreated,
        saved: () => setSaved(true),
      });
    } finally {
      setSettling(false);
    }
  };

  const onDeactivate = (current: T) => () =>
    runDeactivate({
      ...flow(),
      deactivate: () => deactivate(current),
      stale: () => setDeactivated('stale'),
      ok: () => setDeactivated('ok'),
    });

  return {
    id: cfg.id,
    isCreate,
    record,
    loading,
    fetchError,
    refetch,
    notFound: !isCreate && !record && !loading && !fetchError,
    form: state.form,
    setForm: form => setState(s => fs.edit(s, form)),
    saveError,
    clearSaveError: () => setSaveError(null),
    warning,
    clearWarning: () => setWarning(null),
    saved,
    clearSaved: () => setSaved(false),
    deactivated: deactivated === 'ok',
    rail: {
      onCollapse: cfg.onClose,
      mode,
      isDirty,
      saving,
      // No record (first read failed) → nothing to edit or deactivate.
      onEnterEdit:
        (isCreate || record) && !settling ? () => !deactivated && setMode('edit') : undefined,
      onDeactivate: record ? onDeactivate(record) : undefined,
      onCancelEdit: () => {
        // The committed baseline, not `record`: after a create whose list
        // reload failed there is no record yet, and the baseline holds the new id.
        setState(fs.restore);
        setMode('view');
      },
      onSave,
    },
  };
}
