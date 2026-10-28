import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../auth/authUtils';
import { useConfig } from '../../../contexts/configContext';
import { useOrganisationsContext } from '../../../contexts/useOrganisationsContext';
import { saveDeckPlanAsNetexToBackend } from '../api/deckPlanDetailsService';
import type { DeckPlan } from '../types/deckPlanTypes';
import { createOrUpdateDeckPlanRequest } from '../../../graphql/vehicles/mutations/createOrUpdateDeckPlan';
import { serializeDeckPlan } from '../api/fetchDeckPlans';

interface SaveResult {
  error: string | null;
}

interface UseDeckPlanSaveResult {
  save: (xml: string) => Promise<SaveResult>;
  saveGQL: (form: DeckPlan) => Promise<{ newId: string | null; error: string | null }>;
}

const errMsg = (e: unknown): string => (e instanceof Error ? e.message : String(e));

/**
 * Save a deck plan via one of two paths:
 * - `save(xml)` — POSTs the full NeTEx XML to the import endpoint (edit flow
 *   for existing rows; keeps the route view's wire format).
 * - `saveGQL(form)` — fires the `createOrUpdateDeckPlan` GraphQL mutation with
 *   {@link serializeDeckPlan}'s full-replace input (create flow); resolves to
 *   `{ newId, error }` so the caller can advance the sidebar URL.
 *
 * Both resolve to a result object and never throw; the editor surfaces a
 * failure from the returned `error`.
 *
 * @returns `save` (→ `{ error }`) and `saveGQL` (→ `{ newId, error }`).
 */
export function useDeckPlanSave(): UseDeckPlanSaveResult {
  const { t } = useTranslation();
  const { getAccessToken } = useAuth();
  const { applicationImportBaseUrl, applicationBaseUrl } = useConfig();
  const { currentOrganisation } = useOrganisationsContext();

  const save = useCallback(
    async (xml: string): Promise<SaveResult> => {
      if (!applicationImportBaseUrl) return { error: t('error.noImportBaseUrl') };
      if (!currentOrganisation?.id) return { error: t('deckPlans.save.noOrganisation') };
      try {
        const token = await getAccessToken();
        await saveDeckPlanAsNetexToBackend(
          applicationImportBaseUrl,
          currentOrganisation.id,
          xml,
          token
        );
        return { error: null };
      } catch (e) {
        return { error: errMsg(e) };
      }
    },
    [applicationImportBaseUrl, getAccessToken, currentOrganisation?.id, t]
  );

  const saveGQL = useCallback(
    async (form: DeckPlan): Promise<{ newId: string | null; error: string | null }> => {
      if (!applicationBaseUrl) return { newId: null, error: t('error.noBaseUrl') };
      if (!currentOrganisation?.id) {
        return { newId: null, error: t('deckPlans.save.noOrganisation') };
      }
      try {
        const token = await getAccessToken();
        const body = await createOrUpdateDeckPlanRequest(
          applicationBaseUrl,
          token,
          serializeDeckPlan(form, currentOrganisation.id)
        );
        return { newId: body.createOrUpdateDeckPlan, error: null };
      } catch (err) {
        return { newId: null, error: errMsg(err) };
      }
    },
    [applicationBaseUrl, getAccessToken, currentOrganisation?.id, t]
  );

  return { save, saveGQL };
}
