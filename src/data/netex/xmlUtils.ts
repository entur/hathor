/**
 * Generic NeTEx XML helpers — no domain (Vehicle/VehicleModel/import)
 * knowledge. Consumers: `deck-plans/` (details service, XML patch),
 * `vehicle-imports/api/` (bulk-result assembly, import-response parse).
 */
import { XMLParser } from 'fast-xml-parser';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ParsedXml = Record<string, any>;

// NeTEx content models are sequences, and Sobek validates against the XSD (2.0): a parsed object's
// key order is its element order, so an added element goes after the ones these lists name.
// A frame's own head (EntityInVersion → DataManagedObject → VersionFrame groups), up to FrameDefaults.
const FRAME_HEAD = [
  'validityConditions',
  'ValidBetween',
  'alternativeTexts',
  'keyList',
  'privateCodes',
  'Extensions',
  'BrandingRef',
  'Name',
  'Description',
  'TypeOfFrameRef',
  'BaselineVersionFrameRef',
  'codespaces',
];
// What precedes responsibilitySets in a ResourceFrame: the rest of the head, then DataManagement.
const RESPONSIBILITY_SETS_HEAD = [
  ...FRAME_HEAD,
  'FrameDefaults',
  'versions',
  'prerequisites',
  'traces',
  'contentValidityConditions',
  'layers',
  'dataSources',
  'responsibilityRoles',
];
// What precedes DefaultResponsibilitySetRef in FrameDefaults.
const DEFAULT_RESPONSIBILITY_SET_HEAD = ['DefaultCodespaceRef', 'DefaultDataSourceRef'];

/** Set `parent[key]` in place, after its attributes and the `head` elements, before the rest. */
const setAfter = (parent: ParsedXml, key: string, value: unknown, head: readonly string[]) => {
  const isHead = ([k]: [string, unknown]) => k.startsWith('@_') || head.includes(k);
  const rest = Object.entries(parent).filter(([k]) => k !== key);
  const ordered = [...rest.filter(isHead), [key, value], ...rest.filter(e => !isHead(e))];
  Object.keys(parent).forEach(k => delete parent[k]);
  Object.assign(parent, Object.fromEntries(ordered));
};

/** Find ResourceFrame in parsed XML — supports both CompositeFrame-wrapped and flat layouts. */
export function findResourceFrame(parsed: ParsedXml): ParsedXml | undefined {
  const dataObjects = parsed.PublicationDelivery?.dataObjects;
  return dataObjects?.CompositeFrame?.frames?.ResourceFrame ?? dataObjects?.ResourceFrame;
}

/** Normalise to array — handles single-element vs array in parsed XML. */
export function toArray<T>(value: T | T[] | undefined): T[] {
  if (value === undefined || value === null) return [];
  return Array.isArray(value) ? value : [value];
}

/**
 * Collect the `@_id`s of one entity collection in a ResourceFrame.
 *
 * @param {ParsedXml} rf - A parsed ResourceFrame.
 * @param {string} section - Collection element, e.g. `vehicleTypes`.
 * @param {string} element - Entity element, e.g. `VehicleType`.
 * @returns {Set<string>} The ids, deduplicated.
 */
export const entityIds = (rf: ParsedXml, section: string, element: string): Set<string> =>
  new Set(
    toArray<ParsedXml>(rf[section]?.[element])
      .map(e => e['@_id'])
      .filter(Boolean)
  );

/**
 * Make `dataOwnerRef` the owner of a document: an owning ResponsibilitySet in the ResourceFrame,
 * referenced as the frame's DefaultResponsibilitySetRef. Mutates both frames, in schema order.
 *
 * @param {ParsedXml} baseFrame - The frame whose FrameDefaults name the set (CompositeFrame, or
 *   the ResourceFrame itself when flat).
 * @param {ParsedXml} resourceFrame - The ResourceFrame that holds the set.
 * @param {string} dataOwnerRef - NeTEx id of the owning organisation.
 */
export function addDataOwnerRefToFrame(
  baseFrame: ParsedXml,
  resourceFrame: ParsedXml,
  dataOwnerRef: string
) {
  if (!baseFrame.FrameDefaults) setAfter(baseFrame, 'FrameDefaults', {}, FRAME_HEAD);
  setAfter(
    baseFrame.FrameDefaults,
    'DefaultResponsibilitySetRef',
    { '@_ref': 'NMR:ResponsibilitySet:1' },
    DEFAULT_RESPONSIBILITY_SET_HEAD
  );

  const ResponsibilityRoleAssignment = {
    '@_id': `NMR:ResponsibilityRoleAssignment:1`,
    '@_version': '1',
    DataRoleType: 'owns',
    ResponsibleOrganisationRef: { '@_ref': dataOwnerRef },
  };

  const responsibilitySet = {
    '@_id': 'NMR:ResponsibilitySet:1',
    '@_version': '1',
    roles: { ResponsibilityRoleAssignment },
  };

  setAfter(
    resourceFrame,
    'responsibilitySets',
    { ResponsibilitySet: responsibilitySet },
    RESPONSIBILITY_SETS_HEAD
  );
}

/**
 * The NeTEx parser. Tag values are never coerced.
 *
 * `parseTagValue` is off because the default guesses a type per value, the way
 * a spreadsheet does: seat label `1B` comes back a string, `1` a number, `007`
 * the number `7`, dimension `1.10` the number `1.1`. Two things follow, and the
 * second is the worse one — numeric-looking text is rewritten on a round-trip
 * (a pure rename silently renumbers seats), and no caller can know the type of
 * a parsed field without re-deriving the guess from the data it is holding.
 *
 * Off by default rather than opt-in, because every path that re-serializes
 * needs it and no caller reads a tag value as a number: the closest,
 * `extractVehicleTypeIds`, reads `@_id`, and attribute parsing is governed by
 * `parseAttributeValue` (off) regardless.
 */
export const xmlParser = new XMLParser({
  ignoreAttributes: false,
  parseTagValue: false,
});
