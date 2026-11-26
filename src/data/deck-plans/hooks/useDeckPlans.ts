import { useEffect, useState, useCallback, useMemo } from 'react';
import { graphqlErrMsg } from '../../graphqlErrMsg.ts';
import { useConfig } from '../../../contexts/configContext.ts';
import { useAuth } from '../../../auth/authUtils.ts';
import type { DeckPlan, DeckPlanContext } from '../types/deckPlanTypes.ts';
import { fetchDeckPlans } from '../api/fetchDeckPlans.ts';
import { compareDeckPlans } from '../utils/deckPlanSortValue.ts';
import { useOrganisationsContext } from '../../../contexts/useOrganisationsContext.ts';

export function useDeckPlans() {
  const [data, setData] = useState<DeckPlan[]>([]);
  const [loading, setLoading] = useState(true);

  const { applicationBaseUrl } = useConfig();
  const [error, setError] = useState<string | null>(null);
  const { getAccessToken } = useAuth();
  const { currentOrganisation } = useOrganisationsContext();

  // This doFetch shape (gate → fetch chain → setLoading) is still duplicated
  // in `useVehicleTypes` and `useVehicles`; the error translation it used to
  // inline now lives in `graphqlErrMsg`. Remaining lift tracked in hathor#119.
  const doFetch = useCallback(async () => {
    if (!applicationBaseUrl || !currentOrganisation?.id) return;
    setLoading(true);
    setError(null);
    const token = await getAccessToken();
    // Return the chain so callers (`refetch` as `onSaved`) can await a fully
    // applied refresh — the post-save re-baseline depends on `setData` having
    // run before the success signal fires.
    return fetchDeckPlans(applicationBaseUrl, currentOrganisation.id, token)
      .then((ctx: DeckPlanContext) => {
        setData(ctx.deckPlans);
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
  const sorted = useMemo(() => [...data].sort(compareDeckPlans('name', 'asc')), [data]);

  return { allData: sorted, error, loading, refetch: doFetch };
}
