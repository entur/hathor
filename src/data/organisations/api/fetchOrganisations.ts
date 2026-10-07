import type { AccessToken } from '../../../auth/index.ts';
import { FETCH_ALL_SIZE } from '../../../graphql/paginationTypes.ts';
import {
  fetchOrganisationsRequest,
  type OrganisationsQuery,
} from '../../../graphql/vehicles/queries/fetchOrganisations.ts';
import type { Organisation } from '../types/organisationTypes.ts';

const projectOrganisation = (
  org: OrganisationsQuery['organisations']['content'][number]
): Organisation => ({
  id: org.netexId,
  name: org.name,
  type: org.type,
});

export const fetchOrganisations = async (
  applicationBaseUrl: string,
  token: AccessToken
): Promise<Organisation[]> => {
  const raw = await fetchOrganisationsRequest(applicationBaseUrl, token, {
    filter: { onlyUserAuthorized: true },
    size: FETCH_ALL_SIZE,
  });
  return raw.organisations.content.map(projectOrganisation);
};
