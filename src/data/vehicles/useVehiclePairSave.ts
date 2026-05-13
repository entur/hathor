import { useCallback, useState } from 'react';
import { useAuth } from '../../auth/authUtils';
import { useConfig } from '../../contexts/configContext';
import { importAsNetexToBackend } from '../vehicle-imports/vehicleImportServices';
import { buildVehiclePairXml } from './buildVehiclePairXml';
import { parseVehicleImportResponse } from './parseVehicleImportResponse';
import type { VehicleEditFormValue } from './VehicleEditForm';

interface UseVehiclePairSaveResult {
  /** Build XML, POST to /import, parse response. Resolves with the new id or null. */
  save: (form: VehicleEditFormValue) => Promise<{ newId: string | null }>;
  saving: boolean;
  error: string | null;
  clearError: () => void;
}

/**
 * Lifecycle hook for the combined Vehicle + VehicleModel save: builds the
 * PublicationDelivery XML, POSTs it to Sobek's `/import` endpoint, and tries
 * to parse the new `Vehicle/@id` from the response body for after-save
 * navigation.
 *
 * Does not navigate or refetch — that lives in the caller (create page
 * navigates to `/vehicle?selected=<newId>`; sidebar closes itself).
 *
 * NOTE: pending #68 — `modification="new|revise"` client policy is
 * unresolved; the handler does not set the attribute today.
 */
export function useVehiclePairSave(): UseVehiclePairSaveResult {
  const { getAccessToken } = useAuth();
  const { applicationImportBaseUrl } = useConfig();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const save = useCallback(
    async (form: VehicleEditFormValue): Promise<{ newId: string | null }> => {
      if (!applicationImportBaseUrl) {
        const msg = 'Application import base URL is not configured';
        setError(msg);
        throw new Error(msg);
      }
      setSaving(true);
      setError(null);
      try {
        const xml = buildVehiclePairXml(form);
        const token = await getAccessToken();
        const body = await importAsNetexToBackend(applicationImportBaseUrl, xml, token);
        return { newId: parseVehicleImportResponse(body) };
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        setError(message);
        throw err;
      } finally {
        setSaving(false);
      }
    },
    [applicationImportBaseUrl, getAccessToken]
  );

  return { save, saving, error, clearError: () => setError(null) };
}
