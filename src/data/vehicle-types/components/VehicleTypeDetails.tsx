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
import { fetchVehicleType } from '../api/fetchVehicleTypes.ts';
import { useVehicleTypeSave } from '../hooks/useVehicleTypeSave.ts';
import { VEHICLE_TYPE_SELECTED_PARAM } from '../utils/vehicleTypeUrlParams.ts';
import VehicleTypeForm from './VehicleTypeForm.tsx';
import type { VehicleType } from '../types/vehicleTypeTypes.ts';
import { useVehicleTypeDeactivate } from '../hooks/useVehicleTypeDeactivate.ts';
import { useCodeValues } from '../../code-values/hooks/useCodeValues.ts';
import { EMISSION_STANDARD } from '../../code-values/types/codeValueTypes.ts';

const BLANK_NAME = 'unnamed';
const RAIL_SIDE = 'right' as const;
const EMPTY_VTYPE: VehicleType = { id: '', version: 0 };
const SKELETON_ROWS = 8;

/**
 * Coerce flag booleans so a Switch's `false` (off) compares equal to an absent
 * baseline (a null-backed flag projects to `undefined`). Without this, toggling
 * a null-baseline `lowFloor`/`selfPropelled` on then off reads as dirty.
 */
const normalizeForDirty = (vt: VehicleType): VehicleType => ({
  ...vt,
  lowFloor: vt.lowFloor || undefined,
  selfPropelled: vt.selfPropelled || undefined,
});

interface VehicleTypeDetailsProps {
  /** NeTEx id to edit; `''` is the create pane. The editor reads the record itself. */
  id: string;
  /**
   * List-side refetch fired after a successful save or deactivate so the row
   * on `/vehicle-types` is fresh before the success snackbar appears; a
   * rejection shows a stale-list warning instead. Optional.
   */
  onSaved?: () => Promise<void>;

  mode?: 'view' | 'edit';
}

type FormState = { form: VehicleType; baseline: VehicleType };
type FormAction = { type: 'hydrate'; row: VehicleType } | { type: 'edit'; form: VehicleType };

function formReducer(state: FormState, action: FormAction): FormState {
  return action.type === 'hydrate'
    ? { form: action.row, baseline: action.row }
    : { ...state, form: action.form };
}

/**
 * Editable sidebar for a VehicleType, opened via `/vehicle-types?selected=<id>`.
 * Reads the record by id ({@link useEntityRecord}) into a tabbed
 * {@link VehicleTypeForm}. The full {@link EditorRail} drives view↔edit; save
 * fires the `createOrUpdateVehicleType` mutation via {@link useVehicleTypeSave},
 * then re-reads the record (the new baseline) and runs `onSaved` to refresh
 * the list table.
 *
 * @param id NeTEx id to edit; `''` for the create pane.
 * @param onSaved Optional list refetch run after a successful save (table freshness).
 * @param mode Optional initial mode ('view' or 'edit').
 */
export default function VehicleTypeDetails({
  id,
  onSaved,
  mode: initialMode,
}: VehicleTypeDetailsProps) {
  const { t } = useTranslation();
  const isCreate = id === '';
  const [mode, setMode] = useState<'view' | 'edit'>(initialMode ?? 'view');
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [refreshError, setRefreshError] = useState<string | null>(null);
  const [state, dispatch] = useReducer(formReducer, { form: EMPTY_VTYPE, baseline: EMPTY_VTYPE });
  const { save, saving, error, clearError } = useVehicleTypeSave();
  const { deactivate } = useVehicleTypeDeactivate();
  const [deactivated, setDeactivated] = useState<'ok' | 'stale' | null>(null);
  const {
    data: record,
    loading,
    error: fetchError,
    refetch,
  } = useEntityRecord(isCreate ? null : id, fetchVehicleType);
  // Fetched on the first editor open of the session, cached for every later one.
  const euroClasses = useCodeValues(EMISSION_STANDARD);

  // Re-baseline on every read of the record — the first one and each post-save re-read.
  useEffect(() => {
    if (record) dispatch({ type: 'hydrate', row: record });
  }, [record]);

  const isDirty =
    (isCreate || !!record) &&
    JSON.stringify(normalizeForDirty(state.form)) !==
      JSON.stringify(normalizeForDirty(state.baseline));
  useDirtyFormBlock(isDirty);
  useLiftEditorDirty(isDirty);

  const closeSlider = useCloseSliderParam(VEHICLE_TYPE_SELECTED_PARAM);
  const advanceCreated = useSidebarCreateAdvance(VEHICLE_TYPE_SELECTED_PARAM);

  const handleDeactivate = async () => {
    const result = await deactivate(state.form);
    if (result.error) {
      setRefreshError(result.error);
      return;
    }
    setMode('view');
    try {
      await onSaved?.();
      setDeactivated('ok');
    } catch {
      setDeactivated('stale');
      setRefreshError(t('vehicleType.deactivateStaleList'));
    }
  };

  // Fire the mutation, then re-read the record and refresh the list (`onSaved`).
  const handleSave = async () => {
    setRefreshError(null);
    // `save` resolves to `{ error }` and never throws — so a save failure flows
    // through the save-error snackbar.
    const result = await save(state.form);
    if (result.error) return;

    const hydrateRow = { ...state.form };
    if (isCreate) {
      // Blank id factory → a create. A successful save with no `newId` is a
      // Sobek invariant break: silently re-baselining to id='' would let the
      // next Edit→Save fire CREATE again and mint a duplicate.
      if (!result.newId) {
        setRefreshError(t('common.saveNoIdReturned'));
        return;
      }
      hydrateRow.id = result.newId;
      hydrateRow.version = 1; // bridge until the re-mounted editor reads the record
    }
    // Save committed: re-baseline on the write so a failing re-read or list
    // refresh can't strand the editor dirty.
    dispatch({ type: 'hydrate', row: hydrateRow });
    setMode('view');
    if (isCreate) {
      try {
        await onSaved?.();
        // ?selected=new → ?selected=<newId>: the editor re-mounts on the new id
        // and reads the created record.
        advanceCreated(result.newId);
        setSavedAt(Date.now());
      } catch {
        setRefreshError(t('vehicleType.saveStaleList'));
      }
      return;
    }
    // "Saved" means the record was re-read: the re-read re-baselines the form
    // (bumped version included). The list refresh runs alongside; if it fails,
    // warn instead of a clean success over a stale table.
    const [reread, list] = await Promise.allSettled([refetch(), onSaved?.()]);
    if (reread.status === 'rejected') return; // the body shows `fetchError`
    if (list.status === 'rejected') setRefreshError(t('vehicleType.saveStaleList'));
    else setSavedAt(Date.now());
  };

  if (loading && !record) {
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

  if (!isCreate && !record && !fetchError) {
    return (
      <>
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            {t('vehicleType.detailsTitle')}
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {t('vehicleType.notFound')}
          </Typography>
          <Typography variant="caption" color="text.disabled" sx={{ wordBreak: 'break-all' }}>
            {id}
          </Typography>
        </Box>
        <EditorRail onCollapse={closeSlider} side={RAIL_SIDE} />
      </>
    );
  }

  const name = state.form.name?.value?.trim();

  return (
    <Box sx={{ p: 2, height: '100%', overflowY: 'auto', boxSizing: 'border-box' }}>
      <FormLayout sx={{ mb: 1 }}>
        <Typography
          variant="h6"
          noWrap
          title={name || undefined}
          data-testid="vehicle-type-details-title"
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
        {state.form.id && (
          <NetexId
            id={state.form.id}
            version={state.form.version}
            copy="onHover"
            size="small"
            sx={{ justifySelf: 'start' }}
          />
        )}
      </FormLayout>
      <Divider sx={{ mb: 2 }} />

      {fetchError ? (
        <Typography variant="body2" color="error" sx={{ py: 2 }}>
          {fetchError}
        </Typography>
      ) : (
        <Stack data-testid="vehicle-type-context">
          <VehicleTypeForm
            value={state.form}
            onChange={form => dispatch({ type: 'edit', form })}
            mode={mode}
            euroClasses={euroClasses}
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
        message={t('vehicleType.saveSuccess')}
        onClose={() => setSavedAt(null)}
      />
      <SaveSuccessSnackbar
        open={deactivated === 'ok'}
        message={t('vehicleType.deactivateSuccess')}
        onClose={closeSlider}
      />
      <EditorRail
        side={RAIL_SIDE}
        onCollapse={closeSlider}
        mode={mode}
        onEnterEdit={() => !deactivated && setMode('edit')}
        onDeactivate={handleDeactivate}
        deactivateConfirmTitle={t('vehicleType.deactivateConfirmTitle')}
        deactivateConfirmMessage={t('vehicleType.deactivateConfirmMessage')}
        deactivateConfirmActionLabel={t('common.deactivate')}
        onCancelEdit={() => {
          // Revert to the last committed baseline (post-save = saved values).
          dispatch({ type: 'hydrate', row: state.baseline });
          setMode('view');
        }}
        onSave={handleSave}
        isDirty={isDirty}
        saving={saving}
      />
    </Box>
  );
}
