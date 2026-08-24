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

export const xmlParser = new XMLParser({ ignoreAttributes: false });

/**
 * Parser for documents that are re-serialized and sent back to the backend.
 *
 * `parseTagValue` is off so numeric-looking text survives the round-trip
 * byte-for-byte: seat labels are zero-padded (`007`), dimensions carry
 * trailing zeros (`1.10`) and occasionally exponent notation, and the default
 * coercion rewrites all three — silently renumbering seats on a pure rename.
 */
export const verbatimXmlParser = new XMLParser({
  ignoreAttributes: false,
  parseTagValue: false,
});
