import { useCallback, useState } from 'react';
import { useAuth } from '../../../auth/authUtils';
import { useConfig } from '../../../contexts/configContext';
import type { VehicleEditFormValue } from '../components/VehicleEditForm';
import type { VehicleWire } from '../api/fetchVehicles';
import { createOrUpdateVehicleRequest } from '../../../graphql/vehicles/mutations/createOrUpdateVehicle';

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

  const save = useCallback(
    async (form: VehicleEditFormValue): Promise<SaveResult> => {
      if (!applicationBaseUrl) {
        const message = 'Application base URL is not configured';
        setError(message);
        return { newId: null, error: message };
      }
      setSaving(true);
      setError(null);
      try {
        const wireVehicle = {
          registrationDate: form.vehicle.registrationDate,
          description: form.vehicle.description,
          chassisNumber: form.vehicle.chassisNumber,
          buildDate: form.vehicle.buildDate,
          netexId: form.vehicle.id == '' ? undefined : form.vehicle.id, // treat blank id as "new vehicle"
          name: form.vehicle.name,
          registrationNumber: form.vehicle.registrationNumber ?? '',
          operationalNumber: form.vehicle.operationalNumber,
          transportType: form.vehicle.transportType
            ? {
                netexId: form.vehicle.transportType.id ?? '',
              }
            : undefined,
        } as VehicleWire;
        const token = await getAccessToken();
        const body = await createOrUpdateVehicleRequest(applicationBaseUrl, token, wireVehicle);
        return { newId: body.createOrUpdateVehicle, error: body.error ?? null };
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        setError(message);
        return { newId: null, error: message };
      } finally {
        setSaving(false);
      }
    },
    [applicationBaseUrl, getAccessToken]
  );

  return { save, saving, error, clearError: () => setError(null) };
}
