import { request, gql } from 'graphql-request';
import { authHeader, type AccessToken } from '../../../auth/index.ts';
import type { DeactivateInput } from './deactivateInput.ts';

const deactivateVehicleDocument = gql`
  mutation DeactivateVehicle($input: DeactivateInput!) {
    deactivateVehicle(input: $input) {
      netexId
      version
    }
  }
`;

/** Mutation response: the persisted Vehicle's NeTEx id + version (nullable per SDL). */
export interface DeactivateVehicleMutation {
  deactivateVehicle: {
    netexId: string;
    version: number;
  } | null;
}

export const deactivateVehicleRequest = (
  applicationBaseUrl: string,
  token: AccessToken,
  vehicleData: DeactivateInput
): Promise<DeactivateVehicleMutation> =>
  request<DeactivateVehicleMutation>(
    applicationBaseUrl,
    deactivateVehicleDocument,
    { input: vehicleData },
    authHeader(token)
  );
