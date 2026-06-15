import { request, gql } from 'graphql-request';
import { authHeader, type AccessToken } from '../../../auth/index.ts';
import type { DeactivateInput } from '../../../data/vehicle-types/api/fetchVehicleTypes.ts';

const deactivateDeckPlanMutation = gql`
  mutation DeactivateDeckPlan($input: DeactivateInput!) {
    deactivateDeckPlan(input: $input) {
      netexId
      version
    }
  }
`;

/** Mutation response: the persisted DeckPlan's NeTEx id + version (nullable per SDL). */
export interface DeactivateDeckPlanResponse {
  deactivateDeckPlan: {
    netexId: string;
    version: number;
  } | null;
}

export const deactivateDeckPlanRequest = (
  applicationBaseUrl: string,
  token: AccessToken,
  deckPlanData: DeactivateInput
): Promise<DeactivateDeckPlanResponse> =>
  request<DeactivateDeckPlanResponse>(
    applicationBaseUrl,
    deactivateDeckPlanMutation,
    { input: deckPlanData },
    authHeader(token)
  );
