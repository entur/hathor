import { fetchVehicleTypesRequest } from './fetchVehicleTypes.ts';
import type { AccessToken } from '../../../auth';
import type { VehicleTypeKind } from '../../../data/vehicle-types/types/vehicleTypeTypes.ts';

export const fetchVehicleTypeRequest = (
  applicationBaseUrl: string,
  id: string,
  dataOwnerRef: string,
  vehicleTypeKind: VehicleTypeKind,
  token: AccessToken
) =>
  fetchVehicleTypesRequest(applicationBaseUrl, token, {
    size: 1,
    filter: { netexIds: [id], vehicleTypeKind, dataOwnerRef },
  });
