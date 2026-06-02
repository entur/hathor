import type { AccessToken } from '../../../auth/index.ts';
import type { Page } from '../../../graphql/paginationTypes.ts';
import { FETCH_ALL_SIZE } from '../../../graphql/paginationTypes.ts';
import { fetchOrganisationsRequest } from '../../../graphql/vehicles/queries/fetchOrganisations.ts';
import type {
  Name,
  Organisation,
  OrganisationType,
} from '../../vehicle-types/types/vehicleTypeTypes.ts';

interface OrganisationWire {
  netexId: string;
  name: Name;
  type: OrganisationType;
}

const projectOrganisation = (dp: OrganisationWire): Organisation => ({
  id: dp.netexId,
  name: dp.name,
  type: dp.type,
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
