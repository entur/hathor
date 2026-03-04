import type { My_VehicleType } from './generated/types.js';
import { normalizeFields, vehicleTypeSchema } from './fieldSchema.js';

/**
 * Normalize parsed XML (PascalCase keys, possible {value} wrappers)
 * or a plain object into a clean My_VehicleType.
 */
export function normalize(src: Record<string, unknown>): Partial<My_VehicleType> {
  return normalizeFields(src, vehicleTypeSchema) as Partial<My_VehicleType>;
}
