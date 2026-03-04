import { request, gql } from 'graphql-request';
import { authHeader, type AccessToken } from '../../../auth';

const fetchDeckPlansGQL = gql`
  query DeckPlans {
    deckPlans {
      id
      name {
        value
      }
    }
  }
`;

export const fetchDeckPlansRequest = (applicationBaseUrl: string, token: AccessToken) => {
  return request(applicationBaseUrl, fetchDeckPlansGQL, undefined, authHeader(token));
};
