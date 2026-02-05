import { XMLParser } from 'fast-xml-parser';
import { translateAutosysError } from './autosysErrorTranslator';
import type { ParsedXml } from './types';

/** Result of fetching a single vehicle from the Autosys registry.
 * On success `xml` contains the raw NeTEx XML and `error` is null.
 * On failure `xml` is empty and `error` holds the backend error message. */
export interface AutosysFetchResult {
  regNumber: string;
  xml: string;
  error: string | null;
}

/** Deduplicated summary produced by {@link assembleAutosysResults}.
 * Entity IDs are collected into Sets so shared types/plans across
 * multiple vehicles are counted only once. */
export interface AutosysAssembledSummary {
  vehicleCount: number;
  vehicleTypeIds: Set<string>;
  deckPlanIds: Set<string>;
  vehicleModelIds: Set<string>;
  errors: { regNumber: string; message: string }[];
}

/** Combined output of {@link assembleAutosysResults}: a deduplicated
 * summary of all fetched vehicles plus the successfully parsed XML
 * objects ready for merging via {@link pubDeliveryFromListV1}. */
export interface AutosysAssembledResult {
  summary: AutosysAssembledSummary;
  xmlList: ParsedXml[];
}

const parser = new XMLParser({ ignoreAttributes: false });

/** Normalise to array — handles single-element vs array in parsed XML. */
function toArray<T>(value: T | T[] | undefined): T[] {
  if (value === undefined || value === null) return [];
  return Array.isArray(value) ? value : [value];
}

/**
 * Parse an array of Autosys fetch results, extract the NeTEx ResourceFrame
 * from each successful XML, and produce a deduplicated summary of
 * VehicleType, DeckPlan, and VehicleModel IDs along with a vehicle count.
 * Failed fetches are collected as translated errors.
 */
export function assembleAutosysResults(results: AutosysFetchResult[]): AutosysAssembledResult {
  const vehicleTypeIds = new Set<string>();
  const deckPlanIds = new Set<string>();
  const vehicleModelIds = new Set<string>();
  const errors: { regNumber: string; message: string }[] = [];
  const xmlList: ParsedXml[] = [];
  let vehicleCount = 0;

  for (const result of results) {
    if (result.error) {
      errors.push({
        regNumber: result.regNumber,
        message: translateAutosysError(result.error),
      });
      continue;
    }

    try {
      const parsed = parser.parse(result.xml);
      const resourceFrame =
        parsed.PublicationDelivery?.dataObjects?.CompositeFrame?.frames?.ResourceFrame;

      if (!resourceFrame) {
        errors.push({
          regNumber: result.regNumber,
          message: 'No ResourceFrame found in response',
        });
        continue;
      }

      // Vehicles
      const vehicles = toArray(resourceFrame.vehicles?.Vehicle);
      vehicleCount += vehicles.length;

      // VehicleTypes
      const vehicleTypes = toArray(resourceFrame.vehicleTypes?.VehicleType);
      for (const vt of vehicleTypes) {
        if (vt['@_id']) vehicleTypeIds.add(vt['@_id']);
      }

      // DeckPlans
      const deckPlans = toArray(resourceFrame.deckPlans?.DeckPlan);
      for (const dp of deckPlans) {
        if (dp['@_id']) deckPlanIds.add(dp['@_id']);
      }

      // VehicleModels
      const vehicleModels = toArray(resourceFrame.vehicleModels?.VehicleModel);
      for (const vm of vehicleModels) {
        if (vm['@_id']) vehicleModelIds.add(vm['@_id']);
      }

      xmlList.push(parsed);
    } catch (e) {
      errors.push({
        regNumber: result.regNumber,
        message: e instanceof Error ? e.message : 'Failed to parse XML',
      });
    }
  }

  return {
    summary: {
      vehicleCount,
      vehicleTypeIds,
      deckPlanIds,
      vehicleModelIds,
      errors,
    },
    xmlList,
  };
}
