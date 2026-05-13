import { useState } from 'react';
import { Alert, Paper, Snackbar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import GenericDetailsPage from './GenericDetailsPage';
import VehicleEditForm, { type VehicleEditFormValue } from '../data/vehicles/VehicleEditForm';
import { useVehiclePairSave } from '../data/vehicles/useVehiclePairSave';
import { useDirtyFormBlock } from '../data/vehicles/useDirtyFormBlock';

/**
 * Constant placeholder id for the inline VehicleModel side of the 1-to-1
 * Vehicle + VehicleModel pair. Server-side collapses the inlined model on
 * import (per issue #69). Vehicle's `VehicleModelRef` always points at this
 * constant so the client never has to mint a real id.
 */
const INLINE_MODEL_ID = 'INLINE:VehicleModel:1' as const;

const BLANK_FORM: VehicleEditFormValue = {
  vehicle: { VehicleModelRef: INLINE_MODEL_ID },
  model: { $id: INLINE_MODEL_ID },
};

const BLANK_FORM_KEY = JSON.stringify(BLANK_FORM);

/**
 * `/vehicle/new` — full-page Vehicle + VehicleModel create form.
 *
 * Save flow (issue #69):
 *  1. Build PublicationDelivery XML via `buildVehiclePairXml`.
 *  2. POST to Sobek `/import` via `importAsNetexToBackend`.
 *  3. Parse `Vehicle/@id` from the response body for deep-linking.
 *  4. Navigate to `/vehicle?selected=<newId>` — VehicleView remounts,
 *     `useVehicles` fetches a fresh list, sidebar opens on the new row.
 *
 * NOTE: pending #68 — `modification="new|revise"` client policy is
 * unresolved; the save handler does not set the attribute today.
 *
 * D3 fallback (issue #69): when the response doesn't echo a Vehicle id
 * we navigate to `/vehicle` (plain list) so the user can locate the new
 * row by `RegistrationNumber`. A proper refetch-and-find fallback can
 * land once the create flow has a reachable refetch handle.
 */
export default function VehicleCreatePage() {
  const navigate = useNavigate();
  const [form, setForm] = useState<VehicleEditFormValue>(BLANK_FORM);
  const { save, error, clearError } = useVehiclePairSave();

  const isDirty = JSON.stringify(form) !== BLANK_FORM_KEY;
  useDirtyFormBlock(isDirty);

  const handleSave = async () => {
    const { newId } = await save(form);
    // TODO: clear any active ?search= filter when navigating —
    // otherwise the deep-linked new row may be hidden behind a filter.
    // (Filter UX lands with the Sobek vehicles(filter) pushdown, issue #24.)
    if (newId) {
      navigate(`/vehicle?selected=${encodeURIComponent(newId)}`);
    } else {
      navigate('/vehicle');
    }
  };

  return (
    <>
      <GenericDetailsPage title="New Vehicle" onSave={handleSave}>
        <Paper sx={{ p: 3 }}>
          <VehicleEditForm value={form} onChange={setForm} mode="edit" />
        </Paper>
      </GenericDetailsPage>
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={clearError}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="error" onClose={clearError} variant="filled">
          {error}
        </Alert>
      </Snackbar>
    </>
  );
}
