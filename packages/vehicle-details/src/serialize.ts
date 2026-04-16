import { XMLBuilder } from 'fast-xml-parser';
import { vehicleToXmlShape } from './generated/Vehicle-mapping.js';
import type { Vehicle } from './generated/Vehicle.js';

const builder = new XMLBuilder({
  format: true,
  indentBy: '  ',
  ignoreAttributes: false,
});

export function serialize(obj: Partial<Vehicle>): string {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const xmlObj = vehicleToXmlShape(obj as Record<string, any>);
  return builder.build({ Vehicle: xmlObj }) as string;
}
