import { fetchVehicleTypeRequest } from '../../graphql/vehicles/queries/fetchVehicleType.ts';
import type { VehicleType } from './vehicleTypeTypes.ts';
import type { AccessToken } from '../../auth';
import type { Page } from '../../types/paginationTypes.ts';

export const fetchVehicleType = async (
  applicationBaseUrl: string,
  id: string,
  token: AccessToken
): Promise<VehicleType | null> => {
  const res: { vehicleTypes: Page<VehicleType> } = await fetchVehicleTypeRequest(
    applicationBaseUrl,
    id,
    token
  );
  return res.vehicleTypes.content[0] ?? null;
};
