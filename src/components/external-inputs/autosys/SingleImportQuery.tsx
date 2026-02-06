import { TextField } from '@mui/material';
import Button from '@mui/material/Button';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { useTranslation } from 'react-i18next';

interface SingleImportQueryProps {
  registrationNumber: string;
  operationalId: string;
  onRegistrationNumberChange: (value: string) => void;
  onOperationalIdChange: (value: string) => void;
  onFetch: () => void;
  onClose: () => void;
}

export default function SingleImportQuery({
  registrationNumber,
  operationalId,
  onRegistrationNumberChange,
  onOperationalIdChange,
  onFetch,
  onClose,
}: SingleImportQueryProps) {
  const { t } = useTranslation();

  return (
    <>
      <DialogContent dividers>
        <TextField
          label={t('import.registrationNumber', 'Registration Number')}
          value={registrationNumber}
          onChange={e => onRegistrationNumberChange(e.target.value)}
          fullWidth
          data-testid="autosys-registration-number"
        />
        <TextField
          label={t('import.operationalId', 'Operational ID')}
          value={operationalId}
          onChange={e => onOperationalIdChange(e.target.value)}
          fullWidth
          data-testid="autosys-operational-id"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onFetch} variant="contained" data-testid="autosys-fetch-button">
          {t('import.importData', 'Fetch data from external registry')}
        </Button>
        <Button onClick={onClose} variant="outlined">
          {t('close')}
        </Button>
      </DialogActions>
    </>
  );
}
