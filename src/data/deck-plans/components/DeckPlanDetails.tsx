import { useEffect, useReducer, useState } from 'react';
import { Box, Divider, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import NetexId from '../../netex/NetexId.tsx';
import EditorRail from '../../../components/sidebar/EditorRail.tsx';
import EditorRecordGate from '../../../components/sidebar/EditorRecordGate.tsx';
import { FormLayout } from '../../../components/FormLayout.tsx';
import FormLayoutSkeleton from '../../../components/FormLayoutSkeleton.tsx';
import SaveSuccessSnackbar from '../../../components/feedback/SaveSuccessSnackbar.tsx';
import SaveErrorSnackbar from '../../../components/feedback/SaveErrorSnackbar.tsx';
import { useDirtyFormBlock } from '../../../hooks/useDirtyFormBlock.ts';
import { useLiftEditorDirty } from '../../../hooks/useLiftEditorDirty.ts';
import { useCloseSliderParam } from '../../../hooks/useCloseSliderParam.ts';
import { useSidebarCreateAdvance } from '../../../hooks/useSidebarCreateAdvance.ts';
import { useEntityRecord } from '../../../hooks/useEntityRecord.ts';
import { useSelectionGuard } from '../../../hooks/useSelectionGuard.ts';
import { useSelectionReset } from '../../../hooks/useSelectionReset.ts';
import { succeeds } from '../../../utils/succeeds.ts';
import { NEW_SELECTION } from '../../../hooks/useUrlEditorSelection.tsx';
import { fetchDeckPlanById } from '../api/fetchDeckPlans.ts';
import { useDeckPlanXml } from '../hooks/useDeckPlanXml.ts';
import { useDeckPlanSave } from '../hooks/useDeckPlanSave.ts';
import { useDeckPlanDeactivate } from '../hooks/useDeckPlanDeactivate.ts';
import { DECK_PLAN_SELECTED_PARAM } from '../utils/deckPlanUrlParams.ts';
import { patchDeckPlanXml } from '../utils/patchDeckPlanXml.ts';
import {
  edit,
  hydrate,
  initialFormState,
  isDirty as isFormDirty,
  restore,
  type FormState,
} from '../stores/deckPlanFormState.ts';
import DeckPlanForm from './DeckPlanForm.tsx';
import type { DeckPlan } from '../types/deckPlanTypes.ts';

const RAIL_SIDE = 'right' as const;
const BLANK_NAME = 'unnamed';
const SKELETON_ROWS = 2;
/** Create pane's starting form. */
const EMPTY_DECK_PLAN: DeckPlan = { id: '' };

interface DeckPlanDetailsProps {
  /** DeckPlan netexId to load, or `NEW_SELECTION` for the create pane. */
  id: string;
  /** List-side refetch fired after a successful save (table freshness). */
  onSaved?: () => Promise<void>;
  /** Initial mode ('view' or 'edit'). */
  mode?: 'view' | 'edit';
}

type FormAction =
  | { type: 'hydrate'; dp: DeckPlan | null }
  | { type: 'edit'; form: DeckPlan }
  | { type: 'restore' };

function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case 'hydrate':
      return hydrate(state, action.dp);
    case 'edit':
      return edit(state, action.form);
    case 'restore':
      return restore(state);
  }
}

/**
 * Editable sidebar for a DeckPlan, opened via `/deck-plans?selected=<id>`.
 * Loads name + description from Sobek by id ({@link useEntityRecord}) and
 * renders the {@link DeckPlanForm} tab pair — Identity (name + description,
 * editable) and XML (the read-only NeTEx body, fetched separately by
 * {@link useDeckPlanXml}) — inside an {@link EditorRail} view↔edit harness.
 * Stays mounted across `?selected=` changes, resetting itself whenever the
 * id moves.
 *
 * Save takes one of two paths. A create fires the `createOrUpdateDeckPlan`
 * mutation, which mints the new NeTEx id the sidebar then advances to. An edit
 * patches the typed name/description into the fetched NeTEx document and POSTs
 * the whole body to the import endpoint — the only write path that preserves
 * deck geometry, which `DeckPlanInput` cannot carry.
 *
 * @param {string} id DeckPlan netexId, or `NEW_SELECTION` for the create pane.
 * @param {() => Promise<void>} [onSaved] Optional list refetch run after a successful save.
 * @param {'view' | 'edit'} [mode] Optional initial mode.
 * @returns {JSX.Element} The editor, its loading skeleton, or the load-error / not-found body.
 */
export default function DeckPlanDetails({ id, onSaved, mode: initialMode }: DeckPlanDetailsProps) {
  const { t } = useTranslation();
  const isCreate = id === NEW_SELECTION;
  const defaultMode = initialMode ?? (isCreate ? 'edit' : 'view');
  const [mode, setMode] = useState<'view' | 'edit'>(defaultMode);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [refreshError, setRefreshError] = useState<string | null>(null);
  const [state, dispatch] = useReducer(formReducer, initialFormState);
  const { form } = state;

  const record = useEntityRecord(isCreate ? null : id, fetchDeckPlanById);
  const { xml, loading, error: fetchError, refetch } = useDeckPlanXml(isCreate ? null : id);
  const { save, saveGQL, saving } = useDeckPlanSave();
  const { deactivate } = useDeckPlanDeactivate();
  // The current selection's save failure — set from the guarded result only.
  const [saveError, setSaveError] = useState<string | null>(null);
  const [deactivatedOK, setDeactivatedOK] = useState(false);
  // A committed write's continuation (list refresh, record re-fetch,
  // create-advance) is running; Edit is withheld until it ends.
  const [refreshing, setRefreshing] = useState(false);

  // Once the selection moved (see useSelectionGuard), a write continuation
  // leaves editor state, the record re-fetch and the create-advance alone. The
  // list refresh (`onSaved`) is page state: it runs for every committed write.
  const { selection, captureSelection } = useSelectionGuard(id);

  // The editor outlives `?selected=` and organisation changes: reset on the
  // guard's selection, so state an invalidated continuation never cleared
  // (`refreshing`) can't outlive it. Only a create advancing to its new id
  // (`bridgeId`) keeps its form and success snackbar.
  const [bridgeId, setBridgeId] = useState<string | null>(null);
  useSelectionReset(selection, bridgeId, keepForm => {
    setMode(defaultMode);
    setRefreshError(null);
    setDeactivatedOK(false);
    setRefreshing(false);
    setSaveError(null);
    if (keepForm) return;
    setSavedAt(null);
    setBridgeId(null);
    dispatch({ type: 'hydrate', dp: EMPTY_DECK_PLAN });
  });

  // Baseline = Sobek's record, on open and after every post-save re-fetch.
  // hydrate() trims: Sobek re-pads <Text> on serialize, so an untrimmed
  // baseline would read as dirty the moment the editor opens (sobek#180).
  useEffect(() => {
    if (!record.data) return;
    dispatch({ type: 'hydrate', dp: record.data });
    setBridgeId(null);
  }, [record.data]);

  const isDirty = isFormDirty(state);
  useDirtyFormBlock(isDirty);
  useLiftEditorDirty(isDirty);

  const closeSlider = useCloseSliderParam(DECK_PLAN_SELECTED_PARAM);
  const advanceCreated = useSidebarCreateAdvance(DECK_PLAN_SELECTED_PARAM);

  const handleDeactivate = async () => {
    if (!record.data) return;
    const isCurrent = captureSelection();
    const result = await deactivate(record.data);
    if (result.error) {
      if (isCurrent()) setRefreshError(result.error);
      return;
    }
    if (isCurrent()) {
      setMode('view');
      setDeactivatedOK(true);
    }
    try {
      await onSaved?.();
      if (isCurrent()) setRefreshError(null);
    } catch {
      if (isCurrent()) setRefreshError(t('deckPlan.deactivateStaleList'));
    }
  };

  const staleList = () => setRefreshError(t('deckPlans.saveStaleList'));

  const handleSave = async () => {
    const isCurrent = captureSelection();
    setRefreshError(null);
    setSaveError(null);
    if (isCreate) {
      const result = await saveGQL(form);
      if (result.error) {
        if (isCurrent()) setSaveError(result.error);
        return;
      }

      // Blank id factory → a create. A successful save with no `newId` is a
      // Sobek invariant break: surfaced as a snackbar so the user can refresh.
      if (!result.newId) {
        if (isCurrent()) setRefreshError(t('common.saveNoIdReturned'));
        return;
      }

      if (isCurrent()) {
        setMode('view');
        setRefreshing(true);
        // Re-baseline on the write, not on the refresh. The mutation has already
        // committed, so a failing list refetch must not strand the editor dirty —
        // collapsing would then offer to discard changes that are persisted.
        dispatch({ type: 'hydrate', dp: { ...form, id: result.newId } });
      }
      try {
        const listOk = await succeeds(() => onSaved?.());
        if (!isCurrent()) return;
        if (!listOk) {
          staleList();
          return;
        }
        // Advance `?selected=new` → `?selected=<newId>`; the editor then
        // fetches the created record by id.
        setBridgeId(result.newId);
        advanceCreated(result.newId);
        setSavedAt(Date.now()); // success only once the list is fresh
      } finally {
        if (isCurrent()) setRefreshing(false);
      }
      return;
    }

    // Edit — patch the identity fields into the fetched document so the deck
    // body survives the round-trip, then POST the whole thing.
    // The body the hook holds is the last one that arrived, not necessarily the
    // current one: a post-save refetch that failed leaves the pre-save document
    // there, and POSTing it back would resurrect what the save replaced. The
    // save button is already disabled for this, so reaching here means some
    // other submit path did — fail loud rather than write the wrong document.
    if (fetchError) {
      setRefreshError(fetchError);
      return;
    }
    let patched: string;
    try {
      patched = patchDeckPlanXml(xml, id, form.name, form.description);
    } catch (e) {
      setRefreshError(e instanceof Error ? e.message : String(e));
      return;
    }
    const result = await save(patched);
    if (result.error) {
      if (isCurrent()) setSaveError(result.error);
      return;
    }

    if (isCurrent()) {
      setMode('view');
      setRefreshing(true);
      // Re-baseline on the write, for the same reason as the create branch above
      // — a bridge until the re-fetched record re-hydrates it.
      dispatch({ type: 'hydrate', dp: { ...form, id } });
      // Re-pull the persisted body so the XML tab stops showing the pre-save
      // document. Fire-and-forget: `refetch` bumps a tick, it returns no promise.
      refetch();
    }
    try {
      // The record re-fetch and the list refresh run concurrently, each
      // whatever the other's outcome.
      const [recordOk, listOk] = await Promise.all([
        !isCurrent() || succeeds(record.refetch),
        succeeds(() => onSaved?.()),
      ]);
      if (!isCurrent()) return;
      if (!recordOk || !listOk) {
        staleList();
        return;
      }
      setSavedAt(Date.now());
    } finally {
      if (isCurrent()) setRefreshing(false);
    }
  };

  // Until Sobek's record lands, the post-create bridge form stays up;
  // otherwise skeleton, the load error, or not-found.
  const hasRecord = isCreate || record.data !== null || bridgeId === id;

  if (!hasRecord) {
    return (
      <EditorRecordGate
        title={t('deckPlans.detailsTitle')}
        notFoundLabel={t('deckPlans.notFound')}
        id={id}
        error={record.error}
        notFound={record.notFound}
        skeleton={
          <FormLayoutSkeleton
            ariaLabel={t('data.loading')}
            showTitle
            sections={[{ rowCount: SKELETON_ROWS }]}
          />
        }
        onCollapse={closeSlider}
        side={RAIL_SIDE}
      />
    );
  }

  // The title mirrors the typed name so it updates as the user edits — in
  // create mode there is no persisted name until save.
  const name = form.name?.value?.trim();

  return (
    <Box sx={{ p: 2, height: '100%', overflowY: 'auto', boxSizing: 'border-box' }}>
      <FormLayout sx={{ mb: 1 }}>
        <Typography
          variant="h6"
          noWrap
          title={name || undefined}
          data-testid="deck-plan-details-title"
          sx={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis' }}
        >
          {name || (
            <>
              {'[ '}
              <Box
                component="span"
                sx={{
                  color: 'text.disabled',
                  fontStyle: 'italic',
                  fontWeight: 400,
                  letterSpacing: '0.02em',
                }}
              >
                {BLANK_NAME}
              </Box>
              {' ]'}
            </>
          )}
        </Typography>
        {form.id && (
          <NetexId id={form.id} copy="onHover" size="small" sx={{ justifySelf: 'start' }} />
        )}
      </FormLayout>
      <Divider sx={{ mb: 2 }} />

      <Stack data-testid="deck-plan-context">
        <DeckPlanForm
          value={form}
          onChange={next => dispatch({ type: 'edit', form: next })}
          mode={mode}
          isCreate={isCreate}
          xml={xml}
          loading={loading}
          fetchError={fetchError}
          onRetry={refetch}
        />
      </Stack>

      {/* The guarded result, not the hook's raw `error`: a late failure for
          the previous selection must not surface here. */}
      <SaveErrorSnackbar error={saveError} onClose={() => setSaveError(null)} />
      <SaveErrorSnackbar
        error={refreshError}
        severity="warning"
        onClose={() => setRefreshError(null)}
      />
      <SaveSuccessSnackbar
        open={savedAt !== null}
        message={t('deckPlans.saveSuccess')}
        onClose={() => setSavedAt(null)}
      />
      <SaveSuccessSnackbar
        open={deactivatedOK}
        message={t('deckPlan.deactivateSuccess')}
        onClose={closeSlider}
      />
      <EditorRail
        side={RAIL_SIDE}
        onCollapse={closeSlider}
        mode={mode}
        // No Edit while a committed write's refreshes run or the record
        // (re-)loads: the re-hydrate (or create-advance) would wipe what the
        // user types.
        onEnterEdit={
          refreshing || record.loading ? undefined : () => !deactivatedOK && setMode('edit')
        }
        onDeactivate={isCreate ? undefined : handleDeactivate}
        deactivateConfirmTitle={t('deckPlan.deactivateConfirmTitle')}
        deactivateConfirmMessage={t('deckPlan.deactivateConfirmMessage')}
        deactivateConfirmActionLabel={t('common.deactivate')}
        onCancelEdit={() => {
          // Baseline = the re-fetched record, or the submitted values if that
          // re-fetch failed.
          dispatch({ type: 'restore' });
          setMode('view');
        }}
        onSave={handleSave}
        isDirty={isDirty}
        saving={saving}
        // An edit patches the fetched document, so block save until the body is
        // here — otherwise patchDeckPlanXml throws a misleading "not found in
        // document" for what is really "not loaded yet". `fetchError` blocks it
        // too: the body may be present but stale (see handleSave). Create has
        // no body.
        canSubmit={isCreate || (!loading && !fetchError && !!xml)}
      />
    </Box>
  );
}
