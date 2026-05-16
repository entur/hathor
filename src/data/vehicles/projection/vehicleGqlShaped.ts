import type { TransportMode } from '../../netex/transportMode.ts';

/**
 * Vehicle row as displayed in the `/vehicle` list — the GQL-shaped projection
 * (camelCase) consumed by sort, filter, and cell renderers.
 *
 * Distinct from the NeTEx-shaped `Vehicle` (see `../xml/Vehicle.ts`), which is
 * the PascalCase XML-write truth. The two types serve different roles —
 * read/display vs. import/export — and intentionally do not share a name.
 *
 * `transportType` is the joined mini-VehicleType the new Sobek `vehicles(...)`
 * query returns inline. `transportType.id` ≡ NeTEx `TransportTypeRef` (the
 * foreign-key reference); `name`/`transportMode` are denormalised display data
 * the chip filter and list cell read off the row directly without a second
 * fetch. Optional: Sobek may return `transportType: null` for vehicles whose
 * parent VehicleType is missing.
 */
export interface VehicleGQLShaped {
  id: string;
  version: number;
  registrationNumber: string;
  operationalNumber?: string;
  transportType?: {
    /** NeTEx id of the parent VehicleType — equivalent to `TransportTypeRef`. */
    id: string;
    version: number;
    /** Lifted from server-side `Name.value`. */
    name?: string;
    /** `'unknown'` when the backend value is missing or unrecognised. */
    transportMode: TransportMode;
  };
}

export type VehicleColumnKey =
  | 'registrationNumber'
  | 'version'
  | 'transportTypeName'
  | 'transportTypeMode';
