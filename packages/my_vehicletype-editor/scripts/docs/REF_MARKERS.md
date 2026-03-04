# Ref Markers

Several VehicleType fields hold NeTEx references — string IDs that point to other entities (DeckPlans, Branding, etc.). The schema pipeline preserves this semantic information so downstream consumers (UI pickers, validation, schema interrogation) can distinguish a ref from a plain string like `euroClass`.

## Type aliases in `types.ts`

```ts
export type SimpleRef = string;                      // untyped ref (ambiguous target)
export type Ref<T extends string = string> = string; // typed ref
```

Both resolve to `string` at runtime. The codegen reads the AST source text to tell them apart.

## How it maps

| Source type | Generated descriptor |
|-------------|----------------------|
| `Ref<'DeckPlan'>` | `isRef: true, refTarget: 'DeckPlan'` |
| `SimpleRef` | `isRef: true` |
| `Ref` (no arg) | `isRef: true` |
| `string` | _(no flag)_ |

## Fields currently marked

| Field | Type | refTarget |
|-------|------|-----------|
| `deckPlanRef` | `Ref<'DeckPlan'>` | `DeckPlan` |
| `includedIn` | `Ref<'VehicleType'>` | `VehicleType` |
| `classifiedAsRef` | `Ref<'TypeOfVehicleType'>` | `TypeOfVehicleType` |
| `brandingRef` | `Ref<'Branding'>` | `Branding` |
| `responsibilitySetRef` | `Ref<'ResponsibilitySet'>` | `ResponsibilitySet` |
| `facilities` | `SimpleRef` | _(none)_ |
| `canCarry` | `SimpleRef` | _(none)_ |
| `satisfiesFacilityRequirements` | `SimpleRef` | _(none)_ |

## How it flows

### Codegen (`generate-field-descriptors.ts`)

The script matches `typeNode.getText()` in the TypeReference branch before the `type.isString()` fallback (needed because optional properties resolve to `string | undefined`, which fails `isString()`):

```
typeText === 'SimpleRef'          →  { kind: 'string', isRef: true }
typeText matches /^Ref<'…'>$/     →  { kind: 'string', isRef: true, refTarget: '…' }
otherwise                         →  { kind: 'string' }
```

### FieldDescriptor type (`fieldSchema.ts`)

`isRef` and `refTarget` live on the `string` variant only:

```ts
{ kind: 'string'; camel: string; xml: string; isAttribute?: true; isRef?: true; refTarget?: string }
```

### Normalize / Serialize

No behavioral change — refs normalize and serialize identically to plain strings. The flags are metadata for consumers, not for the round-trip pipeline.

## Adding a new ref field

1. Type the property as `Ref<'TargetEntity'>` in `types.ts` (or `SimpleRef` if the target is ambiguous).
2. Run `npm run codegen` to regenerate `fieldDescriptors.ts`.
3. The generated descriptor will include `isRef: true` (and `refTarget` if typed).
