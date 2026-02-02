import { FileUpload, LibraryAdd } from '@mui/icons-material';
import { Dialog, SpeedDial, SpeedDialAction, SpeedDialIcon } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import AutosysMultiImport from './AutosysMultiImport';
import AutosysSingleImport from './AutosysSingleImport';

export default function AutosysImportFloatingMenu() {
  const [singleOpen, setSingleOpen] = useState(false);
  const [multiOpen, setMultiOpen] = useState(false);
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
          slotProps={{
            tooltip: {
              title: t('vehicleType.actions.import', 'Import vehicle'),
            },
          }}
          onClick={() => setSingleOpen(true)}
          data-testid="import-vehicle-button"
        />
        <SpeedDialAction
          icon={<LibraryAdd />}
          slotProps={{
            tooltip: {
              title: t('vehicleType.actions.importMulti', 'Bulk import'),
            },
          }}
          onClick={() => setMultiOpen(true)}
          data-testid="import-vehicle-multi-button"
        />
      </SpeedDial>
      <Dialog open={singleOpen} onClose={() => setSingleOpen(false)} maxWidth="xs" fullWidth>
        <AutosysSingleImport onClose={() => setSingleOpen(false)} />
      </Dialog>
      <Dialog open={multiOpen} onClose={() => setMultiOpen(false)} maxWidth="sm" fullWidth>
        <AutosysMultiImport onClose={() => setMultiOpen(false)} />
      </Dialog>
    </>
  );
}
