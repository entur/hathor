import { useEffect, useState, useCallback } from 'react';
import { ClientError } from 'graphql-request';
import { useSearchParams } from 'react-router-dom';
import { useConfig } from '../../contexts/configContext.ts';
import type { VehicleType, VehicleTypeContext } from './vehicleTypeTypes.js';
import { fetchVehicleTypes } from './fetchVehicleTypes.ts';
import type { Order } from '../../components/data/dataTableTypes.ts';
import { useAuth } from '../../auth/authUtils.ts';

export type OrderBy = 'name' | 'id' | 'length' | 'height' | 'width' | 'deckPlanName';

export function useVehicleTypes() {
  const [data, setData] = useState<VehicleType[]>([]);
  const [loading, setLoading] = useState(true);

  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<OrderBy>('name');

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const { applicationBaseUrl } = useConfig();
  const [error, setError] = useState<string | null>(null);
  const { getAccessToken } = useAuth();
  const [searchParams] = useSearchParams();

  // Track filter param to trigger refetch when it changes (e.g., after import)
  const filterParam = searchParams.get('filter');

  const doFetch = useCallback(async () => {
    if (!applicationBaseUrl) return;
    setLoading(true);
    setError(null);
    const token = await getAccessToken();
    fetchVehicleTypes(applicationBaseUrl, token)
      .then((ctx: VehicleTypeContext) => {
        setData(ctx.vehicleTypes);
      })
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

  // Refetch when applicationBaseUrl changes or when filter param changes (after import)
  useEffect(() => {
    doFetch();
  }, [doFetch, filterParam]);

  const handleRequestSort = (property: OrderBy) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sorted = [...data].sort((a, b) => {
    const v1 = orderBy === 'name' ? a.name?.value?.toLowerCase() : a.id.toLowerCase();
    const v2 = orderBy === 'name' ? b.name?.value?.toLowerCase() : b.id.toLowerCase();
    if (v1 < v2) return order === 'asc' ? -1 : 1;
    if (v1 > v2) return order === 'asc' ? 1 : -1;
    return 0;
  });

  const paginated = sorted.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

  return {
    allData: sorted,
    data: paginated,
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
