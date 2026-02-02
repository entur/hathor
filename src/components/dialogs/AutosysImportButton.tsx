import { useState } from 'react';
import { SpeedDial, SpeedDialAction, SpeedDialIcon } from '@mui/material';
import { FileUpload, LibraryAdd } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import AutosysImportDialog from './AutosysImportDialog';

export default function AutosysImportButton() {
  const [singleOpen, setSingleOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <>
      <SpeedDial
        ariaLabel={t('vehicleType.actions.importMenu', 'Import actions')}
        sx={{ position: 'absolute', bottom: 24, right: 24 }}
        icon={<SpeedDialIcon />}
        data-testid="import-speed-dial"
      >
        <SpeedDialAction
          icon={<FileUpload />}
          tooltipTitle={t('vehicleType.actions.import', 'Import vehicle')}
          onClick={() => setSingleOpen(true)}
          data-testid="import-vehicle-button"
        />
        <SpeedDialAction
          icon={<LibraryAdd />}
          tooltipTitle={t('vehicleType.actions.importMulti', 'Bulk import')}
          onClick={() => {
            /* TODO: multi-import */
          }}
          data-testid="import-vehicle-multi-button"
        />
      </SpeedDial>
      <AutosysImportDialog open={singleOpen} onClose={() => setSingleOpen(false)} />
    </>
  );
}
