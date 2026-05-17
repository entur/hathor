/*
 * Project VehicleModel to fast-xml-parser XMLBuilder shape. Most helpers
 * live in `mapping-helpers.ts` and are shared with `Vehicle-mapping`.
 */
import {
  attr,
  baseReshape,
  child,
  elem,
  mapArr,
  refAttr,
  wrapArr,
  type Obj,
  type Reshape,
} from '../../netex/mapping-helpers';

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

const reshapeComplex: Reshape = (name, obj) =>
  name === 'ContactStructure'
    ? contactStructureToXmlShape(obj, reshapeComplex)
    : baseReshape(name, obj, reshapeComplex);

function contactStructureToXmlShape(obj: Obj, rc: Reshape): Obj {
  return {
    ...mapArr(obj, 'ContactPerson', 'TextType', rc),
    ...elem(obj, 'Email'),
    ...elem(obj, 'Phone'),
    ...elem(obj, 'Fax'),
    ...elem(obj, 'Url'),
    ...mapArr(obj, 'FurtherDetails', 'TextType', rc),
    ...refAttr(obj, 'ContactRef'),
  };
}
