import { XMLBuilder } from 'fast-xml-parser';
import { toXmlShape } from './generated/type_helpers.js';
import type { VehicleType } from './generated/types.js';

const builder = new XMLBuilder({
  format: true,
  indentBy: '  ',
  ignoreAttributes: false,
});

export function serialize(obj: Partial<VehicleType>): string {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const xmlObj = toXmlShape(obj as Record<string, any>);
  return builder.build({ VehicleType: xmlObj }) as string;
}
