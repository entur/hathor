import { useEffect, useState, useCallback } from 'react';
import { graphqlErrMsg } from '../../graphqlErrMsg.ts';
import { useSearchParams } from 'react-router-dom';
import { useConfig } from '../../../contexts/configContext.ts';
import type { Order } from '../../../components/data/dataTableTypes.ts';
import { useAuth } from '../../../auth/authUtils.ts';
import type { DeckPlan, DeckPlanContext } from '../types/deckPlanTypes.ts';
import { fetchDeckPlans } from '../api/fetchDeckPlans.ts';
import { compareDeckPlans } from '../utils/deckPlanSortValue.ts';
import { useOrganisationsContext } from '../../../contexts/useOrganisationsContext.ts';
import { useLatestRequest } from '../../../hooks/useLatestRequest.ts';

export type OrderBy = 'name' | 'id';

export function useDeckPlans() {
  const [data, setData] = useState<DeckPlan[]>([]);
  const [loading, setLoading] = useState(true);

  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<OrderBy>('name');

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const { applicationBaseUrl } = useConfig();
  const [error, setError] = useState<string | null>(null);
  const { getAccessToken } = useAuth();
  const [searchParams] = useSearchParams();
  const { currentOrganisation } = useOrganisationsContext();

  // Track filter param to trigger refetch when it changes (e.g., after import)
  const filterParam = searchParams.get('filter');
  const beginRequest = useLatestRequest();

  // This doFetch shape (gate → fetch chain → setLoading) is still duplicated
  // in `useVehicleTypes` and `useVehicles`; the error translation it used to
  // inline now lives in `graphqlErrMsg`. Remaining lift tracked in hathor#230.
  const doFetch = useCallback(async () => {
    if (!applicationBaseUrl || !currentOrganisation?.id) return;
    // Refetches overlap (one per write, never awaited): only the newest
    // request's response may touch state, so an older one landing last
    // cannot bring back a row a later write changed or deactivated.
    const isLatest = beginRequest();
    setLoading(true);
    setError(null);
    const token = await getAccessToken();
    // Return the chain so `refetch` settles once the refresh has applied (or
    // failed); the editor fires it from `onWritten` without awaiting it.
    return fetchDeckPlans(applicationBaseUrl, currentOrganisation.id, token)
      .then((ctx: DeckPlanContext) => {
        if (isLatest()) setData(ctx.deckPlans);
      })
      .catch((err: unknown) => {
        if (isLatest()) setError(graphqlErrMsg(err));
        // Re-throw so `refetch()` honestly rejects on failure (e.g. a failed
        // post-save refresh) instead of resolving and masking the error.
        throw err;
      })
      .finally(() => {
        if (isLatest()) setLoading(false);
      });
  }, [applicationBaseUrl, getAccessToken, currentOrganisation?.id, beginRequest]);

  // Refetch when applicationBaseUrl changes or when filter param changes (after
  // import). Fire-and-forget: the error is already in state, so swallow the
  // rejection here.
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

  const sorted = [...data].sort(compareDeckPlans(orderBy, order));

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
