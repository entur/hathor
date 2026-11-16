import { VEHICLE_TYPE_KIND } from '../types/vehicleTypeTypes.ts';
import type { VehicleTypeKind } from '../types/vehicleTypeTypes.ts';
import { VEHICLE_TYPE_KIND_CONFIG } from './vehicleTypeKindConfig.ts';

/** Build the vehicle type's form-page href, `/vehicle-types/<id>` (#285); a CONTRACTUAL one's is under
 *  `/contractual-vehicle-types`. */
export const vehicleTypeFormHref = (
  id: string,
  kind: VehicleTypeKind = VEHICLE_TYPE_KIND
): string => `${VEHICLE_TYPE_KIND_CONFIG[kind].path}/${encodeURIComponent(id)}`;
