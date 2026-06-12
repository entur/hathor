import { request, gql } from 'graphql-request';
import { authHeader, type AccessToken } from '../../../auth/index.ts';
import type { DeactivateInput } from '../../../data/vehicle-types/api/fetchVehicleTypes.ts';

const deactivateVehicleMutation = gql`
  mutation DeactivateVehicle($input: DeactivateInput!) {
    deactivateVehicle(input: $input) {
      netexId
      version
    }
  }
`;

/** Mutation response: the persisted Vehicle's NeTEx id (nullable per SDL). */
export interface DeactivateVehicleResponse {
  deactivateVehicle: {
    netexId: string;
    version: number;
  } | null;
}

export const deactivateVehicleRequest = (
  applicationBaseUrl: string,
  token: AccessToken,
  vehicleData: DeactivateInput
): Promise<DeactivateVehicleResponse> =>
  request<DeactivateVehicleResponse>(
    applicationBaseUrl,
    deactivateVehicleMutation,
    { input: vehicleData },
    authHeader(token)
  );
