/**
 * Inverse of `Vehicle-mapping.ts:vehicleToXmlShape`. Parses a
 * `PublicationDelivery` XML string (CompositeFrame-wrapped or flat
 * ResourceFrame) into a `Partial<Vehicle>` matching `xml/Vehicle.ts`.
 *
 * Mapping rules (mirror of `vehicleToXmlShape`):
 *   `@_x`        → `$x`
 *   `#text`      → `value`
 *   `{@_ref:S}`  → `S`            (flat string for *Ref elements)
 *   `T | T[]`    → `T[]`          (forced via `isArray` on known list keys)
 */
import { XMLParser } from 'fast-xml-parser';
import type { Vehicle, ValidBetween_VersionStructure, TextType } from './Vehicle';
import { findResourceFrame, toArray } from '../../vehicle-imports/xmlUtils';

const ARRAY_PATHS = new Set([
  'Name',
  'ShortName',
  'Description',
  'ValidBetween',
  'KeyValue',
  'PrivateCode',
  'AlternativeText',
  'TextType',
]);

const REF_KEYS = new Set([
  'TransportOrganisationRef',
  'AuthorityRef',
  'ContactRef',
  'TransportTypeRef',
  'VehicleModelRef',
  'equipmentProfiles',
  'VehicleModelProfileRef',
  'CarModelProfileRef',
  'actualVehicleEquipments',
  'BrandingRef',
  'WithConditionRef',
  'ConditionedObjectRef',
  'validityConditions',
  'DataManagedObjectRef',
]);

const parser = new XMLParser({
  ignoreAttributes: false,
  isArray: (name: string) => ARRAY_PATHS.has(name),
});

type Obj = Record<string, unknown>;

/**
 * Parse a NeTEx PublicationDelivery XML and project the first `<Vehicle>` in
 * the ResourceFrame into the domain `Vehicle` shape. Returns `null` when no
 * vehicle is present (unknown-id response from Sobek emits an empty
 * ResourceFrame).
 */
export function parseVehicleXml(xml: string): Partial<Vehicle> | null {
  const parsed = parser.parse(xml);
  const rf = findResourceFrame(parsed);
  if (!rf) return null;
  const raw = toArray(rf.vehicles?.Vehicle)[0];
  if (!raw) return null;
  return projectVehicle(raw as Obj);
}

function projectVehicle(raw: Obj): Partial<Vehicle> {
  const v: Partial<Vehicle> = {};
  attr(raw, 'id', v, '$id');
  attr(raw, 'version', v, '$version');
  attr(raw, 'nameOfClass', v, '$nameOfClass');
  attr(raw, 'responsibilitySetRef', v, '$responsibilitySetRef');
  attr(raw, 'dataSourceRef', v, '$dataSourceRef');
  attr(raw, 'created', v, '$created');
  attr(raw, 'changed', v, '$changed');
  attr(raw, 'modification', v, '$modification');
  attr(raw, 'status', v, '$status');
  attr(raw, 'derivedFromVersionRef', v, '$derivedFromVersionRef');
  attr(raw, 'compatibleWithVersionFrameVersionRef', v, '$compatibleWithVersionFrameVersionRef');
  attr(raw, 'derivedFromObjectRef', v, '$derivedFromObjectRef');

  textArr(raw, 'Name', v);
  textArr(raw, 'ShortName', v);
  textArr(raw, 'Description', v);
  scalar(raw, 'BuildDate', v);
  scalar(raw, 'ChassisNumber', v);
  scalar(raw, 'RegistrationNumber', v);
  scalar(raw, 'RegistrationDate', v);
  scalar(raw, 'OperationalNumber', v);
  scalar(raw, 'Monitored', v);

  for (const key of REF_KEYS) ref(raw, key, v);

  validBetweens(raw, v);
  return v;
}

function attr(raw: Obj, xmlKey: string, out: Obj, domKey: string) {
  const x = raw['@_' + xmlKey];
  if (x !== undefined) out[domKey] = x;
}

function scalar(raw: Obj, key: string, out: Obj) {
  if (raw[key] !== undefined) out[key] = raw[key];
}

function ref(raw: Obj, key: string, out: Obj) {
  const x = raw[key] as Obj | undefined;
  if (x && typeof x === 'object' && '@_ref' in x) out[key] = x['@_ref'];
}

function textArr(raw: Obj, key: string, out: Obj) {
  const arr = raw[key] as Obj[] | undefined;
  if (!arr) return;
  out[key] = arr.map(projectText);
}

function projectText(raw: Obj): TextType {
  const t: TextType = {};
  if (raw['#text'] !== undefined) t.value = String(raw['#text']);
  if (raw['@_lang'] !== undefined) t.$lang = String(raw['@_lang']);
  if (raw['@_textIdType'] !== undefined) t.$textIdType = String(raw['@_textIdType']);
  return t;
}

function validBetweens(raw: Obj, out: Partial<Vehicle>) {
  const arr = raw['ValidBetween'] as Obj[] | undefined;
  if (!arr) return;
  out.ValidBetween = arr.map(projectValidBetween);
}

function projectValidBetween(raw: Obj): ValidBetween_VersionStructure {
  const vb: Obj = {};
  attr(raw, 'id', vb, '$id');
  attr(raw, 'version', vb, '$version');
  scalar(raw, 'FromDate', vb);
  scalar(raw, 'ToDate', vb);
  textArr(raw, 'Name', vb);
  textArr(raw, 'Description', vb);
  for (const key of REF_KEYS) ref(raw, key, vb);
  return vb as ValidBetween_VersionStructure;
}
