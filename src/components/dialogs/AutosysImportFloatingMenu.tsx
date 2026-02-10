import { LibraryAdd } from '@mui/icons-material';
import { Dialog, Fab, Tooltip } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import MultiImport from '../external-inputs/autosys/MultiImport';

export default function AutosysImportFloatingMenu() {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleImportComplete = (vehicleTypeIds: string[]) => {
    setOpen(false);
    if (vehicleTypeIds.length > 0) {
      const filterParam = vehicleTypeIds.join(',');
      navigate(`/vehicle-type?filter=${encodeURIComponent(filterParam)}`, { replace: true });
    }
  };

  return (
    <>
      <Tooltip title={t('vehicleType.actions.importMulti', 'Bulk import')}>
        <Fab
          size="small"
          color="primary"
          onClick={() => setOpen(true)}
          data-testid="import-vehicle-multi-button"
          aria-label={t('vehicleType.actions.importMulti', 'Bulk import')}
        >
          <LibraryAdd />
        </Fab>
      </Tooltip>
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <MultiImport onClose={() => setOpen(false)} onImportComplete={handleImportComplete} />
      </Dialog>
    </>
  );
}
