import type { TransportMode } from '../netex/transportMode.ts';

/**
 * Flat Vehicle row as displayed in the `/vehicle` list.
 *
 * Iteration 1 sources rows by flattening `vehicleTypes.vehicles[]` across the
 * existing `fetchVehicleTypes` query. Enrichment fields prefixed `parent*`
 * carry over from the parent VehicleType during the flatten in
 * `fetchVehicles.ts` — they let the list show context (parent name, transport
 * mode) without a second request, and let the shared TransportMode chip filter
 * narrow rows client-side.
 *
 * Once Sobek exposes a dedicated `vehicles(filter)` query, this shape
 * generalises naturally — top-level fields stay; `parent*` either remain
 * optional enrichment or get replaced by a proper Ref<'VehicleType'> link.
 */
export interface Vehicle {
  id: string;
  registrationNumber: string;
  version: number;
  parentVehicleTypeId?: string;
  parentVehicleTypeName?: string;
  parentTransportMode?: TransportMode;
}

export type VehicleColumnKey =
  | 'registrationNumber'
  | 'version'
  | 'parentVehicleTypeName'
  | 'parentTransportMode';
