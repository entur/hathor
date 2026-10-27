/**
 * Map shepet's per-plate fetch error codes (`FetchVehicleErrorCode`, entur/shepet#39)
 * to user-friendly messages. Shepet keeps the upstream detail in its log and puts
 * only the code in the bulk response's `fetchError-message-<i>` KeyValue.
 */
import i18next from 'i18next';

/** i18n key + English fallback per shepet error code. */
const ERROR_CODES: Record<string, { key: string; defaultMessage: string }> = {
  NOT_FOUND: {
    key: 'autosys.errResp.badFormat.or.unknown',
    defaultMessage: 'Invalid format or unknown registration number',
  },
  UPSTREAM_ERROR: {
    key: 'autosys.errResp.upstream',
    defaultMessage: 'Autosys lookup failed',
  },
};

/**
 * Map a shepet fetch error code to a localised, user-facing message.
 *
 * @param {string} code - Shepet's `fetchError-message-<i>` value, e.g. `NOT_FOUND`.
 * @returns {string} The translated message for a known code, else `code`
 *   unchanged (an untranslated backend string beats swallowing the detail).
 */
export function translateAutosysError(code: string): string {
  const known = ERROR_CODES[code];
  return known ? i18next.t(known.key, known.defaultMessage) : code;
}
