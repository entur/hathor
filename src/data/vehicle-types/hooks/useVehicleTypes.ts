import { useEffect, useState, useCallback, useMemo } from 'react';
import { graphqlErrMsg } from '../../graphqlErrMsg.ts';
import { useConfig } from '../../../contexts/configContext.ts';
import type { VehicleType, VehicleTypeContext } from '../types/vehicleTypeTypes.js';
import { fetchVehicleTypes } from '../api/fetchVehicleTypes.ts';
import { compareVehicleTypes } from '../utils/vehicleTypeSortValue.ts';
import { useAuth } from '../../../auth/authUtils.ts';
import { useOrganisationsContext } from '../../../contexts/useOrganisationsContext.ts';

export function useVehicleTypes() {
  const [data, setData] = useState<VehicleType[]>([]);
  const [loading, setLoading] = useState(true);

  const { applicationBaseUrl } = useConfig();
  const [error, setError] = useState<string | null>(null);
  const { getAccessToken } = useAuth();
  const { currentOrganisation } = useOrganisationsContext();

  // This doFetch shape (gate → fetch chain → setLoading) is still duplicated
  // in `useDeckPlans` and `useVehicles`; the error translation it used to
  // inline now lives in `graphqlErrMsg`. Remaining lift tracked in hathor#119.
  const doFetch = useCallback(async () => {
    if (!applicationBaseUrl || !currentOrganisation?.id) return;
    setLoading(true);
    setError(null);
    const token = await getAccessToken();
    // Return the chain so callers (`refetch` as `onSaved`) can await a fully
    // applied refresh — the post-save re-baseline depends on `setData` having
    // run before the success signal fires.
    return fetchVehicleTypes(applicationBaseUrl, currentOrganisation.id, token)
      .then((ctx: VehicleTypeContext) => {
        setData(ctx.vehicleTypes);
      })
      .catch((err: unknown) => {
        setError(graphqlErrMsg(err));
        // Re-throw so `refetch()` honestly rejects on failure (e.g. a failed
        // post-save refresh) instead of resolving and masking the error.
        throw err;
      })
      .finally(() => setLoading(false));
  }, [applicationBaseUrl, getAccessToken, currentOrganisation?.id]);

  // Refetch when applicationBaseUrl or the org changes. Fire-and-forget: the error is already in state, so swallow the
  // rejection here (only awaiting callers like the post-save refresh care).
  useEffect(() => {
    void doFetch().catch(() => {});
  }, [doFetch]);

  // By name, empty names last: the collection's unsorted order (#291 counts its pages in it).
  const sorted = useMemo(() => [...data].sort(compareVehicleTypes('name', 'asc')), [data]);

  return { allData: sorted, error, loading, refetch: doFetch };
}
