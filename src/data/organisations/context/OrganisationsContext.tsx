import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useAuth } from '../../../auth';
import { useConfig } from '../../../contexts/configContext.ts';
import { fetchOrganisations } from '../api/fetchOrganisations.ts';
import type { Organisation } from '../types/organisationTypes.ts';
import { OrganisationsContext } from './useOrganisationsContext.ts';

const STORAGE_KEY = 'hathor:currentOrganisationId';

function readPersistedOrganisationId(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

interface OrganisationsProviderProps {
  children: ReactNode;
}

export function OrganisationsProvider({ children }: OrganisationsProviderProps) {
  const [data, setData] = useState<Organisation[]>([]);
  const [currentOrganisationId, setCurrentOrganisationId] = useState<string | null>(
    readPersistedOrganisationId
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { applicationBaseUrl } = useConfig();
  const { getAccessToken, isAuthenticated } = useAuth();

  const doFetch = useCallback(async () => {
    if (!isAuthenticated) {
      // Keep loading=true while logged out so protected routes don't observe
      // a false-ready state in the render right after auth flips to true.
      setLoading(true);
      setData([]);
      setError(null);
      return;
    }

    if (!applicationBaseUrl) {
      setLoading(true);
      setData([]);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = await getAccessToken();
      const organisations = await fetchOrganisations(applicationBaseUrl, token);
      setData(organisations);
      setCurrentOrganisationId(prevId => {
        if (prevId && organisations.some(org => org.id === prevId)) {
          return prevId;
        }
        return organisations[0]?.id ?? null;
      });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [applicationBaseUrl, getAccessToken, isAuthenticated]);

  useEffect(() => {
    doFetch();
  }, [doFetch]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      if (currentOrganisationId) {
        window.localStorage.setItem(STORAGE_KEY, currentOrganisationId);
      } else {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      /* ignore persistence failures */
    }
  }, [currentOrganisationId]);

  const setCurrentOrganisation = useCallback((organisation: Organisation | null) => {
    setCurrentOrganisationId(organisation?.id ?? null);
  }, []);

  const currentOrganisation = useMemo(
    () => data.find(org => org.id === currentOrganisationId) ?? null,
    [data, currentOrganisationId]
  );

  const value = useMemo(
    () => ({
      data,
      currentOrganisation,
      setCurrentOrganisation,
      error,
      loading,
      refetch: doFetch,
    }),
    [data, currentOrganisation, setCurrentOrganisation, error, loading, doFetch]
  );

  return <OrganisationsContext.Provider value={value}>{children}</OrganisationsContext.Provider>;
}
