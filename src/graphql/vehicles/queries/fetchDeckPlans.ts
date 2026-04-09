import { request, gql } from 'graphql-request';
import { authHeader, type AccessToken } from '../../../auth';

const fetchDeckPlansGQL = gql`
  query DeckPlans($page: Int, $size: Int) {
    deckPlans(page: $page, size: $size) {
      content {
        id
        name {
          value
        }
      }
      totalElements
      page
      size
    }
  }
`;

import type { PageVars } from '../../../types/paginationTypes.ts';

export type DeckPlanVars = PageVars;

export const fetchDeckPlansRequest = (
  applicationBaseUrl: string,
  token: AccessToken,
  variables?: DeckPlanVars
) => request(applicationBaseUrl, fetchDeckPlansGQL, variables, authHeader(token));
