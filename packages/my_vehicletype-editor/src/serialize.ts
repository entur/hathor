import { XMLBuilder } from 'fast-xml-parser';
import type { My_VehicleType } from './generated/types.js';
import { serializeFields, vehicleTypeSchema } from './fieldSchema.js';

const builder = new XMLBuilder({
  format: true,
  indentBy: '  ',
});

/**
 * Serialize a My_VehicleType object to an XML string.
 */
export function serialize(obj: Partial<My_VehicleType>): string {
  const xmlObj = serializeFields(obj as Record<string, unknown>, vehicleTypeSchema);
  return builder.build({ My_VehicleType: xmlObj }) as string;
}
