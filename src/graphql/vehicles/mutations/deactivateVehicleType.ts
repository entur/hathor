import { request, gql } from 'graphql-request';
import { authHeader, type AccessToken } from '../../../auth/index.ts';
import type { DeactivateInput } from './deactivateInput.ts';

const deactivateVehicleTypeDocument = gql`
  mutation DeactivateVehicleType($input: DeactivateInput!) {
    deactivateVehicleType(input: $input) {
      netexId
      version
    }
  }
`;

/** Mutation response: the persisted VehicleType's NeTEx id + version (nullable per SDL). */
export interface DeactivateVehicleTypeMutation {
  deactivateVehicleType: {
    netexId: string;
    version: number;
  } | null;
}

export const deactivateVehicleTypeRequest = (
  applicationBaseUrl: string,
  token: AccessToken,
  vehicleTypeData: DeactivateInput
): Promise<DeactivateVehicleTypeMutation> =>
  request<DeactivateVehicleTypeMutation>(
    applicationBaseUrl,
    deactivateVehicleTypeDocument,
    { input: vehicleTypeData },
    authHeader(token)
  );
