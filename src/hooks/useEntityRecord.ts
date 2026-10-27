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

  const [data, setData] = useState<R | null>(null);
  const [loading, setLoading] = useState(active);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  const fetchRef = useRef(fetchById);
  const tokenRef = useRef(getAccessToken);
  const latest = useRef(0);
  useEffect(() => {
    fetchRef.current = fetchById;
    tokenRef.current = getAccessToken;
  });

  const run = useCallback(async (): Promise<R | null> => {
    if (!active) return null;
    const ticket = ++latest.current;
    setLoading(true);
    setError(null);
    try {
      const token = await tokenRef.current();
      const record = await fetchRef.current(id, { applicationBaseUrl, dataOwnerRef, token });
      if (ticket === latest.current) {
        setData(record);
        setNotFound(record === null);
        setLoading(false);
      }
      return record;
    } catch (err: unknown) {
      if (ticket === latest.current) {
        setData(null);
        setNotFound(false);
        setError(graphqlErrMsg(err));
        setLoading(false);
      }
      throw err;
    }
  }, [active, id, applicationBaseUrl, dataOwnerRef]);

  useEffect(() => {
    if (!active) {
      latest.current++;
      setData(null);
      setNotFound(false);
      setError(null);
      setLoading(false);
      return;
    }
    run().catch(() => {});
  }, [active, run]);

  return { data, loading, error, notFound, refetch: run };
}
