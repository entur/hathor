import { UNKNOWN_TRANSPORT_MODE, type TransportMode } from '../../netex/transportMode.ts';
import type { Name } from '../../vehicle-types/types/vehicleTypeTypes.ts';

/**
 * Vehicle object — GQL-shaped to mirror the shape of the `vehicles(...)` GraphQL query response.
 * The `id` field is seeded from the NeTEx `netexId` because the UI relies on every object having an ID property
 *
 */
export interface VehicleGQLShaped {
  id: string;
  version?: number;
  name?: Name;
  registrationNumber?: string;
  operationalNumber?: string;
  chassisNumber?: string;
  registrationDate?: string;
  buildDate?: string;
  description?: Name;
  transportType?: Partial<{
    id?: string;
    version?: number;
    name?: Name;
    transportMode?: TransportMode;
  }>;
}

export type VehicleColumnKey =
  | 'id'
  | 'registrationNumber'
  | 'operationalNumber'
  | 'version'
  | 'transportTypeName'
  | 'transportTypeMode';

/** Resolve the row's transport mode, collapsing missing `transportType` to `'unknown'`. */
export const vehicleMode = (v: VehicleGQLShaped): TransportMode =>
  v.transportType?.transportMode ?? UNKNOWN_TRANSPORT_MODE;
