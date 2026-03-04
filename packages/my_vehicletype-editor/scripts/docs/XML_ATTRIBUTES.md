# XML Attribute Handling

NeTEx XML uses both child elements (`<Name>…</Name>`) and XML attributes (`id="…"`) on the same element. fast-xml-parser represents attributes with an `@_` prefix. The schema pipeline is aware of this distinction so that attribute fields round-trip correctly through parse → normalize → edit → serialize → build.

## Marking a field as an attribute

Add `/** @xmlAttribute */` JSDoc above the property in `src/generated/types.ts`:

```ts
export interface VehicleType {
  /** @xmlAttribute */
  id?: string;
}
```

Run `npm run codegen`. The generated descriptor gains `isAttribute: true`:

```ts
{ kind: 'string', camel: 'id', xml: 'Id', isAttribute: true }
```

## Fields currently marked

| Interface | Field | XML form |
|-----------|-------|----------|
| VehicleType | `id` | `<VehicleType id="…">` |
| VehicleType | `responsibilitySetRef` | `<VehicleType responsibilitySetRef="…">` |
| TextType | `lang` | `<Name lang="…">` |
| TextType | `textIdType` | `<Name textIdType="…">` |
| PrivateCodeStructure | `type` | `<PrivateCode type="…">` |
| KeyValueStructure | `typeOfKey` | `<KeyValue typeOfKey="…">` |

## How it flows

### Normalize (XML → editor state)

`normalizeFields` checks `@_`-prefixed keys first for attribute fields, then falls back to PascalCase and camelCase:

```
{ "@_id": "NSR:VT:1" }  →  { id: "NSR:VT:1" }
{ "Id": "NSR:VT:1" }    →  { id: "NSR:VT:1" }   (backward compat)
```

### Serialize (editor state → XML object)

`serializeFields` outputs `@_`-prefixed keys for attribute fields:

```
{ id: "NSR:VT:1" }  →  { "@_id": "NSR:VT:1" }
```

### XMLBuilder

`serialize.ts` creates `XMLBuilder` with `ignoreAttributes: false` so `@_`-prefixed keys become XML attributes in the output string.

## Adding a new attribute field

1. Add `/** @xmlAttribute */` above the property in `types.ts`.
2. Run `npm run codegen` to regenerate `fieldDescriptors.ts`.
3. Add tests for the `@_`-prefixed input in `normalize.test.ts` and the attribute output in `serialize.test.ts`.
