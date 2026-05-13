import { useEffect, useMemo, useState } from 'react';
import { Box, Button, Chip, CircularProgress, Divider, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { transportModeLabelKey } from '../netex/transportMode.ts';
import { VEHICLE_SELECTED_PARAM } from './vehicleUrlParams.ts';
import type { VehicleRow } from './vehicleTypes.ts';
import VehicleEditForm, { type VehicleEditFormValue } from './VehicleEditForm.tsx';
import SaveErrorSnackbar from './SaveErrorSnackbar.tsx';
import { BLANK_FORM, hydrateFromRow } from './vehicleFormDefaults.ts';
import { useVehiclePairSave } from './useVehiclePairSave.ts';
import { useDirtyFormBlock } from './useDirtyFormBlock.ts';

interface VehicleDetailsProps {
  /** Resolved row, or `null` when the deep-link `?selected=…` id was not found. */
  vehicle: VehicleRow | null;
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
        <Stack direction="row" spacing={1} sx={{ mt: 3 }}>
          <Button variant="outlined" onClick={closeSlider}>
            {t('close', 'Close')}
          </Button>
        </Stack>
      </Box>
    );
  }

  const isEdit = mode === 'edit';
  const isDirty = JSON.stringify(form) !== initialFormKey;

  return (
    <Box sx={{ p: 2, height: '100%', overflowY: 'auto', boxSizing: 'border-box' }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
        <Typography variant="h6">{t('vehicles.detailsTitle', 'Vehicle Details')}</Typography>
        <Chip
          label={t(
            isEdit ? 'vehicles.viewChipLabel' : 'vehicles.editChipLabel',
            isEdit ? 'View' : 'Edit'
          )}
          onClick={() => setMode(isEdit ? 'view' : 'edit')}
          color={isEdit ? 'primary' : 'default'}
          size="small"
          variant={isEdit ? 'filled' : 'outlined'}
        />
      </Stack>
      <Divider sx={{ mb: 2 }} />

      <Stack spacing={0.5} sx={{ mb: 2 }} data-testid="vehicle-context">
        <ContextRow label={t('vehicles.field.id', 'ID')} value={vehicle.id} />
        <ContextRow
          label={t('vehicles.field.version', 'Version')}
          value={String(vehicle.version)}
        />
        <ContextRow
          label={t('vehicles.field.parentVehicleType', 'Vehicle Type')}
          value={vehicle.parentVehicleTypeName ?? '—'}
        />
        <ContextRow
          label={t('vehicles.field.parentTransportMode', 'Transport Mode')}
          value={t(transportModeLabelKey(vehicle.parentTransportMode), vehicle.parentTransportMode)}
        />
      </Stack>
      <Divider sx={{ mb: 2 }} />

      <VehicleEditForm value={form} onChange={setForm} mode={mode} />

      <Stack direction="row" spacing={1} sx={{ mt: 3 }}>
        {isEdit && (
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            disabled={saving || !isDirty}
            startIcon={saving ? <CircularProgress size={16} color="inherit" /> : undefined}
            data-testid="vehicle-sidebar-save"
          >
            {saving ? t('saving', 'Saving…') : t('save', 'Save')}
          </Button>
        )}
        <Button variant="outlined" onClick={closeSlider} disabled={saving}>
          {t('close', 'Close')}
        </Button>
      </Stack>

      <SaveErrorSnackbar error={error} onClose={clearError} />
    </Box>
  );
}

function ContextRow({ label, value }: { label: string; value: string }) {
  return (
    <Box>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body2">{value}</Typography>
    </Box>
  );
}
