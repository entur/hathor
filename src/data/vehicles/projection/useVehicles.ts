import { useEffect, useMemo, useState, useCallback } from 'react';
import { ClientError } from 'graphql-request';
import { useConfig } from '../../../contexts/configContext.ts';
import { useAuth } from '../../../auth/authUtils.ts';
import type { Order } from '../../../components/data/dataTableTypes.ts';
import type { VehicleGQLShaped, VehicleColumnKey } from './vehicleGqlShaped.ts';
import { fetchVehicles } from './fetchVehicles.ts';
import { compareVehicles } from './vehicleSortValue.ts';

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

  const doFetch = useCallback(async () => {
    if (!applicationBaseUrl) return;
    setLoading(true);
    setError(null);
    const token = await getAccessToken();
    fetchVehicles(applicationBaseUrl, token)
      .then(setData)
      .catch((err: unknown) => {
        if (err instanceof ClientError) {
          const status = err.response.status;
          switch (status) {
            case 401:
              setError('Not authenticated — please log in to access this data');
              break;
            case 403:
              setError('Access denied — you do not have permission to view this data');
              break;
            default: {
              const message = err.response.errors?.[0]?.message;
              setError(message ?? `Server error (${status})`);
            }
          }
        } else if (err instanceof TypeError) {
          setError('Unable to reach server — check that the backend is running');
        } else if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unexpected error occurred');
        }
      })
      .finally(() => setLoading(false));
  }, [applicationBaseUrl, getAccessToken]);

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
