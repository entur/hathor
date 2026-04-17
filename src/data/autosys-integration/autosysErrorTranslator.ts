/**
 * Temporary hardcoded mapping of raw Autosys/Sobek error response bodies to
 * user-friendly messages. This exists because Sobek does not yet expose a
 * structured error-response schema in its OpenAPI spec.
 *
 * Remove this file once Sobek returns typed error responses.
 * See: https://github.com/entur/hathor/issues/4
 */

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

export function translateAutosysError(raw: string): string {
  for (const { pattern, defaultMessage } of ERROR_PATTERNS) {
    if (pattern.test(raw)) {
      return defaultMessage;
    }
  }
  return raw;
}
