import { createContext, useContext } from 'react';
import type { Organisation } from '../data/organisations/types/organisationTypes.ts';

export interface OrganisationsContextType {
  data: Organisation[];
  currentOrganisation: Organisation | null;
  setCurrentOrganisation: (organisation: Organisation | null) => void;
  error: string | null;
  loading: boolean;
  refetch: () => Promise<void>;
}

export const OrganisationsContext = createContext<OrganisationsContextType | undefined>(undefined);

export function useOrganisationsContext(): OrganisationsContextType {
  const context = useContext(OrganisationsContext);
  if (context === undefined) {
    throw new Error('useOrganisationsContext must be used within an OrganisationsProvider');
  }

  return context;
}
