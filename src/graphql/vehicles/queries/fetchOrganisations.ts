import { request, gql } from 'graphql-request';
import { authHeader, type AccessToken } from '../../../auth/index.ts';

const fetchOrganisationsGQL = gql`
  query Organisations($page: Int, $size: Int) {
    organisations(page: $page, size: $size) {
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

import type { PageVars } from '../../paginationTypes.ts';

export type OrganisationVars = PageVars;

export const fetchOrganisationsRequest = (
  applicationBaseUrl: string,
  token: AccessToken,
  variables?: OrganisationVars
) => request(applicationBaseUrl, fetchOrganisationsGQL, variables, authHeader(token));
