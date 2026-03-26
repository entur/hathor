export { Editor } from './Editor.js';
export type { EditorProps } from './Editor.js';
export { SimpleEditor } from './SimpleEditor.js';
export type { SimpleEditorProps } from './SimpleEditor.js';
export { FullEditor } from './FullEditor.js';
export type { FullEditorProps } from './FullEditor.js';
export { XmlPreview } from './XmlPreview.js';
export type { XmlPreviewProps } from './XmlPreview.js';
export type {
  VehicleType,
  SimpleRef,
  TextType,
  PrivateCodeStructure,
  PassengerCapacityStructure,
  VehicleManoeuvringRequirement,
  KeyValueStructure,
  AllPublicTransportModesEnumeration,
  PropulsionTypeEnumeration,
  FuelTypeEnumeration,
} from './generated/VehicleType.js';
export {
  ALL_PUBLIC_TRANSPORT_MODES,
  PROPULSION_TYPE,
  FUEL_TYPE,
  FARE_CLASS,
} from './generated/VehicleType.js';
export { validate } from './generated/validate.js';
export type { ValidationResult } from './generated/validate.js';
export { normalize } from './normalize.js';
export type { TypeHints } from './normalize.js';
export { VEHICLE_TYPE_HINTS, PASSENGER_CAPACITY_HINTS, MANOEUVRE_HINTS } from './normalize.js';
export { serialize } from './serialize.js';
export { vehicleTypeToXmlShape } from './generated/VehicleType-mapping.js';
