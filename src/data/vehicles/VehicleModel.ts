/**
 * Suggested flat interface for VehicleModel
 * Resolved from 4 types in the inheritance chain
 */
export interface VehicleModel {
  // ── EntityStructure ──
  $nameOfClass?: 'VehicleModel';
  $id?: string;

  // ── VehicleModel_VersionStructure ──
  Name?: TextType[];
  Description?: TextType[];
  Manufacturer?: TextType[];
  TransportTypeRef?: Ref<'TransportType'>;
  Range?: number;
  FullCharge?: number;
  equipmentProfiles?: Ref<'VehicleEquipmentProfile'>;
  VehicleModelProfileRef?: SimpleRef;
  CustomerServiceContactDetails?: ContactStructure;

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

export interface ContactStructure {
  ContactPerson?: TextType[];
  Email?: string;
  Phone?: string;
  Fax?: string;
  Url?: string /* uri */;
  FurtherDetails?: TextType[];
  ContactRef?: Ref<'Contact'>;
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

export interface PrivateCodeStructure {
  value?: string;
  $type?: string;
}

export interface TextType {
  value?: string;
  $lang?: string;
  $textIdType?: string;
}

export type SimpleRef = string;
// _T is read by codegen AST, not at runtime

export type Ref<_T extends string = string> = string;
