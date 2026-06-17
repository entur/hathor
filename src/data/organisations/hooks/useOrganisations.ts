import { useOrganisationsContext } from '../context/useOrganisationsContext.ts';

/**
 * Data hook for the `organisations` select. Mirrors `useVehicles`, but with a simpler lifecycle — no sort or pagination, just a single fetch
 * on `applicationBaseUrl` change.
 */
export function useOrganisations() {
  return useOrganisationsContext();
}
