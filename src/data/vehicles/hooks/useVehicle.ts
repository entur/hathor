import { useEffect, useState, useCallback } from 'react';
import { useConfig } from '../../../contexts/configContext.ts';
import { useAuth } from '../../../auth/authUtils.ts';
import type { VehicleGQLShaped } from '../types/vehicleGqlShaped.ts';
import { fetchVehicle } from '../api/fetchVehicles.ts';
import { useOrganisations } from '../../organisations/hooks/useOrganisations.ts';

/**
 * Fetch and parse a single VehicleGQLShaped from Sobek's GraphQL endpoint.
 * Mirrors `useVehicleType`'s lifecycle. Returns `data: null` when the
 * response carries no VehicleGQLShaped (unknown id surfaced as an `error`).
 */
export function useVehicle(id: string | undefined) {
  const [data, setData] = useState<Partial<VehicleGQLShaped> | null>(null);
  const [loading, setLoading] = useState(!!id);
  const [error, setError] = useState<string | null>(null);
  const { applicationBaseUrl } = useConfig();
  const { getAccessToken } = useAuth();
  const { currentOrganisation } = useOrganisations();

  const doFetch = useCallback(async () => {
    if (!id) return;
    if (!applicationBaseUrl || !currentOrganisation?.id) {
      setError('Application base URL is not configured or current organisation is not set');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const token = await getAccessToken();
      const vehicles = await fetchVehicle(
        id,
        applicationBaseUrl,
        currentOrganisation?.id || '',
        token
      );
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
  }, [applicationBaseUrl, id, getAccessToken, currentOrganisation?.id]);

  useEffect(() => {
    doFetch();
  }, [doFetch]);

  return { data, loading, error, refetch: doFetch };
}
