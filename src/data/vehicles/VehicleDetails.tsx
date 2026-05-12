import { useState } from 'react';
import { Box, Typography, Button, Chip, Divider, Stack, TextField, Alert } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useEditing } from '../../contexts/EditingContext.tsx';
import { useVehicles } from './useVehicles.ts';
import type { Vehicle } from './vehicleTypes.ts';

const FIELD_LABEL_KEYS: { key: keyof Vehicle; labelKey: string; defaultLabel: string }[] = [
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
  itemId: string;
}

/**
 * Sidebar editor for a Vehicle row. Mounts via `EditingContext` when the user
 * clicks the row's details icon.
 *
 * Iteration 1: read-only by default; an "Edit" Chip toggles to a form view
 * with prefilled `TextField`s. There is intentionally **no Save button** —
 * save (XML mapping, POST/PUT) is gated on layout approval.
 */
export default function VehicleDetails({ itemId }: VehicleDetailsProps) {
  const { t } = useTranslation();
  const { setEditingItem } = useEditing();
  const { allData, loading } = useVehicles();
  const [mode, setMode] = useState<'view' | 'edit'>('view');

  const vehicle = allData.find((v: Vehicle) => v.id === itemId);

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

      {loading && !vehicle && (
        <Typography variant="body2">{t('data.loading', 'Loading data...')}</Typography>
      )}
      {!loading && !vehicle && (
        <Alert severity="warning">
          {t('vehicles.notFound', 'Vehicle not found')}: {itemId}
        </Alert>
      )}

      {vehicle && (
        <Stack spacing={mode === 'edit' ? 2 : 1.25}>
          {FIELD_LABEL_KEYS.map(({ key, labelKey, defaultLabel }) =>
            mode === 'view' ? (
              <Box key={key}>
                <Typography variant="caption" color="text.secondary">
                  {t(labelKey, defaultLabel)}
                </Typography>
                <Typography variant="body2">{String(vehicle[key] ?? '—')}</Typography>
              </Box>
            ) : (
              <TextField
                key={key}
                label={t(labelKey, defaultLabel)}
                value={vehicle[key] ?? ''}
                size="small"
                fullWidth
                // iter 1: read-only form fields. Save will be wired in iter 2 once
                // layout is approved (XML mapping + POST/PUT).
                slotProps={{ input: { readOnly: true } }}
              />
            )
          )}
        </Stack>
      )}

      <Stack direction="row" spacing={1} sx={{ mt: 3 }}>
        {mode === 'edit' && (
          <Button variant="text" onClick={() => setMode('view')}>
            {t('cancel', 'Cancel')}
          </Button>
        )}
        <Button variant="outlined" onClick={() => setEditingItem(null)}>
          {t('close', 'Close')}
        </Button>
      </Stack>
    </Box>
  );
}
