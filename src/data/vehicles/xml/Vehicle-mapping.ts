/*
 * Project Vehicle to fast-xml-parser XMLBuilder shape. Most helpers live
 * in `mapping-helpers.ts` and are shared with `VehicleModel-mapping`.
 */
import {
  attr,
  baseReshape,
  child,
  elem,
  mapArr,
  privateCodeStructureToXmlShape,
  refAttr,
  wrapArr,
  type Obj,
  type Reshape,
} from '../../netex/mapping-helpers';

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

const reshapeComplex: Reshape = (name, obj) =>
  name === 'PrivateCode'
    ? privateCodeStructureToXmlShape(obj, reshapeComplex)
    : baseReshape(name, obj, reshapeComplex);
