import { request, gql } from 'graphql-request';
import { authHeader, type AccessToken } from '../../../auth/index.ts';
import type { DeckPlanInput } from '../../../data/deck-plans/api/fetchDeckPlans.ts';

const createOrUpdateDeckPlanMutation = gql`
  mutation MutateDeckPlan($input: DeckPlanInput!) {
    createOrUpdateDeckPlan(input: $input)
  }
`;

/** Mutation response: the persisted DeckPlan's NeTEx id (nullable per SDL). */
export interface CreateOrUpdateDeckPlanResponse {
  createOrUpdateDeckPlan: string | null;
}

export const createOrUpdateDeckPlanRequest = (
  applicationBaseUrl: string,
  token: AccessToken,
  deckPlanData: DeckPlanInput
): Promise<CreateOrUpdateDeckPlanResponse> =>
  request<CreateOrUpdateDeckPlanResponse>(
    applicationBaseUrl,
    createOrUpdateDeckPlanMutation,
    { input: deckPlanData },
    authHeader(token)
  );
