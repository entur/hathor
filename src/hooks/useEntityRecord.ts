import { useCallback, useEffect, useRef, useState } from 'react';
import { useConfig } from '../contexts/configContext.ts';
import { useAuth } from '../auth/authUtils.ts';
import type { AccessToken } from '../auth';
import { useOrganisationsContext } from '../contexts/useOrganisationsContext.ts';
import { graphqlErrMsg } from '../data/graphqlErrMsg.ts';
import { NEW_SELECTION } from './useUrlEditorSelection';

/** Everything a by-id fetcher needs besides the id itself. */
export interface RecordFetchCtx {
  applicationBaseUrl: string;
  dataOwnerRef: string;
  token: AccessToken;
}

/** Fetches one record by id; resolves `null` when Sobek has no such record. */
export type FetchById<R> = (id: string, ctx: RecordFetchCtx) => Promise<R | null>;

export interface EntityRecord<R> {
  data: R | null;
  loading: boolean;
  error: string | null;
  /** Fetched, and Sobek returned nothing. */
  notFound: boolean;
  /** Re-fetch the current id; resolves with the fresh record, rejects on failure. */
  refetch: () => Promise<R | null>;
}

interface RecState<R> {
  key: string | null;
  data: R | null;
  notFound: boolean;
  error: string | null;
  loading: boolean;
}
const EMPTY_REC: RecState<unknown> = {
  key: null,
  data: null,
  notFound: false,
  error: null,
  loading: false,
};

/**
 * Fetch one entity by id from Sobek. Skips the fetch for a null id or the
 * `NEW_SELECTION` sentinel, re-fetches when the id or organisation changes,
 * and drops responses that arrive after the id has moved on.
 *
 * @param {string | null} id - Entity netexId, `null`, or `NEW_SELECTION` (no fetch).
 * @param {FetchById<R>} fetchById - Fetcher; may be an inline closure (held in a ref).
 * @returns {EntityRecord<R>} Record state plus a `refetch` that rejects on failure.
 */
export function useEntityRecord<R>(id: string | null, fetchById: FetchById<R>): EntityRecord<R> {
  const { applicationBaseUrl } = useConfig();
  const { getAccessToken } = useAuth();
  const { currentOrganisation } = useOrganisationsContext();
  const dataOwnerRef = currentOrganisation?.id;
  const active = !!id && id !== NEW_SELECTION && !!applicationBaseUrl && !!dataOwnerRef;

  const key = active ? `${dataOwnerRef}|${id}` : null;
  const [rec, setRec] = useState<RecState<R>>(EMPTY_REC as RecState<R>);

  const fetchRef = useRef(fetchById);
  const tokenRef = useRef(getAccessToken);
  const latest = useRef(0);
  useEffect(() => {
    fetchRef.current = fetchById;
    tokenRef.current = getAccessToken;
  });

  const run = useCallback(async (): Promise<R | null> => {
    if (!active) return null;
    const k = `${dataOwnerRef}|${id}`;
    const ticket = ++latest.current;
    setRec(prev =>
      prev.key === k
        ? { ...prev, loading: true, error: null }
        : { key: k, data: null, notFound: false, error: null, loading: true }
    );
    try {
      const token = await tokenRef.current();
      const record = await fetchRef.current(id, { applicationBaseUrl, dataOwnerRef, token });
      if (ticket === latest.current)
        setRec({ key: k, data: record, notFound: record === null, error: null, loading: false });
      return record;
    } catch (err: unknown) {
      if (ticket === latest.current)
        // A failed refetch of the same key keeps the last good record.
        setRec(prev => ({
          key: k,
          data: prev.key === k ? prev.data : null,
          notFound: prev.key === k ? prev.notFound : false,
          error: graphqlErrMsg(err),
          loading: false,
        }));
      throw err;
    }
  }, [active, id, applicationBaseUrl, dataOwnerRef]);

  useEffect(() => {
    if (!active) {
      latest.current++;
      return;
    }
    run().catch(() => {});
  }, [active, run]);

  // State belonging to another key is never exposed; loading is true from the first render of a new key.
  const fresh = key !== null && rec.key === key;
  const data = fresh ? rec.data : null;
  const notFound = fresh ? rec.notFound : false;
  const error = fresh ? rec.error : null;
  const loading = key !== null && (!fresh || rec.loading);

  return { data, loading, error, notFound, refetch: run };
}
