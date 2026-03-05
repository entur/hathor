// ── Field descriptor types ──

export type FieldDescriptor =
  | {
      kind: 'string';
      camel: string;
      xml: string;
      isAttribute?: true;
      isRef?: true;
      refTarget?: string;
    }
  | { kind: 'number'; camel: string; xml: string; isAttribute?: true }
  | { kind: 'boolean'; camel: string; xml: string; isAttribute?: true }
  | { kind: 'enum'; camel: string; xml: string; allowed: readonly string[]; isAttribute?: true }
  | { kind: 'enum[]'; camel: string; xml: string; allowed: readonly string[]; isAttribute?: true }
  | { kind: 'object'; camel: string; xml: string; schema: FieldDescriptor[] }
  | { kind: 'array'; camel: string; xml: string; schema: FieldDescriptor[] };

// ── Generic helpers ──

function unwrap(val: unknown): unknown {
  if (typeof val === 'object' && val !== null && 'value' in (val as Record<string, unknown>)) {
    return (val as Record<string, unknown>).value;
  }
  return val;
}

export function serializeFields(
  obj: Record<string, unknown>,
  schema: FieldDescriptor[]
): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const field of schema) {
    const val = obj[field.camel];
    if (val === undefined) continue;
    switch (field.kind) {
      case 'string':
      case 'number':
      case 'enum':
      case 'enum[]': {
        const key = field.isAttribute ? `@_${field.camel}` : field.xml;
        out[key] = val;
        break;
      }
      case 'boolean': {
        const key = field.isAttribute ? `@_${field.camel}` : field.xml;
        out[key] = String(val);
        break;
      }
      case 'object':
        out[field.xml] = serializeFields(val as Record<string, unknown>, field.schema);
        break;
      case 'array':
        out[field.xml] = (val as unknown[]).map(item =>
          serializeFields(item as Record<string, unknown>, field.schema)
        );
        break;
    }
  }
  return out;
}

export function normalizeFields(
  src: Record<string, unknown>,
  schema: FieldDescriptor[]
): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const field of schema) {
    const rawVal =
      field.kind !== 'object' && field.kind !== 'array' && field.isAttribute
        ? (src[`@_${field.camel}`] ?? src[field.xml] ?? src[field.camel])
        : (src[field.xml] ?? src[field.camel]);
    if (rawVal == null) continue;
    switch (field.kind) {
      case 'string': {
        out[field.camel] = String(unwrap(rawVal));
        break;
      }
      case 'number': {
        const raw = unwrap(rawVal);
        if (typeof raw === 'number') {
          out[field.camel] = raw;
        } else {
          const n = Number(raw);
          if (!Number.isNaN(n)) out[field.camel] = n;
        }
        break;
      }
      case 'boolean': {
        const raw = unwrap(rawVal);
        if (typeof raw === 'boolean') {
          out[field.camel] = raw;
        } else if (raw === 'true' || raw === '1') {
          out[field.camel] = true;
        } else if (raw === 'false' || raw === '0') {
          out[field.camel] = false;
        } else {
          out[field.camel] = Boolean(raw);
        }
        break;
      }
      case 'enum': {
        const s = String(unwrap(rawVal));
        if ((field.allowed as readonly string[]).includes(s)) {
          out[field.camel] = s;
        }
        break;
      }
      case 'enum[]': {
        const raw = unwrap(rawVal);
        const arr = Array.isArray(raw) ? raw : [raw];
        out[field.camel] = arr
          .map(v => String(unwrap(v)))
          .filter(s => (field.allowed as readonly string[]).includes(s));
        break;
      }
      case 'object': {
        if (typeof rawVal === 'object' && rawVal !== null) {
          out[field.camel] = normalizeFields(rawVal as Record<string, unknown>, field.schema);
        }
        break;
      }
      case 'array': {
        const arr = Array.isArray(rawVal) ? rawVal : [rawVal];
        out[field.camel] = arr.map(item =>
          normalizeFields(
            typeof item === 'object' && item !== null ? (item as Record<string, unknown>) : {},
            field.schema
          )
        );
        break;
      }
    }
  }
  return out;
}
