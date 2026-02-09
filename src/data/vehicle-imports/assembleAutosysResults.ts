import { XMLParser } from 'fast-xml-parser';
import { translateAutosysError } from './autosysErrorTranslator';
import type { ParsedXml } from './types';
import { findResourceFrame, mergeResourceFrames, pubDeliverySingleRcFrame } from './xmlUtils';

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
  successCount: number;
  errors: { regNumber: string; message: string }[];
}

/** Combined output of {@link assembleAutosysResults}: a deduplicated
 * summary, and the combined netex-payload  */
export interface AutosysAssembledResult {
  summary: AutosysAssembledSummary;
  postPayload?: string;
}

const parser = new XMLParser({ ignoreAttributes: false });

/**
 * Parse an array of Autosys fetch results, extract the NeTEx ResourceFrame
 * from each successful XML, and produce a deduplicated summary of
 * VehicleType, DeckPlan, and VehicleModel IDs along with a vehicle count.
 * Failed fetches are collected as translated errors.
 */
export function assembleAutosysResults(results: AutosysFetchResult[]): AutosysAssembledResult {
  const errors: { regNumber: string; message: string }[] = [];
  const frames: ParsedXml[] = [];
  let firstXml: ParsedXml | undefined = undefined;

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
      const resourceFrame = findResourceFrame(parsed);

      if (!resourceFrame) {
        errors.push({
          regNumber: result.regNumber,
          message: 'No ResourceFrame found in response',
        });
        continue;
      }

      frames.push(resourceFrame);

      // Use the first successfully parsed XML as the envelope template
      if (!firstXml) {
        firstXml = parsed;
      }
    } catch (e) {
      errors.push({
        regNumber: result.regNumber,
        message: e instanceof Error ? e.message : 'Failed to parse XML',
      });
    }
  }

  const merged = mergeResourceFrames(frames);

  return {
    summary: {
      vehicleCount: merged.vehicles.length,
      vehicleTypeIds: new Set(merged.vehicleTypes.map(vt => vt['@_id'])),
      deckPlanIds: new Set(merged.deckPlans.map(dp => dp['@_id'])),
      vehicleModelIds: new Set(merged.vehicleModels.map(vm => vm['@_id'])),
      successCount: frames.length,
      errors,
    },
    postPayload: pubDeliverySingleRcFrame(firstXml, merged),
  };
}
