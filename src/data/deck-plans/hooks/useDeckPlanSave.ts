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

/**
 * Save a deck plan via one of two paths:
 * - `save(xml)` — POSTs the full NeTEx XML to the import endpoint (edit flow
 *   for existing rows; keeps the route view's wire format).
 * - `saveGQL(form)` — fires the `createOrUpdateDeckPlan` GraphQL mutation with
 *   {@link serializeDeckPlan}'s full-replace input (create flow); resolves to
 *   `{ newId, error }` so the caller can advance the sidebar URL.
 *
 * Both resolve to a result object and never throw; the editor surfaces a
 * returned `error` via its save-error snackbar.
 */
export function useDeckPlanSave(): UseDeckPlanSaveResult {
  const { t } = useTranslation();
  const { getAccessToken } = useAuth();
  const { applicationImportBaseUrl, applicationBaseUrl } = useConfig();
  const { currentOrganisation } = useOrganisationsContext();

  const save = useCallback(
    async (xml: string): Promise<SaveResult> => {
      if (!applicationImportBaseUrl) {
        const message = t('error.noImportBaseUrl');
        return { error: message };
      }
      if (!currentOrganisation?.id) {
        const message = t('deckPlans.save.noOrganisation');
        return { error: message };
      }
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
        const message = e instanceof Error ? e.message : String(e);
        return { error: message };
      }
    },
    [applicationImportBaseUrl, getAccessToken, currentOrganisation?.id, t]
  );

  const saveGQL = useCallback(
    async (form: DeckPlan): Promise<{ newId: string | null; error: string | null }> => {
      if (!applicationBaseUrl) {
        const message = t('error.noBaseUrl');
        return { newId: null, error: message };
      }
      if (!currentOrganisation?.id) {
        const message = t('deckPlans.save.noOrganisation');
        return { newId: null, error: message };
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
        const message = err instanceof Error ? err.message : String(err);
        return { newId: null, error: message };
      }
    },
    [applicationBaseUrl, getAccessToken, currentOrganisation?.id, t]
  );

  return { save, saveGQL };
}
