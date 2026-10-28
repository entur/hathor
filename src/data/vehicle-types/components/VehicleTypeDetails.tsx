import { useEffect, useReducer, useRef, useState } from 'react';
import { Box, Divider, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import NetexId from '../../netex/NetexId.tsx';
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
import { useSelectionGuard } from '../../../hooks/useSelectionGuard.ts';
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
 * @returns {JSX.Element} The editor, its loading skeleton, or the not-found body.
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
  const { save, saving, error, clearError } = useVehicleTypeSave();
  const { deactivate } = useVehicleTypeDeactivate();
  const [deactivatedOK, setDeactivatedOK] = useState(false);
  // Fetched on the first editor open of the session, cached for every later one.
  const euroClasses = useCodeValues(EMISSION_STANDARD);

  const record = useEntityRecord(isCreate ? null : id, fetchVehicleTypeById);

  // The editor outlives `?selected=` changes: reset per id. Only a create
  // advancing to its new id (`bridgeId`) keeps its form and success snackbar;
  // any other move drops the previous id's form, so neither its unsaved
  // edits nor its dirty flag outlive it.
  const [bridgeId, setBridgeId] = useState<string | null>(null);
  const prevIdRef = useRef(id);
  useEffect(() => {
    const prevId = prevIdRef.current;
    if (prevId === id) return;
    prevIdRef.current = id;
    setMode(initialMode ?? 'view');
    setRefreshError(null);
    setDeactivatedOK(false);
    if (prevId === NEW_SELECTION && id === bridgeId) return;
    setSavedAt(null);
    setBridgeId(null);
    dispatch({ type: 'hydrate', row: EMPTY_VTYPE });
  }, [id, initialMode, bridgeId]);

  // Baseline = Sobek's record, on open and after every post-save re-fetch.
  useEffect(() => {
    if (!record.data) return;
    dispatch({ type: 'hydrate', row: record.data });
    setBridgeId(null);
  }, [record.data]);

  const isDirty =
    JSON.stringify(normalizeForDirty(state.form)) !==
    JSON.stringify(normalizeForDirty(state.baseline));
  useDirtyFormBlock(isDirty);
  useLiftEditorDirty(isDirty);

  const closeSlider = useCloseSliderParam(VEHICLE_TYPE_SELECTED_PARAM);
  const advanceCreated = useSidebarCreateAdvance(VEHICLE_TYPE_SELECTED_PARAM);

  // Every write continuation bails once the selection moved (see useSelectionGuard).
  const captureSelection = useSelectionGuard(id);

  const handleDeactivate = async () => {
    const isCurrent = captureSelection();
    const result = await deactivate(state.form);
    if (!isCurrent()) return;
    if (result.error) {
      setRefreshError(result.error);
      return;
    }
    setMode('view');
    try {
      setDeactivatedOK(true);
      await onSaved?.();
      if (isCurrent()) setRefreshError(null);
    } catch {
      if (isCurrent()) setRefreshError(t('vehicleType.deactivateStaleList'));
    }
  };

  // Fire the mutation, bridge the baseline from the submitted form, then
  // re-fetch the record (the real baseline) and refresh the list (`onSaved`).
  const handleSave = async () => {
    const isCurrent = captureSelection();
    setRefreshError(null);
    // `save` resolves to `{ error }` and never throws — so a save failure flows
    // through the save-error snackbar, and the try below is scoped to ONLY the
    // post-save refreshes (record re-fetch, `onSaved`).
    const result = await save(state.form);
    if (!isCurrent() || result.error) return;

    const wasCreate = state.form.id === '';
    const hydrateRow = { ...state.form };
    if (wasCreate) {
      // Blank id factory → a create. A successful save with no `newId` is a
      // Sobek invariant break: silently re-baselining to id='' would let the
      // next Edit→Save fire CREATE again and mint a duplicate.
      if (!result.newId) {
        setRefreshError(t('common.saveNoIdReturned'));
        return;
      }
      hydrateRow.id = result.newId;
      hydrateRow.version = 1; // bridge until the by-id fetch lands the real record
    }
    // Save committed: bridge the baseline with the submitted form until the
    // re-fetched record re-hydrates it.
    dispatch({ type: 'hydrate', row: hydrateRow });
    setMode('view');
    try {
      if (!wasCreate) await record.refetch();
      if (!isCurrent()) return;
      await onSaved?.();
      if (!isCurrent()) return;
      // Advance `?selected=new` → `?selected=<newId>`; the editor then
      // fetches the created record by id.
      if (wasCreate) {
        setBridgeId(result.newId);
        advanceCreated(result.newId);
      }
      setSavedAt(Date.now()); // success only once the list is fresh
    } catch {
      // Save is real, but the record or list couldn't refresh — warn instead
      // of a clean success over stale data.
      if (isCurrent()) setRefreshError(t('vehicleType.saveStaleList'));
    }
  };

  // Until Sobek's record lands, the post-create bridge form stays up;
  // otherwise skeleton, or not-found.
  const hasRecord = isCreate || record.data !== null || bridgeId === id;

  if (!hasRecord && (record.notFound || record.error)) {
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

  if (!hasRecord) {
    return (
      <>
        <FormLayoutSkeleton
          ariaLabel={t('data.loading')}
          showTitle
          sections={[{ rowCount: SKELETON_ROWS }]}
        />
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

      <Stack data-testid="vehicle-type-context">
        <VehicleTypeForm
          value={state.form}
          onChange={form => dispatch({ type: 'edit', form })}
          mode={mode}
          euroClasses={euroClasses}
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
        // No Edit while the record (re-)loads: its hydrate would wipe what
        // the user types — e.g. during the post-save re-fetch.
        onEnterEdit={record.loading ? undefined : () => !deactivatedOK && setMode('edit')}
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
