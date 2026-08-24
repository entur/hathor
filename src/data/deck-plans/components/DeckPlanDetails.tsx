import { useEffect, useReducer, useState } from 'react';
import { Box, Divider, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import NetexId from '../../netex/NetexId.tsx';
import EditorRail from '../../../components/sidebar/EditorRail.tsx';
import { FormLayout } from '../../../components/FormLayout.tsx';
import SaveSuccessSnackbar from '../../../components/feedback/SaveSuccessSnackbar.tsx';
import SaveErrorSnackbar from '../../../components/feedback/SaveErrorSnackbar.tsx';
import { useDirtyFormBlock } from '../../../hooks/useDirtyFormBlock.ts';
import { useLiftEditorDirty } from '../../../hooks/useLiftEditorDirty.ts';
import { useCloseSliderParam } from '../../../hooks/useCloseSliderParam.ts';
import { useSidebarCreateAdvance } from '../../../hooks/useSidebarCreateAdvance.ts';
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
import type { DeckPlan } from '../../vehicle-types/types/vehicleTypeTypes.ts';

const RAIL_SIDE = 'right' as const;
const BLANK_NAME = 'unnamed';

interface DeckPlanDetailsProps {
  /** Resolved row, or `null` when the deep-link `?selected=…` id was not found. */
  deckPlan: DeckPlan | null;
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
 * Renders the {@link DeckPlanForm} tab pair — Identity (name + description,
 * editable) and XML (the read-only NeTEx body, fetched separately because the
 * list query carries only id+name) — inside an {@link EditorRail} view↔edit
 * harness.
 *
 * Save takes one of two paths. A create fires the `createOrUpdateDeckPlan`
 * mutation, which mints the new NeTEx id the sidebar then advances to. An edit
 * patches the typed name/description into the fetched NeTEx document and POSTs
 * the whole body to the import endpoint — the only write path that preserves
 * deck geometry, which `DeckPlanInput` cannot carry.
 *
 * @param deckPlan Resolved row, or `null` for a not-found deep link.
 * @param onSaved Optional list refetch run after a successful save.
 * @param mode Optional initial mode ('view' or 'edit').
 */
export default function DeckPlanDetails({
  deckPlan,
  onSaved,
  mode: initialMode,
}: DeckPlanDetailsProps) {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const [mode, setMode] = useState<'view' | 'edit'>(initialMode ?? 'view');
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [refreshError, setRefreshError] = useState<string | null>(null);
  const [state, dispatch] = useReducer(formReducer, initialFormState);
  const { form } = state;

  const isCreate = !!deckPlan && !deckPlan.id;
  const id = isCreate ? null : (deckPlan?.id ?? null);
  const { xml, loading, error: fetchError, refetch } = useDeckPlanXml(id);
  const { save, saveGQL, saving, error, clearError } = useDeckPlanSave();
  const { deactivate } = useDeckPlanDeactivate();
  const [deactivatedOK, setDeactivatedOK] = useState(false);

  // Re-baseline whenever a different row (or the create factory) resolves.
  // hydrate() trims: Sobek re-pads <Text> on serialize, so an untrimmed
  // baseline would read as dirty the moment the editor opens (sobek#180).
  useEffect(() => {
    dispatch({ type: 'hydrate', dp: deckPlan });
    setMode(initialMode ?? (deckPlan && !deckPlan.id ? 'edit' : 'view'));
    setSavedAt(null);
    setRefreshError(null);
    setDeactivatedOK(false);
  }, [initialMode, deckPlan]);

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
    try {
      setDeactivatedOK(true);
      await onSaved?.();
      setRefreshError(null);
    } catch {
      setRefreshError(
        t(
          'deckPlan.deactivateStaleList',
          'Deactivated — but the list could not refresh; it may be stale.'
        )
      );
    }
  };

  const staleList = () =>
    setRefreshError(
      t('deckPlans.saveStaleList', 'Saved — but the list could not refresh; it may be stale.')
    );

  const handleSave = async () => {
    setRefreshError(null);
    if (isCreate) {
      const result = await saveGQL(form);
      if (result.error) return;

      // Blank id factory → a create. A successful save with no `newId` is a
      // Sobek invariant break: surfaced as a snackbar so the user can refresh.
      if (!result.newId) {
        setRefreshError(
          t('common.saveNoIdReturned', 'Saved, but no id was returned — please refresh.')
        );
        return;
      }

      setMode('view');
      // Re-baseline on the write, not on the refresh. The mutation has already
      // committed, so a failing list refetch must not strand the editor dirty —
      // collapsing would then offer to discard changes that are persisted.
      dispatch({ type: 'hydrate', dp: { ...form, id: result.newId } });
      try {
        await onSaved?.();
        // Advance `?selected=new` → `?selected=<newId>` only after the list
        // refetch has landed, so useUrlEditorSelection re-resolves into the
        // fresh row (not a transient "not found" between save and refetch).
        advanceCreated(result.newId);
        setSavedAt(Date.now()); // success only once the list is fresh
      } catch {
        staleList();
      }
      return;
    }

    // Edit — patch the identity fields into the fetched document so the deck
    // body survives the round-trip, then POST the whole thing.
    if (!deckPlan?.id) return;
    let patched: string;
    try {
      patched = patchDeckPlanXml(xml, deckPlan.id, form.name, form.description);
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
    try {
      await onSaved?.();
      setSavedAt(Date.now());
    } catch {
      staleList();
    }
  };

  if (!deckPlan) {
    const requestedId = searchParams.get(DECK_PLAN_SELECTED_PARAM);
    return (
      <>
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            {t('deckPlans.detailsTitle', 'Deck Plan Details')}
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {t('deckPlans.notFound', 'Deck plan not found')}
          </Typography>
          {requestedId && (
            <Typography variant="caption" color="text.disabled" sx={{ wordBreak: 'break-all' }}>
              {requestedId}
            </Typography>
          )}
        </Box>
        <EditorRail onCollapse={closeSlider} side={RAIL_SIDE} />
      </>
    );
  }

  // The title mirrors the typed name so it updates as the user edits — in
  // create mode the persisted `deckPlan.name` is the blank factory until save.
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
        {deckPlan.id && (
          <NetexId id={deckPlan.id} copy="onHover" size="small" sx={{ justifySelf: 'start' }} />
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

      <SaveErrorSnackbar error={error} onClose={clearError} />
      <SaveErrorSnackbar
        error={refreshError}
        severity="warning"
        onClose={() => setRefreshError(null)}
      />
      <SaveSuccessSnackbar
        open={savedAt !== null}
        message={t('deckPlans.saveSuccess', 'Deck plan saved')}
        onClose={() => setSavedAt(null)}
      />
      <SaveSuccessSnackbar
        open={deactivatedOK}
        message={t('deckPlan.deactivateSuccess', 'Deck plan deactivated')}
        onClose={closeSlider}
      />
      <EditorRail
        side={RAIL_SIDE}
        onCollapse={closeSlider}
        mode={mode}
        onEnterEdit={() => !deactivatedOK && setMode('edit')}
        onDeactivate={isCreate ? undefined : handleDeactivate}
        deactivateConfirmTitle={t('deckPlan.deactivateConfirmTitle', 'Deactivate deck plan?')}
        deactivateConfirmMessage={t(
          'deckPlan.deactivateConfirmMessage',
          'This deck plan will be deactivated.'
        )}
        deactivateConfirmActionLabel={t('common.deactivate', 'Deactivate')}
        onCancelEdit={() => {
          // Baseline, not the `deckPlan` prop: a save re-baselines here but
          // never re-commits the editor, so the prop is stale from then on.
          dispatch({ type: 'restore' });
          setMode('view');
        }}
        onSave={handleSave}
        isDirty={isDirty}
        saving={saving}
        // An edit patches the fetched document, so block save until the body is
        // here — otherwise patchDeckPlanXml throws a misleading "not found in
        // document" for what is really "not loaded yet". Create has no body.
        canSubmit={isCreate || (!loading && !!xml)}
      />
    </Box>
  );
}
