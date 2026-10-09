import { request, gql } from 'graphql-request';
import { authHeader, type AccessToken } from '../../../auth/index.ts';
import type { MultilingualString } from '../../../data/netex/multilingualString.ts';
import type { OrganisationType } from '../../../data/organisations/types/organisationTypes.ts';

const organisationsDocument = gql`
  query Organisations($page: Int, $size: Int, $filter: OrganisationsFilter) {
    organisations(page: $page, size: $size, filter: $filter) {
      content {
        netexId
        name {
          value
        }
        type
      }
      totalElements
      page
      size
    }
  }
`;

/** Sobek `OrganisationsFilter` — the `organisations(filter:)` argument. */
export type OrganisationsFilter = { onlyUserAuthorized?: boolean };

/** Variables of the `Organisations` query. */
export type OrganisationsQueryVariables = {
  page?: number;
  size?: number;
  filter?: OrganisationsFilter;
};

/** Result of the `Organisations` query: one page of organisations, as selected above. */
export type OrganisationsQuery = {
  organisations: {
    content: { netexId: string; name: MultilingualString; type: OrganisationType }[];
    totalElements: number;
    page: number;
    size: number;
  };
};

export const fetchOrganisationsRequest = (
  applicationBaseUrl: string,
  token: AccessToken,
  variables?: OrganisationsQueryVariables
) =>
  request<OrganisationsQuery>(
    applicationBaseUrl,
    organisationsDocument,
    variables,
    authHeader(token)
  );
