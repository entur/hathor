/**
 * Inverse of `Vehicle-mapping.ts:vehicleToXmlShape`. Parses a
 * `PublicationDelivery` XML string (CompositeFrame-wrapped or flat
 * ResourceFrame) into a `Partial<Vehicle>`. Generic helpers live in
 * `parser-helpers.ts` (shared with `VehicleModel-parser`).
 *
 * Mapping rules:
 *   `@_x`        → `$x`
 *   `#text`      → `value`
 *   `{@_ref:S}`  → `S`            (flat string; XML alias → domain key via REF map)
 *   `T | T[]`    → `T[]`          (forced via `isArray` on known list keys)
 */
import { XMLParser } from 'fast-xml-parser';
import type { Vehicle } from './Vehicle';
import { findResourceFrame, toArray } from '../../netex/xmlUtils';
import {
  attr,
  ref,
  scalar,
  textArr,
  validBetweens,
  type Obj,
  type RefMap,
} from '../../netex/parser-helpers';

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

/**
 * XML element → domain key. `Vehicle-mapping` emits two NeTEx-aliased
 * forms (`<AuthorityRef>` for `TransportOrganisationRef`,
 * `<CarModelProfileRef>` for `VehicleModelProfileRef`); parsing must
 * translate them back or the round-trip drops both keys.
 */
const REF_XML_TO_DOMAIN: RefMap = new Map([
  ['AuthorityRef', 'TransportOrganisationRef'],
  ['CarModelProfileRef', 'VehicleModelProfileRef'],
  ['ContactRef', 'ContactRef'],
  ['TransportTypeRef', 'TransportTypeRef'],
  ['VehicleModelRef', 'VehicleModelRef'],
  ['equipmentProfiles', 'equipmentProfiles'],
  ['actualVehicleEquipments', 'actualVehicleEquipments'],
  ['BrandingRef', 'BrandingRef'],
  ['WithConditionRef', 'WithConditionRef'],
  ['ConditionedObjectRef', 'ConditionedObjectRef'],
  ['validityConditions', 'validityConditions'],
  ['DataManagedObjectRef', 'DataManagedObjectRef'],
]);

const parser = new XMLParser({
  ignoreAttributes: false,
  isArray: (name: string) => ARRAY_PATHS.has(name),
});

export function parseVehicleXml(xml: string): Partial<Vehicle> | null {
  const parsed = parser.parse(xml);
  const rf = findResourceFrame(parsed);
  if (!rf) return null;
  const raw = toArray(rf.vehicles?.Vehicle)[0];
  if (!raw) return null;
  return projectVehicle(raw as Obj);
}

function projectVehicle(raw: Obj): Partial<Vehicle> {
  const v: Obj = {};
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

  for (const [xmlKey, domKey] of REF_XML_TO_DOMAIN) ref(raw, xmlKey, v, domKey);
  validBetweens(raw, v, REF_XML_TO_DOMAIN);
  return v as Partial<Vehicle>;
}
