// ── Field descriptor types ──

export type FieldDescriptor =
  | { kind: 'string'; camel: string; xml: string }
  | { kind: 'number'; camel: string; xml: string }
  | { kind: 'boolean'; camel: string; xml: string }
  | { kind: 'enum'; camel: string; xml: string; allowed: readonly string[] }
  | { kind: 'enum[]'; camel: string; xml: string; allowed: readonly string[] }
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
      case 'enum[]':
        out[field.xml] = val;
        break;
      case 'boolean':
        out[field.xml] = String(val);
        break;
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
    const rawVal = src[field.xml] ?? src[field.camel];
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
        if (typeof rawVal === 'boolean') {
          out[field.camel] = rawVal;
        } else if (rawVal === 'true' || rawVal === '1') {
          out[field.camel] = true;
        } else if (rawVal === 'false' || rawVal === '0') {
          out[field.camel] = false;
        } else {
          out[field.camel] = Boolean(rawVal);
        }
        break;
      }
      case 'enum': {
        const s = String(rawVal);
        if ((field.allowed as readonly string[]).includes(s)) {
          out[field.camel] = s;
        }
        break;
      }
      case 'enum[]': {
        const arr = Array.isArray(rawVal) ? rawVal : [rawVal];
        out[field.camel] = arr
          .map(v => String(v))
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
