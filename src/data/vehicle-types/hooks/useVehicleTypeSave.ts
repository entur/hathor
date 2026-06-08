import { useCallback, useState } from 'react';
import { useAuth } from '../../../auth/authUtils';
import { useConfig } from '../../../contexts/configContext';
import { serializeVehicleType } from '../api/fetchVehicleTypes.ts';
import type { VehicleType } from '../types/vehicleTypeTypes.ts';
import { createOrUpdateVehicleTypeRequest } from '../../../graphql/vehicles/mutations/createOrUpdateVehicleType';
import { useOrganisations } from '../../organisations/hooks/useOrganisations.ts';

interface SaveResult {
  newId: string | null;
  error: string | null;
}

interface UseVehicleTypeSaveResult {
  save: (form: VehicleType) => Promise<SaveResult>;
  saving: boolean;
  error: string | null;
  clearError: () => void;
}

/**
 * Save a VehicleType via the `createOrUpdateVehicleType` GraphQL mutation,
 * serialising the editor's domain form to the full-document
 * {@link VehicleTypeInput} ({@link serializeVehicleType}). Mirrors
 * {@link useVehiclePairSave} (config base URL + bearer token, saving/error
 * state) but is a single full-document call, not an XML pair.
 *
 * @returns `save` (→ `{ newId, error }`), plus `saving`, `error`, `clearError`.
 */
export function useVehicleTypeSave(): UseVehicleTypeSaveResult {
  const { getAccessToken } = useAuth();
  const { applicationBaseUrl } = useConfig();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { currentOrganisation } = useOrganisations();

  const save = useCallback(
    async (form: VehicleType): Promise<SaveResult> => {
      if (!applicationBaseUrl) {
        const message = 'Application base URL is not configured';
        setError(message);
        return { newId: null, error: message };
      }
      setSaving(true);
      setError(null);
      try {
        const token = await getAccessToken();
        const body = await createOrUpdateVehicleTypeRequest(
          applicationBaseUrl,
          token,
          serializeVehicleType(form, currentOrganisation?.id ?? '')
        );
        return { newId: body.createOrUpdateVehicleType, error: null };
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        setError(message);
        return { newId: null, error: message };
      } finally {
        setSaving(false);
      }
    },
    [applicationBaseUrl, currentOrganisation?.id, getAccessToken]
  );

  return { save, saving, error, clearError: () => setError(null) };
}
