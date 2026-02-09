import type { ParsedXml } from './types';
import { XMLBuilder } from 'fast-xml-parser';

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

/** Collect and deduplicate entities by @_id from a path like `rf.vehicleTypes.VehicleType`. */
function uniqueById(frames: ParsedXml[], section: string, element: string): ParsedXml[] {
  const seen = new Map<string, ParsedXml>();
  for (const rf of frames) {
    for (const item of toArray(rf[section]?.[element])) {
      const id = item['@_id'];
      if (id && !seen.has(id)) seen.set(id, item);
    }
  }
  return [...seen.values()];
}

/** Merged entity collections from one or more ResourceFrames, deduplicated by @_id. */
export interface MergedEntities {
  vehicleTypes: ParsedXml[];
  deckPlans: ParsedXml[];
  vehicleModels: ParsedXml[];
  vehicles: ParsedXml[];
}

/** Merge entities from multiple ResourceFrames, deduplicating by @_id. */
export function mergeResourceFrames(frames: ParsedXml[]): MergedEntities {
  return {
    vehicleTypes: uniqueById(frames, 'vehicleTypes', 'VehicleType'),
    deckPlans: uniqueById(frames, 'deckPlans', 'DeckPlan'),
    vehicleModels: uniqueById(frames, 'vehicleModels', 'VehicleModel'),
    vehicles: uniqueById(frames, 'vehicles', 'Vehicle'),
  };
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
  const xmlContent = builder.build(blueprintClone);
  return xmlContent;
}
