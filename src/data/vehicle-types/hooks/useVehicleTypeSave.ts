import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../auth/authUtils';
import { useConfig } from '../../../contexts/configContext';
import { serializeVehicleType } from '../api/fetchVehicleTypes.ts';
import {
  VEHICLE_TYPE_KIND,
  type VehicleType,
  type VehicleTypeKind,
} from '../types/vehicleTypeTypes.ts';
import { createOrUpdateVehicleTypeRequest } from '../../../graphql/vehicles/mutations/createOrUpdateVehicleType';
import { useOrganisationsContext } from '../../../contexts/useOrganisationsContext';
import { graphqlErrMsg } from '../../graphqlErrMsg';

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
 * {@link useVehiclePairSave} (config base URL + bearer token) but is a single
 * full-document call, not an XML pair.
 *
 * @param kind PHYSICAL (default) or CONTRACTUAL, sent as `vehicleTypeKind`.
 * @returns `save` (→ `{ newId, error }`); never throws.
 */
export function useVehicleTypeSave(
  kind: VehicleTypeKind = VEHICLE_TYPE_KIND
): UseVehicleTypeSaveResult {
  const { t } = useTranslation();
  const { getAccessToken } = useAuth();
  const { applicationBaseUrl } = useConfig();
  const { currentOrganisation } = useOrganisationsContext();

  const save = useCallback(
    async (form: VehicleType): Promise<SaveResult> => {
      if (!applicationBaseUrl) {
        const message = t('error.noBaseUrl');
        return { newId: null, error: message };
      }
      if (!currentOrganisation?.id) {
        const message = t('vehicleType.save.noOrganisation');
        return { newId: null, error: message };
      }
      try {
        const token = await getAccessToken();
        const body = await createOrUpdateVehicleTypeRequest(
          applicationBaseUrl,
          token,
          serializeVehicleType(form, currentOrganisation.id, kind)
        );
        return { newId: body.createOrUpdateVehicleType, error: null };
      } catch (err) {
        const message = graphqlErrMsg(err);
        return { newId: null, error: message };
      }
    },
    [applicationBaseUrl, getAccessToken, currentOrganisation?.id, kind, t]
  );

  return { save };
}
