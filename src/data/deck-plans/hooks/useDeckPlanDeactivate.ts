import { useCallback, useState } from 'react';
import { useAuth } from '../../../auth/authUtils.ts';
import { useConfig } from '../../../contexts/configContext.ts';
import { useOrganisationsContext } from '../../../contexts/useOrganisationsContext.ts';
import { deactivateDeckPlanRequest } from '../../../graphql/vehicles/mutations/deactivateDeckPlan.ts';
import type { DeckPlan } from '../../vehicle-types/types/vehicleTypeTypes.ts';

interface SaveResult {
  newVersion: number | null;
  error: string | null;
}

interface UseDeckPlanDeactivateResult {
  deactivate: (form: DeckPlan) => Promise<SaveResult>;
  saving: boolean;
  error: string | null;
  clearError: () => void;
}

/**
 * Deactivate a DeckPlan via the `deactivateDeckPlan` GraphQL mutation.
 *
 * @returns `deactivate` (→ `{ newVersion, error }`), plus `saving`, `error`, `clearError`.
 */
export function useDeckPlanDeactivate(): UseDeckPlanDeactivateResult {
  const { getAccessToken } = useAuth();
  const { applicationBaseUrl } = useConfig();
  const { currentOrganisation } = useOrganisationsContext();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deactivate = useCallback(
    async (form: DeckPlan): Promise<SaveResult> => {
      if (!applicationBaseUrl) {
        const message = 'Application base URL is not configured';
        setError(message);
        return { newVersion: null, error: message };
      }
      if (!currentOrganisation?.id) {
        const message = 'No organisation selected — cannot deactivate deck plan';
        setError(message);
        return { newVersion: null, error: message };
      }
      setSaving(true);
      setError(null);
      try {
        const token = await getAccessToken();
        const body = await deactivateDeckPlanRequest(applicationBaseUrl, token, {
          netexId: form.id,
          version: Number(form.version),
          deactivateAt: new Date().toISOString(),
        });
        return { newVersion: body.deactivateDeckPlan?.version ?? null, error: null };
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
