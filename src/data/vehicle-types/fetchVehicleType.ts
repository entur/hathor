import { fetchVehicleTypeRequest } from '../../graphql/vehicles/queries/fetchVehicleType.ts';
import type { VehicleType, VehicleTypePage } from './vehicleTypeTypes.ts';
import type { AccessToken } from '../../auth';

export const fetchVehicleType = async (
  applicationBaseUrl: string,
  id: string,
  token: AccessToken
): Promise<VehicleType | null> => {
  const res: { vehicleTypes: VehicleTypePage } = await fetchVehicleTypeRequest(
    applicationBaseUrl,
    id,
    token
  );
  return res.vehicleTypes.content[0] ?? null;
};
