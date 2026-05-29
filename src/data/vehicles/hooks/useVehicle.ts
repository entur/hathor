import { useEffect, useState, useCallback } from 'react';
import { useConfig } from '../../../contexts/configContext.ts';
import { useAuth } from '../../../auth/authUtils.ts';
import type { VehicleGQLShaped } from '../types/vehicleGqlShaped.ts';
import { fetchVehicle } from '../api/fetchVehicles.ts';

/**
 * Fetch and parse a single Vehicle from Sobek's NeTEx single-vehicle endpoint.
 * Mirrors `useVehicleType`'s lifecycle. Returns `data: null` when the
 * response carries no Vehicle (unknown id surfaced as an `error`).
 */
export function useVehicle(id: string | undefined) {
  const [data, setData] = useState<Partial<VehicleGQLShaped> | null>(null);
  const [loading, setLoading] = useState(!!id);
  const [error, setError] = useState<string | null>(null);
  const { applicationBaseUrl } = useConfig();
  const { getAccessToken } = useAuth();

  const doFetch = useCallback(async () => {
    if (!id) return;
    if (!applicationBaseUrl) {
      setError('Application base URL is not configured');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const token = await getAccessToken();
      const vehicles = await fetchVehicle(id, applicationBaseUrl, token);
      if (!vehicles?.length) {
        setError(`Vehicle "${id}" not found`);
        setData(null);
      } else {
        setData(vehicles[0]);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, [applicationBaseUrl, id, getAccessToken]);

  useEffect(() => {
    doFetch();
  }, [doFetch]);

  return { data, loading, error, refetch: doFetch };
}
