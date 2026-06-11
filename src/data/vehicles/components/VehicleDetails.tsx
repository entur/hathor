import { useEffect, useReducer, useState } from 'react';
import { Box, Divider, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import NetexId from '../../netex/NetexId.tsx';
import TransportModeIcon from '../../../components/icons/TransportModeIcon.tsx';
import EditorRail from '../../../components/sidebar/EditorRail.tsx';
import { FormLayout, MetaRow } from '../../../components/FormLayout.tsx';
import { VEHICLE_SELECTED_PARAM } from '../utils/vehicleUrlParams.ts';
import { vehicleMode, type VehicleGQLShaped } from '../types/vehicleGqlShaped.ts';
import VehicleEditForm from './VehicleEditForm.tsx';
import VehicleDetailsSkeleton from './VehicleDetailsSkeleton.tsx';
import SaveErrorSnackbar from '../../../components/feedback/SaveErrorSnackbar.tsx';
import SaveSuccessSnackbar from '../../../components/feedback/SaveSuccessSnackbar.tsx';
import { useVehicle } from '../hooks/useVehicle.ts';
import { useVehiclePairSave } from '../hooks/useVehiclePairSave.ts';
import { useDirtyFormBlock } from '../../../hooks/useDirtyFormBlock.ts';
import { useLiftEditorDirty } from '../../../hooks/useLiftEditorDirty.ts';
import { useCloseSliderParam } from '../../../hooks/useCloseSliderParam.ts';
import { useSidebarCreateAdvance } from '../../../hooks/useSidebarCreateAdvance.ts';
import { commitSave } from '../../../utils/commitSave.ts';
import {
  edit,
  hydrate,
  initialFormState,
  isDirty as isFormDirty,
  canSubmit,
  type FormState,
} from '../stores/vehicleFormState.ts';
import type { VehicleEditFormValue } from './VehicleEditForm.tsx';

const BLANK_NAME = 'unnamed';
const RAIL_SIDE = 'right' as const;

interface VehicleDetailsProps {
  /** Resolved row, or `null` when the deep-link `?selected=…` id was not found. */
  vehicle: VehicleGQLShaped | null;
  /**
   * List-side refetch fired after a successful save so the row on `/vehicles`
   * reflects the new registrationNumber/name/version before the success
   * snackbar appears. Optional — callers without a list channel can omit.
   */
  onSaved?: () => Promise<void>;
  mode?: 'view' | 'edit';
}

export default function VehicleDetails({
  vehicle,
  onSaved,
  mode: initialMode,
}: VehicleDetailsProps) {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const [mode, setMode] = useState<'view' | 'edit'>(initialMode || 'view');
  const [formState, dispatch] = useReducer(formReducer, initialFormState);
  const { form } = formState;
  const setForm = (next: VehicleEditFormValue) => dispatch({ type: 'edit', form: next });
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [commitError, setCommitError] = useState<string | null>(null);
  const { save, saving, error, clearError } = useVehiclePairSave();

  const {
    data: xmlVehicle,
    loading: xmlLoading,
    error: xmlError,
    refetch: refetchXml,
  } = useVehicle(vehicle?.id);

  useEffect(() => {
    dispatch({ type: 'hydrate', xmlVehicle });
  }, [xmlVehicle]);

  const isDirty = isFormDirty(formState);
  useDirtyFormBlock(isDirty);
  useLiftEditorDirty(isDirty);

  const closeSlider = useCloseSliderParam(VEHICLE_SELECTED_PARAM);
  const advanceCreated = useSidebarCreateAdvance(VEHICLE_SELECTED_PARAM);

  const handleSave = async () => {
    const wasCreate = (form.vehicle.id ?? '') === '';
    const result = await commitSave(save, form, onSaved);
    if (result.error) return;

    if (wasCreate) {
      // Sobek's mutation must mint a newId on create; null here = invariant
      // break. Re-baselining with id='' would let the next Edit→Save fire
      // CREATE again and mint a duplicate.
      if (!result.newId) {
        setCommitError(
          t('common.saveNoIdReturned', 'Saved, but no id was returned — please refresh.')
        );
        return;
      }
      // Re-baseline the form with the assigned id so isDirty=false immediately,
      // bridging until the URL advance below re-resolves the row from the list.
      dispatch({
        type: 'hydrate',
        xmlVehicle: { ...form.vehicle, id: result.newId, version: 1 },
      });
      // useVehicle('') short-circuited; advance ?selected=new → ?selected=<newId>
      // so useUrlEditorSelection re-resolves into the just-created row and the
      // single-vehicle fetch lands the real version.
      advanceCreated(result.newId);
    } else {
      // Existing row — re-pull the persisted vehicle so the `hydrate` effect
      // advances the dirty baseline (and picks up the bumped version). Without
      // this the form stays dirty after save and `>>` wrongly raises the
      // discard dialog.
      await refetchXml();
    }
    setSavedAt(Date.now());
    setMode('view');
  };

  if (!vehicle) {
    const requestedId = searchParams.get(VEHICLE_SELECTED_PARAM);
    return (
      <>
        <Box sx={{ p: 2 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
            <Typography variant="h6">{t('vehicles.detailsTitle', 'Vehicle Details')}</Typography>
          </Stack>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {t('vehicles.notFound', 'Vehicle not found')}
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

  if (xmlLoading) {
    return (
      <>
        <VehicleDetailsSkeleton />
        <EditorRail onCollapse={closeSlider} side={RAIL_SIDE} />
      </>
    );
  }

  const trimmedName = form.vehicle.name?.value?.trim();
  const tmode = vehicleMode(vehicle);

  return (
    <Box sx={{ p: 2, height: '100%', overflowY: 'auto', boxSizing: 'border-box' }}>
      <FormLayout sx={{ mb: 1 }}>
        <Typography
          variant="h6"
          noWrap
          title={trimmedName || undefined}
          data-testid="vehicle-details-title"
          sx={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis' }}
        >
          {trimmedName || (
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
        {form.vehicle.id && (
          <NetexId
            id={form.vehicle.id}
            version={form.vehicle.version}
            copy="onHover"
            size="small"
            sx={{ justifySelf: 'start' }}
          />
        )}
      </FormLayout>
      <Divider sx={{ mb: 2 }} />

      <FormLayout rowGap={0.5} sx={{ mb: 2 }} data-testid="vehicle-context">
        <MetaRow label={t('vehicles.field.parentVehicleType', 'Vehicle Type')}>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ flexWrap: 'wrap' }}>
            <span>{vehicle.transportType?.name?.value ?? '—'}</span>
            {xmlVehicle?.transportType?.id && (
              <NetexId id={xmlVehicle.transportType.id} copy="only" size="medium" />
            )}
          </Stack>
        </MetaRow>
        <MetaRow label={t('vehicles.field.parentTransportMode', 'Transport Mode')}>
          <TransportModeIcon mode={tmode} iconPosition="left" />
        </MetaRow>
      </FormLayout>
      <Divider sx={{ mb: 2 }} />

      {xmlError ? (
        <Typography variant="body2" color="error" sx={{ py: 2 }}>
          {xmlError}
        </Typography>
      ) : (
        <VehicleEditForm value={form} onChange={setForm} mode={mode} />
      )}

      <SaveErrorSnackbar error={error} onClose={clearError} />
      <SaveErrorSnackbar
        error={commitError}
        severity="warning"
        onClose={() => setCommitError(null)}
      />
      <SaveSuccessSnackbar
        open={savedAt !== null}
        message={t('vehicles.saveSuccess', 'Vehicle saved')}
        onClose={() => setSavedAt(null)}
      />
      <EditorRail
        side={RAIL_SIDE}
        onCollapse={closeSlider}
        mode={mode}
        onEnterEdit={() => setMode('edit')}
        onCancelEdit={() => {
          dispatch({ type: 'hydrate', xmlVehicle });
          setMode('view');
        }}
        onSave={handleSave}
        isDirty={isDirty}
        saving={saving}
        // Block create-with-no-TransportTypeRef: Sobek's vehicles() resolver
        // silently excludes refless vehicles from the list (create-but-invisible).
        // Existing rows already carry a ref, so only the create flow needs the gate.
        canSubmit={(form.vehicle.id ?? '') !== '' || canSubmit(form)}
      />
    </Box>
  );
}

type FormAction =
  | { type: 'hydrate'; xmlVehicle: Partial<VehicleGQLShaped> | null | undefined }
  | { type: 'edit'; form: VehicleEditFormValue };

function formReducer(state: FormState, action: FormAction): FormState {
  return action.type === 'hydrate' ? hydrate(state, action.xmlVehicle) : edit(state, action.form);
}
