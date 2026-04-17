import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Paper, Typography } from '@mui/material';
import { Editor, validate, serialize } from '@entur/vehicle-details';
import type { Vehicle as EditorVehicle } from '@entur/vehicle-details';
import { useAuth } from '../auth/authUtils';
import { useConfig } from '../contexts/configContext';
import { importAsNetexToBackend } from '../data/netexImport';
import { wrapInPublicationDelivery } from '../data/xmlUtils';
import { useVehicle } from '../data/vehicles/useVehicle';
import LoadingPage from '../components/common/LoadingPage';
import ErrorPage from '../components/common/ErrorPage';
import GenericDetailsPage from './GenericDetailsPage';

export default function VehicleDetails() {
  const { id } = useParams();

  const [value, setValue] = useState<Partial<EditorVehicle>>({});
  const [errors, setErrors] = useState<string[]>([]);

  const { getAccessToken } = useAuth();
  const { applicationImportBaseUrl } = useConfig();

  const { data, loading, error } = useVehicle(id);

  useEffect(() => {
    if (data) setValue(data);
  }, [data]);

  const handleSave = async () => {
    const result = validate(value);
    setErrors(result.errors);
    if (result.errors.length > 0) throw new Error('Validation failed');

    if (!applicationImportBaseUrl) {
      throw new Error('Application import base URL is not configured');
    }

    const fragment = serialize(value);
    const xml = wrapInPublicationDelivery(fragment, 'vehicles');
    const token = await getAccessToken();
    await importAsNetexToBackend(applicationImportBaseUrl, xml, token);
  };

  if (loading) return <LoadingPage />;
  if (error) return <ErrorPage message={error} />;

  const isEmpty = Object.keys(value).length === 0;
  const title = value?.Name?.[0]?.value ?? value?.RegistrationNumber ?? id ?? 'Vehicle';

  return (
    <GenericDetailsPage
      title={title}
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
