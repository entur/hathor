import { request, gql } from 'graphql-request';
import { authHeader, type AccessToken } from '../../../auth';
import type { VehicleInput } from '../../../data/vehicles/api/fetchVehicles.ts';

const createOrUpdateVehicleDocument = gql`
  mutation CreateOrUpdateVehicle($input: VehicleInput!) {
    createOrUpdateVehicle(input: $input)
  }
`;

/** Mutation response: the persisted Vehicle's NeTEx id (nullable per SDL). */
export interface CreateOrUpdateVehicleMutation {
  createOrUpdateVehicle: string | null;
}

export const createOrUpdateVehicleRequest = (
  applicationBaseUrl: string,
  token: AccessToken,
  vehicleData: VehicleInput
): Promise<CreateOrUpdateVehicleMutation> =>
  request<CreateOrUpdateVehicleMutation>(
    applicationBaseUrl,
    createOrUpdateVehicleDocument,
    { input: vehicleData },
    authHeader(token)
  );
