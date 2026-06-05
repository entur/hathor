import { request, gql } from 'graphql-request';
import { authHeader, type AccessToken } from '../../../auth/index.ts';
import type { PageVars } from '../../paginationTypes.ts';

const fetchOrganisationsGQL = gql`
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

export type OrganisationVars = PageVars & {
  filter?: {
    onlyUserAuthorized?: boolean;
  };
};

export const fetchOrganisationsRequest = (
  applicationBaseUrl: string,
  token: AccessToken,
  variables?: OrganisationVars
) => request(applicationBaseUrl, fetchOrganisationsGQL, variables, authHeader(token));
