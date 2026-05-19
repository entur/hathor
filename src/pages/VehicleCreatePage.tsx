import { useState } from 'react';
import { Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import GenericDetailsPage from './GenericDetailsPage';
import VehicleEditForm, { type VehicleEditFormValue } from '../data/vehicles/VehicleEditForm';
import SaveErrorSnackbar from '../data/vehicles/SaveErrorSnackbar';
import SaveSuccessSnackbar from '../data/vehicles/SaveSuccessSnackbar';
import DiscardDialog from '../components/dialogs/DiscardDialog';
import { BLANK_FORM } from '../data/vehicles/vehicleFormDefaults';
import { useVehiclePairSave } from '../data/vehicles/xml/useVehiclePairSave';
import { useDirtyFormBlock } from '../data/vehicles/useDirtyFormBlock';
import { isComplete } from '../data/vehicles/vehicleFormState';
import { waitForVehicleInList } from '../data/vehicles/waitForVehicleInList';
import { vehicleSelectedHref } from '../data/vehicles/projection/vehicleUrlParams';
import { useAuth } from '../auth/authUtils';
import { useConfig } from '../contexts/configContext';

const BLANK_FORM_KEY = JSON.stringify(BLANK_FORM);

export default function VehicleCreatePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { applicationBaseUrl } = useConfig();
  const { getAccessToken } = useAuth();
  const [form, setForm] = useState<VehicleEditFormValue>(BLANK_FORM);
  const [savedNewId, setSavedNewId] = useState<string | null>(null);
  const [confirmingBack, setConfirmingBack] = useState(false);
  const { save, error, clearError } = useVehiclePairSave();

  const isDirty = JSON.stringify(form) !== BLANK_FORM_KEY;
  // Suppress dirty-block while the success snackbar is up.
  useDirtyFormBlock(savedNewId === null && isDirty);

  const handleSave = async () => {
    const result = await save(form);
    if (result.error) return;
    setSavedNewId(result.newId);
  };

  const handleBack = () => {
    if (isDirty) setConfirmingBack(true);
    else navigate('/vehicles');
  };
  const handleDiscardBack = () => {
    setConfirmingBack(false);
    navigate('/vehicles');
  };

  const handleViewInList = async () => {
    const id = savedNewId;
    if (id && applicationBaseUrl) {
      // Wait for the backend to index the new vehicle so the slider on the
      // next page resolves to a found row instead of the not-found body.
      await waitForVehicleInList(id, applicationBaseUrl, getAccessToken);
    }
    setSavedNewId(null);
    // TODO: clear active ?search= filter before deep-link — a filter may
    // otherwise hide the new row (issue #24 brings filter UX).
    navigate(id ? vehicleSelectedHref(id) : '/vehicles');
  };

  return (
    <>
      <GenericDetailsPage
        title="New Vehicle"
        onSave={handleSave}
        saveDisabled={!isComplete(form)}
        onBack={handleBack}
      >
        <Paper sx={{ p: 3 }}>
          <VehicleEditForm value={form} onChange={setForm} mode="edit" />
        </Paper>
      </GenericDetailsPage>
      <DiscardDialog
        open={confirmingBack}
        onCancel={() => setConfirmingBack(false)}
        onDiscard={handleDiscardBack}
      />
      <SaveErrorSnackbar error={error} onClose={clearError} />
      <SaveSuccessSnackbar
        open={savedNewId !== null}
        message={t('vehicles.saveSuccess', 'Vehicle saved')}
        onClose={() => setSavedNewId(null)}
        action={{
          label: t('vehicles.saveSuccess.viewInList', 'View in list'),
          onClick: handleViewInList,
        }}
      />
    </>
  );
}
