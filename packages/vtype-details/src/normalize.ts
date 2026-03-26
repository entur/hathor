import type { VehicleType } from './generated/VehicleType.js';
import {
  ALL_PUBLIC_TRANSPORT_MODES,
  PROPULSION_TYPE,
  FARE_CLASS,
} from './generated/VehicleType.js';

export type TypeHints = {
  booleans?: ReadonlySet<string>;
  numbers?: ReadonlySet<string>;
  enums?: Readonly<Record<string, readonly string[]>>;
  arrays?: ReadonlySet<string>;
  nested?: Readonly<Record<string, TypeHints>>;
};

export const PASSENGER_CAPACITY_HINTS: TypeHints = {
  numbers: new Set([
    'TotalCapacity',
    'SeatingCapacity',
    'StandingCapacity',
    'SpecialPlaceCapacity',
    'PushchairCapacity',
    'WheelchairPlaceCapacity',
    'PramPlaceCapacity',
    'BicycleRackCapacity',
  ]),
  enums: { FareClass: FARE_CLASS },
};

export const MANOEUVRE_HINTS: TypeHints = {
  booleans: new Set(['Reversible']),
  numbers: new Set(['MinimumTurningCircle', 'MinimumOvertakingWidth', 'MinimumLength']),
};

export const VEHICLE_TYPE_HINTS: TypeHints = {
  arrays: new Set([
    'Name',
    'ShortName',
    'Description',
    'keyList',
    'privateCodes',
    'PropulsionTypes',
    'FuelTypes',
  ]),
  booleans: new Set([
    'ReversingDirection',
    'SelfPropelled',
    'Monitored',
    'LowFloor',
    'HasLiftOrRamp',
    'HasHoist',
  ]),
  numbers: new Set([
    'MaximumRange',
    'MaximumVelocity',
    'HoistOperatingRadius',
    'BoardingHeight',
    'GapToPlatform',
    'Length',
    'Width',
    'Height',
    'Weight',
    'FirstAxleHeight',
  ]),
  enums: {
    TransportMode: ALL_PUBLIC_TRANSPORT_MODES,
    PropulsionType: PROPULSION_TYPE,
  },
  nested: {
    PassengerCapacity: PASSENGER_CAPACITY_HINTS,
    canManoeuvre: MANOEUVRE_HINTS,
  },
};

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
