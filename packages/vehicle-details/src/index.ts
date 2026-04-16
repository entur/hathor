export { Editor } from './Editor.js';
export type { EditorProps } from './Editor.js';
export { EditForm } from './EditForm.js';
export type { EditFormProps, ExtraTab } from './EditForm.js';
export { XmlPreview } from './XmlPreview.js';
export type { XmlPreviewProps } from './XmlPreview.js';
export { ReferencesAccordion } from './ReferencesAccordion.js';
export type { ReferencesAccordionProps } from './ReferencesAccordion.js';
export { ValidityAccordion } from './ValidityAccordion.js';
export type { ValidityAccordionProps } from './ValidityAccordion.js';
export { KeyValuesTab } from './KeyValuesTab.js';
export type { KeyValuesTabProps } from './KeyValuesTab.js';
export type {
  Vehicle,
  SimpleRef,
  Ref,
  TextType,
  PrivateCodeStructure,
  KeyValueStructure,
  ValidBetween_VersionStructure,
  AlternativeText_VersionedChildStructure,
  alternativeTexts_RelStructure,
  ModificationEnumeration,
  StatusEnumeration,
} from './generated/Vehicle.js';
export { MODIFICATION, STATUS } from './generated/Vehicle.js';
export { validate } from './generated/validate.js';
export type { ValidationResult } from './generated/validate.js';
export { normalize, normalizeXML, normalizeGraphQL } from './normalize.js';
export type { TypeHints } from './normalize.js';
export { VEHICLE_HINTS, VALID_BETWEEN_HINTS, ALTERNATIVE_TEXTS_HINTS } from './normalize.js';
export { serialize } from './serialize.js';
export { vehicleToXmlShape } from './generated/Vehicle-mapping.js';
