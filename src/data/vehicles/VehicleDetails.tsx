import { useEffect, useState } from 'react';
import { Box, Typography, Button, Chip, Divider, Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { transportModeLabelKey } from '../netex/transportMode.ts';
import { VEHICLE_SELECTED_PARAM } from './vehicleUrlParams.ts';
import type { VehicleRow } from './vehicleTypes.ts';
import VehicleEditForm, { type VehicleEditFormValue } from './VehicleEditForm.tsx';

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
 * Save is stubbed in this commit; commit 5 (per issue #69) adds the Save
 * button + wires `buildPublicationDeliveryXml` + `importAsNetexToBackend`,
 * after-save navigation, toast on error, and `useBlocker` nav guard.
 */
export default function VehicleDetails({ vehicle }: VehicleDetailsProps) {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [mode, setMode] = useState<'view' | 'edit'>('view');
  const [form, setForm] = useState<VehicleEditFormValue>(emptyForm);

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
        <Button variant="outlined" onClick={closeSlider}>
          {t('close', 'Close')}
        </Button>
      </Stack>
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
