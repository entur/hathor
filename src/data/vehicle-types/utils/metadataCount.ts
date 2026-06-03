import type { VehicleType } from '../types/vehicleTypeTypes.ts';

/**
 * Count of extension-metadata entries on a VehicleType: `privateCode` (0 or 1) +
 * the number of `keyValues`. Surfaced as a table column so PC/KV presence is
 * visible — these aren't editable in the form and are at risk on save (Sobek
 * #148/#149), and `keyValues` carries the Autosys `imported-id` provenance.
 *
 * @param vt The VehicleType row.
 * @returns The combined PC/KV count (0 when none).
 */
export const metadataCount = (vt: VehicleType): number =>
  (vt.privateCode ? 1 : 0) + (vt.keyValues?.length ?? 0);
