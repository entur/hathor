import { FileUpload, LibraryAdd } from '@mui/icons-material';
import { Dialog, Fab, Tooltip } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import AutosysMultiImport from './AutosysMultiImport';
import AutosysSingleImport from './AutosysSingleImport';

export default function AutosysImportFloatingMenu() {
  const [open, setOpen] = useState(false);
  const [singleOpen, setSingleOpen] = useState(false);
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
      <Tooltip title={t('vehicleType.actions.importSingle', 'Import')}>
        <Fab
          sx={{ ml: 1 }}
          size="small"
          color="primary"
          onClick={() => setSingleOpen(true)}
          data-testid="import-vehicle-single-button"
          aria-label={t('vehicleType.actions.importSingle', 'Import')}
        >
          <FileUpload />
        </Fab>
      </Tooltip>
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <AutosysMultiImport
          onClose={() => setOpen(false)}
          onImportComplete={handleImportComplete}
        />
      </Dialog>
      {/* Legacy for e2e-tests  */}
      <Dialog open={singleOpen} onClose={() => setSingleOpen(false)} maxWidth="xs" fullWidth>
        <AutosysSingleImport onClose={() => setSingleOpen(false)} />
      </Dialog>
    </>
  );
}
