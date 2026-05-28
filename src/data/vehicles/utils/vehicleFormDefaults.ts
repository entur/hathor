import type { VehicleModel } from '../types/VehicleModel';
import type { VehicleEditFormValue } from '../components/VehicleEditForm';

export const INLINE_MODEL_ID = 'INLINE:VehicleModel:1' as const;

/** Visual placeholder shown when the loaded Vehicle has no Model data.
 *  Hathor #80 sect3: previously this string was seeded as the literal
 *  Manufacturer value and round-tripped into the import XML. Now it's
 *  only a placeholder attribute on the input — never a real value. */
export const MISSING_TEXT = '[missing]';

export const BLANK_FORM: VehicleEditFormValue = {
  vehicle: { VehicleModelRef: INLINE_MODEL_ID },
  model: { $id: INLINE_MODEL_ID },
};

/**
 * Placeholder model rendered when no real VehicleModel data is available
 * for the loaded Vehicle. Sobek's single-vehicle export emits only the
 * Vehicle (not its Model), and the GQL projection has no model fields
 * either — so the form's model slot stays empty until issue #69 brings
 * a model-side fetch online.
 *
 * String fields stay `undefined` so the corresponding TextField renders
 * empty and the `placeholder` attribute surfaces `[missing]` visually
 * without leaking the literal into the save payload (#80 sect3).
 */
export const MISSING_MODEL: VehicleModel = {
  $id: INLINE_MODEL_ID,
};
