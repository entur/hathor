import { XMLBuilder, XMLParser } from 'fast-xml-parser';
import type { MergedEntities, ParsedXml } from './netexTypes.ts';

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

export function extractVehicleTypeIds(xml: string): string[] {
  const parsed = xmlParser.parse(xml);
  const rf = findResourceFrame(parsed);
  if (!rf) return [];
  return toArray(rf.vehicleTypes?.VehicleType)
    .map(vt => vt['@_id'])
    .filter(Boolean);
}

/** Wrap a NeTEx XML fragment in a minimal PublicationDelivery envelope.
 *  `wrapperTag` selects the ResourceFrame section — `vehicleTypes` (default) or `vehicles`. */
// TODO: improve this static solution
export function wrapInPublicationDelivery(
  fragment: string,
  wrapperTag: 'vehicleTypes' | 'vehicles' = 'vehicleTypes'
): string {
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<PublicationDelivery xmlns="http://www.netex.org.uk/netex" version="1.0">',
    `  <PublicationTimestamp>${new Date().toISOString()}</PublicationTimestamp>`,
    '  <dataObjects>',
    '    <ResourceFrame id="RF:1" version="1">',
    '      <FrameDefaults>',
    '        <DefaultLocale>',
    '          <TimeZone>Europe/Oslo</TimeZone>',
    '        </DefaultLocale>',
    '      </FrameDefaults>',
    `      <${wrapperTag}>`,
    fragment,
    `      </${wrapperTag}>`,
    '    </ResourceFrame>',
    '  </dataObjects>',
    '</PublicationDelivery>',
  ].join('\n');
}

/** Clone a PublicationDelivery blueprint and inject merged entities into its ResourceFrame. */
export function pubDeliverySingleRcFrame(
  blueprint: ParsedXml | undefined,
  merged: MergedEntities
): string | undefined {
  if (!blueprint) return;

  const blueprintClone = structuredClone(blueprint);
  const wrapperRf = findResourceFrame(blueprintClone);
  if (!wrapperRf) return;

  delete wrapperRf.vehicleTypes;
  delete wrapperRf.deckPlans;
  delete wrapperRf.vehicleModels;
  delete wrapperRf.vehicles;

  const { vehicleTypes, deckPlans, vehicleModels, vehicles } = merged;
  if (vehicleTypes.length > 0) wrapperRf.vehicleTypes = { VehicleType: vehicleTypes };
  if (deckPlans.length > 0) wrapperRf.deckPlans = { DeckPlan: deckPlans };
  if (vehicleModels.length > 0) wrapperRf.vehicleModels = { VehicleModel: vehicleModels };
  if (vehicles.length > 0) wrapperRf.vehicles = { Vehicle: vehicles };

  const builder = new XMLBuilder({
    ignoreAttributes: false,
    format: true,
    suppressEmptyNode: true,
  });
  return builder.build(blueprintClone);
}
