import { fetchVehicleTypeRequest } from '../../graphql/vehicles/queries/fetchVehicleType.ts';
import type { VehicleType, VehicleTypeContext } from './vehicleTypeTypes.ts';
import type { AccessToken } from '../../auth';

// Workaround: fetches all vehicleTypes and filters by ID (entur/sobek#78)
export const fetchVehicleType = async (
  applicationBaseUrl: string,
  id: string,
  token: AccessToken
): Promise<VehicleType | null> => {
  const res: VehicleTypeContext = await fetchVehicleTypeRequest(applicationBaseUrl, token);
  return res.vehicleTypes.find(vt => vt.id === id) ?? null;
};
