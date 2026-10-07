import { request, gql } from 'graphql-request';
import { authHeader, type AccessToken } from '../../../auth/index.ts';
import type { DeckPlanInput } from '../../../data/deck-plans/api/fetchDeckPlans.ts';

const createOrUpdateDeckPlanDocument = gql`
  mutation CreateOrUpdateDeckPlan($input: DeckPlanInput!) {
    createOrUpdateDeckPlan(input: $input)
  }
`;

/** Mutation response: the persisted DeckPlan's NeTEx id (nullable per SDL). */
export interface CreateOrUpdateDeckPlanMutation {
  createOrUpdateDeckPlan: string | null;
}

export const createOrUpdateDeckPlanRequest = (
  applicationBaseUrl: string,
  token: AccessToken,
  deckPlanData: DeckPlanInput
): Promise<CreateOrUpdateDeckPlanMutation> =>
  request<CreateOrUpdateDeckPlanMutation>(
    applicationBaseUrl,
    createOrUpdateDeckPlanDocument,
    { input: deckPlanData },
    authHeader(token)
  );
