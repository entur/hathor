import { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { graphqlErrMsg } from '../../graphqlErrMsg.ts';
import { useConfig } from '../../../contexts/configContext.ts';
import {
  VEHICLE_TYPE_KIND,
  type VehicleType,
  type VehicleTypeContext,
  type VehicleTypeKind,
} from '../types/vehicleTypeTypes.ts';
import { fetchVehicleTypes } from '../api/fetchVehicleTypes.ts';
import { compareVehicleTypes } from '../utils/vehicleTypeSortValue.ts';
import { useAuth } from '../../../auth/authUtils.ts';
import { useOrganisationsContext } from '../../../contexts/useOrganisationsContext.ts';

const EMPTY: VehicleType[] = [];

/** The org's vehicle types of one kind — PHYSICAL by default (the vehicle form's type picker). */
export function useVehicleTypes(kind: VehicleTypeKind = VEHICLE_TYPE_KIND) {
  // Rows carry the kind they were fetched for: a page of the other kind never shows them.
  const [slot, setSlot] = useState<{ kind: VehicleTypeKind; rows: VehicleType[] }>({
    kind,
    rows: [],
  });
  const data = slot.kind === kind ? slot.rows : EMPTY;
  const [loading, setLoading] = useState(true);

  const { applicationBaseUrl } = useConfig();
  const [error, setError] = useState<string | null>(null);
  const { getAccessToken } = useAuth();
  const { currentOrganisation } = useOrganisationsContext();
  // Generation of the latest read: the sibling pages (PHYSICAL / CONTRACTUAL) and an org switch
  // reuse this hook, so a late response of a superseded read must not publish (as `useEntityRecord`).
  const latest = useRef(0);

  // This doFetch shape (gate → fetch chain → setLoading) is still duplicated
  // in `useDeckPlans` and `useVehicles`; the error translation it used to
  // inline now lives in `graphqlErrMsg`. Remaining lift tracked in hathor#119.
  const doFetch = useCallback(async () => {
    if (!applicationBaseUrl || !currentOrganisation?.id) return;
    const request = ++latest.current;
    const live = () => request === latest.current;
    setLoading(true);
    setError(null);
    const token = await getAccessToken();
    // Return the chain so callers (`refetch` as `onSaved`) can await a fully
    // applied refresh — the post-save re-baseline depends on `setData` having
    // run before the success signal fires.
    return fetchVehicleTypes(applicationBaseUrl, currentOrganisation.id, token, kind)
      .then((ctx: VehicleTypeContext) => {
        if (live()) setSlot({ kind, rows: ctx.vehicleTypes });
      })
      .catch((err: unknown) => {
        if (live()) setError(graphqlErrMsg(err));
        // Re-throw so `refetch()` honestly rejects on failure (e.g. a failed
        // post-save refresh) instead of resolving and masking the error.
        throw err;
      })
      .finally(() => {
        if (live()) setLoading(false);
      });
  }, [applicationBaseUrl, getAccessToken, currentOrganisation?.id, kind]);

  // Refetch when applicationBaseUrl or the org changes. Fire-and-forget: the error is already in state, so swallow the
  // rejection here (only awaiting callers like the post-save refresh care).
  useEffect(() => {
    void doFetch().catch(() => {});
  }, [doFetch]);

  // By name, empty names last: the collection's unsorted order (#291 counts its pages in it).
  const sorted = useMemo(() => [...data].sort(compareVehicleTypes('name', 'asc')), [data]);

  return { allData: sorted, error, loading, refetch: doFetch };
}
