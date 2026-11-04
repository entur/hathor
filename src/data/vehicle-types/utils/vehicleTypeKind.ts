import type { VehicleTypeKind } from '../types/vehicleTypeTypes.ts';

/** Sobek reserves this codespace for CONTRACTUAL vehicle types (sobek#232). */
const CONTRACTUAL_PREFIX = 'CVT:';

/**
 * Kind of a vehicle type, read from its NeTEx id — Sobek encodes it in the codespace.
 *
 * @param {string} netexId Full NeTEx id, or `''` for a not-yet-created type.
 * @returns {VehicleTypeKind} `CONTRACTUAL` for `CVT:` ids, otherwise `PHYSICAL`.
 */
export const vehicleTypeKindOf = (netexId: string): VehicleTypeKind =>
  netexId.startsWith(CONTRACTUAL_PREFIX) ? 'CONTRACTUAL' : 'PHYSICAL';
