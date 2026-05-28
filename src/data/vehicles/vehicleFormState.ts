/**
 * Pure reducer-style state for the Vehicle edit form. `form` and the
 * baseline `hydratedKey` are advanced atomically by `hydrate`, so the
 * load → render transition never produces a brief `isDirty === true`
 * frame (M2, PR #74 review). All edits go through `edit`, which leaves
 * the baseline untouched so divergence is the only signal for dirty.
 */
import type { VehicleEditFormValue } from './VehicleEditForm';
import type { Vehicle } from './types/Vehicle';
import { BLANK_FORM, MISSING_MODEL } from './vehicleFormDefaults';
import { TRANSPORT_TYPE_REF_PATTERN } from './transportTypeRef';

export interface FormState {
  form: VehicleEditFormValue;
  hydratedKey: string;
}

const keyOf = (v: VehicleEditFormValue): string => JSON.stringify(v);

const formFor = (xmlVehicle: Partial<Vehicle> | null | undefined): VehicleEditFormValue =>
  xmlVehicle ? { vehicle: xmlVehicle as Vehicle, model: MISSING_MODEL } : BLANK_FORM;

export const initialFormState: FormState = {
  form: BLANK_FORM,
  hydratedKey: keyOf(BLANK_FORM),
};

/**
 * Apply a freshly-fetched `xmlVehicle` (or `undefined` to collapse back
 * to blank). Advances both `form` and `hydratedKey` in one returned
 * state — atomic by construction.
 */
export function hydrate(_: FormState, xmlVehicle: Partial<Vehicle> | null | undefined): FormState {
  const form = formFor(xmlVehicle);
  return { form, hydratedKey: keyOf(form) };
}

/** Apply a user edit. Baseline `hydratedKey` is preserved so dirty tracks divergence. */
export function edit(state: FormState, form: VehicleEditFormValue): FormState {
  return { ...state, form };
}

/** True iff the form has diverged from the last hydrated baseline. */
export function isDirty(state: FormState): boolean {
  return keyOf(state.form) !== state.hydratedKey;
}

/** True iff the required fields needed for create-side save are present.
 *  Today only TransportTypeRef gates Save — Sobek's `vehicles()` resolver
 *  silently excludes refless vehicles from the list, so a create without
 *  one is unrecoverable. Drives `saveDisabled` on /vehicles/new; the slider
 *  edit doesn't gate since existing rows already carry the ref. */
export function canSubmit(form: VehicleEditFormValue): boolean {
  return TRANSPORT_TYPE_REF_PATTERN.test(form.vehicle.TransportTypeRef ?? '');
}
