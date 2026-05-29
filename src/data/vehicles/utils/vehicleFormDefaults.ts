import type { VehicleEditFormValue } from '../components/VehicleEditForm';

/** Visual placeholder shown when the loaded Vehicle has no Model data.
 *  Hathor #80 sect3: previously this string was seeded as the literal
 *  Manufacturer value and round-tripped into the import XML. Now it's
 *  only a placeholder attribute on the input — never a real value. */
export const MISSING_TEXT = '[missing]';

export const BLANK_FORM: VehicleEditFormValue = {
  vehicle: { id: '' },
};
