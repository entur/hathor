import { useEffect, useReducer, useState } from 'react';
import { Box, Divider, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import NetexId from '../../../components/NetexId.tsx';
import EditorRail from '../../../components/sidebar/EditorRail.tsx';
import { FormLayout } from '../../../components/FormLayout.tsx';
import FormLayoutSkeleton from '../../../components/FormLayoutSkeleton.tsx';
import SaveSuccessSnackbar from '../../../components/feedback/SaveSuccessSnackbar.tsx';
import SaveErrorSnackbar from '../../../components/feedback/SaveErrorSnackbar.tsx';
import { useDirtyFormBlock } from '../../../hooks/useDirtyFormBlock.ts';
import { useLiftEditorDirty } from '../../../hooks/useLiftEditorDirty.ts';
import { useCloseSliderParam } from '../../../hooks/useCloseSliderParam.ts';
import { useSidebarCreateAdvance } from '../../../hooks/useSidebarCreateAdvance.ts';
import { useEntityRecord } from '../../../hooks/useEntityRecord.ts';
import { fetchDeckPlan } from '../api/fetchDeckPlans.ts';
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
const SKELETON_ROWS = 2; // name + description

interface DeckPlanDetailsProps {
  /** NeTEx id to edit; `''` is the create pane. The editor reads the record itself. */
  id: string;
  /**
   * List-side refetch fired after a successful save or deactivate (table
   * freshness); a rejection shows a stale-list warning instead.
   */
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
 * Reads the record by id ({@link useEntityRecord}) and renders the
 * {@link DeckPlanForm} tab pair — Identity (name + description, editable) and
 * XML (the read-only NeTEx body, a separate by-id read) — inside an
 * {@link EditorRail} view↔edit harness.
 *
 * Save takes one of two paths. A create fires the `createOrUpdateDeckPlan`
 * mutation, which mints the new NeTEx id the sidebar then advances to. An edit
 * patches the typed name/description into the fetched NeTEx document and POSTs
 * the whole body to the import endpoint — the only write path that preserves
 * deck geometry, which `DeckPlanInput` cannot carry.
 *
 * @param id NeTEx id to edit; `''` for the create pane.
 * @param onSaved Optional list refetch run after a successful save.
 * @param mode Optional initial mode ('view' or 'edit').
 */
export default function DeckPlanDetails({ id, onSaved, mode: initialMode }: DeckPlanDetailsProps) {
  const { t } = useTranslation();
  const isCreate = id === '';
  const [mode, setMode] = useState<'view' | 'edit'>(initialMode ?? (isCreate ? 'edit' : 'view'));
  const [savedAt, setSavedAt] = useState<number | null>(null);
  // True from Save until the post-save re-read + list refresh land; Edit stays
  // hidden so typing can't be overwritten by the re-read's re-baseline.
  const [settling, setSettling] = useState(false);
  const [refreshError, setRefreshError] = useState<string | null>(null);
  const [state, dispatch] = useReducer(formReducer, initialFormState);
  const { form } = state;

  const {
    data: deckPlan,
    loading: recordLoading,
    error: recordError,
    refetch: refetchRecord,
  } = useEntityRecord(id, fetchDeckPlan);
  const { xml, loading, error: fetchError, refetch } = useDeckPlanXml(id);
  const { save, saveGQL, saving, error, clearError } = useDeckPlanSave();
  const { deactivate } = useDeckPlanDeactivate();
  // 'stale' = deactivated, list not refreshed (yet): Edit blocked, no green.
  const [deactivated, setDeactivated] = useState<'ok' | 'stale' | null>(null);

  // Re-baseline on every read of the record — the first one and each post-save
  // re-read. hydrate() trims: Sobek re-pads <Text> on serialize, so an
  // untrimmed baseline would read as dirty the moment the editor opens (sobek#180).
  useEffect(() => {
    if (deckPlan) dispatch({ type: 'hydrate', dp: deckPlan });
  }, [deckPlan]);

  const isDirty = isFormDirty(state);
  useDirtyFormBlock(isDirty);
  useLiftEditorDirty(isDirty);

  const closeSlider = useCloseSliderParam(DECK_PLAN_SELECTED_PARAM);
  const advanceCreated = useSidebarCreateAdvance(DECK_PLAN_SELECTED_PARAM);

  const handleDeactivate = async () => {
    if (!deckPlan) return;
    const result = await deactivate(deckPlan);
    if (result.error) {
      setRefreshError(result.error);
      return;
    }
    setMode('view');
    setDeactivated('stale'); // blocks Edit while the list refreshes
    try {
      await onSaved?.();
      setDeactivated('ok');
    } catch {
      setRefreshError(t('deckPlan.deactivateStaleList'));
    }
  };

  const staleList = () => setRefreshError(t('deckPlans.saveStaleList'));

  const handleSave = async () => {
    setRefreshError(null);
    if (isCreate) {
      const result = await saveGQL(form);
      if (result.error) return;

      // Blank id factory → a create. A successful save with no `newId` is a
      // Sobek invariant break: surfaced as a snackbar so the user can refresh.
      if (!result.newId) {
        setRefreshError(t('common.saveNoIdReturned'));
        return;
      }

      setMode('view');
      // Re-baseline on the write, not on the refresh. The mutation has already
      // committed, so a failing list refetch must not strand the editor dirty —
      // collapsing would then offer to discard changes that are persisted.
      dispatch({ type: 'hydrate', dp: { ...form, id: result.newId } });
      try {
        await onSaved?.();
        // ?selected=new → ?selected=<newId>: the editor re-mounts on the new id
        // and reads the created record.
        advanceCreated(result.newId);
        setSavedAt(Date.now());
      } catch {
        staleList();
      }
      return;
    }

    // Edit — patch the identity fields into the fetched document so the deck
    // body survives the round-trip, then POST the whole thing.
    if (!deckPlan) return;
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
    if (result.error) return;

    setMode('view');
    // Re-baseline on the write, for the same reason as the create branch above.
    dispatch({ type: 'hydrate', dp: { ...deckPlan, ...form } });
    // Re-pull the persisted body so the XML tab stops showing the pre-save
    // document. Fire-and-forget: `refetch` bumps a tick, it returns no promise.
    refetch();
    // "Saved" means the record was re-read. The list refresh runs alongside.
    const [reread, list] = await Promise.allSettled([refetchRecord(), onSaved?.()]);
    if (reread.status === 'rejected') return; // the body shows `recordError`
    if (list.status === 'rejected') staleList();
    else setSavedAt(Date.now());
  };

  if (recordLoading && !deckPlan) {
    return (
      <>
        <FormLayoutSkeleton
          ariaLabel={t('data.loading')}
          showTitle
          sections={[{ rowCount: SKELETON_ROWS, stacked: true }]}
        />
        <EditorRail onCollapse={closeSlider} side={RAIL_SIDE} />
      </>
    );
  }

  if (!isCreate && !deckPlan && !recordError) {
    return (
      <>
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            {t('deckPlans.detailsTitle')}
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {t('deckPlans.notFound')}
          </Typography>
          <Typography variant="caption" color="text.disabled" sx={{ wordBreak: 'break-all' }}>
            {id}
          </Typography>
        </Box>
        <EditorRail onCollapse={closeSlider} side={RAIL_SIDE} />
      </>
    );
  }

  // The title mirrors the typed name so it updates as the user edits — in
  // create mode there is no record until save.
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
        {!isCreate && <NetexId id={id} copy="onHover" size="small" sx={{ justifySelf: 'start' }} />}
      </FormLayout>
      <Divider sx={{ mb: 2 }} />

      {recordError ? (
        <Typography variant="body2" color="error" sx={{ py: 2 }}>
          {recordError}
        </Typography>
      ) : (
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
      )}

      <SaveErrorSnackbar error={error} onClose={clearError} />
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
        open={deactivated === 'ok'}
        message={t('deckPlan.deactivateSuccess')}
        onClose={closeSlider}
      />
      <EditorRail
        side={RAIL_SIDE}
        onCollapse={closeSlider}
        mode={mode}
        // No record (first read failed) → nothing to edit or deactivate.
        onEnterEdit={
          (isCreate || deckPlan) && !settling ? () => !deactivated && setMode('edit') : undefined
        }
        onDeactivate={deckPlan ? handleDeactivate : undefined}
        deactivateConfirmTitle={t('deckPlan.deactivateConfirmTitle')}
        deactivateConfirmMessage={t('deckPlan.deactivateConfirmMessage')}
        deactivateConfirmActionLabel={t('common.deactivate')}
        onCancelEdit={() => {
          // Restore the last baseline (post-save = the re-read record).
          dispatch({ type: 'restore' });
          setMode('view');
        }}
        onSave={() => {
          setSettling(true);
          return handleSave().finally(() => setSettling(false));
        }}
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
