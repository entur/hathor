import { request, gql } from 'graphql-request';
import { authHeader, type AccessToken } from '../../../auth';
import type { VehicleInput } from '../../../data/vehicles/api/fetchVehicles.ts';

const createOrUpdateVehicleMutation = gql`
  mutation MutateVehicle($input: VehicleInput!) {
    createOrUpdateVehicle(input: $input)
  }
`;

export const createOrUpdateVehicleRequest = (
  applicationBaseUrl: string,
  token: AccessToken,
  vehicleData: VehicleInput
) =>
  request<{ createOrUpdateVehicle: string | null }>(
    applicationBaseUrl,
    createOrUpdateVehicleMutation,
    { input: vehicleData },
    authHeader(token)
  );
