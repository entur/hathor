import { useCallback, useState } from 'react';
import { useAuth } from '../../../auth/authUtils';
import { useConfig } from '../../../contexts/configContext';
import { importAsNetexToBackend } from '../../vehicle-imports/vehicleImportServices';
import { buildVehiclePairXml } from '../api/buildVehiclePairXml';
import { parseVehicleImportResponse } from '../api/parseVehicleImportResponse';
import type { VehicleEditFormValue } from '../VehicleEditForm';

interface SaveResult {
  newId: string | null;
  error: string | null;
}

interface UseVehiclePairSaveResult {
  save: (form: VehicleEditFormValue) => Promise<SaveResult>;
  saving: boolean;
  error: string | null;
  clearError: () => void;
}

export function useVehiclePairSave(): UseVehiclePairSaveResult {
  const { getAccessToken } = useAuth();
  const { applicationImportBaseUrl } = useConfig();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const save = useCallback(
    async (form: VehicleEditFormValue): Promise<SaveResult> => {
      if (!applicationImportBaseUrl) {
        const message = 'Application import base URL is not configured';
        setError(message);
        return { newId: null, error: message };
      }
      setSaving(true);
      setError(null);
      try {
        const xml = buildVehiclePairXml(form);
        const token = await getAccessToken();
        const body = await importAsNetexToBackend(applicationImportBaseUrl, xml, token);
        return { newId: parseVehicleImportResponse(body), error: null };
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        setError(message);
        return { newId: null, error: message };
      } finally {
        setSaving(false);
      }
    },
    [applicationImportBaseUrl, getAccessToken]
  );

  return { save, saving, error, clearError: () => setError(null) };
}
