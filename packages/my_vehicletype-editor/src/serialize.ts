import { XMLBuilder } from 'fast-xml-parser';
import type {
  My_VehicleType,
  TextType,
  PrivateCodeStructure,
  PassengerCapacityStructure,
  VehicleManoeuvringRequirements_STUB,
  KeyValueStructure,
} from './generated/types.js';

const builder = new XMLBuilder({
  format: true,
  indentBy: '  ',
});

function serializeKeyValueStructure(obj: Partial<KeyValueStructure>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  if (obj.key !== undefined) out['Key'] = obj.key;
  if (obj.value !== undefined) out['Value'] = obj.value;
  if (obj.typeOfKey !== undefined) out['TypeOfKey'] = obj.typeOfKey;
  return out;
}

function serializePrivateCodeStructure(
  obj: Partial<PrivateCodeStructure>
): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  if (obj.value !== undefined) out['Value'] = obj.value;
  if (obj.type !== undefined) out['Type'] = obj.type;
  return out;
}

function serializeTextType(obj: Partial<TextType>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  if (obj.value !== undefined) out['Value'] = obj.value;
  if (obj.lang !== undefined) out['Lang'] = obj.lang;
  if (obj.textIdType !== undefined) out['TextIdType'] = obj.textIdType;
  return out;
}

function serializePassengerCapacityStructure(
  obj: Partial<PassengerCapacityStructure>
): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  if (obj.fareClass !== undefined) out['FareClass'] = obj.fareClass;
  if (obj.totalCapacity !== undefined) out['TotalCapacity'] = obj.totalCapacity;
  if (obj.seatingCapacity !== undefined) out['SeatingCapacity'] = obj.seatingCapacity;
  if (obj.standingCapacity !== undefined) out['StandingCapacity'] = obj.standingCapacity;
  if (obj.specialPlaceCapacity !== undefined)
    out['SpecialPlaceCapacity'] = obj.specialPlaceCapacity;
  if (obj.pushchairCapacity !== undefined) out['PushchairCapacity'] = obj.pushchairCapacity;
  if (obj.wheelchairPlaceCapacity !== undefined)
    out['WheelchairPlaceCapacity'] = obj.wheelchairPlaceCapacity;
  if (obj.pramPlaceCapacity !== undefined) out['PramPlaceCapacity'] = obj.pramPlaceCapacity;
  if (obj.bicycleRackCapacity !== undefined) out['BicycleRackCapacity'] = obj.bicycleRackCapacity;
  return out;
}

function serializeVehicleManoeuvringRequirements_STUB(
  obj: Partial<VehicleManoeuvringRequirements_STUB>
): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  if (obj.reversible !== undefined) out['Reversible'] = obj.reversible;
  if (obj.minimumTurningCircle !== undefined)
    out['MinimumTurningCircle'] = obj.minimumTurningCircle;
  if (obj.minimumOvertakingWidth !== undefined)
    out['MinimumOvertakingWidth'] = obj.minimumOvertakingWidth;
  if (obj.minimumLength !== undefined) out['MinimumLength'] = obj.minimumLength;
  return out;
}

/**
 * Serialize a My_VehicleType object to an XML string.
 */
export function serialize(obj: Partial<My_VehicleType>): string {
  const xmlObj: Record<string, unknown> = {};
  if (obj.name !== undefined) xmlObj['Name'] = obj.name.map(item => serializeTextType(item));
  if (obj.shortName !== undefined)
    xmlObj['ShortName'] = obj.shortName.map(item => serializeTextType(item));
  if (obj.description !== undefined)
    xmlObj['Description'] = obj.description.map(item => serializeTextType(item));
  if (obj.privateCode !== undefined)
    xmlObj['PrivateCode'] = serializePrivateCodeStructure(obj.privateCode);
  if (obj.transportMode !== undefined) xmlObj['TransportMode'] = obj.transportMode;
  if (obj.deckPlanRef !== undefined) xmlObj['DeckPlanRef'] = obj.deckPlanRef;
  if (obj.euroClass !== undefined) xmlObj['EuroClass'] = obj.euroClass;
  if (obj.reversingDirection !== undefined)
    xmlObj['ReversingDirection'] = String(obj.reversingDirection);
  if (obj.selfPropelled !== undefined) xmlObj['SelfPropelled'] = String(obj.selfPropelled);
  if (obj.propulsionTypes !== undefined) xmlObj['PropulsionTypes'] = obj.propulsionTypes;
  if (obj.propulsionType !== undefined) xmlObj['PropulsionType'] = obj.propulsionType;
  if (obj.fuelTypes !== undefined) xmlObj['FuelTypes'] = obj.fuelTypes;
  if (obj.maximumRange !== undefined) xmlObj['MaximumRange'] = obj.maximumRange;
  if (obj.maximumVelocity !== undefined) xmlObj['MaximumVelocity'] = obj.maximumVelocity;
  if (obj.fuelType !== undefined) xmlObj['FuelType'] = obj.fuelType;
  if (obj.typeOfFuel !== undefined) xmlObj['TypeOfFuel'] = obj.typeOfFuel;
  if (obj.passengerCapacity !== undefined)
    xmlObj['PassengerCapacity'] = serializePassengerCapacityStructure(obj.passengerCapacity);
  if (obj.id !== undefined) xmlObj['Id'] = obj.id;
  if (obj.includedIn !== undefined) xmlObj['IncludedIn'] = obj.includedIn;
  if (obj.classifiedAsRef !== undefined) xmlObj['ClassifiedAsRef'] = obj.classifiedAsRef;
  if (obj.facilities !== undefined) xmlObj['Facilities'] = obj.facilities;
  if (obj.monitored !== undefined) xmlObj['Monitored'] = String(obj.monitored);
  if (obj.lowFloor !== undefined) xmlObj['LowFloor'] = String(obj.lowFloor);
  if (obj.hasLiftOrRamp !== undefined) xmlObj['HasLiftOrRamp'] = String(obj.hasLiftOrRamp);
  if (obj.hasHoist !== undefined) xmlObj['HasHoist'] = String(obj.hasHoist);
  if (obj.hoistOperatingRadius !== undefined)
    xmlObj['HoistOperatingRadius'] = obj.hoistOperatingRadius;
  if (obj.boardingHeight !== undefined) xmlObj['BoardingHeight'] = obj.boardingHeight;
  if (obj.gapToPlatform !== undefined) xmlObj['GapToPlatform'] = obj.gapToPlatform;
  if (obj.length !== undefined) xmlObj['Length'] = obj.length;
  if (obj.width !== undefined) xmlObj['Width'] = obj.width;
  if (obj.height !== undefined) xmlObj['Height'] = obj.height;
  if (obj.weight !== undefined) xmlObj['Weight'] = obj.weight;
  if (obj.firstAxleHeight !== undefined) xmlObj['FirstAxleHeight'] = obj.firstAxleHeight;
  if (obj.canCarry !== undefined) xmlObj['CanCarry'] = obj.canCarry;
  if (obj.canManoeuvre !== undefined)
    xmlObj['CanManoeuvre'] = serializeVehicleManoeuvringRequirements_STUB(obj.canManoeuvre);
  if (obj.satisfiesFacilityRequirements !== undefined)
    xmlObj['SatisfiesFacilityRequirements'] = obj.satisfiesFacilityRequirements;
  if (obj.keyList !== undefined)
    xmlObj['KeyList'] = obj.keyList.map(item => serializeKeyValueStructure(item));
  if (obj.privateCodes !== undefined)
    xmlObj['PrivateCodes'] = obj.privateCodes.map(item => serializePrivateCodeStructure(item));
  if (obj.brandingRef !== undefined) xmlObj['BrandingRef'] = obj.brandingRef;
  if (obj.responsibilitySetRef !== undefined)
    xmlObj['ResponsibilitySetRef'] = obj.responsibilitySetRef;
  return builder.build({ My_VehicleType: xmlObj }) as string;
}
