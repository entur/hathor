import type { VehicleModel } from './xml/VehicleModel';
import type { VehicleEditFormValue } from './VehicleEditForm';

export const INLINE_MODEL_ID = 'INLINE:VehicleModel:1' as const;
const MISSING_TEXT = '[missing]';

export const BLANK_FORM: VehicleEditFormValue = {
  vehicle: { VehicleModelRef: INLINE_MODEL_ID },
  model: { $id: INLINE_MODEL_ID },
};

/**
 * Placeholder model rendered when no real VehicleModel data is available
 * for the loaded Vehicle. Sobek's single-vehicle export emits only the
 * Vehicle (not its Model), and the GQL projection has no model fields
 * either — so the form's model slot shows `[missing]` until issue #69
 * brings a model-side fetch online.
 *
 * Numeric fields stay `undefined` — `<TextField type="number">` can't
 * carry the placeholder string and an empty render is acceptable signal.
 */
export const MISSING_MODEL: VehicleModel = {
  $id: INLINE_MODEL_ID,
  Manufacturer: [{ value: MISSING_TEXT }],
};
