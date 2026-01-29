import { fetchVehicleTypesRequest } from '../../graphql/Tiamat/queries/fetchVehicleTypes.ts';
import type { VehicleTypeContext } from './vehicleTypeTypes.ts';
import type { AccessToken } from '../../auth';

let fetchedVehicleTypes: VehicleTypeContext | undefined = undefined;

export const fetchVehicleTypes = async (
  applicationBaseUrl: string,
  token: AccessToken
): Promise<VehicleTypeContext> => {
  fetchedVehicleTypes = await fetchVehicleTypesRequest(applicationBaseUrl, token);

  return Object.assign({}, fetchedVehicleTypes);
};
