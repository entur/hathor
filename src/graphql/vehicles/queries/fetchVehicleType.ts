import { fetchVehicleTypesRequest } from './fetchVehicleTypes.ts';
import type { AccessToken } from '../../../auth';
import { vehicleTypeKindOf } from '../../../data/vehicle-types/utils/vehicleTypeKind.ts';

export const fetchVehicleTypeRequest = (
  applicationBaseUrl: string,
  id: string,
  dataOwnerRef: string,
  token: AccessToken
) =>
  fetchVehicleTypesRequest(applicationBaseUrl, token, {
    size: 1,
    filter: { netexIds: [id], vehicleTypeKind: vehicleTypeKindOf(id), dataOwnerRef },
  });
