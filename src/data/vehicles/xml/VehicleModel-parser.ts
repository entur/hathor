/**
 * Inverse of `VehicleModel-mapping.ts:vehicleModelToXmlShape`. Parses a
 * `PublicationDelivery` XML string (CompositeFrame-wrapped or flat
 * ResourceFrame) into a `Partial<VehicleModel>`. Generic helpers live in
 * `parser-helpers.ts` (shared with `Vehicle-parser`).
 */
import { XMLParser } from 'fast-xml-parser';
import type { VehicleModel } from '../types/VehicleModel';
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
  'Description',
  'Manufacturer',
  'ValidBetween',
  'KeyValue',
  'PrivateCode',
  'AlternativeText',
  'TextType',
  'ContactPerson',
  'FurtherDetails',
]);

/**
 * Only NeTEx-aliased Ref on VehicleModel is `<CarModelProfileRef>` for the
 * domain `VehicleModelProfileRef` (`VehicleModel-mapping.ts:34`).
 */
const REF_XML_TO_DOMAIN: RefMap = new Map([
  ['CarModelProfileRef', 'VehicleModelProfileRef'],
  ['TransportTypeRef', 'TransportTypeRef'],
  ['equipmentProfiles', 'equipmentProfiles'],
  ['BrandingRef', 'BrandingRef'],
  ['validityConditions', 'validityConditions'],
  ['ContactRef', 'ContactRef'],
  ['WithConditionRef', 'WithConditionRef'],
  ['ConditionedObjectRef', 'ConditionedObjectRef'],
]);

const parser = new XMLParser({
  ignoreAttributes: false,
  isArray: (name: string) => ARRAY_PATHS.has(name),
});

export function parseVehicleModelXml(xml: string): Partial<VehicleModel> | null {
  const parsed = parser.parse(xml);
  const rf = findResourceFrame(parsed);
  if (!rf) return null;
  const raw = toArray(rf.vehicleModels?.VehicleModel)[0];
  if (!raw) return null;
  return projectVehicleModel(raw as Obj);
}

function projectVehicleModel(raw: Obj): Partial<VehicleModel> {
  const m: Obj = {};
  attr(raw, 'id', m, '$id');
  attr(raw, 'version', m, '$version');
  attr(raw, 'nameOfClass', m, '$nameOfClass');
  attr(raw, 'responsibilitySetRef', m, '$responsibilitySetRef');
  attr(raw, 'dataSourceRef', m, '$dataSourceRef');
  attr(raw, 'created', m, '$created');
  attr(raw, 'changed', m, '$changed');
  attr(raw, 'modification', m, '$modification');
  attr(raw, 'status', m, '$status');
  attr(raw, 'derivedFromVersionRef', m, '$derivedFromVersionRef');
  attr(raw, 'compatibleWithVersionFrameVersionRef', m, '$compatibleWithVersionFrameVersionRef');
  attr(raw, 'derivedFromObjectRef', m, '$derivedFromObjectRef');

  textArr(raw, 'Name', m);
  textArr(raw, 'Description', m);
  textArr(raw, 'Manufacturer', m);
  scalar(raw, 'Range', m);
  scalar(raw, 'FullCharge', m);

  for (const [xmlKey, domKey] of REF_XML_TO_DOMAIN) ref(raw, xmlKey, m, domKey);
  validBetweens(raw, m, REF_XML_TO_DOMAIN);
  return m as Partial<VehicleModel>;
}
