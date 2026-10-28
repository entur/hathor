import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../auth/authUtils';
import { useConfig } from '../../../contexts/configContext';
import { serializeVehicleType } from '../api/fetchVehicleTypes.ts';
import type { VehicleType } from '../types/vehicleTypeTypes.ts';
import { createOrUpdateVehicleTypeRequest } from '../../../graphql/vehicles/mutations/createOrUpdateVehicleType';
import { useOrganisationsContext } from '../../../contexts/useOrganisationsContext';

interface SaveResult {
  newId: string | null;
  error: string | null;
}

interface UseVehicleTypeSaveResult {
  save: (form: VehicleType) => Promise<SaveResult>;
}

/**
 * Save a VehicleType via the `createOrUpdateVehicleType` GraphQL mutation,
 * serialising the editor's domain form to the full-document
 * {@link VehicleTypeInput} ({@link serializeVehicleType}). Mirrors
 * {@link useVehiclePairSave} (config base URL + bearer token)
 * but is a single full-document call, not an XML pair.
 *
 * @returns `save` (→ `{ newId, error }`; never throws).
 */
export function useVehicleTypeSave(): UseVehicleTypeSaveResult {
  const { t } = useTranslation();
  const { getAccessToken } = useAuth();
  const { applicationBaseUrl } = useConfig();
  const { currentOrganisation } = useOrganisationsContext();

  const save = useCallback(
    async (form: VehicleType): Promise<SaveResult> => {
      if (!applicationBaseUrl) {
        return { newId: null, error: t('error.noBaseUrl') };
      }
      if (!currentOrganisation?.id) {
        return { newId: null, error: t('vehicleType.save.noOrganisation') };
      }
      try {
        const token = await getAccessToken();
        const body = await createOrUpdateVehicleTypeRequest(
          applicationBaseUrl,
          token,
          serializeVehicleType(form, currentOrganisation.id)
        );
        return { newId: body.createOrUpdateVehicleType, error: null };
      } catch (err) {
        return { newId: null, error: err instanceof Error ? err.message : String(err) };
      }
    },
    [applicationBaseUrl, getAccessToken, currentOrganisation?.id, t]
  );

  return { save };
}
