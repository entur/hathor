/**
 * Pure reducer-style state for the Vehicle edit form. Re-exports the
 * generic `createFormState` factory from `src/hooks/useFormState.ts`
 * bound to `VehicleEditFormValue` + `Partial<Vehicle>` so the public
 * API (`initialFormState`, `hydrate`, `edit`, `isDirty`, `FormState`)
 * stays stable for `VehicleDetails` and tests.
 */
import { createFormState, type FormState as GenericFormState } from '../../../hooks/useFormState';
import type { VehicleEditFormValue } from '../components/VehicleEditForm';
import { BLANK_FORM } from '../utils/vehicleFormDefaults';
import type { VehicleGQLShaped } from '../types/vehicleGqlShaped';

const vehicleForm = createFormState<VehicleEditFormValue, Partial<VehicleGQLShaped>>({
  blank: BLANK_FORM,
  formFromSource: src => (src ? { vehicle: src as VehicleGQLShaped } : BLANK_FORM),
});

export type FormState = GenericFormState<VehicleEditFormValue>;
export const initialFormState = vehicleForm.initial;
export const hydrate = vehicleForm.hydrate;
export const edit = vehicleForm.edit;
export const isDirty = vehicleForm.isDirty;

/** True iff the required fields needed for create-side save are present.
 *  Today only TransportTypeRef gates Save — Sobek's `vehicles()` resolver
 *  silently excludes refless vehicles from the list, so a create without
 *  one is unrecoverable. Drives `saveDisabled` on /vehicles/new; the slider
 *  edit doesn't gate since existing rows already carry the ref. The picker
 *  (VehicleEditForm) structurally guarantees any non-empty value is a
 *  Sobek-known ref, so the check is just "did the user pick anything?". */
export function canSubmit(form: VehicleEditFormValue): boolean {
  return !!form.vehicle.transportType?.id;
}
