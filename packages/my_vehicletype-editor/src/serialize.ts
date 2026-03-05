import { XMLBuilder } from 'fast-xml-parser';
import type { VehicleType } from './generated/types.js';
import { vehicleTypeSchema } from './generated/fieldDescriptors.js';
import { serializeFields } from './fieldSchema.js';

const builder = new XMLBuilder({
  format: true,
  indentBy: '  ',
  ignoreAttributes: false,
});

/**
 * Serialize a VehicleType object to an XML string.
 */
export function serialize(obj: Partial<VehicleType>): string {
  const xmlObj = serializeFields(obj as Record<string, unknown>, vehicleTypeSchema);
  return builder.build({ VehicleType: xmlObj }) as string;
}
