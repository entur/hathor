import type { VehicleImport } from '../data/vehicle-imports/vehicleImportTypes.ts';
import { vehicleImportViewConfig } from '../data/vehicle-imports/vehicleImportViewConfig.tsx';
import { type OrderBy } from '../data/vehicle-imports/useVehicleImports.ts';
import GenericDataEditPage from './GenericDataEditPage.tsx';
import { Box, Button } from '@mui/material';
import { useState } from 'react';
import ImportDialog from '../components/dialogs/ImportDialog.tsx';

export default function VehicleImportView() {
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
      <GenericDataEditPage<VehicleImport, OrderBy> viewConfig={vehicleImportViewConfig} />

      <ImportDialog open={importOpen} onClose={() => setImportOpen(false)} />
    </>
  );
}
