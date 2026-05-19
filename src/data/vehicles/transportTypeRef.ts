/**
 * Shared shape constants for `Vehicle.TransportTypeRef`. Lifted out of
 * VehicleEditForm + vehicleFormState so the same prefix + validation regex
 * isn't duplicated across the bare-input writer and the completeness gate.
 *
 * TEMP — the hardcoded codespace falls away when the proper TransportType
 * picker lands (blocked on Sobek `VehicleTypeFilter.name`). At that point
 * the picker hands the form a fully-formed netex id and these helpers
 * become unnecessary.
 */

export const TRANSPORT_TYPE_PREFIX = 'NMR:VehicleType:';
export const TRANSPORT_TYPE_REF_PATTERN = /^NMR:VehicleType:\d+$/;

/** Strip the codespace+type prefix from a full netex ref for the bare numeric input. */
export const refToInt = (ref: string | undefined): string => {
  if (!ref) return '';
  const m = ref.match(TRANSPORT_TYPE_REF_PATTERN);
  return m ? ref.slice(TRANSPORT_TYPE_PREFIX.length) : '';
};

/** Splice the codespace+type prefix back when the user types a number. */
export const intToRef = (raw: string): string | undefined => {
  const s = raw.trim();
  return /^\d+$/.test(s) ? `${TRANSPORT_TYPE_PREFIX}${s}` : undefined;
};
