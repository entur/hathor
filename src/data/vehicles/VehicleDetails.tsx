import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { Box, Divider, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { transportModeLabelKey } from '../netex/transportMode.ts';
import NetexId from '../netex/NetexId.tsx';
import EditorRail from '../../components/sidebar/EditorRail.tsx';
import { VEHICLE_SELECTED_PARAM } from './projection/vehicleUrlParams.ts';
import type { VehicleGQLShaped } from './projection/vehicleGqlShaped.ts';
import VehicleEditForm, {
  type VehicleEditFormValue,
  LABEL_COL_MIN,
  LABEL_COL_MAX,
  COL_GAP,
} from './VehicleEditForm.tsx';
import { firstText } from '../netex/multilingualString.ts';
import SaveErrorSnackbar from './SaveErrorSnackbar.tsx';
import { BLANK_FORM, hydrateFromRow } from './vehicleFormDefaults.ts';
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
  const { save, saving, error, clearError } = useVehiclePairSave();

  const initialFormKey = useMemo(
    () => JSON.stringify(vehicle ? hydrateFromRow(vehicle) : BLANK_FORM),
    [vehicle]
  );
  useDirtyFormBlock(JSON.stringify(form) !== initialFormKey);

  useEffect(() => {
    setForm(vehicle ? hydrateFromRow(vehicle) : BLANK_FORM);
  }, [vehicle]);

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
    if (!result.error) closeSlider();
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
              <span>{vehicle.parentVehicleTypeName ?? '—'}</span>
              {vehicle.parentVehicleTypeId && (
                <NetexId id={vehicle.parentVehicleTypeId} copy="onHover" size="xsmall" />
              )}
            </Stack>
          }
        />
        <ContextRow
          label={t('vehicles.field.parentTransportMode', 'Transport Mode')}
          value={t(transportModeLabelKey(vehicle.parentTransportMode), vehicle.parentTransportMode)}
        />
      </Box>
      <Divider sx={{ mb: 2 }} />

      <VehicleEditForm value={form} onChange={setForm} mode={mode} />

      <SaveErrorSnackbar error={error} onClose={clearError} />
      <EditorRail
        side={RAIL_SIDE}
        onCollapse={closeSlider}
        mode={mode}
        onEnterEdit={() => setMode('edit')}
        onCancelEdit={() => {
          setForm(hydrateFromRow(vehicle));
          setMode('view');
        }}
        onSave={handleSave}
        isDirty={isDirty}
        saving={saving}
      />
    </Box>
  );
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
