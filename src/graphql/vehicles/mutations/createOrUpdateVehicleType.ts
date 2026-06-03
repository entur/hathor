import { request, gql } from 'graphql-request';
import { authHeader, type AccessToken } from '../../../auth/index.ts';
import type { VehicleTypeInput } from '../../../data/vehicle-types/api/fetchVehicleTypes.ts';

const createOrUpdateVehicleTypeMutation = gql`
  mutation MutateVehicleType($input: VehicleTypeInput!) {
    createOrUpdateVehicleType(input: $input)
  }
`;

/** Mutation response: the persisted VehicleType's NeTEx id (nullable per SDL). */
export interface CreateOrUpdateVehicleTypeResponse {
  createOrUpdateVehicleType: string | null;
}

export const createOrUpdateVehicleTypeRequest = (
  applicationBaseUrl: string,
  token: AccessToken,
  vehicleTypeData: VehicleTypeInput
): Promise<CreateOrUpdateVehicleTypeResponse> =>
  request<CreateOrUpdateVehicleTypeResponse>(
    applicationBaseUrl,
    createOrUpdateVehicleTypeMutation,
    { input: vehicleTypeData },
    authHeader(token)
  );
