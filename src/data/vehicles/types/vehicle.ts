import { UNKNOWN_TRANSPORT_MODE, type TransportMode } from '../../netex/transportMode.ts';
import type { MultilingualString } from '../../netex/multilingualString.ts';

/**
 * Vehicle object — GQL-shaped to mirror the shape of the `vehicles(...)` GraphQL query response.
 * The `id` field is seeded from the NeTEx `netexId` because the UI relies on every object having an ID property
 *
 */
export interface Vehicle {
  id: string;
  version?: number;
  name?: MultilingualString;
  registrationNumber?: string;
  operationalNumber?: string;
  chassisNumber?: string;
  registrationDate?: string;
  buildDate?: string;
  description?: MultilingualString;
  transportType?: Partial<{
    id?: string;
    version?: number;
    name?: MultilingualString;
    transportMode?: TransportMode;
  }>;
}

export type VehicleColumnKey =
  | 'name'
  | 'id'
  | 'registrationNumber'
  | 'operationalNumber'
  | 'transportTypeName'
  | 'transportTypeMode';

/** Resolve the row's transport mode, collapsing missing `transportType` to `'unknown'`. */
export const vehicleMode = (v: Vehicle): TransportMode =>
  v.transportType?.transportMode ?? UNKNOWN_TRANSPORT_MODE;

/**
 * The mode a vehicle is drawn in: its type's, looked up in the org's list (a picked type on
 * a create carries none of its own), else the one embedded in the vehicle (#285).
 *
 * @param {Vehicle} v the vehicle
 * @param {{ transportMode?: TransportMode }} [type] its type from the org's list, if found
 * @returns {TransportMode | undefined} the mode to draw; none draws the standard bus
 */
export const vehiclePictureMode = (
  v: Vehicle,
  type?: { transportMode?: TransportMode }
): TransportMode | undefined => type?.transportMode ?? v.transportType?.transportMode;
