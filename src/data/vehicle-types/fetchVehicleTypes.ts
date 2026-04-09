import { fetchVehicleTypesRequest } from '../../graphql/vehicles/queries/fetchVehicleTypes.ts';
import type { VehicleTypeContext, VehicleType } from './vehicleTypeTypes.ts';
import type { AccessToken } from '../../auth';
import type { Page } from '../../types/paginationTypes.ts';
import { FETCH_ALL_SIZE } from '../../types/paginationTypes.ts';

export const fetchVehicleTypes = async (
  applicationBaseUrl: string,
  token: AccessToken
): Promise<VehicleTypeContext> => {
  const raw: { vehicleTypes: Page<VehicleType> } = await fetchVehicleTypesRequest(
    applicationBaseUrl,
    token,
    { size: FETCH_ALL_SIZE }
  );
  return { vehicleTypes: raw.vehicleTypes.content };
};
