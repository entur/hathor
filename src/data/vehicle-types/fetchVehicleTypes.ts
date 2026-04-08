import { fetchVehicleTypesRequest } from '../../graphql/vehicles/queries/fetchVehicleTypes.ts';
import type { VehicleTypeContext, VehicleTypePage } from './vehicleTypeTypes.ts';
import type { AccessToken } from '../../auth';

export const fetchVehicleTypes = async (
  applicationBaseUrl: string,
  token: AccessToken
): Promise<VehicleTypeContext> => {
  const raw: { vehicleTypes: VehicleTypePage } = await fetchVehicleTypesRequest(
    applicationBaseUrl,
    token,
    { size: 10000 }
  );
  return { vehicleTypes: raw.vehicleTypes.content };
};
