import type { AccessToken } from '../../../auth/index.ts';
import { fetchCodeValues } from '../api/fetchCodeValues.ts';
import type { CodeValue, CodeValueType } from '../types/codeValueTypes.ts';

// Session cache, one entry per list (the backend is fixed for the session).
// `settled` lets a remounting editor render its options synchronously;
// `pending` dedupes concurrent opens.
const settled = new Map<CodeValueType, readonly CodeValue[]>();
const pending = new Map<CodeValueType, Promise<readonly CodeValue[]>>();

/**
 * Code list already fetched this session, if any — a synchronous cache read.
 *
 * @param valueType Code list key.
 * @returns The cached entries, or `undefined` before the first successful fetch.
 */
export const cachedCodeValues = (valueType: CodeValueType): readonly CodeValue[] | undefined =>
  settled.get(valueType);

/**
 * Fetch a Sobek code list at most once per session: later calls (and calls
 * made while the first is in flight) share its result. A failed fetch is not
 * cached, so the next call retries.
 *
 * @param applicationBaseUrl Sobek GraphQL endpoint.
 * @param getAccessToken     Token source, only invoked on a cache miss.
 * @param valueType          Code list key, e.g. `EMISSION_STANDARD`.
 * @returns The list's `{ value, label }` entries.
 */
export const loadCodeValues = (
  applicationBaseUrl: string,
  getAccessToken: () => Promise<AccessToken>,
  valueType: CodeValueType
): Promise<readonly CodeValue[]> => {
  const hit = settled.get(valueType);
  if (hit) return Promise.resolve(hit);
  const inFlight = pending.get(valueType);
  if (inFlight) return inFlight;

  const load = getAccessToken()
    .then(token => fetchCodeValues(applicationBaseUrl, token, valueType))
    .then(codes => {
      settled.set(valueType, codes);
      return codes;
    })
    .finally(() => pending.delete(valueType));
  pending.set(valueType, load);
  return load;
};

/** Drop every cached code list — test isolation only. */
export const clearCodeValuesCache = () => {
  settled.clear();
  pending.clear();
};
