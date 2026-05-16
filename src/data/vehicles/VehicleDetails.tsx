import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { Box, CircularProgress, Divider, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { transportModeLabelKey } from '../netex/transportMode.ts';
import NetexId from '../netex/NetexId.tsx';
import EditorRail from '../../components/sidebar/EditorRail.tsx';
import { VEHICLE_SELECTED_PARAM } from './projection/vehicleUrlParams.ts';
import { vehicleMode, type VehicleGQLShaped } from './projection/vehicleGqlShaped.ts';
import VehicleEditForm, {
  type VehicleEditFormValue,
  LABEL_COL_MIN,
  LABEL_COL_MAX,
  COL_GAP,
} from './VehicleEditForm.tsx';
import { firstText } from '../netex/multilingualString.ts';
import SaveErrorSnackbar from './SaveErrorSnackbar.tsx';
import SaveSuccessSnackbar from './SaveSuccessSnackbar.tsx';
import { BLANK_FORM, MISSING_MODEL } from './vehicleFormDefaults.ts';
import { useVehicle } from './useVehicle.ts';
import type { Vehicle } from './xml/Vehicle';
import { useVehiclePairSave } from './xml/useVehiclePairSave.ts';
import { useDirtyFormBlock } from './useDirtyFormBlock.ts';

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
  const [form, setForm] = useState<VehicleEditFormValue>(BLANK_FORM);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const { save, saving, error, clearError } = useVehiclePairSave();

  const { data: xmlVehicle, loading: xmlLoading, error: xmlError } = useVehicle(vehicle?.id);

  const initialFormKey = useMemo(
    () => JSON.stringify(xmlVehicle ? hydrateFromXml(xmlVehicle) : BLANK_FORM),
    [xmlVehicle]
  );
  useDirtyFormBlock(JSON.stringify(form) !== initialFormKey);

  useEffect(() => {
    setForm(xmlVehicle ? hydrateFromXml(xmlVehicle) : BLANK_FORM);
  }, [xmlVehicle]);

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

  const isDirty = JSON.stringify(form) !== initialFormKey;
  const trimmedName = firstText(form.vehicle.Name).trim();
  const tmode = vehicleMode(vehicle);

  return (
    <Box sx={{ p: 2, height: '100%', overflowY: 'auto', boxSizing: 'border-box' }}>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ minWidth: 0, mb: 1 }}>
        <Typography variant="h6" noWrap data-testid="vehicle-details-title" sx={{ minWidth: 0 }}>
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
        <NetexId id={vehicle.id} version={vehicle.version} copy="onHover" size="xsmall" />
      </Stack>
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
                <NetexId id={vehicle.transportType.id} copy="onHover" size="xsmall" />
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
          setForm(xmlVehicle ? hydrateFromXml(xmlVehicle) : BLANK_FORM);
          setMode('view');
        }}
        onSave={handleSave}
        isDirty={isDirty}
        saving={saving}
      />
    </Box>
  );
}

function hydrateFromXml(xml: Partial<Vehicle>): VehicleEditFormValue {
  return { vehicle: xml, model: MISSING_MODEL };
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
