import { useEffect, useState, useCallback, useMemo } from 'react';
import { ClientError } from 'graphql-request';
import { useSearchParams } from 'react-router-dom';
import { useConfig } from '../../../contexts/configContext.ts';
import type { VehicleType, VehicleTypeContext } from '../types/vehicleTypeTypes.js';
import { fetchVehicleTypes } from '../api/fetchVehicleTypes.ts';
import { compareVehicleTypes } from '../utils/vehicleTypeSortValue.ts';
import type { Order } from '../../../components/data/dataTableTypes.ts';
import { useAuth } from '../../../auth/authUtils.ts';
import { useOrganisations } from '../../organisations/hooks/useOrganisations.ts';

export type OrderBy = 'name' | 'id' | 'dimensions' | 'deckPlanName' | 'transportMode';

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
  const { currentOrganisation } = useOrganisations();

  // Track filter param to trigger refetch when it changes (e.g., after import)
  const filterParam = searchParams.get('filter');

  // This doFetch shape (gate → fetch chain → translate error → setLoading)
  // is duplicated in `useDeckPlans` and `useVehicles`. The duplication is
  // tracked for lift in hathor#119 — keep variants in sync until then.
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
        // Re-throw so `refetch()` honestly rejects on failure (e.g. a failed
        // post-save refresh) instead of resolving and masking the error.
        throw err;
      })
      .finally(() => setLoading(false));
  }, [applicationBaseUrl, getAccessToken, currentOrganisation?.id]);

  // Refetch when applicationBaseUrl changes or when filter param changes (after
  // import). Fire-and-forget: the error is already in state, so swallow the
  // rejection here (only awaiting callers like the post-save refresh care).
  useEffect(() => {
    void doFetch().catch(() => {});
  }, [doFetch, filterParam]);

  // Ref-stable so `DataTableHeader` doesn't re-render on every parent render
  // (#77 N12). Deps are the sort state the toggle reads.
  const handleRequestSort = useCallback(
    (property: OrderBy) => {
      const isAsc = orderBy === property && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(property);
    },
    [order, orderBy]
  );

  const sorted = useMemo(
    () => [...data].sort(compareVehicleTypes(orderBy, order)),
    [data, orderBy, order]
  );

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
