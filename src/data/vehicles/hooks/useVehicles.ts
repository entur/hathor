import { useEffect, useMemo, useState, useCallback } from 'react';
import { useConfig } from '../../../contexts/configContext.ts';
import { useAuth } from '../../../auth/authUtils.ts';
import type { Vehicle } from '../types/vehicle.ts';
import { fetchVehiclesAndApply } from '../api/fetchVehiclesAndApply.ts';
import { compareVehicles } from '../utils/vehicleSortValue.ts';
import { useOrganisationsContext } from '../../../contexts/useOrganisationsContext.ts';

/**
 * Data hook for the `/vehicles` list. Mirrors `useVehicleTypes` — single fetch
 * of the full set, sorted by registration number. Refetch on
 * `applicationBaseUrl` change.
 */
export function useVehicles() {
  const [data, setData] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { applicationBaseUrl } = useConfig();
  const { getAccessToken } = useAuth();
  const { currentOrganisation } = useOrganisationsContext();

  // This doFetch shape (gate → fetch chain → translate error → setLoading)
  // is duplicated in `useVehicleTypes` and `useDeckPlans` — here it's
  // delegated to `fetchVehiclesAndApply` (setter-injection variant). The
  // duplication and variant drift is tracked for lift in hathor#119 — keep
  // variants in sync until then.
  const doFetch = useCallback(async () => {
    if (!applicationBaseUrl || !currentOrganisation?.id) return;
    setLoading(true);
    try {
      await fetchVehiclesAndApply({
        applicationBaseUrl,
        getAccessToken,
        setData,
        setError,
        dataOwnerRef: currentOrganisation?.id || '',
      });
    } finally {
      setLoading(false);
    }
  }, [applicationBaseUrl, getAccessToken, currentOrganisation?.id]);

  useEffect(() => {
    void doFetch().catch(() => {}); // surfaced through `error`
  }, [doFetch]);

  // By registration number, empty ones last: the collection's unsorted order (#291 counts its
  // pages in it).
  const sorted = useMemo(
    () => [...data].sort(compareVehicles('registrationNumber', 'asc')),
    [data]
  );

  return { allData: sorted, error, loading, refetch: doFetch };
}
