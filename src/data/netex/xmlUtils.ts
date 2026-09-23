/**
 * Generic NeTEx XML helpers — no domain (Vehicle/VehicleModel/import)
 * knowledge. Consumers: `vehicles/xml/*-parser.ts`,
 * `vehicles/xml/parseVehicleImportResponse.ts`,
 * `vehicle-imports/xmlUtils.ts`, `vehicle-imports/types.ts`.
 */
import { XMLParser } from 'fast-xml-parser';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ParsedXml = Record<string, any>;

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

export function addDataOwnerRefToFrame(
  baseFrame: ParsedXml,
  resourceFrame: ParsedXml,
  dataOwnerRef: string
) {
  const frameDefaults = baseFrame.FrameDefaults ?? (baseFrame.FrameDefaults = {});
  frameDefaults.DefaultResponsibilitySetRef = { '@_ref': 'NMR:ResponsibilitySet:1' };

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

  resourceFrame.responsibilitySets = {
    ResponsibilitySet: responsibilitySet,
  };
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
