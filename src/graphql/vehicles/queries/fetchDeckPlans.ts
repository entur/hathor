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

export type DeckPlanVars = { page?: number; size?: number };

export const fetchDeckPlansRequest = (
  applicationBaseUrl: string,
  token: AccessToken,
  variables?: DeckPlanVars
) => request(applicationBaseUrl, fetchDeckPlansGQL, variables, authHeader(token));
