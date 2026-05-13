import { useState } from 'react';
import { Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import GenericDetailsPage from './GenericDetailsPage';
import VehicleEditForm, { type VehicleEditFormValue } from '../data/vehicles/VehicleEditForm';
import SaveErrorSnackbar from '../data/vehicles/SaveErrorSnackbar';
import { BLANK_FORM } from '../data/vehicles/vehicleFormDefaults';
import { useVehiclePairSave } from '../data/vehicles/useVehiclePairSave';
import { useDirtyFormBlock } from '../data/vehicles/useDirtyFormBlock';

const BLANK_FORM_KEY = JSON.stringify(BLANK_FORM);

export default function VehicleCreatePage() {
  const navigate = useNavigate();
  const [form, setForm] = useState<VehicleEditFormValue>(BLANK_FORM);
  const { save, error, clearError } = useVehiclePairSave();

  useDirtyFormBlock(JSON.stringify(form) !== BLANK_FORM_KEY);

  const handleSave = async () => {
    const result = await save(form);
    if (result.error) return;
    // TODO: clear active ?search= filter before deep-link — a filter may
    // otherwise hide the new row (issue #24 brings filter UX).
    navigate(result.newId ? `/vehicle?selected=${encodeURIComponent(result.newId)}` : '/vehicle');
  };

  return (
    <>
      <GenericDetailsPage title="New Vehicle" onSave={handleSave}>
        <Paper sx={{ p: 3 }}>
          <VehicleEditForm value={form} onChange={setForm} mode="edit" />
        </Paper>
      </GenericDetailsPage>
      <SaveErrorSnackbar error={error} onClose={clearError} />
    </>
  );
}
