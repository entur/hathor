import type { Decorator } from '@storybook/react-vite';
import type { Organisation } from '../data/organisations/types/organisationTypes.ts';
import { OrganisationsContext, type OrganisationsContextType } from './useOrganisationsContext.ts';

// NeTEx ids in full `Codespace:Type:Number` form, matching what Sobek returns.
const ORGS: Organisation[] = [
  { id: 'NMR:Organisation:1', name: { value: 'First Org' }, type: 'AUTHORITY' },
  { id: 'NMR:Organisation:2', name: { value: 'Second Org' }, type: 'OPERATOR' },
];

const SIGNED_IN: OrganisationsContextType = {
  data: ORGS,
  currentOrganisation: ORGS[0],
  setCurrentOrganisation: () => {},
  error: null,
  loading: false,
  refetch: () => Promise.resolve(),
};

/**
 * Decorator supplying a static OrganisationsContext to a story. The real
 * OrganisationsProvider derives its value from runtime config, OIDC and a
 * fetch, none of which exist in Storybook — so org-aware components (Menu,
 * Home) throw without this.
 *
 * @param over - context fields overriding the signed-in-with-two-orgs default.
 * @returns a decorator wrapping the story in the mocked provider.
 */
export const withOrganisations =
  (over: Partial<OrganisationsContextType> = {}): Decorator =>
  Story => (
    <OrganisationsContext.Provider value={{ ...SIGNED_IN, ...over }}>
      <Story />
    </OrganisationsContext.Provider>
  );

export { ORGS as mockOrganisations };
