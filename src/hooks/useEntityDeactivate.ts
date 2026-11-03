import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import type { AccessToken } from '../auth';
import { useAuth } from '../auth/authUtils.ts';
import { useConfig } from '../contexts/configContext.ts';
import { useOrganisationsContext } from '../contexts/useOrganisationsContext.ts';
import type { DeactivateInput } from '../graphql/vehicles/mutations/deactivateInput.ts';
import { graphqlErrMsg } from '../data/graphqlErrMsg.ts';

/** One of the `deactivate*Request` mutations in `src/graphql/vehicles/mutations/`. */
export type DeactivateRequest = (
  applicationBaseUrl: string,
  token: AccessToken,
  input: DeactivateInput
) => Promise<unknown>;

/**
 * Deactivate an entity through the feature's `deactivate*` GraphQL mutation,
 * stamped now. Never throws.
 *
 * @param {DeactivateRequest} request The feature's mutation, e.g. `deactivateVehicleRequest`.
 * @returns {(entity: { id: string; version?: number | string }) => Promise<{ error: string | null }>}
 *   `deactivate(entity)` → `{ error }` (`null` on success).
 */
export function useEntityDeactivate(
  request: DeactivateRequest
): (entity: { id: string; version?: number | string }) => Promise<{ error: string | null }> {
  const { t } = useTranslation();
  const { getAccessToken } = useAuth();
  const { applicationBaseUrl } = useConfig();
  const { currentOrganisation } = useOrganisationsContext();

  return useCallback(
    async entity => {
      if (!applicationBaseUrl) return { error: t('error.noBaseUrl') };
      if (!currentOrganisation?.id) return { error: t('common.deactivate.noOrganisation') };
      try {
        const token = await getAccessToken();
        await request(applicationBaseUrl, token, {
          netexId: entity.id,
          version: Number(entity.version),
          deactivateAt: new Date().toISOString(),
        });
        return { error: null };
      } catch (err) {
        return { error: graphqlErrMsg(err) };
      }
    },
    [applicationBaseUrl, getAccessToken, currentOrganisation?.id, request, t]
  );
}
