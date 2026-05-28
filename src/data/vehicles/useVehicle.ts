import { useEffect, useState, useCallback } from 'react';
import { useConfig } from '../../contexts/configContext.ts';
import { useAuth } from '../../auth/authUtils.ts';
import { fetchVehicleNetexXml } from './api/fetchVehicleNetexXml';
import { parseVehicleXml } from './api/Vehicle-parser';
import type { Vehicle } from './types/Vehicle';

/**
 * Fetch and parse a single Vehicle from Sobek's NeTEx single-vehicle endpoint.
 * Mirrors `useVehicleType`'s lifecycle. Returns `data: null` when the
 * response carries no Vehicle (unknown id surfaced as an `error`).
 */
export function useVehicle(id: string | undefined) {
  const [data, setData] = useState<Partial<Vehicle> | null>(null);
  const [loading, setLoading] = useState(!!id);
  const [error, setError] = useState<string | null>(null);
  const { applicationImportBaseUrl } = useConfig();
  const { getAccessToken } = useAuth();

  const doFetch = useCallback(async () => {
    if (!id) return;
    if (!applicationImportBaseUrl) {
      setError('Application import base URL is not configured');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const token = await getAccessToken();
      const xml = await fetchVehicleNetexXml(applicationImportBaseUrl, id, token);
      const parsed = parseVehicleXml(xml);
      if (!parsed) {
        setError(`Vehicle "${id}" not found`);
        setData(null);
      } else {
        setData(parsed);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, [applicationImportBaseUrl, id, getAccessToken]);

  useEffect(() => {
    doFetch();
  }, [doFetch]);

  return { data, loading, error, refetch: doFetch };
}
