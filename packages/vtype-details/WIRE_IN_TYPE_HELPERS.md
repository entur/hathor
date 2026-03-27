# Wire in `type_helpers.ts` for XML serialization

## Context

`serialize.ts` currently uses a convention-only `serializeValue()` that walks objects
recursively, renames `$`-prefixed keys to `@_` attributes, and stringifies booleans.
It has **no schema awareness** — it misses:

- simpleContent `value` → `#text` (e.g. `TextType { value, $lang }` stays as `{ value, @_lang }` instead of `{ '#text', @_lang }`)
- Ref-structure attrs (e.g. `DeckPlanRef { value, $ref, $version }` — nested `$ref` doesn't get `@_` rename because `serializeValue` doesn't recurse into string-valued refs)

`generated/type_helpers.ts` has a schema-aware `toXmlShape()` that handles all of
this correctly. It was generated from the NeTEx JSON Schema by
`netex-typescript-model/typescript/scripts/generate-hathor-helpers.ts` using
`makeInlinedToXmlShape()`.

## What to do

### 1. Replace `serializeValue` with `toXmlShape` in `serialize.ts`

```ts
import { XMLBuilder } from 'fast-xml-parser';
import { toXmlShape } from './generated/type_helpers.js';
import type { VehicleType } from './generated/types.js';

const builder = new XMLBuilder({
  format: true,
  indentBy: '  ',
  ignoreAttributes: false,
});

export function serialize(obj: Partial<VehicleType>): string {
  const xmlObj = toXmlShape(obj as Record<string, any>);
  return builder.build({ VehicleType: xmlObj }) as string;
}
```

Delete `serializeValue()` — it is fully replaced.

### 2. Update serialize tests

The existing tests in `__tests__/serialize.test.ts` pass partial VehicleType
objects directly. Most will keep working since `toXmlShape` uses a base loop
that copies unknown properties as-is. But check:

- **Ref tests** (`DeckPlanRef`, `IncludedIn`, `ClassifiedAsRef`, `BrandingRef`) —
  if these are currently passed as bare strings (`{ DeckPlanRef: 'test' }`),
  `toXmlShape` will copy them through unchanged (same behavior). But if the
  editor starts passing ref _objects_ (`{ value: 'x', $ref: 'x' }`), the
  dispatch `default` branch won't transform nested attrs. See TODOs in
  `type_helpers.ts` for adding ref-type functions.

- **Name / ShortName / Description** — tests pass `{ Value: 'a' }` (capital V).
  The stem shape from `normalize` uses `value` (lowercase). Verify which casing
  the editor actually produces and align the tests.

- **Roundtrip test** — the `normalize → serialize → parse → normalize` roundtrip
  should still pass since `toXmlShape` handles the same primitives. Run it to
  confirm.

### 3. Re-export (optional)

If consumers outside the editor package need `toXmlShape` directly, add to
`index.ts`:

```ts
export { toXmlShape } from './generated/type_helpers.js';
```

## Known gaps (see TODOs in `type_helpers.ts`)

| Gap | Impact | Fix |
|-----|--------|-----|
| Ref types (`BrandingRef`, `DeckPlanRef`, `ValidBetween`, `VehicleTypeRefStructure`, `VehicleModelRefStructure`) hit dispatch `default` pass-through | Nested `$ref`/`$version` attrs won't get `@_` rename | Add these to `TYPES[]` in the generator and add dispatch cases |
| `VehicleManoeuvringRequirements` is hand-written | Works, but won't track schema changes | Replace when/if type lands in NeTEx XSD |
| Only VehicleType tree is covered | Vehicle / DeckPlan exports won't use schema-aware transform | Add their types when Hathor needs them |

## How to regenerate

From `netex-typescript-model/`:

```bash
cd typescript
npx tsx scripts/generate-hathor-helpers.ts
```

Requires `generated-src/base/base.schema.json` (run `make all` first if missing).
