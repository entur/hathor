import { LibraryAdd } from '@mui/icons-material';
import { Button, Dialog } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import MultiImport from './MultiImport';

export default function AutosysImportFloatingMenu() {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const label = t('vehicleType.actions.importMulti', 'Import');

  const handleImportComplete = (vehicleTypeIds: string[]) => {
    setOpen(false);
    if (vehicleTypeIds.length > 0) {
      const filterParam = vehicleTypeIds.join(',');
      navigate(`/vehicle-types?filter=${encodeURIComponent(filterParam)}`, { replace: true });
    }
  };

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        startIcon={<LibraryAdd />}
        onClick={() => setOpen(true)}
        data-testid="import-vehicle-multi-button"
        aria-label={label}
        sx={{ textTransform: 'none' }}
      >
        {label}
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <MultiImport onClose={() => setOpen(false)} onImportComplete={handleImportComplete} />
      </Dialog>
    </>
  );
}
