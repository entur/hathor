import type { VehicleType } from './generated/types.js';
import { normalizeFields, vehicleTypeSchema } from './fieldSchema.js';

/**
 * Normalize parsed XML (PascalCase keys, possible {value} wrappers)
 * or a plain object into a clean VehicleType.
 */
export function normalize(src: Record<string, unknown>): Partial<VehicleType> {
  return normalizeFields(src, vehicleTypeSchema) as Partial<VehicleType>;
}
