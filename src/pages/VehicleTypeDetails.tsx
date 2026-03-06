import { useState } from 'react';
import { Paper, Typography } from '@mui/material';
import { Editor, validate, serialize } from '@entur/my_vehicletype-editor';
import type { VehicleType } from '@entur/my_vehicletype-editor';
import { useAuth } from '../auth/authUtils';
import { useConfig } from '../contexts/configContext';
import { importAsNetexToBackend } from '../data/vehicle-imports/vehicleImportServices';
import { wrapInPublicationDelivery } from '../data/vehicle-imports/xmlUtils';
import GenericDetailsPage from './GenericDetailsPage';

export default function VehicleTypeDetails() {
  const [value, setValue] = useState<Partial<VehicleType>>({});
  const [errors, setErrors] = useState<string[]>([]);

  const { getAccessToken } = useAuth();
  const { applicationImportBaseUrl } = useConfig();

  const handleSave = async () => {
    const result = validate(value);
    setErrors(result.errors);
    if (result.errors.length > 0) throw new Error('Validation failed');

    if (!applicationImportBaseUrl) {
      throw new Error('Application import base URL is not configured');
    }

    const fragment = serialize(value);
    const xml = wrapInPublicationDelivery(fragment);
    const token = await getAccessToken();
    await importAsNetexToBackend(applicationImportBaseUrl, xml, token);
  };

  const isEmpty = Object.keys(value).length === 0;

  return (
    <GenericDetailsPage
      title="New VehicleType"
      onSave={handleSave}
      saveDisabled={isEmpty || !applicationImportBaseUrl}
    >
      <Paper sx={{ p: 3, mb: 2 }}>
        <Editor value={value} onChange={setValue} />
      </Paper>
      {errors.length > 0 && (
        <Paper sx={{ p: 2, bgcolor: 'error.light', color: 'error.contrastText' }}>
          <Typography variant="subtitle2" gutterBottom>
            Validation errors:
          </Typography>
          <ul style={{ margin: 0, paddingLeft: '1.5em' }}>
            {errors.map(e => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        </Paper>
      )}
    </GenericDetailsPage>
  );
}
