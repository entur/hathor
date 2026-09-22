/**
 * Temporary hardcoded mapping of raw Autosys/Sobek error response bodies to
 * user-friendly messages. This exists because Sobek does not yet expose a
 * structured error-response schema in its OpenAPI spec.
 *
 * Remove this file once Sobek returns typed error responses.
 * See: https://github.com/entur/hathor/issues/4
 */
import { tOutside } from '../../utils/tOutside';

interface ErrorPattern {
  pattern: RegExp;
  key: string;
  defaultMessage: string;
}

const ERROR_PATTERNS: ErrorPattern[] = [
  {
    pattern: /Cannot invoke "org\.entur\.autosys\.model/,
    key: 'autosys.errResp.incomplete.autosys.data',
    defaultMessage: 'Incomplete vehicle data in Autosys',
  },
  {
    pattern: /400 Bad Request: "\{"feilmelding":"UGYLDIG_FORMAT_UNR_ELLER_KJENNEMERKE"\}"/,
    key: 'autosys.errResp.badFormat.or.unknown',
    defaultMessage: 'Invalid format or unknown registration number',
  },
];

/**
 * Map a raw Autosys/Sobek error body to a localised, user-facing message.
 *
 * @param {string} raw - Error body as returned by Sobek.
 * @returns {string} The translated message for a known pattern, else `raw`
 *   unchanged (an untranslated backend string beats swallowing the detail).
 */
export function translateAutosysError(raw: string): string {
  for (const { pattern, key, defaultMessage } of ERROR_PATTERNS) {
    if (pattern.test(raw)) {
      return tOutside(key, defaultMessage);
    }
  }
  return raw;
}
