/**
 * Pure reducer-style state for the Vehicle edit form. Re-exports the
 * generic `createFormState` factory from `src/hooks/useFormState.ts`
 * bound to `VehicleEditFormValue` + `Partial<Vehicle>` so the public
 * API (`initialFormState`, `hydrate`, `edit`, `isDirty`, `FormState`)
 * stays stable for `VehicleDetails` and tests.
 */
import { createFormState, type FormState as GenericFormState } from '../../../hooks/useFormState';
import type { VehicleEditFormValue } from '../components/VehicleEditForm';
import type { Vehicle } from '../types/Vehicle';
import { BLANK_FORM, MISSING_MODEL } from '../utils/vehicleFormDefaults';
import { TRANSPORT_TYPE_REF_PATTERN } from '../utils/transportTypeRef';

const vehicleForm = createFormState<VehicleEditFormValue, Partial<Vehicle>>({
  blank: BLANK_FORM,
  formFromSource: src => (src ? { vehicle: src as Vehicle, model: MISSING_MODEL } : BLANK_FORM),
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
 *  edit doesn't gate since existing rows already carry the ref. */
export function canSubmit(form: VehicleEditFormValue): boolean {
  return TRANSPORT_TYPE_REF_PATTERN.test(form.vehicle.TransportTypeRef ?? '');
}
