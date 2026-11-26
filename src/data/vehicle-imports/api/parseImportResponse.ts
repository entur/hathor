import { entityIds, findResourceFrame, xmlParser } from '../../netex/xmlUtils';

export function extractVehicleTypeIds(xml: string): string[] {
  const rf = findResourceFrame(xmlParser.parse(xml));
  return rf ? [...entityIds(rf, 'vehicleTypes', 'VehicleType')] : [];
}
