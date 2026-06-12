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

/** Mutation response: the persisted Vehicle's NeTEx id (nullable per SDL). */
export interface DeactivateDeckPlanResponse {
  deactivateDeckPlan: {
    netexId: string;
    version: number;
  } | null;
}

export const deactivateDeckPlanRequest = (
  applicationBaseUrl: string,
  token: AccessToken,
  vehicleData: DeactivateInput
): Promise<DeactivateDeckPlanResponse> =>
  request<DeactivateDeckPlanResponse>(
    applicationBaseUrl,
    deactivateDeckPlanMutation,
    { input: vehicleData },
    authHeader(token)
  );
