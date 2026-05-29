import { request, gql } from 'graphql-request';
import { authHeader, type AccessToken } from '../../../auth/index.ts';
import type { VehicleTypeWire } from '../../../data/vehicle-types/fetchVehicleTypes.ts';

const createOrUpdateVehicleTypeMutation = gql`
  mutation MutateVehicleType($input: VehicleTypeInput!) {
    createOrUpdateVehicleType(input: $input)
  }
`;

export const createOrUpdateVehicleTypeRequest = (
  applicationBaseUrl: string,
  token: AccessToken,
  vehicleTypeData: VehicleTypeWire
) =>
  request(
    applicationBaseUrl,
    createOrUpdateVehicleTypeMutation,
    { input: vehicleTypeData },
    authHeader(token)
  );
