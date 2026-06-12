import { useEffect, useMemo, useState, useCallback } from 'react';
import { useConfig } from '../../../contexts/configContext.ts';
import { useAuth } from '../../../auth/authUtils.ts';
import type { Order } from '../../../components/data/dataTableTypes.ts';
import type { VehicleGQLShaped, VehicleColumnKey } from '../types/vehicleGqlShaped.ts';
import { fetchVehiclesAndApply } from '../api/fetchVehiclesAndApply.ts';
import { compareVehicles } from '../utils/vehicleSortValue.ts';
import { useOrganisations } from '../../organisations/hooks/useOrganisations.ts';

/**
 * Data hook for the `/vehicles` list. Mirrors `useVehicleTypes` — single fetch
 * of the full set, client-side sort + pagination. Refetch on
 * `applicationBaseUrl` change.
 */
export function useVehicles() {
  const [data, setData] = useState<VehicleGQLShaped[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<VehicleColumnKey>('registrationNumber');

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { applicationBaseUrl } = useConfig();
  const { getAccessToken } = useAuth();
  const { currentOrganisation } = useOrganisations();

  // This doFetch shape (gate → fetch chain → translate error → setLoading)
  // is duplicated in `useVehicleTypes` and `useDeckPlans` — here it's
  // delegated to `fetchVehiclesAndApply` (setter-injection variant, no
  // rethrow). The duplication and variant drift is tracked for lift in
  // hathor#119 — keep variants in sync until then.
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
    doFetch();
  }, [doFetch]);

  const handleRequestSort = (property: VehicleColumnKey) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  // Memoized so that `allData` is a stable reference across renders. The
  // /vehicles URL effect (`useVehicleUrlSelection`) depends on `allData` —
  // without memoisation a fresh array each render would re-fire the effect
  // continuously, remounting the slider editor and wiping its `mode` state.
  const sorted = useMemo(
    () => [...data].sort(compareVehicles(orderBy, order)),
    [data, orderBy, order]
  );

  return {
    allData: sorted,
    data: sorted.slice(page * rowsPerPage, (page + 1) * rowsPerPage),
    totalCount: data.length,
    error,
    loading,
    order,
    orderBy,
    handleRequestSort,
    page,
    rowsPerPage,
    setPage,
    setRowsPerPage,
    refetch: doFetch,
  };
}
