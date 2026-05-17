import { useEffect, useReducer, useState, type ReactNode } from 'react';
import { Box, CircularProgress, Divider, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { transportModeLabelKey } from '../netex/transportMode.ts';
import NetexId from '../netex/NetexId.tsx';
import EditorRail from '../../components/sidebar/EditorRail.tsx';
import { VEHICLE_SELECTED_PARAM } from './projection/vehicleUrlParams.ts';
import { vehicleMode, type VehicleGQLShaped } from './projection/vehicleGqlShaped.ts';
import VehicleEditForm, { LABEL_COL_MIN, LABEL_COL_MAX, COL_GAP } from './VehicleEditForm.tsx';
import { firstText } from '../netex/multilingualString.ts';
import SaveErrorSnackbar from './SaveErrorSnackbar.tsx';
import SaveSuccessSnackbar from './SaveSuccessSnackbar.tsx';
import { useVehicle } from './useVehicle.ts';
import { useVehiclePairSave } from './xml/useVehiclePairSave.ts';
import { useDirtyFormBlock } from './useDirtyFormBlock.ts';
import {
  edit,
  hydrate,
  initialFormState,
  isDirty as isFormDirty,
  type FormState,
} from './vehicleFormState.ts';
import type { VehicleEditFormValue } from './VehicleEditForm.tsx';
import type { Vehicle } from './xml/Vehicle';

const BLANK_NAME = 'unnamed';
const RAIL_SIDE = 'right' as const;

interface VehicleDetailsProps {
  /** Resolved row, or `null` when the deep-link `?selected=…` id was not found. */
  vehicle: VehicleGQLShaped | null;
}

export default function VehicleDetails({ vehicle }: VehicleDetailsProps) {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [mode, setMode] = useState<'view' | 'edit'>('view');
  const [formState, dispatch] = useReducer(formReducer, initialFormState);
  const { form } = formState;
  const setForm = (next: VehicleEditFormValue) => dispatch({ type: 'edit', form: next });
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const { save, saving, error, clearError } = useVehiclePairSave();

  const { data: xmlVehicle, loading: xmlLoading, error: xmlError } = useVehicle(vehicle?.id);

  useEffect(() => {
    dispatch({ type: 'hydrate', xmlVehicle });
  }, [xmlVehicle]);

  const isDirty = isFormDirty(formState);
  useDirtyFormBlock(isDirty);

  const closeSlider = () =>
    setSearchParams(
      params => {
        params.delete(VEHICLE_SELECTED_PARAM);
        return params;
      },
      { replace: true }
    );

  const handleSave = async () => {
    const result = await save(form);
    if (!result.error) {
      setSavedAt(Date.now());
      setMode('view');
    }
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

  const trimmedName = firstText(form.vehicle.Name).trim();
  const tmode = vehicleMode(vehicle);

  return (
    <Box sx={{ p: 2, height: '100%', overflowY: 'auto', boxSizing: 'border-box' }}>
      <Box
        sx={{
          mb: 1,
          width: '100%',
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: `minmax(${LABEL_COL_MIN}, ${LABEL_COL_MAX}) 1fr`,
          },
          columnGap: COL_GAP,
          alignItems: 'center',
        }}
      >
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
        <NetexId
          id={vehicle.id}
          version={vehicle.version}
          copy="onHover"
          size="small"
          sx={{ justifySelf: 'start' }}
        />
      </Box>
      <Divider sx={{ mb: 2 }} />

      <Box
        sx={{
          mb: 2,
          width: '100%',
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: `minmax(${LABEL_COL_MIN}, ${LABEL_COL_MAX}) 1fr`,
          },
          columnGap: COL_GAP,
          rowGap: 0.5,
          alignItems: 'center',
        }}
        data-testid="vehicle-context"
      >
        <ContextRow
          label={t('vehicles.field.parentVehicleType', 'Vehicle Type')}
          value={
            <Stack direction="row" spacing={1} alignItems="center" sx={{ flexWrap: 'wrap' }}>
              <span>{vehicle.transportType?.name ?? '—'}</span>
              {vehicle.transportType?.id && (
                <NetexId id={vehicle.transportType.id} copy="onHover" size="small" />
              )}
            </Stack>
          }
        />
        <ContextRow
          label={t('vehicles.field.parentTransportMode', 'Transport Mode')}
          value={t(transportModeLabelKey(tmode), tmode)}
        />
      </Box>
      <Divider sx={{ mb: 2 }} />

      {xmlLoading && (
        <Stack direction="row" alignItems="center" spacing={1} sx={{ py: 2 }}>
          <CircularProgress size={16} />
          <Typography variant="body2" color="text.secondary">
            {t('vehicles.loading', 'Loading vehicle…')}
          </Typography>
        </Stack>
      )}
      {!xmlLoading && xmlError && (
        <Typography variant="body2" color="error" sx={{ py: 2 }}>
          {xmlError}
        </Typography>
      )}
      {!xmlLoading && !xmlError && <VehicleEditForm value={form} onChange={setForm} mode={mode} />}

      <SaveErrorSnackbar error={error} onClose={clearError} />
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
      />
    </Box>
  );
}

type FormAction =
  | { type: 'hydrate'; xmlVehicle: Partial<Vehicle> | null | undefined }
  | { type: 'edit'; form: VehicleEditFormValue };

function formReducer(state: FormState, action: FormAction): FormState {
  return action.type === 'hydrate' ? hydrate(state, action.xmlVehicle) : edit(state, action.form);
}

function ContextRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <Box sx={{ display: 'contents' }}>
      <Typography sx={{ fontSize: '0.875rem', color: 'text.primary' }}>{label}</Typography>
      <Typography variant="body2" component="div">
        {value}
      </Typography>
    </Box>
  );
}
