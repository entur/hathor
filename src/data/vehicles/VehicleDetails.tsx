import { useState } from 'react';
import { Box, Typography, Button, Chip, Divider, Stack, TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { transportModeLabelKey } from '../netex/transportMode.ts';
import { VEHICLE_SELECTED_PARAM } from './vehicleUrlParams.ts';
import type { VehicleRow } from './vehicleTypes.ts';

const FIELD_LABEL_KEYS: { key: keyof VehicleRow; labelKey: string; defaultLabel: string }[] = [
  { key: 'id', labelKey: 'vehicles.field.id', defaultLabel: 'ID' },
  {
    key: 'registrationNumber',
    labelKey: 'vehicles.field.registrationNumber',
    defaultLabel: 'Registration Number',
  },
  { key: 'version', labelKey: 'vehicles.field.version', defaultLabel: 'Version' },
  {
    key: 'parentVehicleTypeName',
    labelKey: 'vehicles.field.parentVehicleType',
    defaultLabel: 'Vehicle Type',
  },
  {
    key: 'parentTransportMode',
    labelKey: 'vehicles.field.parentTransportMode',
    defaultLabel: 'Transport Mode',
  },
];

interface VehicleDetailsProps {
  /** Resolved row, or `null` when the deep-link `?selected=…` id was not found. */
  vehicle: VehicleRow | null;
}

/**
 * Sidebar editor for a Vehicle row, driven by the `?selected=…` URL param.
 * Save is intentionally not wired in this iteration (no XML mapping /
 * POST/PUT) — fields remain `readOnly` regardless of mode.
 */
export default function VehicleDetails({ vehicle }: VehicleDetailsProps) {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [mode, setMode] = useState<'view' | 'edit'>('view');

  const closeSlider = () =>
    setSearchParams(
      params => {
        params.delete(VEHICLE_SELECTED_PARAM);
        return params;
      },
      { replace: true }
    );

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

  /**
   * Single display path for view + edit modes — keeps the localised
   * TransportMode label from drifting between the two. `missing` differs
   * by context: view mode shows an em-dash, edit mode shows an empty
   * TextField.
   */
  const fieldDisplay = (key: keyof VehicleRow, missing: string): string => {
    if (key === 'parentTransportMode') {
      return t(transportModeLabelKey(vehicle.parentTransportMode), vehicle.parentTransportMode);
    }
    const raw = vehicle[key];
    if (raw == null || raw === '') return missing;
    return String(raw);
  };

  return (
    <Box sx={{ p: 2 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
        <Typography variant="h6">{t('vehicles.detailsTitle', 'Vehicle Details')}</Typography>
        <Chip
          label={
            mode === 'view'
              ? t('vehicles.editChipLabel', 'Edit')
              : t('vehicles.viewChipLabel', 'View')
          }
          onClick={() => setMode(mode === 'view' ? 'edit' : 'view')}
          color={mode === 'edit' ? 'primary' : 'default'}
          size="small"
          variant={mode === 'edit' ? 'filled' : 'outlined'}
        />
      </Stack>
      <Divider sx={{ mb: 2 }} />

      <Stack spacing={mode === 'edit' ? 2 : 1.25}>
        {FIELD_LABEL_KEYS.map(({ key, labelKey, defaultLabel }) =>
          mode === 'view' ? (
            <Box key={key}>
              <Typography variant="caption" color="text.secondary">
                {t(labelKey, defaultLabel)}
              </Typography>
              <Typography variant="body2">{fieldDisplay(key, '—')}</Typography>
            </Box>
          ) : (
            <TextField
              key={key}
              label={t(labelKey, defaultLabel)}
              value={fieldDisplay(key, '')}
              size="small"
              fullWidth
              slotProps={{ input: { readOnly: true } }}
            />
          )
        )}
      </Stack>

      <Stack direction="row" spacing={1} sx={{ mt: 3 }}>
        <Button variant="outlined" onClick={closeSlider}>
          {t('close', 'Close')}
        </Button>
      </Stack>
    </Box>
  );
}
