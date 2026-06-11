import { useCallback, useState } from 'react';
import { useAuth } from '../../../auth/authUtils';
import { useConfig } from '../../../contexts/configContext';
import { useOrganisations } from '../../organisations/hooks/useOrganisations';
import { saveDeckPlanAsNetexToBackend } from '../api/deckPlanDetailsService';

interface SaveResult {
  error: string | null;
}

interface UseDeckPlanSaveResult {
  save: (xml: string) => Promise<SaveResult>;
  saving: boolean;
  error: string | null;
  clearError: () => void;
}

/**
 * Save a deck plan by POSTing its NeTEx XML to the import endpoint. Mirrors
 * {@link useVehicleTypeSave} (config base URL + bearer token, saving/error
 * state) but works on a raw XML string rather than a serialised domain form
 * — the existing route view already used the same wire format.
 *
 * Resolves to `{ error }`. Never throws; failures flow through `error`/`save()`'s
 * return so the editor can surface them via SaveErrorSnackbar without unmounting
 * the slider.
 */
export function useDeckPlanSave(): UseDeckPlanSaveResult {
  const { getAccessToken } = useAuth();
  const { applicationImportBaseUrl } = useConfig();
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

  return { save, saving, error, clearError: () => setError(null) };
}
