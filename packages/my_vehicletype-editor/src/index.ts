export { Editor } from './Editor.js';
export type { EditorProps } from './Editor.js';
export type {
  VehicleType,
  SimpleRef,
  TextType,
  PrivateCodeStructure,
  PassengerCapacityStructure,
  VehicleManoeuvringRequirements_STUB,
  KeyValueStructure,
  AllPublicTransportModesEnumeration,
  PropulsionTypeEnumeration,
  FuelTypeEnumeration,
  TypeHints,
} from './generated/types.js';
export {
  TRANSPORT_MODES,
  PROPULSION_TYPES,
  FUEL_TYPES,
  FARE_CLASSES,
  VEHICLE_TYPE_HINTS,
  PASSENGER_CAPACITY_HINTS,
  MANOEUVRE_HINTS,
} from './generated/types.js';
export { validate } from './generated/validate.js';
export type { ValidationResult } from './generated/validate.js';
export { normalize } from './normalize.js';
export { serialize } from './serialize.js';
