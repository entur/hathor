import type { TransportMode } from '../netex/transportMode.ts';

/**
 * Flat Vehicle row as displayed in the `/vehicle` list.
 *
 * Named `VehicleRow` (not `Vehicle`) to avoid collision with
 * `vehicle-types/vehicleTypeTypes.ts::Vehicle`, which is the wire shape nested
 * under VehicleType. `VehicleRow` extends that shape with optional `parent*`
 * enrichment fields populated during flatten in `fetchVehicles.ts` — they let
 * the list show context (parent name, transport mode) without a second
 * request and let the shared TransportMode chip filter narrow rows
 * client-side.
 *
 * Once Sobek exposes a dedicated `vehicles(filter)` query, this shape
 * generalises — top-level fields stay; `parent*` either remain optional
 * enrichment or get replaced by a proper Ref<'VehicleType'> link.
 */
export interface VehicleRow {
  id: string;
  registrationNumber: string;
  version: number;
  parentVehicleTypeId?: string;
  parentVehicleTypeName?: string;
  /** Always defined; `'unknown'` when the backend value is missing or unrecognised. */
  parentTransportMode: TransportMode;
}

export type VehicleColumnKey =
  | 'registrationNumber'
  | 'version'
  | 'parentVehicleTypeName'
  | 'parentTransportMode';
