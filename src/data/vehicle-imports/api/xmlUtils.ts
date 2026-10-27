import { findResourceFrame, toArray, xmlParser } from '../../netex/xmlUtils';

export function extractVehicleTypeIds(xml: string): string[] {
  const parsed = xmlParser.parse(xml);
  const rf = findResourceFrame(parsed);
  if (!rf) return [];
  return toArray(rf.vehicleTypes?.VehicleType)
    .map(vt => vt['@_id'])
    .filter(Boolean);
}
