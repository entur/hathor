import { useEffect, useReducer, useState } from 'react';
import { Box, Divider, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import NetexId from '../../netex/NetexId.tsx';
import EditorRail from '../../../components/sidebar/EditorRail.tsx';
import { FormLayout, MetaRow } from '../../../components/FormLayout.tsx';
import SaveSuccessSnackbar from '../../../components/feedback/SaveSuccessSnackbar.tsx';
import SaveErrorSnackbar from '../../../components/feedback/SaveErrorSnackbar.tsx';
import { useDirtyFormBlock } from '../../../hooks/useDirtyFormBlock.ts';
import { useLiftEditorDirty } from '../../../hooks/useLiftEditorDirty.ts';
import { useCloseSliderParam } from '../../../hooks/useCloseSliderParam.ts';
import { useDeckPlanXml } from '../hooks/useDeckPlanXml.ts';
import { useDeckPlanSave } from '../hooks/useDeckPlanSave.ts';
import { DECK_PLAN_SELECTED_PARAM } from '../utils/deckPlanUrlParams.ts';
import DeckPlanForm from './DeckPlanForm.tsx';
import type { DeckPlan } from '../../vehicle-types/types/vehicleTypeTypes.ts';
import { useDeckPlanDeactivate } from '../hooks/useDeckPlanDeactivate.ts';

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

type FormState = { form: string; baseline: string };
type FormAction = { type: 'hydrate'; xml: string } | { type: 'edit'; xml: string };

function formReducer(state: FormState, action: FormAction): FormState {
  return action.type === 'hydrate'
    ? { form: action.xml, baseline: action.xml }
    : { ...state, form: action.xml };
}

/**
 * Editable sidebar for a DeckPlan, opened via `/deck-plans?selected=<id>`.
 * Fetches the NeTEx XML body on mount (the list query carries only id+name);
 * once hydrated, renders the {@link DeckPlanForm} textarea inside an
 * {@link EditorRail} view↔edit harness. Save POSTs the full XML to the
 * import endpoint via {@link useDeckPlanSave}, then `onSaved` refreshes
 * the list table.
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
  const [state, dispatch] = useReducer(formReducer, { form: '', baseline: '' });

  const id = deckPlan?.id ?? null;
  const { xml, loading, error: fetchError, refetch } = useDeckPlanXml(id);
  const { save, saving, error, clearError } = useDeckPlanSave();
  const { deactivate } = useDeckPlanDeactivate();
  const [deactivatedOK, setDeactivatedOK] = useState(false);

  // Hydrate (and drop to view) whenever a fresh XML body arrives for the current row.
  useEffect(() => {
    if (deckPlan && xml) {
      dispatch({ type: 'hydrate', xml });
      setMode(initialMode ?? 'view');
      setSavedAt(null);
      setRefreshError(null);
    }
  }, [initialMode, deckPlan, xml]);

  const isDirty = !!deckPlan && state.form !== state.baseline;
  useDirtyFormBlock(isDirty);
  useLiftEditorDirty(isDirty);

  const closeSlider = useCloseSliderParam(DECK_PLAN_SELECTED_PARAM);

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

  const handleSave = async () => {
    setRefreshError(null);
    const result = await save(state.form);
    if (result.error) return;
    dispatch({ type: 'hydrate', xml: state.form });
    setMode('view');
    try {
      await onSaved?.();
      setSavedAt(Date.now());
    } catch {
      setRefreshError(
        t('deckPlans.saveStaleList', 'Saved — but the list could not refresh; it may be stale.')
      );
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

  const name = deckPlan.name?.value?.trim();

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

      <FormLayout sx={{ mb: 2 }}>
        <MetaRow label={t('vehicleType.field.name', 'Name')}>
          <span data-testid="deck-plan-name-value">{name || ''}</span>
        </MetaRow>
      </FormLayout>

      <Stack data-testid="deck-plan-context">
        <DeckPlanForm
          value={state.form}
          onChange={next => dispatch({ type: 'edit', xml: next })}
          mode={mode}
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
      <EditorRail
        side={RAIL_SIDE}
        onCollapse={closeSlider}
        mode={mode}
        onEnterEdit={() => !deactivatedOK && setMode('edit')}
        onDeactivate={handleDeactivate}
        onCancelEdit={() => {
          dispatch({ type: 'hydrate', xml: state.baseline });
          setMode('view');
        }}
        onSave={handleSave}
        isDirty={isDirty}
        saving={saving}
      />
    </Box>
  );
}
