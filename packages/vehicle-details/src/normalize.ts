import type { Vehicle } from './generated/Vehicle.js';
import { MODIFICATION, STATUS } from './generated/Vehicle.js';

export type TypeHints = {
  booleans?: ReadonlySet<string>;
  numbers?: ReadonlySet<string>;
  enums?: Readonly<Record<string, readonly string[]>>;
  arrays?: ReadonlySet<string>;
  nested?: Readonly<Record<string, TypeHints>>;
};

export const VALID_BETWEEN_HINTS: TypeHints = {
  arrays: new Set(['Name', 'Description', 'keyList', 'privateCodes', 'ValidBetween']),
};

export const ALTERNATIVE_TEXTS_HINTS: TypeHints = {
  arrays: new Set(['AlternativeText']),
};

export const VEHICLE_HINTS: TypeHints = {
  arrays: new Set(['Name', 'ShortName', 'Description', 'keyList', 'privateCodes', 'ValidBetween']),
  booleans: new Set(['Monitored']),
  enums: {
    modification: MODIFICATION,
    status: STATUS,
  },
  nested: {
    ValidBetween: VALID_BETWEEN_HINTS,
    alternativeTexts: ALTERNATIVE_TEXTS_HINTS,
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
        } else if (isArray) {
          // fast-xml-parser collapses a single repeated element into an object;
          // wrap as single-element array when the schema expects a list.
          out[key] = [normalizeValue(rawVal as Record<string, unknown>, nestedHints)];
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

/** Normalize parsed NeTEx XML (fast-xml-parser output) into editor shape. */
export function normalizeXML(src: Record<string, unknown>): Partial<Vehicle> {
  return normalizeValue(src, VEHICLE_HINTS) as Partial<Vehicle>;
}

/** @deprecated Use normalizeXML */
export const normalize = normalizeXML;

// ── GraphQL → editor helpers (mirrors Vehicle-mapping.ts pattern) ──

type Src = Record<string, unknown>;

const gStr = (s: Src, from: string, to: string) =>
  s[from] != null ? { [to]: String(s[from]) } : {};

const gBool = (s: Src, from: string, to: string) =>
  s[from] != null ? { [to]: Boolean(s[from]) } : {};

// name: { value } → Name: [{ value, $lang: 'nb' }]
const gNameArr = (s: Src, from: string, to: string) => {
  if (s[from] == null || typeof s[from] !== 'object') return {};
  const n = s[from] as Src;
  return n.value != null ? { [to]: [{ value: String(n.value), $lang: 'nb' }] } : {};
};

/** Map a Sobek GraphQL Vehicle response (camelCase) into editor shape. */
export function normalizeGraphQL(gql: object): Partial<Vehicle> {
  const s = gql as Src;
  return {
    ...gStr(s, 'id', '$id'),
    ...gStr(s, 'version', '$version'),
    ...gNameArr(s, 'name', 'Name'),
    ...gNameArr(s, 'shortName', 'ShortName'),
    ...gNameArr(s, 'description', 'Description'),
    ...gStr(s, 'registrationNumber', 'RegistrationNumber'),
    ...gStr(s, 'registrationDate', 'RegistrationDate'),
    ...gStr(s, 'buildDate', 'BuildDate'),
    ...gStr(s, 'chassisNumber', 'ChassisNumber'),
    ...gStr(s, 'operationalNumber', 'OperationalNumber'),
    ...gBool(s, 'monitored', 'Monitored'),
    ...gStr(s, 'created', '$created'),
    ...gStr(s, 'changed', '$changed'),
  } as Partial<Vehicle>;
}
