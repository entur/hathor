/**
 * NOTE — workaround for sobek#125. Two nested NeTEx-id fields fall back to
 * the default fetcher and return the bare DB row id instead of the full
 * `CODESPACE:Type:value` form:
 *
 *   - `vehicles(...) { content { transportType { id } } }` — used by the
 *     `/vehicles` list and details TransportTypeRef.
 *   - `vehicleTypes(...) { content { vehicles { id } } }` — used by the
 *     "vehicles" column on `/vehicle-types` for the deep-link to
 *     `/vehicles/:id`.
 *
 * Until the Sobek fix lands, we reconstruct the missing prefix client-side
 * by lifting the codespace off a sibling NeTEx id (typically the outer
 * entity in the same frame). Mirrors the historical hardcoded
 * `NMR:Vehicle:` workaround that PR entur/sobek#123 retired.
 *
 * Remove `restructNetexId` once sobek#125 ships — the pass-through guard means
 * call sites still produce correct output, but the helper itself is dead
 * weight at that point.
 *
 * @param donor  Sibling NeTEx id sharing the codespace (e.g. `NMR:Vehicle:V1`).
 * @param type   Type segment to splice in (e.g. `'VehicleType'`).
 * @param value  Raw value from the broken nested field, or an already-formed
 *               NeTEx id (which is returned unchanged once sobek#125 lands).
 * @returns      `CODESPACE:type:value`, or `value` when it already contains a
 *               `:` (assume already-formed) or `donor` lacks one.
 */
export function restructNetexId(donor: string, type: string, value: string): string {
  if (value.includes(':')) return value;
  const idx = donor.indexOf(':');
  if (idx === -1) return value;
  return `${donor.slice(0, idx)}:${type}:${value}`;
}
