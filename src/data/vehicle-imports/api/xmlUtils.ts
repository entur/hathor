import { type ParsedXml, findResourceFrame, toArray, xmlParser } from '../../netex/xmlUtils';

/**
 * Collect the `@_id`s of one entity collection in a ResourceFrame.
 *
 * @param {ParsedXml} rf - A parsed ResourceFrame.
 * @param {string} section - Collection element, e.g. `vehicleTypes`.
 * @param {string} element - Entity element, e.g. `VehicleType`.
 * @returns {Set<string>} The ids, deduplicated.
 */
export const entityIds = (rf: ParsedXml, section: string, element: string): Set<string> =>
  new Set(
    toArray<ParsedXml>(rf[section]?.[element])
      .map(e => e['@_id'])
      .filter(Boolean)
  );

export function extractVehicleTypeIds(xml: string): string[] {
  const rf = findResourceFrame(xmlParser.parse(xml));
  return rf ? [...entityIds(rf, 'vehicleTypes', 'VehicleType')] : [];
}
