import { vehicleTypeViewConfig } from '../data/vehicle-types/vehicleTypeViewConfig.tsx';
import GenericDataViewPage from './GenericDataViewPage.tsx';
import type { VehicleType } from '../data/vehicle-types/vehicleTypeTypes.ts';
import type { OrderBy } from '../data/vehicle-types/useVehicleTypes.ts';
import { useState } from 'react';
import { Box, Button } from '@mui/material';
import ImportDialog from '../components/dialogs/ImportDialog.tsx';

export default function VehicleTypeView() {
  const [importOpen, setImportOpen] = useState(false);

  const doImport = () => {
    setImportOpen(true);
  };

  return (
    <>
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        <Button variant="contained" color="primary" onClick={() => doImport()}>
          Import data
        </Button>
      </Box>
      <GenericDataViewPage<VehicleType, OrderBy> viewConfig={vehicleTypeViewConfig} />

      <ImportDialog open={importOpen} onClose={() => setImportOpen(false)} />
    </>
  );
}
