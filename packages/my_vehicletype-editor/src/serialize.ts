import { XMLBuilder } from 'fast-xml-parser';
import { vehicleTypeToXmlShape } from './generated/VehicleType-mapping.js';
import type { VehicleType } from './generated/VehicleType.js';

const builder = new XMLBuilder({
  format: true,
  indentBy: '  ',
  ignoreAttributes: false,
});

export function serialize(obj: Partial<VehicleType>): string {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const xmlObj = vehicleTypeToXmlShape(obj as Record<string, any>);
  return builder.build({ VehicleType: xmlObj }) as string;
}
