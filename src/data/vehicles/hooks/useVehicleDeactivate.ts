import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../auth/authUtils.ts';
import { useConfig } from '../../../contexts/configContext.ts';
import { useOrganisationsContext } from '../../../contexts/useOrganisationsContext.ts';
import { deactivateVehicleRequest } from '../../../graphql/vehicles/mutations/deactivateVehicle.ts';
import type { Vehicle } from '../types/vehicle.ts';

interface SaveResult {
  newVersion: number | null;
  error: string | null;
}

interface UseVehicleDeactivateResult {
  deactivate: (form: Vehicle) => Promise<SaveResult>;
  saving: boolean;
}

/**
 * Deactivate a Vehicle via the `deactivateVehicle` GraphQL mutation.
 *
 * @returns `deactivate` (→ `{ newVersion, error }`) and `saving`.
 */
export function useVehicleDeactivate(): UseVehicleDeactivateResult {
  const { t } = useTranslation();
  const { getAccessToken } = useAuth();
  const { applicationBaseUrl } = useConfig();
  const { currentOrganisation } = useOrganisationsContext();
  const [saving, setSaving] = useState(false);

  const deactivate = useCallback(
    async (form: Vehicle): Promise<SaveResult> => {
      if (!applicationBaseUrl) {
        const message = t('error.noBaseUrl');
        return { newVersion: null, error: message };
      }
      if (!currentOrganisation?.id) {
        const message = t('vehicles.deactivate.noOrganisation');
        return { newVersion: null, error: message };
      }
      setSaving(true);
      try {
        const token = await getAccessToken();
        const body = await deactivateVehicleRequest(applicationBaseUrl, token, {
          netexId: form.id,
          version: Number(form.version),
          deactivateAt: new Date().toISOString(),
        });
        return { newVersion: body.deactivateVehicle?.version ?? null, error: null };
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        return { newVersion: null, error: message };
      } finally {
        setSaving(false);
      }
    },
    [applicationBaseUrl, getAccessToken, currentOrganisation?.id, t]
  );

  return { deactivate, saving };
}
