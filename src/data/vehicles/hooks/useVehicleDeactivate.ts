import { useCallback, useState } from 'react';
import { useAuth } from '../../../auth/authUtils.ts';
import { useConfig } from '../../../contexts/configContext.ts';
import { useOrganisations } from '../../organisations/hooks/useOrganisations.ts';
import { deactivateVehicleRequest } from '../../../graphql/vehicles/mutations/deactivateVehicle.ts';
import type { VehicleGQLShaped } from '../types/vehicleGqlShaped.ts';

interface SaveResult {
  newVersion: number | null;
  error: string | null;
}

interface UseVehicleDeactivateResult {
  deactivate: (form: VehicleGQLShaped) => Promise<SaveResult>;
  saving: boolean;
  error: string | null;
  clearError: () => void;
}

/**
 * Deactivate a Vehicle via the `deactivateVehicle` GraphQL mutation.
 *
 * @returns `deactivate` (→ `{ newVersion, error }`), plus `saving`, `error`, `clearError`.
 */
export function useVehicleDeactivate(): UseVehicleDeactivateResult {
  const { getAccessToken } = useAuth();
  const { applicationBaseUrl } = useConfig();
  const { currentOrganisation } = useOrganisations();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deactivate = useCallback(
    async (form: VehicleGQLShaped): Promise<SaveResult> => {
      if (!applicationBaseUrl) {
        const message = 'Application base URL is not configured';
        setError(message);
        return { newVersion: null, error: message };
      }
      if (!currentOrganisation?.id) {
        const message = 'No organisation selected — cannot deactivate vehicle';
        setError(message);
        return { newVersion: null, error: message };
      }
      setSaving(true);
      setError(null);
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
        setError(message);
        return { newVersion: null, error: message };
      } finally {
        setSaving(false);
      }
    },
    [applicationBaseUrl, getAccessToken, currentOrganisation?.id]
  );

  return { deactivate, saving, error, clearError: () => setError(null) };
}
