import { netexText } from '../../netex/multilingualString.ts';
import type { Vehicle } from '../types/vehicle.ts';

/**
 * A vehicle's display name — grid, card, Edit link and page heading (#290): its name,
 * else its registration number.
 *
 * @param {Vehicle} v a listed row or the form's vehicle
 * @returns {string} the title, `''` when it has neither
 */
export const vehicleTitle = (v: Vehicle): string =>
  netexText(v.name) || v.registrationNumber?.trim() || '';
