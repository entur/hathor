import { request, gql } from 'graphql-request';
import { authHeader, type AccessToken } from '../../../auth';
import type { VehicleWire } from '../../../data/vehicles/api/fetchVehicles.ts';

const createOrUpdateVehicleMutation = gql`
  mutation MutateVehicle($input: VehicleInput!) {
    createOrUpdateVehicle(input: $input)
  }
`;

export const createOrUpdateVehicleRequest = (
  applicationBaseUrl: string,
  token: AccessToken,
  vehicleData: VehicleWire
) =>
  request<{ createOrUpdateVehicle: string | null }>(
    applicationBaseUrl,
    createOrUpdateVehicleMutation,
    { input: vehicleData },
    authHeader(token)
  );
