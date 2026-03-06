import type { VehicleType, TypeHints } from './generated/types.js';
import { VEHICLE_TYPE_HINTS } from './generated/types.js';

function unwrap(val: unknown): unknown {
  if (typeof val === 'object' && val !== null && 'value' in (val as Record<string, unknown>)) {
    return (val as Record<string, unknown>).value;
  }
  return val;
}

function coerce(key: string, val: unknown, hints: TypeHints): unknown {
  if (hints.booleans?.has(key)) {
    if (typeof val === 'boolean') return val;
    if (val === 'true' || val === '1') return true;
    if (val === 'false' || val === '0') return false;
    return Boolean(val);
  }
  if (hints.numbers?.has(key)) {
    if (typeof val === 'number') return val;
    const n = Number(val);
    return Number.isNaN(n) ? undefined : n;
  }
  if (hints.enums?.[key]) {
    const s = String(val);
    return (hints.enums[key] as readonly string[]).includes(s) ? s : undefined;
  }
  return typeof val === 'object' ? val : String(val);
}

function normalizeValue(src: Record<string, unknown>, hints: TypeHints): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [key, rawVal] of Object.entries(src)) {
    if (rawVal == null) continue;
    if (key.startsWith('@_')) {
      const tsKey = '$' + key.slice(2);
      out[tsKey] = String(unwrap(rawVal));
    } else {
      const nestedHints = hints.nested?.[key];
      const isArray = hints.arrays?.has(key);
      if (nestedHints && typeof rawVal === 'object') {
        if (Array.isArray(rawVal)) {
          out[key] = rawVal.map(item =>
            normalizeValue(item as Record<string, unknown>, nestedHints)
          );
        } else {
          out[key] = normalizeValue(rawVal as Record<string, unknown>, nestedHints);
        }
      } else if (isArray) {
        const items = Array.isArray(rawVal) ? rawVal : [rawVal];
        out[key] = items.map(item =>
          typeof item === 'object' && item !== null
            ? normalizeValue(item as Record<string, unknown>, {})
            : unwrap(item)
        );
      } else if (Array.isArray(rawVal)) {
        out[key] = rawVal.map(item =>
          typeof item === 'object' && item !== null
            ? normalizeValue(item as Record<string, unknown>, {})
            : unwrap(item)
        );
      } else {
        out[key] = coerce(key, unwrap(rawVal), hints);
      }
    }
  }
  return out;
}

export function normalize(src: Record<string, unknown>): Partial<VehicleType> {
  return normalizeValue(src, VEHICLE_TYPE_HINTS) as Partial<VehicleType>;
}
