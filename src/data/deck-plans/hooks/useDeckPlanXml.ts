import { useEffect, useState } from 'react';
import { useAuth } from '../../../auth/authUtils';
import { useConfig } from '../../../contexts/configContext';
import { useOrganisations } from '../../organisations/hooks/useOrganisations';
import { fetchDeckPlanDetails } from '../api/deckPlanDetailsService';

interface UseDeckPlanXmlResult {
  xml: string;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Fetch the NeTEx XML body for a single deck plan. Gates on the same
 * preconditions as the previous route-based effect (`id`, configured
 * `applicationImportBaseUrl`, selected organisation); while any precondition
 * is unmet, holds the previous state and reports `loading=false`.
 *
 * Returns `{xml, loading, error, refetch}`. The component is responsible
 * for rendering a loading state until `loading === false && xml !== ''`.
 *
 * @param id Full NeTEx id of the deck plan to fetch; `null`/empty pauses the fetch.
 */
export function useDeckPlanXml(id: string | null | undefined): UseDeckPlanXmlResult {
  const { getAccessToken } = useAuth();
  const { applicationImportBaseUrl } = useConfig();
  const { currentOrganisation } = useOrganisations();
  const [xml, setXml] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState<number>(0);

  const enabled = !!id && !!applicationImportBaseUrl && currentOrganisation?.id !== undefined;

  useEffect(() => {
    // Precondition unmet — clear loading so a spinner from a prior, now-
    // cancelled fetch doesn't hang. (The previous effect's cleanup gates
    // setLoading(false) behind `!cancelled`, so without this the next
    // early-return run would leave `loading=true` forever.)
    if (!enabled) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    (async () => {
      try {
        const token = await getAccessToken();
        const data = await fetchDeckPlanDetails(applicationImportBaseUrl, id!, token);
        if (!cancelled) setXml(data);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : String(e));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [enabled, id, applicationImportBaseUrl, getAccessToken, currentOrganisation?.id, tick]);

  return { xml, loading, error, refetch: () => setTick(t => t + 1) };
}
