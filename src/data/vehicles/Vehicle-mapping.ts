/*
 * Project Vehicle to fast-xml-parser XMLBuilder shape.
 * Renames $-prefixed attrs to @_, stringifies booleans,
 * and delegates complex children via reshapeComplex.
 */
export function vehicleToXmlShape(obj: Obj): Obj {
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
    ...mapArr(obj, 'ShortName', 'TextType', reshapeComplex),
    ...mapArr(obj, 'Description', 'TextType', reshapeComplex),
    ...elem(obj, 'BuildDate'),
    ...elem(obj, 'ChassisNumber'),
    ...elem(obj, 'RegistrationNumber'),
    ...elem(obj, 'RegistrationDate'),
    ...elem(obj, 'OperationalNumber'),
    ...child(obj, 'PrivateCode', 'PrivateCode', reshapeComplex),
    ...refAttr(obj, 'TransportOrganisationRef', 'AuthorityRef'),
    ...refAttr(obj, 'ContactRef'),
    ...refAttr(obj, 'TransportTypeRef'),
    ...refAttr(obj, 'VehicleModelRef'),
    ...refAttr(obj, 'equipmentProfiles'),
    ...refAttr(obj, 'VehicleModelProfileRef', 'CarModelProfileRef'),
    ...refAttr(obj, 'actualVehicleEquipments'),
    ...elem(obj, 'Monitored'),
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
    case 'PrivateCode':
      return privateCodeToXmlShape(obj, reshapeComplex);
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

const privateCodeToXmlShape = privateCodeStructureToXmlShape;

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
