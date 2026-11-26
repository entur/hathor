import { netexText } from '../../netex/multilingualString.ts';
import type { VehicleType } from '../types/vehicleTypeTypes.ts';

/**
 * A vehicle type's display name — grid, card, Edit link and page heading (#290): its
 * name, else its id.
 *
 * @param {VehicleType} vt a listed row or the form's type
 * @returns {string} the title, `''` for an unnamed create (no id yet)
 */
export const vehicleTypeTitle = (vt: VehicleType): string => netexText(vt.name) || vt.id;
