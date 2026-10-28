import type { VehicleEditFormValue } from '../components/VehicleEditForm';

/**
 * Whether a Vehicle create form carries the fields Save requires. Today only
 * the TransportTypeRef gates it — Sobek's `vehicles()` resolver silently
 * excludes refless vehicles from the list, so a create without one is
 * unrecoverable. Existing rows already carry the ref, so only the create flow
 * is gated. The picker (VehicleEditForm) structurally guarantees any non-empty
 * value is a Sobek-known ref, so the check is just "did the user pick one?".
 *
 * @param {VehicleEditFormValue} form - The create form.
 * @returns {boolean} `true` when a VehicleType is picked.
 */
export function canSubmit(form: VehicleEditFormValue): boolean {
  return !!form.vehicle.transportType?.id;
}
