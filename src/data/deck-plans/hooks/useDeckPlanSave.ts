import { useCallback, useState } from 'react';
import { useAuth } from '../../../auth/authUtils';
import { useConfig } from '../../../contexts/configContext';
import { useOrganisations } from '../../organisations/hooks/useOrganisations';
import { saveDeckPlanAsNetexToBackend } from '../api/deckPlanDetailsService';
import type { DeckPlan } from '../../vehicle-types/types/vehicleTypeTypes';
import { createOrUpdateDeckPlanRequest } from '../../../graphql/vehicles/mutations/createOrUpdateDeckPlan';
import { serializeDeckPlan } from '../api/fetchDeckPlans';

interface SaveResult {
  error: string | null;
}

interface UseDeckPlanSaveResult {
  save: (xml: string) => Promise<SaveResult>;
  saveGQL: (form: DeckPlan) => Promise<{ newId: string | null; error: string | null }>;
  saving: boolean;
  error: string | null;
  clearError: () => void;
}

/**
 * Save a deck plan via one of two paths sharing `saving`/`error` state:
 * - `save(xml)` — POSTs the full NeTEx XML to the import endpoint (edit flow
 *   for existing rows; keeps the route view's wire format).
 * - `saveGQL(form)` — fires the `createOrUpdateDeckPlan` GraphQL mutation with
 *   {@link serializeDeckPlan}'s full-replace input (create flow); resolves to
 *   `{ newId, error }` so the caller can advance the sidebar URL.
 *
 * Both resolve to a result object; never throw. Failures flow through `error`
 * and the per-call return so the editor surfaces them via SaveErrorSnackbar
 * without unmounting the slider.
 */
export function useDeckPlanSave(): UseDeckPlanSaveResult {
  const { getAccessToken } = useAuth();
  const { applicationImportBaseUrl, applicationBaseUrl } = useConfig();
  const { currentOrganisation } = useOrganisations();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const save = useCallback(
    async (xml: string): Promise<SaveResult> => {
      if (!applicationImportBaseUrl) {
        const message = 'Application import base URL is not configured';
        setError(message);
        return { error: message };
      }
      if (!currentOrganisation?.id) {
        const message = 'No organisation selected — cannot save deck plan';
        setError(message);
        return { error: message };
      }
      setSaving(true);
      setError(null);
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
        setError(message);
        return { error: message };
      } finally {
        setSaving(false);
      }
    },
    [applicationImportBaseUrl, getAccessToken, currentOrganisation?.id]
  );

  const saveGQL = useCallback(
    async (form: DeckPlan): Promise<{ newId: string | null; error: string | null }> => {
      if (!applicationBaseUrl) {
        const message = 'Application base URL is not configured';
        setError(message);
        return { newId: null, error: message };
      }
      if (!currentOrganisation?.id) {
        const message = 'No organisation selected — cannot save deck plan';
        setError(message);
        return { newId: null, error: message };
      }
      setSaving(true);
      setError(null);
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
        setError(message);
        return { newId: null, error: message };
      } finally {
        setSaving(false);
      }
    },
    [applicationBaseUrl, getAccessToken, currentOrganisation?.id]
  );

  return { save, saveGQL, saving, error, clearError: () => setError(null) };
}
