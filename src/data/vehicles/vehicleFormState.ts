/**
 * Pure reducer-style state for the Vehicle edit form. `form` and the
 * baseline `hydratedKey` are advanced atomically by `hydrate`, so the
 * load → render transition never produces a brief `isDirty === true`
 * frame (M2, PR #74 review). All edits go through `edit`, which leaves
 * the baseline untouched so divergence is the only signal for dirty.
 */
import type { VehicleEditFormValue } from './VehicleEditForm';
import type { Vehicle } from './xml/Vehicle';
import { BLANK_FORM, MISSING_MODEL } from './vehicleFormDefaults';

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

/** TEMP — the bare numeric input in VehicleEditForm writes the full netex id;
 *  this gate enforces save-disabled until that id is present and well-formed.
 *  Tighten/loosen alongside the picker swap (Sobek VehicleTypeFilter.name). */
const TRANSPORT_TYPE_REF_PATTERN = /^NMR:VehicleType:\d+$/;

/** True iff the form has the required TransportTypeRef in the canonical shape.
 *  Drives `saveDisabled` on the create page; existing-vehicle edits already
 *  carry a valid ref so the slider doesn't gate on this. */
export function isComplete(form: VehicleEditFormValue): boolean {
  return TRANSPORT_TYPE_REF_PATTERN.test(form.vehicle.TransportTypeRef ?? '');
}
