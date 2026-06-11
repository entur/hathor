import { useCallback, useState } from 'react';
import { useAuth } from '../../../auth/authUtils';
import { useConfig } from '../../../contexts/configContext';
import type { VehicleEditFormValue } from '../components/VehicleEditForm';
import { createOrUpdateVehicleRequest } from '../../../graphql/vehicles/mutations/createOrUpdateVehicle';
import { useOrganisations } from '../../organisations/hooks/useOrganisations';

const orUndef = <T>(s: string | undefined, value: T): T | undefined =>
  s && s.length > 0 ? value : undefined;

interface SaveResult {
  newId: string | null;
  error: string | null;
}

interface UseVehiclePairSaveResult {
  save: (form: VehicleEditFormValue) => Promise<SaveResult>;
  saving: boolean;
  error: string | null;
  clearError: () => void;
}

export function useVehiclePairSave(): UseVehiclePairSaveResult {
  const { getAccessToken } = useAuth();
  const { applicationBaseUrl } = useConfig();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { currentOrganisation } = useOrganisations();

  const save = useCallback(
    async (form: VehicleEditFormValue): Promise<SaveResult> => {
      if (!applicationBaseUrl) {
        const message = 'Application base URL is not configured';
        setError(message);
        return { newId: null, error: message };
      }
      if (!currentOrganisation?.id) {
        const message = 'No organisation selected — cannot save vehicle';
        setError(message);
        return { newId: null, error: message };
      }
      setSaving(true);
      setError(null);
      try {
        const wireVehicle = {
          dataOwnerRef: currentOrganisation.id,
          registrationDate: form.vehicle.registrationDate,
          description: orUndef(form.vehicle.description?.value, form.vehicle.description),
          chassisNumber: orUndef(form.vehicle.chassisNumber, form.vehicle.chassisNumber),
          buildDate: form.vehicle.buildDate,
          netexId: orUndef(form.vehicle.id, form.vehicle.id), // treat blank id as "new vehicle"
          name: orUndef(form.vehicle.name?.value, form.vehicle.name),
          registrationNumber: orUndef(
            form.vehicle.registrationNumber,
            form.vehicle.registrationNumber
          ),
          operationalNumber: orUndef(
            form.vehicle.operationalNumber,
            form.vehicle.operationalNumber
          ),
          transportType: form.vehicle.transportType
            ? {
                netexId: form.vehicle.transportType.id ?? '',
              }
            : undefined,
        };
        const token = await getAccessToken();
        const body = await createOrUpdateVehicleRequest(applicationBaseUrl, token, wireVehicle);
        return { newId: body.createOrUpdateVehicle, error: null };
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        setError(message);
        return { newId: null, error: message };
      } finally {
        setSaving(false);
      }
    },
    [applicationBaseUrl, getAccessToken, currentOrganisation?.id]
  );

  return { save, saving, error, clearError: () => setError(null) };
}
