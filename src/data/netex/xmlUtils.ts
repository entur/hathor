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

export const xmlParser = new XMLParser({ ignoreAttributes: false });
