import { Grid } from '@mui/material';
import Button from '@mui/material/Button';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { useTranslation } from 'react-i18next';
import type { NeTExResourceFrame } from '../../../data/vehicle-types/vehicleTypeTypes';

interface AutosysSingleConfirmProps {
  operationalId: string;
  resourceFrame: NeTExResourceFrame;
  onConfirm: () => void;
  onClose: () => void;
}

export default function AutosysSingleConfirm({
  operationalId,
  resourceFrame,
  onConfirm,
  onClose,
}: AutosysSingleConfirmProps) {
  const { t } = useTranslation();

  return (
    <>
      <DialogContent dividers>
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid size={6}>{t('import.registrationNumber', 'Registration Number')}</Grid>
          <Grid size={6}>{resourceFrame.vehicles?.Vehicle?.RegistrationNumber}</Grid>
          <Grid size={6}>{t('import.operationalId', 'Operational ID')}</Grid>
          <Grid size={6}>{operationalId}</Grid>
          <Grid size={6}>{t('import.result.type', 'Type')}</Grid>
          <Grid size={6}>{resourceFrame.deckPlans?.DeckPlan?.Name}</Grid>
          <Grid size={6}>{t('import.result.capacity', 'Capacity')}</Grid>
          <Grid size={6}>
            {t('import.result.seatingCapacity', '{{count}} seats', {
              count: resourceFrame.vehicleTypes?.VehicleType?.PassengerCapacity?.SeatingCapacity,
            })}{' '}
            {resourceFrame.vehicleTypes?.VehicleType?.PassengerCapacity?.StandingCapacity &&
              t('import.result.standingCapacity', ', {{count}} standing places', {
                count: resourceFrame.vehicleTypes?.VehicleType?.PassengerCapacity?.StandingCapacity,
              })}
          </Grid>
          <Grid size={6}>{t('import.result.fuelType', 'Fuel Type')}</Grid>
          <Grid size={6}>
            {t(
              'import.result.fuelTypeEnum.' +
                (resourceFrame.vehicleTypes?.VehicleType?.FuelTypes || ''),
              '' + resourceFrame.vehicleTypes?.VehicleType?.FuelTypes
            )}
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onConfirm} variant="contained" data-testid="autosys-confirm-button">
          {t('import.confirmImport', 'Confirm Import')}
        </Button>
        <Button onClick={onClose} variant="outlined">
          {t('close')}
        </Button>
      </DialogActions>
    </>
  );
}
