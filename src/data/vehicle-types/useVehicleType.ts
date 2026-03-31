import { useEffect, useState, useCallback } from 'react';
import { useConfig } from '../../contexts/configContext.ts';
import { useAuth } from '../../auth/authUtils.ts';
import { fetchVehicleType } from './fetchVehicleType.ts';
import { graphqlErrMsg } from '../graphqlErrMsg.ts';
import type { VehicleType } from './vehicleTypeTypes.ts';

export function useVehicleType(id: string | undefined) {
  const [data, setData] = useState<VehicleType | null>(null);
  const [loading, setLoading] = useState(!!id);
  const [error, setError] = useState<string | null>(null);
  const { applicationBaseUrl } = useConfig();
  const { getAccessToken } = useAuth();

  const doFetch = useCallback(async () => {
    if (!applicationBaseUrl || !id) return;
    setLoading(true);
    setError(null);
    try {
      const token = await getAccessToken();
      const vtype = await fetchVehicleType(applicationBaseUrl, id, token);
      setData(vtype);
    } catch (err: unknown) {
      setError(graphqlErrMsg(err));
    } finally {
      setLoading(false);
    }
  }, [applicationBaseUrl, id, getAccessToken]);

  useEffect(() => {
    doFetch();
  }, [doFetch]);

  return { data, loading, error, refetch: doFetch };
}
