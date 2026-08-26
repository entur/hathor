/**
 * Shared helpers for `Vehicle-mapping` + `VehicleModel-mapping`. Both
 * serializers project a `$`-prefixed domain object into the fast-xml-parser
 * builder shape: `$x → @_x`, `value → #text`, booleans stringified.
 *
 * NOTE: this hand-written parser/mapping mirror pair is the workaround
 * tracked by entur/netex-typescript-model#49. Once the codegen tool emits
 * bidirectional `Codec<T>` per entity (v2), this whole `netex/*-helpers.ts`
 * pair is deleted and consumers swap to `fooCodec.encode/decode`.
 */

export type Obj = Record<string, unknown>;
export type Reshape = (name: string, obj: Obj) => Obj;

export function strVal(v: unknown) {
  return typeof v === 'boolean' ? String(v) : v;
}

export function attr(obj: Obj, key: string) {
  const v = obj['$' + key];
  return v !== undefined ? { ['@_' + key]: strVal(v) } : {};
}

export function elem(obj: Obj, key: string) {
  const v = obj[key];
  return v !== undefined ? { [key]: strVal(v) } : {};
}

export function child(obj: Obj, key: string, type: string, rc: Reshape, xmlKey?: string) {
  const k = xmlKey || key;
  return obj[key] !== undefined ? { [k]: rc(type, obj[key] as Obj) } : {};
}

export function mapArr(obj: Obj, key: string, type: string, rc: Reshape, xmlKey?: string) {
  const k = xmlKey || key;
  return obj[key] !== undefined ? { [k]: (obj[key] as Obj[]).map(item => rc(type, item)) } : {};
}

export function wrapArr(
  obj: Obj,
  key: string,
  childKey: string,
  type: string,
  rc: Reshape,
  xmlKey?: string
) {
  const k = xmlKey || key;
  const arr = obj[key] as Obj[];
  return arr && arr.length ? { [k]: { [childKey]: arr.map(item => rc(type, item)) } } : {};
}

export function text(obj: Obj) {
  return obj['value'] !== undefined ? { '#text': obj['value'] } : {};
}

export function refAttr(obj: Obj, key: string, xk?: string) {
  return obj[key] !== undefined ? { [xk || key]: { '@_ref': obj[key] } } : {};
}

export function validBetweenToXmlShape(obj: Obj, rc: Reshape): Obj {
  return {
    ...attr(obj, 'nameOfClass'),
    ...attr(obj, 'id'),
    ...refAttr(obj, 'validityConditions'),
    ...mapArr(obj, 'ValidBetween', 'ValidBetween', rc),
    ...elem(obj, 'alternativeTexts'),
    ...attr(obj, 'dataSourceRef'),
    ...attr(obj, 'created'),
    ...attr(obj, 'changed'),
    ...attr(obj, 'modification'),
    ...attr(obj, 'version'),
    ...attr(obj, 'status'),
    ...attr(obj, 'derivedFromVersionRef'),
    ...attr(obj, 'compatibleWithVersionFrameVersionRef'),
    ...attr(obj, 'derivedFromObjectRef'),
    ...wrapArr(obj, 'keyList', 'KeyValue', 'KeyValueStructure', rc),
    ...wrapArr(obj, 'privateCodes', 'PrivateCode', 'PrivateCodeStructure', rc),
    ...elem(obj, 'Extensions'),
    ...refAttr(obj, 'BrandingRef'),
    ...attr(obj, 'responsibilitySetRef'),
    ...mapArr(obj, 'Name', 'TextType', rc),
    ...mapArr(obj, 'Description', 'TextType', rc),
    ...refAttr(obj, 'ConditionedObjectRef'),
    ...refAttr(obj, 'WithConditionRef'),
    ...elem(obj, 'FromDate'),
    ...elem(obj, 'ToDate'),
  };
}

export function keyValueStructureToXmlShape(obj: Obj, _rc: Reshape): Obj {
  return {
    ...elem(obj, 'Key'),
    ...elem(obj, 'Value'),
    ...attr(obj, 'typeOfKey'),
  };
}

export function privateCodeStructureToXmlShape(obj: Obj, _rc: Reshape): Obj {
  return {
    ...text(obj),
    ...attr(obj, 'type'),
  };
}

export function textTypeToXmlShape(obj: Obj, _rc: Reshape): Obj {
  return {
    ...text(obj),
    ...attr(obj, 'lang'),
    ...attr(obj, 'textIdType'),
  };
}

/**
 * Dispatcher for the four NeTEx complex types that both mappings share.
 * Vehicle and VehicleModel each wrap this with their own type-specific
 * cases (`PrivateCode` for Vehicle, `ContactStructure` for VehicleModel),
 * falling back here for the common four.
 */
export function baseReshape(name: string, obj: Obj, rc: Reshape): Obj {
  switch (name) {
    case 'ValidBetween':
      return validBetweenToXmlShape(obj, rc);
    case 'KeyValueStructure':
      return keyValueStructureToXmlShape(obj, rc);
    case 'PrivateCodeStructure':
      return privateCodeStructureToXmlShape(obj, rc);
    case 'TextType':
      return textTypeToXmlShape(obj, rc);
    default:
      return obj;
  }
}
