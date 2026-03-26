/*
 * Project VehicleType to fast-xml-parser XMLBuilder shape.
 * Renames $-prefixed attrs to @_, stringifies booleans,
 * and delegates complex children via reshapeComplex.
 */
function reshapeComplex(name: string, obj: Obj): Obj {
  switch (name) {
    case 'TextType':
      return textTypeToXmlShape(obj);
    case 'PrivateCode':
      return privateCodeToXmlShape(obj);
    case 'PassengerCapacityStructure':
      return passengerCapacityStructureToXmlShape(obj);
    case 'KeyValueStructure':
      return keyValueStructureToXmlShape(obj);
    case 'VehicleManoeuvringRequirement':
      return vehicleManoeuvringRequirementToXmlShape(obj);
    default:
      return obj;
  }
}

export function vehicleTypeToXmlShape(obj: Obj): Obj {
  return {
    ...attr(obj, 'id'),
    ...attr(obj, 'version'),
    ...wrapArr(obj, 'keyList', 'KeyValue', 'KeyValueStructure', reshapeComplex),
    ...wrapArr(obj, 'privateCodes', 'PrivateCode', 'PrivateCode', reshapeComplex),
    ...refAttr(obj, 'BrandingRef'),
    ...attr(obj, 'responsibilitySetRef'),
    ...mapArr(obj, 'Name', 'TextType', reshapeComplex),
    ...mapArr(obj, 'ShortName', 'TextType', reshapeComplex),
    ...mapArr(obj, 'Description', 'TextType', reshapeComplex),
    ...child(obj, 'PrivateCode', 'PrivateCode', reshapeComplex),
    ...elem(obj, 'EuroClass'),
    ...elem(obj, 'ReversingDirection'),
    ...elem(obj, 'SelfPropelled'),
    ...elem(obj, 'PropulsionTypes'),
    ...elem(obj, 'PropulsionType'),
    ...elem(obj, 'FuelTypes'),
    ...elem(obj, 'MaximumRange'),
    ...elem(obj, 'MaximumVelocity'),
    ...elem(obj, 'TransportMode'),
    ...child(obj, 'PassengerCapacity', 'PassengerCapacityStructure', reshapeComplex),
    ...refAttr(obj, 'DeckPlanRef'),
    ...elem(obj, 'LowFloor'),
    ...elem(obj, 'HasLiftOrRamp'),
    ...elem(obj, 'HasHoist'),
    ...elem(obj, 'HoistOperatingRadius'),
    ...elem(obj, 'BoardingHeight'),
    ...elem(obj, 'GapToPlatform'),
    ...elem(obj, 'Length'),
    ...elem(obj, 'Width'),
    ...elem(obj, 'Height'),
    ...elem(obj, 'Weight'),
    ...elem(obj, 'FirstAxleHeight'),
    ...elem(obj, 'Monitored'),
    ...refAttr(obj, 'IncludedIn'),
    ...refAttr(obj, 'ClassifiedAsRef'),
    ...childWrapped(obj, 'canManoeuvre', 'VehicleManoeuvringRequirement', reshapeComplex),
  };
}

function textTypeToXmlShape(obj: Obj): Obj {
  return {
    ...text(obj),
    ...attr(obj, 'lang'),
    ...attr(obj, 'textIdType'),
  };
}

function privateCodeToXmlShape(obj: Obj): Obj {
  return {
    ...text(obj),
    ...attr(obj, 'type'),
  };
}

function passengerCapacityStructureToXmlShape(obj: Obj): Obj {
  return {
    ...attr(obj, 'id'),
    ...attr(obj, 'version'),
    ...elem(obj, 'FareClass'),
    ...elem(obj, 'TotalCapacity'),
    ...elem(obj, 'SeatingCapacity'),
    ...elem(obj, 'StandingCapacity'),
    ...elem(obj, 'SpecialPlaceCapacity'),
    ...elem(obj, 'PushchairCapacity'),
    ...elem(obj, 'WheelchairPlaceCapacity'),
    ...elem(obj, 'PramPlaceCapacity'),
    ...elem(obj, 'BicycleRackCapacity'),
  };
}

function keyValueStructureToXmlShape(obj: Obj): Obj {
  return {
    ...elem(obj, 'Key'),
    ...elem(obj, 'Value'),
    ...attr(obj, 'typeOfKey'),
  };
}

function vehicleManoeuvringRequirementToXmlShape(obj: Obj): Obj {
  return {
    ...attr(obj, 'id'),
    ...attr(obj, 'version'),
    ...elem(obj, 'Reversible'),
    ...elem(obj, 'MinimumTurningCircle'),
    ...elem(obj, 'MinimumOvertakingWidth'),
    ...elem(obj, 'MinimumLength'),
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

function child(obj: Obj, key: string, type: string, rc: Reshape) {
  return obj[key] !== undefined ? { [key]: rc(type, obj[key] as Obj) } : {};
}

function childWrapped(obj: Obj, key: string, wrapName: string, rc: Reshape) {
  return obj[key] !== undefined ? { [key]: { [wrapName]: rc(wrapName, obj[key] as Obj) } } : {};
}

function wrapArr(obj: Obj, key: string, childKey: string, type: string, rc: Reshape) {
  const arr = obj[key] as Obj[] | undefined;
  return arr?.length ? { [key]: { [childKey]: arr.map(item => rc(type, item)) } } : {};
}

function mapArr(obj: Obj, key: string, type: string, rc: Reshape) {
  return obj[key] !== undefined ? { [key]: (obj[key] as Obj[]).map(item => rc(type, item)) } : {};
}

function text(obj: Obj) {
  return obj['value'] !== undefined ? { '#text': obj['value'] } : {};
}

function refAttr(obj: Obj, key: string) {
  return obj[key] !== undefined ? { [key]: { '@_ref': obj[key] } } : {};
}
