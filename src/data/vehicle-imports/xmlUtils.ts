import type { ImportEntry, ParsedXml, UniqueParsedXmlSet } from './types';
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

/** Build a regNumber → operationalRef lookup from entries that have an operationalRef. */
function opRefByRegNumber(entries: ImportEntry[]): Map<string, string> {
  const map = new Map<string, string>();
  for (const e of entries) {
    if (e.operationalRef) map.set(e.queryRegNumber, e.operationalRef);
  }
  return map;
}

/** Merged entity collections from one or more ResourceFrames, deduplicated by @_id. */
export interface MergedEntities {
  vehicleTypes: ParsedXml[];
  deckPlans: ParsedXml[];
  vehicleModels: ParsedXml[];
  vehicles: ParsedXml[];
}

/** Merge entities from multiple ResourceFrames, deduplicating by @_id.
 *  When `entries` is provided, injects `OperationalNumber` into vehicles
 *  whose regNumber key in `framesByReg` matches an entry with an `operationalRef`. */
export function mergeResourceFrames(
  framesByReg: UniqueParsedXmlSet,
  entries: ImportEntry[] = []
): MergedEntities {
  const frames = Object.values(framesByReg);
  const merged: MergedEntities = {
    vehicleTypes: uniqueById(frames, 'vehicleTypes', 'VehicleType'),
    deckPlans: uniqueById(frames, 'deckPlans', 'DeckPlan'),
    vehicleModels: uniqueById(frames, 'vehicleModels', 'VehicleModel'),
    vehicles: uniqueById(frames, 'vehicles', 'Vehicle'),
  };

  const opRefs = opRefByRegNumber(entries);
  if (opRefs.size > 0) {
    // Match via the shared key: regNumber in framesByReg → vehicle in that frame
    for (const [regNumber, rf] of Object.entries(framesByReg)) {
      const opRef = opRefs.get(regNumber);
      if (!opRef) continue;
      for (const v of toArray(rf.vehicles?.Vehicle)) {
        const existing = merged.vehicles.find(mv => mv['@_id'] === v['@_id']);
        if (existing) existing.OperationalNumber = opRef;
      }
    }
  }

  return merged;
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
