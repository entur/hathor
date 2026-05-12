import { useState } from 'react';
import { Box, Typography, Button, Chip, Divider, Stack, TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useEditing } from '../../contexts/EditingContext.tsx';
import { transportModeLabelKey } from '../netex/transportMode.ts';
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
  vehicle: VehicleRow;
}

/**
 * Sidebar editor for a Vehicle row. Mounts via `EditingContext` when the user
 * clicks a row's details trigger. The full `VehicleRow` is passed via closure
 * from `RowClickCell` — no second GraphQL request to look it up.
 *
 * Read-only by default; an "Edit" Chip toggles to a form view with prefilled
 * `TextField`s. Save is intentionally not wired in this iteration (no XML
 * mapping / POST/PUT) — fields remain `readOnly` regardless of mode.
 */
export default function VehicleDetails({ vehicle }: VehicleDetailsProps) {
  const { t } = useTranslation();
  const { setEditingItem } = useEditing();
  const [mode, setMode] = useState<'view' | 'edit'>('view');

  const fieldValue = (key: keyof VehicleRow): string => {
    const raw = vehicle[key];
    if (key === 'parentTransportMode') {
      return t(transportModeLabelKey(vehicle.parentTransportMode), vehicle.parentTransportMode);
    }
    if (raw == null || raw === '') return '—';
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
              <Typography variant="body2">{fieldValue(key)}</Typography>
            </Box>
          ) : (
            <TextField
              key={key}
              label={t(labelKey, defaultLabel)}
              value={vehicle[key] ?? ''}
              size="small"
              fullWidth
              slotProps={{ input: { readOnly: true } }}
            />
          )
        )}
      </Stack>

      <Stack direction="row" spacing={1} sx={{ mt: 3 }}>
        <Button variant="outlined" onClick={() => setEditingItem(null)}>
          {t('close', 'Close')}
        </Button>
      </Stack>
    </Box>
  );
}
