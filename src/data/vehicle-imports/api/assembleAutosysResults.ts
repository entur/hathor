import i18next from 'i18next';
import { translateAutosysError } from '../utils/autosysErrorTranslator';
import type { ImportEntry } from '../types/importTypes';
import {
  type ParsedXml,
  entityIds,
  findResourceFrame,
  toArray,
  xmlParser,
} from '../../netex/xmlUtils';

/** Shepet's per-plate failure keys: `fetchError-registrationNumber-<i>` / `fetchError-message-<i>`. */
const FETCH_ERROR_REG = 'fetchError-registrationNumber-';
const FETCH_ERROR_MSG = 'fetchError-message-';

/** Deduplicated summary produced by {@link assembleAutosysResults}.
 * Entity IDs are collected into Sets so shared types/plans across
 * multiple vehicles are counted only once. */
export interface AutosysAssembledSummary {
  vehicleCount: number;
  vehicleTypeIds: Set<string>;
  deckPlanIds: Set<string>;
  vehicleModelIds: Set<string>;
  successCount: number;
  errors: { queryRegNumber: string; message: string }[];
}

/** Combined output of {@link assembleAutosysResults}: a deduplicated
 * summary, and the netex-payload to POST to Sobek */
export interface AutosysAssembledResult {
  summary: AutosysAssembledSummary;
  postPayload?: string;
}

/** Pair shepet's indexed `fetchError-*` KeyValues into one error per plate. */
const fetchErrors = (rf: ParsedXml): AutosysAssembledSummary['errors'] => {
  const kv = new Map(
    toArray<ParsedXml>(rf.keyList?.KeyValue).map(({ Key, Value }) => [
      String(Key),
      String(Value ?? ''),
    ])
  );
  return [...kv.keys()]
    .filter(k => k.startsWith(FETCH_ERROR_REG))
    .map(k => ({
      queryRegNumber: kv.get(k)!,
      message: translateAutosysError(
        kv.get(FETCH_ERROR_MSG + k.slice(FETCH_ERROR_REG.length)) ?? ''
      ),
    }));
};

/**
 * Summarise shepet's bulk `PublicationDelivery` for the confirm step. The XML is
 * Sobek-ready as returned, so it is passed through untouched as the payload.
 *
 * @param {string} xml - Shepet's bulk response.
 * @param {ImportEntry[]} entries - The plates that were requested.
 * @returns {AutosysAssembledResult} Entity ids, per-plate errors from the frame's
 *   `keyList`, and the payload — absent when no vehicle came back.
 * @throws {Error} When the response has no ResourceFrame — the whole request failed.
 */
export function assembleAutosysResults(
  xml: string,
  entries: ImportEntry[]
): AutosysAssembledResult {
  const rf = findResourceFrame(xmlParser.parse(xml));
  if (!rf) throw new Error(i18next.t('import.multi.noResourceFrame'));

  const errors = fetchErrors(rf);
  const vehicleCount = toArray(rf.vehicles?.Vehicle).length;

  return {
    summary: {
      vehicleCount,
      vehicleTypeIds: entityIds(rf, 'vehicleTypes', 'VehicleType'),
      deckPlanIds: entityIds(rf, 'deckPlans', 'DeckPlan'),
      vehicleModelIds: entityIds(rf, 'vehicleModels', 'VehicleModel'),
      successCount: Math.max(entries.length - errors.length, 0),
      errors,
    },
    postPayload: vehicleCount > 0 ? xml : undefined,
  };
}
