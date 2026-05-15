import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { Box, Button, Chip, CircularProgress, Divider, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { transportModeLabelKey } from '../netex/transportMode.ts';
import NetexId from '../netex/NetexId.tsx';
import { VEHICLE_SELECTED_PARAM } from './vehicleUrlParams.ts';
import type { VehicleRow } from './vehicleTypes.ts';
import VehicleEditForm, {
  type VehicleEditFormValue,
  LABEL_COL_MIN,
  LABEL_COL_MAX,
  COL_GAP,
} from './VehicleEditForm.tsx';
import { firstText } from '../netex/multilingualString.ts';
import SaveErrorSnackbar from './SaveErrorSnackbar.tsx';
import { BLANK_FORM, hydrateFromRow } from './vehicleFormDefaults.ts';
import { useVehiclePairSave } from './useVehiclePairSave.ts';
import { useDirtyFormBlock } from './useDirtyFormBlock.ts';

const BLANK_NAME = 'unnamed';

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
  const trimmedName = firstText(form.vehicle.Name).trim();

  return (
    <Box sx={{ p: 2, height: '100%', overflowY: 'auto', boxSizing: 'border-box' }}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 1, gap: 1 }}
      >
        <Stack direction="row" alignItems="center" spacing={1} sx={{ minWidth: 0, flex: 1 }}>
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
          <NetexId id={vehicle.id} version={vehicle.version} />
        </Stack>
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
              {vehicle.parentVehicleTypeId && <NetexId id={vehicle.parentVehicleTypeId} />}
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
