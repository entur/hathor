import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { useTranslation } from 'react-i18next';
import { Grid, TextField } from '@mui/material';
import { useConfig } from '../../contexts/ConfigContext';
import {
  fetchVehicleFromAutosys,
  importVehicle,
} from '../../data/vehicle-imports/vehicleImportServices';
import type { NeTExResourceFrame } from '../../data/vehicle-types/vehicleTypeTypes';
import { useState } from 'react';
import { XMLParser } from 'fast-xml-parser';
import { useAuth } from '../../auth';

interface ImportDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function ImportDialog({ open, onClose }: ImportDialogProps) {
  const { t } = useTranslation();

  const { applicationImportBaseUrl, applicationGetAutosysUrl } = useConfig();
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [operationalId, setOperationalId] = useState('');
  const [step, setStep] = useState(1);
  const [neTExXML, setNeTExXML] = useState('');
  const [NeTExResourceFrame, setNeTExResourceFrame] = useState<NeTExResourceFrame | null>(null);
  const { getAccessToken } = useAuth();

  const onFetch = async () => {
    const token = await getAccessToken();
    if (!token) {
      throw new Error('You must be authenticated to import vehicle data');
    }
    const retXML = await fetchVehicleFromAutosys(
      applicationGetAutosysUrl || '',
      registrationNumber,
      token
    );

    setNeTExXML(retXML);

    const parser = new XMLParser({
      ignoreAttributes: false,
    });

    const result = parser.parse(retXML);
    setNeTExResourceFrame(
      result.PublicationDelivery?.dataObjects?.CompositeFrame?.frames.ResourceFrame
    );
    setStep(2);
  };

  const onImport = async () => {
    const token = await getAccessToken();
    if (!token) {
      throw new Error('You must be authenticated to import vehicle data');
    }
    await importVehicle(applicationImportBaseUrl || '', neTExXML, token);
    setStep(1);
    setRegistrationNumber('');
    setOperationalId('');
    setNeTExXML('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{t('import.title', 'Import Vehicle')}</DialogTitle>
      <DialogContent dividers>
        {step === 1 && (
          <>
            <TextField
              label={t('import.registrationNumber', 'Registration Number')}
              value={registrationNumber}
              onChange={e => setRegistrationNumber(e.target.value)}
              fullWidth
            />
            <TextField
              label={t('import.operationalId', 'Operational ID')}
              value={operationalId}
              onChange={e => setOperationalId(e.target.value)}
              fullWidth
            />
          </>
        )}
        {step === 2 && (
          <>
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid size={6}>{t('import.registrationNumber', 'Registration Number')}</Grid>
              <Grid size={6}>{NeTExResourceFrame?.vehicles?.Vehicle?.RegistrationNumber}</Grid>
              <Grid size={6}>{t('import.operationalId', 'Operational ID')}</Grid>
              <Grid size={6}>{operationalId}</Grid>
              <Grid size={6}>{t('import.result.type', 'Type')}</Grid>
              <Grid size={6}>{NeTExResourceFrame?.deckPlans?.DeckPlan?.Name}</Grid>
              <Grid size={6}>{t('import.result.capacity', 'Capacity')}</Grid>
              <Grid size={6}>
                {t('import.result.seatingCapacity', '{{count}} seats', {
                  count:
                    NeTExResourceFrame?.vehicleTypes?.VehicleType?.PassengerCapacity
                      ?.SeatingCapacity,
                })}{' '}
                {NeTExResourceFrame?.vehicleTypes?.VehicleType?.PassengerCapacity
                  ?.StandingCapacity &&
                  t('import.result.standingCapacity', ', {{count}} standing places', {
                    count:
                      NeTExResourceFrame?.vehicleTypes?.VehicleType?.PassengerCapacity
                        ?.StandingCapacity,
                  })}
              </Grid>
              <Grid size={6}>{t('import.result.fuelType', 'Fuel Type')}</Grid>
              <Grid size={6}>
                {t(
                  'import.result.fuelTypeEnum.' +
                    (NeTExResourceFrame?.vehicleTypes?.VehicleType?.FuelTypes || ''),
                  '' + NeTExResourceFrame?.vehicleTypes?.VehicleType?.FuelTypes
                )}
              </Grid>
            </Grid>
          </>
        )}
      </DialogContent>
      <DialogActions>
        {step === 1 && (
          <Button onClick={onFetch} variant="contained">
            {t('import.importData', 'Fetch data from external registry')}
          </Button>
        )}
        {step === 2 && (
          <Button onClick={onImport} variant="outlined">
            {t('import.confirmImport', 'Confirm Import')}
          </Button>
        )}
        <Button onClick={onClose} variant="outlined">
          {t('close')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
