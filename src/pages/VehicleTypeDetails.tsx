import { useState } from 'react';
import { Container, Paper, Typography, Box, Button, Alert, CircularProgress } from '@mui/material';
import { Editor, validate, serialize } from '@entur/my_vehicletype-editor';
import type { VehicleType } from '@entur/my_vehicletype-editor';
import { useAuth } from '../auth/authUtils';
import { useConfig } from '../contexts/configContext';
import { importAsNetexToBackend } from '../data/vehicle-imports/vehicleImportServices';
import { wrapInPublicationDelivery } from '../data/vehicle-imports/xmlUtils';

export default function VehicleTypeDetails() {
  const [value, setValue] = useState<Partial<VehicleType>>({});
  const [errors, setErrors] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const { getAccessToken } = useAuth();
  const { applicationImportBaseUrl } = useConfig();

  const handleValidate = () => {
    const result = validate(value);
    setErrors(result.errors);
  };

  const handleSave = async () => {
    setSaveError(null);
    setSaveSuccess(false);

    const result = validate(value);
    setErrors(result.errors);
    if (result.errors.length > 0) return;

    setSaving(true);
    try {
      const fragment = serialize(value);
      const xml = wrapInPublicationDelivery(fragment);
      const token = await getAccessToken();
      await importAsNetexToBackend(applicationImportBaseUrl!, xml, token);
      setSaveSuccess(true);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : String(err));
    } finally {
      setSaving(false);
    }
  };

  const isEmpty = Object.keys(value).length === 0;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        New VehicleType (beta)
      </Typography>
      <Paper sx={{ p: 3, mb: 2 }}>
        <Editor value={value} onChange={setValue} />
      </Paper>
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <Button variant="contained" onClick={handleValidate}>
          Validate
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          disabled={saving || isEmpty || !applicationImportBaseUrl}
          startIcon={saving ? <CircularProgress size={18} color="inherit" /> : undefined}
        >
          {saving ? 'Saving…' : 'Save'}
        </Button>
      </Box>
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
      {saveSuccess && (
        <Alert severity="success" sx={{ mt: 2 }}>
          VehicleType saved successfully.
        </Alert>
      )}
      {saveError && (
        <Alert severity="error" sx={{ mt: 2 }}>
          Save failed: {saveError}
        </Alert>
      )}
    </Container>
  );
}
