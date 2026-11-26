import { request, gql } from 'graphql-request';
import { authHeader, type AccessToken } from '../../../auth/index.ts';
import type { DeactivateInput } from './deactivateInput.ts';

const deactivateDeckPlanDocument = gql`
  mutation DeactivateDeckPlan($input: DeactivateInput!) {
    deactivateDeckPlan(input: $input) {
      netexId
      version
    }
  }
`;

/** Mutation response: the persisted DeckPlan's NeTEx id + version (nullable per SDL). */
export interface DeactivateDeckPlanMutation {
  deactivateDeckPlan: {
    netexId: string;
    version: number;
  } | null;
}

export const deactivateDeckPlanRequest = (
  applicationBaseUrl: string,
  token: AccessToken,
  deckPlanData: DeactivateInput
): Promise<DeactivateDeckPlanMutation> =>
  request<DeactivateDeckPlanMutation>(
    applicationBaseUrl,
    deactivateDeckPlanDocument,
    { input: deckPlanData },
    authHeader(token)
  );
