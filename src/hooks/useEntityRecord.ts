import { useCallback, useEffect, useRef, useState } from 'react';
import type { AccessToken } from '../auth';
import { useAuth } from '../auth/authUtils.ts';
import { useConfig } from '../contexts/configContext.ts';
import { useOrganisationsContext } from '../contexts/useOrganisationsContext.ts';
import { graphqlErrMsg } from '../data/graphqlErrMsg.ts';

/** By-id fetcher a feature's `api/` exports; resolves `null` for an unknown id. */
export type FetchById<T> = (
  id: string,
  applicationBaseUrl: string,
  dataOwnerRef: string,
  token: AccessToken
) => Promise<T | null>;

export interface EntityRecord<T> {
  /** The record for the current org + id; `null` while loading, on not-found, or before the first read. */
  data: T | null;
  loading: boolean;
  error: string | null;
  /** Re-read the record. Resolves to the fresh record; rejects when the read fails. */
  refetch: () => Promise<T | null>;
}

interface Slot<T> {
  key: string | null;
  data: T | null;
  error: string | null;
  loading: boolean;
}

/** The slot's record if it was written for `key`, else nothing. */
const dataFor = <T>(s: Slot<T>, key: string) => (s.key === key ? s.data : null);

/**
 * Read one entity from Sobek by NeTEx id — the editor's single source of
 * truth, rather than a row copied out of the list.
 *
 * Render values are derived from the slot keyed on org + id: a slot written
 * for another key reads as empty, so a switch never shows the previous
 * record under the new id. Only the latest request may write the slot; an
 * earlier one that lands late is dropped. A failed re-read keeps the last
 * record and sets `error`.
 *
 * Reads only when org + id change — not when the access token renews, which
 * would re-baseline an open form mid-edit.
 *
 * @param id NeTEx id to read; `''` or `null` pauses (e.g. the create pane).
 * @param fetchById Feature fetcher, e.g. `fetchVehicle`.
 * @returns `{ data, loading, error, refetch }`.
 */
export function useEntityRecord<T>(id: string | null, fetchById: FetchById<T>): EntityRecord<T> {
  const { applicationBaseUrl } = useConfig();
  const { getAccessToken } = useAuth();
  const dataOwnerRef = useOrganisationsContext().currentOrganisation?.id;
  const key = id && applicationBaseUrl && dataOwnerRef ? `${dataOwnerRef}|${id}` : null;
  const [slot, setSlot] = useState<Slot<T>>({ key: null, data: null, error: null, loading: false });
  const latest = useRef(0);
  const getAccessTokenRef = useRef(getAccessToken);
  getAccessTokenRef.current = getAccessToken;
  const fetchByIdRef = useRef(fetchById);
  fetchByIdRef.current = fetchById;

  const refetch = useCallback(async (): Promise<T | null> => {
    if (!key) return null;
    const request = ++latest.current;
    setSlot(s => ({ key, data: dataFor(s, key), error: null, loading: true }));
    try {
      const token = await getAccessTokenRef.current();
      const data = await fetchByIdRef.current(id!, applicationBaseUrl!, dataOwnerRef!, token);
      if (request === latest.current) setSlot({ key, data, error: null, loading: false });
      return data;
    } catch (err) {
      if (request === latest.current)
        setSlot(s => ({ key, data: dataFor(s, key), error: graphqlErrMsg(err), loading: false }));
      throw err;
    }
  }, [key, id, applicationBaseUrl, dataOwnerRef]);

  useEffect(() => {
    refetch().catch(() => {}); // surfaced through `error`
  }, [refetch]);

  const current = slot.key === key;
  return {
    data: current ? slot.data : null,
    error: current ? slot.error : null,
    // No key yet (org still loading) counts as loading, not as not-found.
    loading: !!id && (!key || !current || slot.loading),
    refetch,
  };
}
