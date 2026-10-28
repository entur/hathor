import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../auth/authUtils.ts';
import { useConfig } from '../../../contexts/configContext.ts';
import { useOrganisationsContext } from '../../../contexts/useOrganisationsContext.ts';
import { deactivateDeckPlanRequest } from '../../../graphql/vehicles/mutations/deactivateDeckPlan.ts';
import type { DeckPlan } from '../types/deckPlanTypes.ts';

interface SaveResult {
  newVersion: number | null;
  error: string | null;
}

interface UseDeckPlanDeactivateResult {
  deactivate: (form: DeckPlan) => Promise<SaveResult>;
}

/**
 * Deactivate a DeckPlan via the `deactivateDeckPlan` GraphQL mutation.
 *
 * @returns `deactivate` (→ `{ newVersion, error }`; never throws).
 */
export function useDeckPlanDeactivate(): UseDeckPlanDeactivateResult {
  const { t } = useTranslation();
  const { getAccessToken } = useAuth();
  const { applicationBaseUrl } = useConfig();
  const { currentOrganisation } = useOrganisationsContext();

  const deactivate = useCallback(
    async (form: DeckPlan): Promise<SaveResult> => {
      if (!applicationBaseUrl) {
        return { newVersion: null, error: t('error.noBaseUrl') };
      }
      if (!currentOrganisation?.id) {
        return { newVersion: null, error: t('deckPlans.deactivate.noOrganisation') };
      }
      try {
        const token = await getAccessToken();
        const body = await deactivateDeckPlanRequest(applicationBaseUrl, token, {
          netexId: form.id,
          version: Number(form.version),
          deactivateAt: new Date().toISOString(),
        });
        return { newVersion: body.deactivateDeckPlan?.version ?? null, error: null };
      } catch (err) {
        return { newVersion: null, error: err instanceof Error ? err.message : String(err) };
      }
    },
    [applicationBaseUrl, getAccessToken, currentOrganisation?.id, t]
  );

  return { deactivate };
}
