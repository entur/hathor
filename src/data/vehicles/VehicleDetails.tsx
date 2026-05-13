import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  Snackbar,
  Stack,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { transportModeLabelKey } from '../netex/transportMode.ts';
import { VEHICLE_SELECTED_PARAM } from './vehicleUrlParams.ts';
import type { VehicleRow } from './vehicleTypes.ts';
import VehicleEditForm, { type VehicleEditFormValue } from './VehicleEditForm.tsx';
import { useVehiclePairSave } from './useVehiclePairSave.ts';
import { useDirtyFormBlock } from './useDirtyFormBlock.ts';

/** Placeholder id for the inline VehicleModel side (see issue #69). */
const INLINE_MODEL_ID = 'INLINE:VehicleModel:1' as const;

/**
 * Hydrate `{ vehicle, model }` form state from a partial `VehicleRow`. Edit
 * mode is partial today: only the 4 fields persisted on the list row are
 * pre-filled. The remaining Vehicle/VehicleModel fields start blank and the
 * user can either fill them or leave them empty. Full hydration arrives
 * with the deferred `/netex/vehicles/{id}` read (memory:
 * project_vehicle_details_route_hathor).
 */
function hydrateFromRow(row: VehicleRow): VehicleEditFormValue {
  return {
    vehicle: {
      $id: row.id,
      $version: String(row.version),
      RegistrationNumber: row.registrationNumber,
      TransportTypeRef: row.parentVehicleTypeId,
      VehicleModelRef: INLINE_MODEL_ID,
    },
    model: { $id: INLINE_MODEL_ID },
  };
}

const emptyForm: VehicleEditFormValue = {
  vehicle: { VehicleModelRef: INLINE_MODEL_ID },
  model: { $id: INLINE_MODEL_ID },
};

interface VehicleDetailsProps {
  /** Resolved row, or `null` when the deep-link `?selected=…` id was not found. */
  vehicle: VehicleRow | null;
}

/**
 * Sidebar editor for a Vehicle row, driven by the `?selected=…` URL param.
 * Renders the shared `VehicleEditForm` for the editable Vehicle +
 * VehicleModel fields, with a read-only context panel above for the
 * VehicleRow-only enrichment (id, version, parent VehicleType name,
 * localised transport mode).
 *
 * Save (edit mode): builds a Vehicle + VehicleModel pair into a
 * PublicationDelivery via `useVehiclePairSave`, POSTs to Sobek `/import`,
 * and on success closes the sidebar (removes `?selected=` from URL). List
 * refresh is deferred: today the list shows what's in `useVehicles`'s cache
 * until the user re-navigates. A proper refetch handle on the sidebar is a
 * follow-up (the page-level `useVehicles().refetch` is not yet plumbed
 * through `EditingContext` to the editor closure).
 *
 * NOTE: pending #68 — `modification="new|revise"` policy is unresolved;
 * the save handler does not set the attribute today.
 */
export default function VehicleDetails({ vehicle }: VehicleDetailsProps) {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [mode, setMode] = useState<'view' | 'edit'>('view');
  const [form, setForm] = useState<VehicleEditFormValue>(emptyForm);
  const { save, saving, error, clearError } = useVehiclePairSave();

  const initialFormKey = useMemo(
    () => JSON.stringify(vehicle ? hydrateFromRow(vehicle) : emptyForm),
    [vehicle]
  );
  const isDirty = JSON.stringify(form) !== initialFormKey;
  useDirtyFormBlock(isDirty);

  useEffect(() => {
    setForm(vehicle ? hydrateFromRow(vehicle) : emptyForm);
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
    try {
      await save(form);
      closeSlider();
    } catch {
      // useVehiclePairSave already captured the message into `error`;
      // Snackbar below surfaces it. Keep the form open so the user can fix
      // and retry without losing what they typed.
    }
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

  return (
    <Box sx={{ p: 2, height: '100%', overflowY: 'auto', boxSizing: 'border-box' }}>
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
        {mode === 'edit' && (
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

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={clearError}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="error" onClose={clearError} variant="filled">
          {error}
        </Alert>
      </Snackbar>
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
