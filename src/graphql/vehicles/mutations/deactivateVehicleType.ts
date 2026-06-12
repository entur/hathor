import { request, gql } from 'graphql-request';
import { authHeader, type AccessToken } from '../../../auth/index.ts';
import type { DeactivateInput } from '../../../data/vehicle-types/api/fetchVehicleTypes.ts';

const deactivateVehicleTypeMutation = gql`
  mutation DeactivateVehicleType($input: DeactivateInput!) {
    deactivateVehicleType(input: $input) {
      netexId
      version
    }
  }
`;

/** Mutation response: the persisted VehicleType's NeTEx id + version (nullable per SDL). */
  deactivateVehicleType: {
    netexId: string;
    version: number;
  } | null;
}

export const deactivateVehicleTypeRequest = (
  applicationBaseUrl: string,
  token: AccessToken,
  vehicleTypeData: DeactivateInput
): Promise<DeactivateVehicleTypeResponse> =>
  request<DeactivateVehicleTypeResponse>(
    applicationBaseUrl,
    deactivateVehicleTypeMutation,
    { input: vehicleTypeData },
    authHeader(token)
  );
