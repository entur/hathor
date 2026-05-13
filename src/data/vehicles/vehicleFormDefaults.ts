import type { VehicleRow } from './vehicleTypes';
import type { VehicleEditFormValue } from './VehicleEditForm';

export const INLINE_MODEL_ID = 'INLINE:VehicleModel:1' as const;

export const BLANK_FORM: VehicleEditFormValue = {
  vehicle: { VehicleModelRef: INLINE_MODEL_ID },
  model: { $id: INLINE_MODEL_ID },
};

export function hydrateFromRow(row: VehicleRow): VehicleEditFormValue {
  return {
    vehicle: {
      $id: row.id,
      $version: String(row.version),
      RegistrationNumber: row.registrationNumber,
      TransportTypeRef: row.parentVehicleTypeId,
      VehicleModelRef: INLINE_MODEL_ID,
    },
    model: { $id: INLINE_MODEL_ID },
  };
}
