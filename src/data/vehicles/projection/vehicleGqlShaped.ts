import type { TransportMode } from '../../netex/transportMode.ts';

/**
 * Flat Vehicle row as displayed in the `/vehicle` list — the GQL-shaped
 * projection (camelCase) consumed by sort, filter, and cell renderers.
 *
 * Distinct from the NeTEx-shaped `Vehicle` (see `../xml/Vehicle.ts`), which is
 * the PascalCase XML-write truth. The two types serve different roles —
 * read/display vs. import/export — and intentionally do not share a name.
 *
 * Today's shape carries `parent*` enrichment populated by flattening
 * `vehicleType.vehicles[]`. A follow-up cutover (#72) replaces `parent*` with
 * a nested `transportType` sidecar matching the new `vehicles(...)` GQL
 * response.
 */
export interface VehicleGQLShaped {
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
