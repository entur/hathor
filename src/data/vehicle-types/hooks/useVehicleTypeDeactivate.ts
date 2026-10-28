import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../auth/authUtils.ts';
import { useConfig } from '../../../contexts/configContext.ts';
import type { VehicleType } from '../types/vehicleTypeTypes.ts';
import { useOrganisationsContext } from '../../../contexts/useOrganisationsContext.ts';
import { deactivateVehicleTypeRequest } from '../../../graphql/vehicles/mutations/deactivateVehicleType.ts';

interface SaveResult {
  newVersion: number | null;
  error: string | null;
}

interface UseVehicleTypeDeactivateResult {
  deactivate: (form: VehicleType) => Promise<SaveResult>;
}

/**
 * Deactivate a VehicleType via the `deactivateVehicleType` GraphQL mutation.
 *
 * @returns `deactivate` (→ `{ newVersion, error }`; never throws).
 */
export function useVehicleTypeDeactivate(): UseVehicleTypeDeactivateResult {
  const { t } = useTranslation();
  const { getAccessToken } = useAuth();
  const { applicationBaseUrl } = useConfig();
  const { currentOrganisation } = useOrganisationsContext();

  const deactivate = useCallback(
    async (form: VehicleType): Promise<SaveResult> => {
      if (!applicationBaseUrl) {
        return { newVersion: null, error: t('error.noBaseUrl') };
      }
      if (!currentOrganisation?.id) {
        return { newVersion: null, error: t('vehicleType.deactivate.noOrganisation') };
      }
      try {
        const token = await getAccessToken();
        const body = await deactivateVehicleTypeRequest(applicationBaseUrl, token, {
          netexId: form.id,
          version: Number(form.version),
          deactivateAt: new Date().toISOString(),
        });
        return { newVersion: body.deactivateVehicleType?.version ?? null, error: null };
      } catch (err) {
        return { newVersion: null, error: err instanceof Error ? err.message : String(err) };
      }
    },
    [applicationBaseUrl, getAccessToken, currentOrganisation?.id, t]
  );

  return { deactivate };
}
