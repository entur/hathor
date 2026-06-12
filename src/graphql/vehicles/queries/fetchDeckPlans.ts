import { request, gql } from 'graphql-request';
import { authHeader, type AccessToken } from '../../../auth';

const fetchDeckPlansGQL = gql`
  query DeckPlans($page: Int, $size: Int, $filter: DeckPlanFilter) {
    deckPlans(page: $page, size: $size, filter: $filter) {
      content {
        netexId
        name {
          value
        }
        version
      }
      totalElements
      page
      size
    }
  }
`;

import type { PageVars } from '../../paginationTypes.ts';

export type DeckPlanVars = PageVars & {
  filter?: { netexIds?: string[]; transportModes?: string[]; dataOwnerRef: string };
};

export const fetchDeckPlansRequest = (
  applicationBaseUrl: string,
  token: AccessToken,
  variables?: DeckPlanVars
) => request(applicationBaseUrl, fetchDeckPlansGQL, variables, authHeader(token));
