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
import { useVehicleTypeSave } from '../hooks/useVehicleTypeSave.ts';
import { VEHICLE_TYPE_SELECTED_PARAM } from '../utils/vehicleTypeUrlParams.ts';
import VehicleTypeForm from './VehicleTypeForm.tsx';
import type { VehicleType } from '../types/vehicleTypeTypes.ts';

const BLANK_NAME = 'unnamed';
const RAIL_SIDE = 'right' as const;
const EMPTY_VTYPE: VehicleType = { id: '', version: 0 };

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
  /** Resolved row, or `null` when the deep-link `?selected=…` id was not found. */
  vehicleType: VehicleType | null;
  /**
   * List-side refetch fired after a successful save so the row on
   * `/vehicle-types` (and the resolved sidebar prop) reflects the persisted
   * values + bumped version before the success snackbar appears. Optional.
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
 * Hydrates straight from the resolved list row (the list query carries every
 * field) into a tabbed {@link VehicleTypeForm}. The full {@link EditorRail}
 * drives view↔edit; save fires the `createOrUpdateVehicleType` mutation via
 * {@link useVehicleTypeSave}, re-baselines the form from the submitted values,
 * and runs `onSaved` to refresh the list table.
 *
 * @param vehicleType Resolved row, or `null` for a not-found deep link.
 * @param onSaved Optional list refetch run after a successful save (table freshness).
 * @param mode Optional initial mode ('view' or 'edit').
 */
export default function VehicleTypeDetails({
  vehicleType,
  onSaved,
  mode: initialMode,
}: VehicleTypeDetailsProps) {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const [mode, setMode] = useState<'view' | 'edit'>(initialMode ?? 'view');
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [refreshError, setRefreshError] = useState<string | null>(null);
  const [state, dispatch] = useReducer(formReducer, { form: EMPTY_VTYPE, baseline: EMPTY_VTYPE });
  const { save, saving, error, clearError } = useVehicleTypeSave();

  // Re-hydrate (and drop back to view) whenever the deep-link resolves a new row.
  useEffect(() => {
    if (vehicleType) {
      dispatch({ type: 'hydrate', row: vehicleType });
      setMode(initialMode ?? 'view');
      // Don't let a prior save snackbar / stale-list warning bleed into the next row.
      setSavedAt(null);
      setRefreshError(null);
    }
  }, [initialMode, vehicleType]);

  const isDirty =
    !!vehicleType &&
    JSON.stringify(normalizeForDirty(state.form)) !==
      JSON.stringify(normalizeForDirty(state.baseline));
  useDirtyFormBlock(isDirty);
  useLiftEditorDirty(isDirty);

  const closeSlider = useCloseSliderParam(VEHICLE_TYPE_SELECTED_PARAM);
  const advanceCreated = useSidebarCreateAdvance(VEHICLE_TYPE_SELECTED_PARAM);

  // Fire the mutation, then refresh the list (`onSaved`) so the table reflects
  // the edit. The sidebar's own re-baseline is from the submitted form, not the
  // refetched prop: `useUrlEditorSelection`'s commit guard intentionally does
  // not push a new row into an open editor on a same-id refetch.
  const handleSave = async () => {
    setRefreshError(null);
    // `save` resolves to `{ error }` and never throws — so a save failure flows
    // through the save-error snackbar, and the try below is scoped to ONLY the
    // post-save list refresh (`onSaved`).
    const result = await save(state.form);
    if (result.error) return;

    const wasCreate = state.form.id === '';
    const hydrateRow = { ...state.form };
    if (wasCreate) {
      // Blank id factory → a create. A successful save with no `newId` is a
      // Sobek invariant break: silently re-baselining to id='' would let the
      // next Edit→Save fire CREATE again and mint a duplicate.
      if (!result.newId) {
        setRefreshError(
          t('common.saveNoIdReturned', 'Saved, but no id was returned — please refresh.')
        );
        return;
      }
      hydrateRow.id = result.newId;
      hydrateRow.version = 1; // bridge until the refetched list lands the real row
    }
    // Save committed: re-baseline from the submitted form (the commit guard in
    // useUrlEditorSelection won't push the refetched row into an open editor).
    dispatch({ type: 'hydrate', row: hydrateRow });
    setMode('view');
    try {
      await onSaved?.();
      // Advance `?selected=new` → `?selected=<newId>` only after the list
      // refetch has landed, so useUrlEditorSelection re-resolves into the
      // fresh row (not a transient "not found" between save and refetch).
      if (wasCreate) advanceCreated(result.newId);
      setSavedAt(Date.now()); // success only once the list is fresh
    } catch {
      // Save is real, but the list couldn't refresh — warn instead of a clean
      // success over a stale table.
      setRefreshError(
        t('vehicleType.saveStaleList', 'Saved — but the list could not refresh; it may be stale.')
      );
    }
  };

  if (!vehicleType) {
    const requestedId = searchParams.get(VEHICLE_TYPE_SELECTED_PARAM);
    return (
      <>
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            {t('vehicleType.detailsTitle', 'Vehicle Type Details')}
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {t('vehicleType.notFound', 'Vehicle type not found')}
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
        message={t('vehicleType.saveSuccess', 'Vehicle type saved')}
        onClose={() => setSavedAt(null)}
      />
      <EditorRail
        side={RAIL_SIDE}
        onCollapse={closeSlider}
        mode={mode}
        onEnterEdit={() => setMode('edit')}
        onCancelEdit={() => {
          // Revert to the last committed baseline (post-save = saved values),
          // not the `vehicleType` prop which goes stale after a same-id save.
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
