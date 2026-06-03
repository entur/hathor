import { fetchVehicleTypeRequest } from '../../../graphql/vehicles/queries/fetchVehicleType.ts';
import type { VehicleType } from '../types/vehicleTypeTypes.ts';
import type { AccessToken } from '../../../auth';
import type { Page } from '../../../graphql/paginationTypes.ts';
import { projectVehicleType, type VehicleTypeWire } from '../api/fetchVehicleTypes.ts';

export const fetchVehicleType = async (
  applicationBaseUrl: string,
  id: string,
  dataOwnerRef: string,
  token: AccessToken
): Promise<VehicleType | null> => {
  const res: { vehicleTypes: Page<VehicleTypeWire> } = await fetchVehicleTypeRequest(
    applicationBaseUrl,
    id,
    dataOwnerRef,
    token
  );
  const wire = res.vehicleTypes.content[0];
  return wire ? projectVehicleType(wire) : null;
};
