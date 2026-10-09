import { request, gql } from 'graphql-request';
import { authHeader, type AccessToken } from '../../../auth/index.ts';
import type { VehicleTypeInput } from '../../../data/vehicle-types/api/fetchVehicleTypes.ts';

const createOrUpdateVehicleTypeDocument = gql`
  mutation CreateOrUpdateVehicleType($input: VehicleTypeInput!) {
    createOrUpdateVehicleType(input: $input)
  }
`;

/** Mutation response: the persisted VehicleType's NeTEx id (nullable per SDL). */
export interface CreateOrUpdateVehicleTypeMutation {
  createOrUpdateVehicleType: string | null;
}

export const createOrUpdateVehicleTypeRequest = (
  applicationBaseUrl: string,
  token: AccessToken,
  vehicleTypeData: VehicleTypeInput
): Promise<CreateOrUpdateVehicleTypeMutation> =>
  request<CreateOrUpdateVehicleTypeMutation>(
    applicationBaseUrl,
    createOrUpdateVehicleTypeDocument,
    { input: vehicleTypeData },
    authHeader(token)
  );
