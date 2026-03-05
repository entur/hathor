# Schema-driven normalize + serialize refactor

## Problem

`normalize.ts` and `serialize.ts` contained ~900 lines of hand-written, per-field boilerplate. Every NeTEx field required its own IIFE or `if`-block that:

- Looked up the value by PascalCase (`src['TransportMode']`) or camelCase (`src['transportMode']`)
- Unwrapped `{ value: ... }` wrappers left by the XML parser
- Coerced to the correct JS type (string, number, boolean, enum validation)
- Recursed into sub-structures (TextType, PassengerCapacity, etc.)

Adding or renaming a field meant touching two files with identical knowledge about the field — its XML tag, its camelCase name, its type, and its sub-structure shape.

## Solution

Introduce a single **field schema** (`fieldSchema.ts`) that declares every field once as a `FieldDescriptor`:

```ts
type FieldDescriptor =
  | { kind: 'string';  camel: string; xml: string }
  | { kind: 'number';  camel: string; xml: string }
  | { kind: 'boolean'; camel: string; xml: string }
  | { kind: 'enum';    camel: string; xml: string; allowed: readonly string[] }
  | { kind: 'enum[]';  camel: string; xml: string; allowed: readonly string[] }
  | { kind: 'object';  camel: string; xml: string; schema: FieldDescriptor[] }
  | { kind: 'array';   camel: string; xml: string; schema: FieldDescriptor[] }
```

Two generic walkers drive both directions:

| Function | Direction | Purpose |
|----------|-----------|---------|
| `normalizeFields(src, schema)` | XML → JS | PascalCase lookup, unwrap `{value}`, coerce types |
| `serializeFields(obj, schema)` | JS → XML | camelCase → PascalCase, stringify booleans |

Sub-structures (TextType, PrivateCodeStructure, PassengerCapacityStructure, KeyValueStructure, VehicleManoeuvringRequirements) are just nested `FieldDescriptor[]` arrays referenced from the parent schema.

## Files changed

| File | Before | After | Change |
|------|--------|-------|--------|
| `normalize.ts` | 774 lines | 10 lines | Replaced all per-field IIFEs with `normalizeFields(src, vehicleTypeSchema)` |
| `serialize.ts` | 127 lines | 16 lines | Replaced all per-field `if` blocks with `serializeFields(obj, vehicleTypeSchema)` |
| `fieldSchema.ts` | — | 217 lines | New: schema definitions + generic walkers |
| **Net** | **901 lines** | **243 lines** | **−658 lines** |

## Schema structure

```
vehicleTypeSchema
├── name          → array  → textTypeSchema
├── shortName     → array  → textTypeSchema
├── description   → array  → textTypeSchema
├── privateCode   → object → privateCodeSchema
├── transportMode → enum   (TRANSPORT_MODES)
├── propulsionTypes → enum[] (PROPULSION_TYPES)
├── fuelTypes     → enum[] (FUEL_TYPES)
├── passengerCapacity → object → passengerCapacitySchema
│   └── fareClass → enum (FARE_CLASSES)
│   └── totalCapacity, seatingCapacity, ... → number
├── canManoeuvre  → object → manoeuvringSchema
├── keyList       → array  → keyValueSchema
├── privateCodes  → array  → privateCodeSchema
└── (30+ string/number/boolean leaf fields)
```

## Auto-generated fieldDescriptors via ts-morph

The `vehicleTypeSchema` array and its sub-schemas are **auto-generated** from `generated/types.ts` by a ts-morph codegen script.

### How it works

`scripts/generate-field-descriptors.ts` uses ts-morph to walk the `VehicleType` interface at the AST level. For each property it:

1. Resolves the TS type to a `FieldDescriptor` kind (`string`, `number`, `boolean`, `enum`, `enum[]`, `object`, `array`)
2. Derives the XML tag from the camelCase property name (capitalize first letter → PascalCase)
3. Maps enum type aliases back to their source `as const` arrays (e.g. `AllPublicTransportModesEnumeration` → `TRANSPORT_MODES`)
4. Recursively processes sub-interfaces (e.g. `PassengerCapacityStructure`, `TextType`)

The output is `src/generated/fieldDescriptors.ts` — a static `.ts` file that can be git-tracked, reviewed, and tested normally. Zero runtime cost.

### Commands

```bash
npm run codegen         # regenerate fieldDescriptors.ts
npm run codegen:check   # exit 1 if the generated file is stale
```

### Architecture

```
src/generated/types.ts          ← single source of truth (interfaces + const arrays)
        ↓  (ts-morph AST walk)
scripts/generate-field-descriptors.ts
        ↓  (writes)
src/generated/fieldDescriptors.ts  ← schema data (vehicleTypeSchema + sub-schemas)
        ↓  (imported by)
src/normalize.ts + src/serialize.ts
        ↓  (use generic walkers from)
src/fieldSchema.ts              ← FieldDescriptor type + normalizeFields/serializeFields
```
