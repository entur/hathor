import { UNKNOWN_TRANSPORT_MODE, type TransportMode } from '../../netex/transportMode.ts';
import type { Name } from '../../vehicle-types/vehicleTypeTypes.ts';

/**
 * Vehicle list row — GQL-shaped projection (camelCase). Distinct from the
 * NeTEx-shaped `Vehicle` in `../xml/` which is the XML-write truth.
 *
 * `transportType.id` ≡ NeTEx `TransportTypeRef`. The nested sidecar is optional
 * (server may return null when the parent VehicleType is missing).
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
  | 'registrationNumber'
  | 'operationalNumber'
  | 'version'
  | 'transportTypeName'
  | 'transportTypeMode';

/** Resolve the row's transport mode, collapsing missing `transportType` to `'unknown'`. */
export const vehicleMode = (v: VehicleGQLShaped): TransportMode =>
  v.transportType?.transportMode ?? UNKNOWN_TRANSPORT_MODE;
