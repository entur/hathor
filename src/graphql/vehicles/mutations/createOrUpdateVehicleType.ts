import { request, gql } from 'graphql-request';
import { authHeader, type AccessToken } from '../../../auth/index.ts';
import type { VehicleTypeInput } from '../../../data/vehicle-types/api/fetchVehicleTypes.ts';

const createOrUpdateVehicleTypeMutation = gql`
  mutation MutateVehicleType($input: VehicleTypeInput!) {
    createOrUpdateVehicleType(input: $input)
  }
`;

/** Mutation response: the persisted VehicleType's NeTEx id. */
export interface CreateOrUpdateVehicleTypeResponse {
  createOrUpdateVehicleType: string;
}

export const createOrUpdateVehicleTypeRequest = (
  applicationBaseUrl: string,
  token: AccessToken,
  vehicleTypeData: VehicleTypeInput
): Promise<CreateOrUpdateVehicleTypeResponse> =>
  request(
    applicationBaseUrl,
    createOrUpdateVehicleTypeMutation,
    { input: vehicleTypeData },
    authHeader(token)
  );
