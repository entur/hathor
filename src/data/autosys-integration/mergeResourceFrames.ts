import type { MergedEntities, ParsedXml } from '../netexTypes.ts';
import { toArray } from '../xmlUtils.ts';
import type { FramesByQueryRegNumber, ImportEntry } from './types.ts';

/** Collect and deduplicate entities by @_id from a path like `rf.vehicleTypes.VehicleType`. */
function uniqueById(frames: ParsedXml[], section: string, element: string): ParsedXml[] {
  const seen = new Map<string, ParsedXml>();
  for (const rf of frames) {
    for (const item of toArray<ParsedXml>(rf[section]?.[element])) {
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

/** Merge entities from multiple ResourceFrames, deduplicating by @_id.
 *  When `entries` is provided, injects `OperationalNumber` into vehicles
 *  whose regNumber key in `framesByReg` matches an entry with an `operationalRef`. */
export function mergeResourceFrames(
  framesByReg: FramesByQueryRegNumber,
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
    for (const [regNumber, rf] of Object.entries(framesByReg)) {
      const opRef = opRefs.get(regNumber);
      if (!opRef) continue;
      for (const v of toArray<ParsedXml>(rf.vehicles?.Vehicle)) {
        const existing = merged.vehicles.find(mv => mv['@_id'] === v['@_id']);
        if (existing) existing.OperationalNumber = opRef;
      }
    }
  }

  return merged;
}
