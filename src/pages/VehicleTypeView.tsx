import { vehicleTypeViewConfig } from '../data/vehicle-types/vehicleTypeViewConfig.tsx';
import GenericDataViewPage from './GenericDataViewPage.tsx';
import type { VehicleType } from '../data/vehicle-types/vehicleTypeTypes.ts';
import type { OrderBy } from '../data/vehicle-types/useVehicleTypes.ts';
import { useState } from 'react';
import { Box, Button } from '@mui/material';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import AutosysImportDialog from '../components/dialogs/AutosysImportDialog.tsx';
import { useTranslation } from 'react-i18next';

export default function VehicleTypeView() {
  const [importOpen, setImportOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box
        sx={{
          display: 'flex',
          gap: 1,
          alignItems: 'center',
          px: 2,
          py: 1,
          flexShrink: 0,
        }}
      >
        <Button
          variant="contained"
          startIcon={<FileUploadIcon />}
          onClick={() => setImportOpen(true)}
          data-testid="import-vehicle-button"
        >
          {t('vehicleType.actions.import', 'Import vehicle')}
        </Button>
      </Box>
      <Box sx={{ flex: 1, minHeight: 0 }}>
        <GenericDataViewPage<VehicleType, OrderBy> viewConfig={vehicleTypeViewConfig} />
      </Box>
      <AutosysImportDialog open={importOpen} onClose={() => setImportOpen(false)} />
    </Box>
  );
}
