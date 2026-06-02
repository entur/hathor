import { useEffect, useState, useCallback } from 'react';
import { useConfig } from '../../../contexts/configContext.ts';
import { useAuth } from '../../../auth/authUtils.ts';
import type { Organisation } from '../../vehicle-types/types/vehicleTypeTypes.ts';
import { fetchOrganisations } from '../api/fetchOrganisations.ts';

/**
 * Data hook for the `organisations` select. Mirrors `useVehicles`, but with a simpler lifecycle — no sort or pagination, just a single fetch
 * on `applicationBaseUrl` change.
 */
export function useOrganisations() {
  const [data, setData] = useState<Organisation[]>([]);
  const [currentOrganisation, setCurrentOrganisation] = useState<Organisation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { applicationBaseUrl } = useConfig();
  const { getAccessToken, isAuthenticated } = useAuth();

  const doFetch = useCallback(async () => {
    if (!applicationBaseUrl || !isAuthenticated) return;
    setLoading(true);
    try {
      const token = await getAccessToken();
      const organisations = await fetchOrganisations(applicationBaseUrl, token);
      setData(organisations);
      if (organisations.length > 0) {
        setCurrentOrganisation(organisations[0]);
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [applicationBaseUrl, getAccessToken, isAuthenticated]);

  useEffect(() => {
    doFetch();
  }, [doFetch]);

  return {
    data,
    currentOrganisation,
    setCurrentOrganisation,
    error,
    loading,
    refetch: doFetch,
  };
}
