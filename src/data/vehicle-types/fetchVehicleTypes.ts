import { fetchVehicleTypesRequest } from '../../graphql/vehicles/queries/fetchVehicleTypes.ts';
import { restructNetexId } from '../netex/restructNetexId.ts';
import type { VehicleTypeContext, VehicleType } from './vehicleTypeTypes.ts';
import type { AccessToken } from '../../auth';
import type { Page } from '../../graphql/paginationTypes.ts';
import { FETCH_ALL_SIZE } from '../../graphql/paginationTypes.ts';

/**
 * Fetch all VehicleTypes plus their nested vehicles list. Reconstructs
 * nested `vehicles[].id` into the full NeTEx form because Sobek returns
 * the raw DB row id there (see sobek#125 — same bug class as the
 * `transportType.id` workaround in `fetchVehicles`). Once the Sobek fix
 * ships, the `restructNetexId` pass-through guard keeps this safe and
 * the helper itself can be retired.
 */
export const fetchVehicleTypes = async (
  applicationBaseUrl: string,
  token: AccessToken
): Promise<VehicleTypeContext> => {
  const raw: { vehicleTypes: Page<VehicleType> } = await fetchVehicleTypesRequest(
    applicationBaseUrl,
    token,
    { size: FETCH_ALL_SIZE }
  );
  return {
    vehicleTypes: raw.vehicleTypes.content.map(vt => ({
      ...vt,
      vehicles: vt.vehicles?.map(v => ({
        ...v,
        id: restructNetexId(vt.id, 'Vehicle', v.id),
      })),
    })),
  };
};
