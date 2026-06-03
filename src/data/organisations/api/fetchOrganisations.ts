import type { AccessToken } from '../../../auth/index.ts';
import type { Page } from '../../../graphql/paginationTypes.ts';
import { FETCH_ALL_SIZE } from '../../../graphql/paginationTypes.ts';
import { fetchOrganisationsRequest } from '../../../graphql/vehicles/queries/fetchOrganisations.ts';
import type { Name } from '../../vehicle-types/types/vehicleTypeTypes.ts';
import type { Organisation, OrganisationType } from '../types/organisationTypes.ts';

interface OrganisationWire {
  netexId: string;
  name: Name;
  type: OrganisationType;
}

const projectOrganisation = (org: OrganisationWire): Organisation => ({
  id: org.netexId,
  name: org.name,
  type: org.type,
});

export const fetchOrganisations = async (
  applicationBaseUrl: string,
  token: AccessToken
): Promise<Organisation[]> => {
  const raw: { organisations: Page<OrganisationWire> } = await fetchOrganisationsRequest(
    applicationBaseUrl,
    token,
    { size: FETCH_ALL_SIZE }
  );
  return raw.organisations.content.map(projectOrganisation);
};
