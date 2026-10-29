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
import { useBridgeReadBack } from '../../../hooks/useBridgeReadBack.ts';
import { useSelectionGuard } from '../../../hooks/useSelectionGuard.ts';
import { useSelectionReset } from '../../../hooks/useSelectionReset.ts';
import { succeeds } from '../../../utils/succeeds.ts';
import { NEW_SELECTION } from '../../../hooks/useUrlEditorSelection.tsx';
import { fetchVehicleTypeById } from '../api/fetchVehicleTypes.ts';
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
const SKELETON_ROWS = 6;

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
  /** VehicleType netexId to load, or `NEW_SELECTION` for the create pane. */
  id: string;
  /**
   * List-side refetch fired after a successful save so the row on
   * `/vehicle-types` reflects the persisted values + bumped version before
   * the success snackbar appears. Optional.
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
 * Loads its record from Sobek by id ({@link useEntityRecord}) into a tabbed
 * {@link VehicleTypeForm}, and stays mounted across `?selected=` changes,
 * resetting itself whenever the id moves. The full {@link EditorRail} drives
 * view↔edit; save fires the `createOrUpdateVehicleType` mutation via
 * {@link useVehicleTypeSave}, bridges the baseline with the submitted values,
 * re-fetches the record (the real baseline) and runs `onSaved` to refresh the
 * list table.
 *
 * @param {string} id VehicleType netexId, or `NEW_SELECTION` for the create pane.
 * @param {() => Promise<void>} [onSaved] Optional list refetch run after a successful save.
 * @param {'view' | 'edit'} [mode] Optional initial mode.
 * @returns {JSX.Element} The editor, its loading skeleton, or the load-error / not-found body.
 */
export default function VehicleTypeDetails({
  id,
  onSaved,
  mode: initialMode,
}: VehicleTypeDetailsProps) {
  const { t } = useTranslation();
  const isCreate = id === NEW_SELECTION;
  const [mode, setMode] = useState<'view' | 'edit'>(initialMode ?? 'view');
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [refreshError, setRefreshError] = useState<string | null>(null);
  const [state, dispatch] = useReducer(formReducer, { form: EMPTY_VTYPE, baseline: EMPTY_VTYPE });
  const { save, saving } = useVehicleTypeSave();
  const { deactivate } = useVehicleTypeDeactivate();
  // The current selection's save failure — set from the guarded result only.
  const [saveError, setSaveError] = useState<string | null>(null);
  const [deactivatedOK, setDeactivatedOK] = useState(false);
  // A committed write's continuation (list refresh, record re-fetch,
  // create-advance) is running; Edit is withheld until it ends.
  const [refreshing, setRefreshing] = useState(false);
  // Fetched on the first editor open of the session, cached for every later one.
  const euroClasses = useCodeValues(EMISSION_STANDARD);

  const record = useEntityRecord(isCreate ? null : id, fetchVehicleTypeById);

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
    setMode(initialMode ?? 'view');
    setRefreshError(null);
    setDeactivatedOK(false);
    setRefreshing(false);
    setSaveError(null);
    if (keepForm) return;
    setSavedAt(null);
    setBridgeId(null);
    dispatch({ type: 'hydrate', row: EMPTY_VTYPE });
  });

  // Baseline = Sobek's record, on open and after every post-save re-fetch.
  useEffect(() => {
    if (!record.data) return;
    dispatch({ type: 'hydrate', row: record.data });
    setBridgeId(null);
  }, [record.data]);

  // The created record's read-back failed or found nothing: the bridged form
  // stays (Cancel keeps the created id), the success snackbar gives way to a warning.
  useBridgeReadBack(record, bridgeId === id, t('vehicleType.notFound'), warning => {
    setSavedAt(null);
    setRefreshError(warning);
  });

  const isDirty =
    JSON.stringify(normalizeForDirty(state.form)) !==
    JSON.stringify(normalizeForDirty(state.baseline));
  useDirtyFormBlock(isDirty);
  useLiftEditorDirty(isDirty);

  const closeSlider = useCloseSliderParam(VEHICLE_TYPE_SELECTED_PARAM);
  const advanceCreated = useSidebarCreateAdvance(VEHICLE_TYPE_SELECTED_PARAM);

  const handleDeactivate = async () => {
    const isCurrent = captureSelection();
    const result = await deactivate(state.form);
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
      if (isCurrent()) setRefreshError(t('vehicleType.deactivateStaleList'));
    }
  };

  // Fire the mutation, bridge the baseline from the submitted form, then
  // re-fetch the record (the real baseline) and refresh the list (`onSaved`)
  // — each runs whatever the other's outcome.
  const handleSave = async () => {
    const isCurrent = captureSelection();
    setRefreshError(null);
    setSaveError(null);
    // `save` resolves to `{ error }` and never throws — so a save failure flows
    // through the save-error snackbar; the refreshes below report through
    // `succeeds` instead of throwing.
    const result = await save(state.form);
    if (result.error) {
      if (isCurrent()) setSaveError(result.error);
      return;
    }

    const wasCreate = state.form.id === '';
    const hydrateRow = { ...state.form };
    if (wasCreate) {
      // Blank id factory → a create. A successful save with no `newId` is a
      // Sobek invariant break: silently re-baselining to id='' would let the
      // next Edit→Save fire CREATE again and mint a duplicate.
      if (!result.newId) {
        if (isCurrent()) setRefreshError(t('common.saveNoIdReturned'));
        return;
      }
      hydrateRow.id = result.newId;
      hydrateRow.version = 1; // bridge until the by-id fetch lands the real record
    }
    // Save committed: bridge the baseline with the submitted form until the
    // re-fetched record re-hydrates it.
    if (isCurrent()) {
      dispatch({ type: 'hydrate', row: hydrateRow });
      setMode('view');
      setRefreshing(true);
    }
    try {
      // The record re-fetch and the list refresh run concurrently, each
      // whatever the other's outcome.
      const [recordOk, listOk] = await Promise.all([
        wasCreate || !isCurrent() || succeeds(record.refetch),
        succeeds(() => onSaved?.()),
      ]);
      if (!isCurrent()) return;
      // Save is real, but the record or list couldn't refresh — warn instead
      // of a clean success over stale data.
      if (!recordOk || !listOk) {
        setRefreshError(t('vehicleType.saveStaleList'));
        return;
      }
      // Advance `?selected=new` → `?selected=<newId>`; the editor then
      // fetches the created record by id.
      if (wasCreate) {
        setBridgeId(result.newId);
        advanceCreated(result.newId);
      }
      setSavedAt(Date.now()); // success only once the list is fresh
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
        title={t('vehicleType.detailsTitle')}
        notFoundLabel={t('vehicleType.notFound')}
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

      <Stack data-testid="vehicle-type-context">
        <VehicleTypeForm
          value={state.form}
          onChange={form => dispatch({ type: 'edit', form })}
          mode={mode}
          euroClasses={euroClasses}
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
        message={t('vehicleType.saveSuccess')}
        onClose={() => setSavedAt(null)}
      />
      <SaveSuccessSnackbar
        open={deactivatedOK}
        message={t('vehicleType.deactivateSuccess')}
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
        onDeactivate={handleDeactivate}
        deactivateConfirmTitle={t('vehicleType.deactivateConfirmTitle')}
        deactivateConfirmMessage={t('vehicleType.deactivateConfirmMessage')}
        deactivateConfirmActionLabel={t('common.deactivate')}
        onCancelEdit={() => {
          // Revert to the last committed baseline (post-save = the re-fetched
          // record, or the submitted values if that re-fetch failed).
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
