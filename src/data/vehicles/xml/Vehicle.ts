/**
 * Suggested flat interface for Vehicle
 * Resolved from 4 types in the inheritance chain
 */
export interface Vehicle {
  // ── EntityStructure ──
  $nameOfClass?: 'Vehicle';
  $id?: string;

  // ── Vehicle_VersionStructure ──
  Name?: TextType[];
  ShortName?: TextType[];
  Description?: TextType[];
  BuildDate?: string /* date */;
  ChassisNumber?: string;
  RegistrationNumber?: string;
  RegistrationDate?: string /* date */;
  OperationalNumber?: string;
  /** @deprecated */
  PrivateCode?: PrivateCodeStructure;
  TransportOrganisationRef?: SimpleRef;
  ContactRef?: Ref<'Contact'>;
  TransportTypeRef?: Ref<'TransportType'>;
  VehicleModelRef?: Ref<'VehicleModel'>;
  equipmentProfiles?: Ref<'VehicleEquipmentProfile'>;
  VehicleModelProfileRef?: SimpleRef;
  actualVehicleEquipments?: SimpleRef;
  Monitored?: boolean;

  // ── DataManagedObjectStructure ──
  keyList?: KeyValueStructure[];
  privateCodes?: PrivateCodeStructure[];
  Extensions?: any;
  BrandingRef?: Ref<'Branding'>;
  $responsibilitySetRef?: string;

  // ── EntityInVersionStructure ──
  validityConditions?: Ref<'ValidityCondition'>;
  ValidBetween?: ValidBetween_VersionStructure[];
  alternativeTexts?: alternativeTexts_RelStructure;
  $dataSourceRef?: string;
  $created?: string /* date-time */;
  $changed?: string /* date-time */;
  $modification?: ModificationEnumeration;
  $version?: string;
  $status?: StatusEnumeration;
  $derivedFromVersionRef?: string;
  $compatibleWithVersionFrameVersionRef?: string;
  $derivedFromObjectRef?: string;
}

export interface ValidBetween_VersionStructure {
  $nameOfClass?: 'ValidBetween_VersionStructure';
  $id?: string;
  Name?: TextType[];
  Description?: TextType[];
  ConditionedObjectRef?: SimpleRef;
  WithConditionRef?: Ref<'ValidityCondition'>;
  FromDate?: string /* date-time */;
  ToDate?: string /* date-time */;
  keyList?: KeyValueStructure[];
  privateCodes?: PrivateCodeStructure[];
  Extensions?: any;
  BrandingRef?: Ref<'Branding'>;
  $responsibilitySetRef?: string;
  validityConditions?: Ref<'ValidityCondition'>;
  ValidBetween?: ValidBetween_VersionStructure[];
  alternativeTexts?: alternativeTexts_RelStructure;
  $dataSourceRef?: string;
  $created?: string /* date-time */;
  $changed?: string /* date-time */;
  $modification?: ModificationEnumeration;
  $version?: string;
  $status?: StatusEnumeration;
  $derivedFromVersionRef?: string;
  $compatibleWithVersionFrameVersionRef?: string;
  $derivedFromObjectRef?: string;
}

export interface alternativeTexts_RelStructure {
  $id?: 'alternativeTexts_RelStructure';
  AlternativeText?: AlternativeText_VersionedChildStructure[];
}

export const MODIFICATION = ['new', 'revise', 'delete', 'unchanged', 'delta'] as const;
export type ModificationEnumeration = (typeof MODIFICATION)[number];

export const STATUS = ['active', 'inactive', 'other'] as const;
export type StatusEnumeration = (typeof STATUS)[number];

export interface PrivateCodeStructure {
  value?: string;
  $type?: string;
}

export interface AlternativeText_VersionedChildStructure {
  $nameOfClass?: 'AlternativeText_VersionedChildStructure';
  $id?: string;
  Extensions?: any;
  DataManagedObjectRef?: SimpleRef;
  Text?: TextType[];
  $attributeName?: string;
  $useForLanguage?: string;
  $order?: number;
  validityConditions?: Ref<'ValidityCondition'>;
  ValidBetween?: ValidBetween_VersionStructure[];
  alternativeTexts?: alternativeTexts_RelStructure;
  $dataSourceRef?: string;
  $created?: string /* date-time */;
  $changed?: string /* date-time */;
  $modification?: ModificationEnumeration;
  $version?: string;
  $status?: StatusEnumeration;
  $derivedFromVersionRef?: string;
  $compatibleWithVersionFrameVersionRef?: string;
  $derivedFromObjectRef?: string;
}

export interface KeyValueStructure {
  Key?: string;
  Value?: string;
  $typeOfKey?: string;
}

export interface TextType {
  value?: string;
  $lang?: string;
  $textIdType?: string;
}

export type SimpleRef = string;
// _T is read by codegen AST, not at runtime

export type Ref<_T extends string = string> = string;
