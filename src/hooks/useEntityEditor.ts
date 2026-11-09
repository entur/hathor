import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { EditorRailProps } from '../components/sidebar/EditorRail.tsx';
import { useEditorOnPage } from '../components/sidebar/editorHost.ts';
import { useOrganisationsContext } from '../contexts/useOrganisationsContext.ts';
import { runDeactivate, runSave, type FlowCtx, type WriteResult } from './entityEditorFlow.ts';
import { useDirtyFormBlock } from './useDirtyFormBlock.ts';
import { useEntityDeactivate, type DeactivateRequest } from './useEntityDeactivate.ts';
import { useEntityRecord, type FetchById } from './useEntityRecord.ts';
import type { FormStateActions } from './useFormState.ts';
import { useLiftEditorDirty } from './useLiftEditorDirty.ts';

export type EditorMode = 'view' | 'edit';

/** Id a host routes to the create pane (`?selected=new`, `/<entity>/new`) — not a record id. */
export const NEW_SELECTION = 'new';

export interface EntityEditorConfig<T, F> {
  /** NeTEx id to edit; `''` is the create pane. */
  id: string;
  /** Ignored on a form page (`EditorHostContext`, #282): it opens in edit and stays there
   *  after a save or Cancel; only a deactivate leaves it, into View. */
  initialMode?: EditorMode;
  /** Open with the "saved" toast showing — a create re-mounted on its minted id. */
  initialSaved?: boolean;
  fetchById: FetchById<T>;
  /** The feature's `createFormState` binding (module-level, stable). */
  formState: FormStateActions<F, T>;
  /** Persist the form; never throws. `record` is the last read (null on create). */
  write: (form: F, record: T | null) => Promise<WriteResult>;
  /** The form as committed by a create that minted `newId`. */
  withNewId: (form: F, newId: string) => F;
  deactivateRequest: DeactivateRequest;
  /** Extra Save gate, AND'd with dirty + not saving: false while a required field is
   *  missing, or what the write needs has not loaded. Default: always. */
  canSubmit?: (form: F, isCreate: boolean) => boolean;
  /** Host list reload after a save or deactivate; rejects → stale-list warning. */
  onSaved?: () => Promise<void>;
  /** Host: collapse the editor. */
  onClose: () => void;
  /** Host: move the selection from the create pane to the new id. */
  onCreated: (newId: string) => void;
}

/** What a host (e.g. `useUrlEditorSelection`) hands an entity editor. */
export type EntityEditorHostProps = Pick<
  EntityEditorConfig<unknown, unknown>,
  'id' | 'initialMode' | 'initialSaved' | 'onSaved' | 'onClose' | 'onCreated'
>;

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
  /** Deactivated this visit, list reloaded or not: read-only for good. */
  isDeactivated: boolean;
  rail: Required<
    Pick<
      EditorRailProps,
      'onCollapse' | 'mode' | 'isDirty' | 'saving' | 'canSubmit' | 'onCancelEdit' | 'onSave'
    >
  > &
    Pick<EditorRailProps, 'onEnterEdit' | 'onDeactivate'>;
}

/**
 * The entity editor state machine shared by every editor, sidebar or form page: reads the
 * record by id, keeps the form and its baseline, and runs the canonical save /
 * cancel / deactivate ({@link runSave}, {@link runDeactivate}). Host-agnostic:
 * router I/O arrives as `onClose` / `onCreated`.
 *
 * A save or deactivate that outlives its editor or its org publishes nothing.
 *
 * @param {EntityEditorConfig<T, F>} cfg What the feature declares.
 * @returns {EntityEditor<T, F>} Editor state plus ready-made `EditorRail` props.
 */
export function useEntityEditor<T extends { id: string; version?: number | string }, F>(
  cfg: EntityEditorConfig<T, F>
): EntityEditor<T, F> {
  const { t } = useTranslation();
  const fs = cfg.formState;
  const isCreate = cfg.id === '';
  // A form page edits only: no View until a deactivate.
  const editOnly = useEditorOnPage();
  const [mode, setMode] = useState<EditorMode>(editOnly ? 'edit' : (cfg.initialMode ?? 'view'));
  const [state, setState] = useState(fs.initial);
  const [saving, setSaving] = useState(false);
  // True from Save until the post-save reads land; Edit stays hidden (an `editOnly`
  // host's fields read-only) so typing can't be overwritten by the re-read's re-baseline.
  const [settling, setSettling] = useState(false);
  // True while a deactivate runs: no second send; a form page's fields read-only.
  const [deactivating, setDeactivating] = useState(false);
  const [saved, setSaved] = useState(cfg.initialSaved ?? false);
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
  const canSubmit = cfg.canSubmit?.(state.form, isCreate) ?? true;
  useDirtyFormBlock(isDirty);
  useLiftEditorDirty(isDirty);

  // Bumped on unmount and org change; a run whose captured scope is gone is not
  // live. The create pane survives an org switch (its draft stays), so unmount
  // alone would let a create started under the old org publish into the new one.
  const orgId = useOrganisationsContext().currentOrganisation?.id;
  const scope = useRef(0);
  useEffect(() => () => void scope.current++, [orgId]);

  const flow = (): FlowCtx => {
    const started = scope.current;
    return {
      t,
      live: () => started === scope.current,
      toView: () => !editOnly && setMode('view'),
      reloadList: cfg.onSaved ?? (() => Promise.resolve()),
      warn: setWarning,
    };
  };

  const onSave = async () => {
    // Every Save (rail, footer, either leave dialog) comes through here.
    if (!canSubmit) return;
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

  const onDeactivate = (current: T) => async () => {
    setDeactivating(true);
    try {
      await runDeactivate({
        ...flow(),
        deactivate: () => deactivate(current),
        stale: () => setDeactivated('stale'),
        ok: () => setDeactivated('ok'),
      });
    } finally {
      setDeactivating(false);
    }
  };

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
    isDeactivated: deactivated !== null,
    rail: {
      onCollapse: cfg.onClose,
      // Deactivated is read-only on every host; a form page also reads only while a
      // save or deactivate settles, or a read (a Retry) is in flight: its hydrate overwrites.
      mode: deactivated || (editOnly && (settling || deactivating || loading)) ? 'view' : mode,
      isDirty,
      saving,
      canSubmit,
      // No record (first read failed) → nothing to edit or deactivate. While a
      // read is pending or failed, its eventual hydrate would overwrite edits.
      onEnterEdit:
        (isCreate || record) && !settling && !loading && !fetchError
          ? () => !deactivated && setMode('edit')
          : undefined,
      // Once deactivated, or while one is in flight, a second click would re-send the mutation.
      onDeactivate:
        record && !deactivated && !settling && !deactivating ? onDeactivate(record) : undefined,
      onCancelEdit: () => {
        // The committed baseline, not `record`: after a create whose list
        // reload failed there is no record yet, and the baseline holds the new id.
        setState(fs.restore);
        if (!editOnly) setMode('view');
      },
      onSave,
    },
  };
}
