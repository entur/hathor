import { useState } from 'react';
import { Paper } from '@mui/material';
import GenericDetailsPage from './GenericDetailsPage';
import VehicleEditForm, { type VehicleEditFormValue } from '../data/vehicles/VehicleEditForm';

/**
 * Constant placeholder id for the inline VehicleModel side of the 1-to-1
 * Vehicle + VehicleModel pair. Server-side collapses the inlined model on
 * import (per issue #69). Vehicle's `VehicleModelRef` always points at this
 * constant so the client never has to mint a real id.
 */
const INLINE_MODEL_ID = 'INLINE:VehicleModel:1' as const;

const blankForm: VehicleEditFormValue = {
  vehicle: { VehicleModelRef: INLINE_MODEL_ID },
  model: { $id: INLINE_MODEL_ID },
};

/**
 * `/vehicle/new` — full-page Vehicle + VehicleModel create form. Mounts
 * `VehicleEditForm` in edit mode against a blank state preset with the
 * INLINE model id.
 *
 * Save is stubbed in this commit; commit 5 (per issue #69) wires
 * `buildPublicationDeliveryXml` + `importAsNetexToBackend` and adds the
 * after-save navigation, refetch, toast, and dirty-form nav guard.
 *
 * NOTE: pending #68 — `modification="new|revise"` client policy is
 * unresolved; save handler will not set the attribute until that decision
 * lands.
 */
export default function VehicleCreatePage() {
  const [form, setForm] = useState<VehicleEditFormValue>(blankForm);

  const handleSave = async () => {
    // TODO(commit 5, issue #69): wire buildPublicationDeliveryXml +
    // importAsNetexToBackend; navigate to /vehicle?selected=<newId>;
    // toast on error; dirty-form nav guard.
    console.warn('Vehicle save not yet wired', form);
    throw new Error('Save not yet wired (see issue #69)');
  };

  return (
    <GenericDetailsPage title="New Vehicle" onSave={handleSave}>
      <Paper sx={{ p: 3 }}>
        <VehicleEditForm value={form} onChange={setForm} mode="edit" />
      </Paper>
    </GenericDetailsPage>
  );
}
