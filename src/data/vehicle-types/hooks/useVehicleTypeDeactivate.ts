import { useCallback, useState } from 'react';
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
  saving: boolean;
  error: string | null;
  clearError: () => void;
}

/**
 * Deactivate a VehicleType via the `deactivateVehicleType` GraphQL mutation.
 *
 * @returns `deactivate` (→ `{ newVersion, error }`), plus `saving`, `error`, `clearError`.
 */
export function useVehicleTypeDeactivate(): UseVehicleTypeDeactivateResult {
  const { getAccessToken } = useAuth();
  const { applicationBaseUrl } = useConfig();
  const { currentOrganisation } = useOrganisationsContext();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deactivate = useCallback(
    async (form: VehicleType): Promise<SaveResult> => {
      if (!applicationBaseUrl) {
        const message = 'Application base URL is not configured';
        setError(message);
        return { newVersion: null, error: message };
      }
      if (!currentOrganisation?.id) {
        const message = 'No organisation selected — cannot deactivate vehicle type';
        setError(message);
        return { newVersion: null, error: message };
      }
      setSaving(true);
      setError(null);
      try {
        const token = await getAccessToken();
        const body = await deactivateVehicleTypeRequest(applicationBaseUrl, token, {
          netexId: form.id,
          version: Number(form.version),
          deactivateAt: new Date().toISOString(),
        });
        return { newVersion: body.deactivateVehicleType?.version ?? null, error: null };
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
