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
