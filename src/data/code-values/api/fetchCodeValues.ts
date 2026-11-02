import type { AccessToken } from '../../../auth/index.ts';
import { FETCH_ALL_SIZE } from '../../../graphql/paginationTypes.ts';
import { fetchCodeValuesRequest } from '../../../graphql/vehicles/queries/fetchCodeValues.ts';
import type { CodeValue, CodeValueType } from '../types/codeValueTypes.ts';

/**
 * Fetch one Sobek code list, in Sobek's own order.
 *
 * @param applicationBaseUrl Sobek GraphQL endpoint.
 * @param token              Bearer token, or `null` when auth is off.
 * @param valueType          Code list key, e.g. `EMISSION_STANDARD`.
 * @returns The list's `{ value, label }` entries.
 */
export const fetchCodeValues = async (
  applicationBaseUrl: string,
  token: AccessToken,
  valueType: CodeValueType
): Promise<CodeValue[]> => {
  const raw = await fetchCodeValuesRequest(applicationBaseUrl, token, {
    filter: { valueType },
    size: FETCH_ALL_SIZE,
  });
  return raw.codeValues.content;
};
