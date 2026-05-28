import { useState } from 'react';
import { Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import GenericDetailsPage from './GenericDetailsPage';
import VehicleEditForm, { type VehicleEditFormValue } from '../data/vehicles/VehicleEditForm';
import SaveErrorSnackbar from '../data/vehicles/SaveErrorSnackbar';
import SaveSuccessSnackbar from '../data/vehicles/SaveSuccessSnackbar';
import DiscardDialog from '../components/dialogs/DiscardDialog';
import { BLANK_FORM } from '../data/vehicles/utils/vehicleFormDefaults';
import { useVehiclePairSave } from '../data/vehicles/xml/useVehiclePairSave';
import { useDirtyFormBlock } from '../data/vehicles/useDirtyFormBlock';
import { canSubmit } from '../data/vehicles/vehicleFormState';
import { waitForVehicleInList } from '../data/vehicles/api/waitForVehicleInList';
import { vehicleSelectedHref } from '../data/vehicles/utils/vehicleUrlParams';
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
  const [saved, setSaved] = useState(false);
  const [savedKey, setSavedKey] = useState(BLANK_FORM_KEY);
  const [confirmingBack, setConfirmingBack] = useState(false);
  const { save, error, clearError } = useVehiclePairSave();

  // Baseline advances to the saved form on success, so a saved-then-untouched
  // form reads as clean — no spurious discard dialog, no beforeunload block.
  const isDirty = JSON.stringify(form) !== savedKey;
  useDirtyFormBlock(isDirty);

  const handleSave = async () => {
    const result = await save(form);
    if (result.error) return;
    setSavedKey(JSON.stringify(form));
    setSavedNewId(result.newId);
    setSaved(true);
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
    setSaved(false);
    // TODO: clear active ?search= filter before deep-link — a filter may
    // otherwise hide the new row (issue #24 brings filter UX).
    navigate(id ? vehicleSelectedHref(id) : '/vehicles');
  };

  return (
    <>
      <GenericDetailsPage
        title="New Vehicle"
        onSave={handleSave}
        saveDisabled={!canSubmit(form)}
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
        open={saved}
        message={t('vehicles.saveSuccess', 'Vehicle saved')}
        onClose={() => setSaved(false)}
        action={
          savedNewId
            ? {
                label: t('vehicles.saveSuccess.viewInList', 'View in list'),
                onClick: handleViewInList,
              }
            : undefined
        }
      />
    </>
  );
}
