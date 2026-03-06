import { XMLBuilder } from 'fast-xml-parser';
import type { VehicleType } from './generated/types.js';

const builder = new XMLBuilder({
  format: true,
  indentBy: '  ',
  ignoreAttributes: false,
});

function serializeValue(obj: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [key, val] of Object.entries(obj)) {
    if (val === undefined) continue;
    if (key.startsWith('$')) {
      out[`@_${key.slice(1)}`] = typeof val === 'boolean' ? String(val) : val;
    } else if (Array.isArray(val)) {
      out[key] = val.map(item =>
        typeof item === 'object' && item !== null
          ? serializeValue(item as Record<string, unknown>)
          : item
      );
    } else if (typeof val === 'object' && val !== null) {
      out[key] = serializeValue(val as Record<string, unknown>);
    } else if (typeof val === 'boolean') {
      out[key] = String(val);
    } else {
      out[key] = val;
    }
  }
  return out;
}

export function serialize(obj: Partial<VehicleType>): string {
  const xmlObj = serializeValue(obj as Record<string, unknown>);
  return builder.build({ VehicleType: xmlObj }) as string;
}
