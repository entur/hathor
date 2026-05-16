/*
 * Project VehicleModel to fast-xml-parser XMLBuilder shape.
 * Renames $-prefixed attrs to @_, stringifies booleans,
 * and delegates complex children via reshapeComplex.
 */
export function vehicleModelToXmlShape(obj: Obj): Obj {
  return {
    ...attr(obj, 'nameOfClass'),
    ...attr(obj, 'id'),
    ...refAttr(obj, 'validityConditions'),
    ...mapArr(obj, 'ValidBetween', 'ValidBetween', reshapeComplex),
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
    ...wrapArr(obj, 'keyList', 'KeyValue', 'KeyValueStructure', reshapeComplex),
    ...wrapArr(obj, 'privateCodes', 'PrivateCode', 'PrivateCodeStructure', reshapeComplex),
    ...elem(obj, 'Extensions'),
    ...refAttr(obj, 'BrandingRef'),
    ...attr(obj, 'responsibilitySetRef'),
    ...mapArr(obj, 'Name', 'TextType', reshapeComplex),
    ...mapArr(obj, 'Description', 'TextType', reshapeComplex),
    ...mapArr(obj, 'Manufacturer', 'TextType', reshapeComplex),
    ...refAttr(obj, 'TransportTypeRef'),
    ...elem(obj, 'Range'),
    ...elem(obj, 'FullCharge'),
    ...refAttr(obj, 'equipmentProfiles'),
    ...refAttr(obj, 'VehicleModelProfileRef', 'CarModelProfileRef'),
    ...child(obj, 'CustomerServiceContactDetails', 'ContactStructure', reshapeComplex),
  };
}

function reshapeComplex(name: string, obj: Obj): Obj {
  switch (name) {
    case 'ValidBetween':
      return validBetweenToXmlShape(obj, reshapeComplex);
    case 'KeyValueStructure':
      return keyValueStructureToXmlShape(obj, reshapeComplex);
    case 'PrivateCodeStructure':
      return privateCodeStructureToXmlShape(obj, reshapeComplex);
    case 'TextType':
      return textTypeToXmlShape(obj, reshapeComplex);
    case 'ContactStructure':
      return contactStructureToXmlShape(obj, reshapeComplex);
    default:
      return obj;
  }
}

function validBetweenToXmlShape(obj: Obj, reshapeComplex: Reshape): Obj {
  return {
    ...attr(obj, 'nameOfClass'),
    ...attr(obj, 'id'),
    ...refAttr(obj, 'validityConditions'),
    ...mapArr(obj, 'ValidBetween', 'ValidBetween', reshapeComplex),
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
    ...wrapArr(obj, 'keyList', 'KeyValue', 'KeyValueStructure', reshapeComplex),
    ...wrapArr(obj, 'privateCodes', 'PrivateCode', 'PrivateCodeStructure', reshapeComplex),
    ...elem(obj, 'Extensions'),
    ...refAttr(obj, 'BrandingRef'),
    ...attr(obj, 'responsibilitySetRef'),
    ...mapArr(obj, 'Name', 'TextType', reshapeComplex),
    ...mapArr(obj, 'Description', 'TextType', reshapeComplex),
    ...refAttr(obj, 'ConditionedObjectRef'),
    ...refAttr(obj, 'WithConditionRef'),
    ...elem(obj, 'FromDate'),
    ...elem(obj, 'ToDate'),
  };
}

function keyValueStructureToXmlShape(obj: Obj, _reshapeComplex: Reshape): Obj {
  return {
    ...elem(obj, 'Key'),
    ...elem(obj, 'Value'),
    ...attr(obj, 'typeOfKey'),
  };
}

function privateCodeStructureToXmlShape(obj: Obj, _reshapeComplex: Reshape): Obj {
  return {
    ...text(obj),
    ...attr(obj, 'type'),
  };
}

function textTypeToXmlShape(obj: Obj, _reshapeComplex: Reshape): Obj {
  return {
    ...text(obj),
    ...attr(obj, 'lang'),
    ...attr(obj, 'textIdType'),
  };
}

function contactStructureToXmlShape(obj: Obj, reshapeComplex: Reshape): Obj {
  return {
    ...mapArr(obj, 'ContactPerson', 'TextType', reshapeComplex),
    ...elem(obj, 'Email'),
    ...elem(obj, 'Phone'),
    ...elem(obj, 'Fax'),
    ...elem(obj, 'Url'),
    ...mapArr(obj, 'FurtherDetails', 'TextType', reshapeComplex),
    ...refAttr(obj, 'ContactRef'),
  };
}

type Obj = Record<string, unknown>;
type Reshape = (name: string, obj: Obj) => Obj;

function strVal(v: unknown) {
  return typeof v === 'boolean' ? String(v) : v;
}

function attr(obj: Obj, key: string) {
  const v = obj['$' + key];
  return v !== undefined ? { ['@_' + key]: strVal(v) } : {};
}

function elem(obj: Obj, key: string) {
  const v = obj[key];
  return v !== undefined ? { [key]: strVal(v) } : {};
}

function child(obj: Obj, key: string, type: string, rc: Reshape, xmlKey?: string) {
  const k = xmlKey || key;
  return obj[key] !== undefined ? { [k]: rc(type, obj[key] as Obj) } : {};
}

function mapArr(obj: Obj, key: string, type: string, rc: Reshape, xmlKey?: string) {
  const k = xmlKey || key;
  return obj[key] !== undefined
    ? {
        [k]: (obj[key] as Obj[]).map(function (item: Obj) {
          return rc(type, item);
        }),
      }
    : {};
}

function wrapArr(
  obj: Obj,
  key: string,
  childKey: string,
  type: string,
  rc: Reshape,
  xmlKey?: string
) {
  const k = xmlKey || key;
  const arr = obj[key] as Obj[];
  return arr && arr.length
    ? {
        [k]: {
          [childKey]: arr.map(function (item: Obj) {
            return rc(type, item);
          }),
        },
      }
    : {};
}

function text(obj: Obj) {
  return obj['value'] !== undefined ? { '#text': obj['value'] } : {};
}

function refAttr(obj: Obj, key: string, xk?: string) {
  return obj[key] !== undefined ? { [xk || key]: { '@_ref': obj[key] } } : {};
}
