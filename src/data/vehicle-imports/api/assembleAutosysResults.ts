import i18next from 'i18next';
import { translateAutosysError } from '../utils/autosysErrorTranslator';
import type { ImportEntry, ParsedXml } from '../types/importTypes';
import { findResourceFrame, toArray, xmlParser } from '../../netex/xmlUtils';

/** Shepet's per-plate failure keys: `fetchError-registrationNumber-<i>` / `fetchError-message-<i>`. */
const FETCH_ERROR_REG = 'fetchError-registrationNumber-',
  FETCH_ERROR_MSG = 'fetchError-message-';

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

const idsOf = (rf: ParsedXml, section: string, element: string): Set<string> =>
  new Set(
    toArray<ParsedXml>(rf[section]?.[element])
      .map(e => e['@_id'])
      .filter(Boolean)
  );

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
 * Every entry failed for the same reason — the whole bulk request could not be read.
 *
 * @param {ImportEntry[]} entries - The plates that were requested.
 * @param {string} message - Why the request failed.
 * @returns {AutosysAssembledResult} A summary with one error per plate and no payload.
 */
export function failedAutosysResult(
  entries: ImportEntry[],
  message: string
): AutosysAssembledResult {
  return {
    summary: {
      vehicleCount: 0,
      vehicleTypeIds: new Set(),
      deckPlanIds: new Set(),
      vehicleModelIds: new Set(),
      successCount: 0,
      errors: entries.map(e => ({ queryRegNumber: e.queryRegNumber, message })),
    },
  };
}

/**
 * Summarise shepet's bulk `PublicationDelivery` for the confirm step. The XML is
 * Sobek-ready as returned, so it is passed through untouched as the payload.
 *
 * @param {string} xml - Shepet's bulk response.
 * @param {ImportEntry[]} entries - The plates that were requested.
 * @returns {AutosysAssembledResult} Entity ids, per-plate errors from the frame's
 *   `keyList`, and the payload — absent when no vehicle came back.
 */
export function assembleAutosysResults(
  xml: string,
  entries: ImportEntry[]
): AutosysAssembledResult {
  let rf: ParsedXml | undefined;
  try {
    rf = findResourceFrame(xmlParser.parse(xml));
  } catch (e) {
    return failedAutosysResult(
      entries,
      e instanceof Error ? e.message : i18next.t('import.multi.xmlParseFailed')
    );
  }
  if (!rf) return failedAutosysResult(entries, i18next.t('import.multi.noResourceFrame'));

  const errors = fetchErrors(rf);
  const vehicleCount = toArray(rf.vehicles?.Vehicle).length;

  return {
    summary: {
      vehicleCount,
      vehicleTypeIds: idsOf(rf, 'vehicleTypes', 'VehicleType'),
      deckPlanIds: idsOf(rf, 'deckPlans', 'DeckPlan'),
      vehicleModelIds: idsOf(rf, 'vehicleModels', 'VehicleModel'),
      successCount: Math.max(entries.length - errors.length, 0),
      errors,
    },
    postPayload: vehicleCount > 0 ? xml : undefined,
  };
}
