import { xmlParser } from '../../vehicle-imports/xmlUtils';

/**
 * Extracts `Vehicle/@id` from an /import response body, supporting both
 * CompositeFrame-wrapped and flat ResourceFrame layouts. Returns null when
 * the response is empty, not XML, or has no Vehicle.
 */
export function parseVehicleImportResponse(body: string): string | null {
  if (!body || !body.trim()) return null;
  let parsed: Record<string, unknown>;
  try {
    parsed = xmlParser.parse(body) as Record<string, unknown>;
  } catch {
    return null;
  }
  const dataObjects = (
    parsed?.PublicationDelivery as { dataObjects?: Record<string, unknown> } | undefined
  )?.dataObjects;
  const rf =
    (dataObjects?.CompositeFrame as { frames?: { ResourceFrame?: Record<string, unknown> } })
      ?.frames?.ResourceFrame ??
    (dataObjects?.ResourceFrame as Record<string, unknown> | undefined);
  if (!rf) return null;
  const vehicleSlot = (rf as { vehicles?: { Vehicle?: unknown } }).vehicles?.Vehicle;
  if (!vehicleSlot) return null;
  const first = Array.isArray(vehicleSlot) ? vehicleSlot[0] : vehicleSlot;
  const id = (first as { '@_id'?: unknown } | undefined)?.['@_id'];
  return typeof id === 'string' && id.length > 0 ? id : null;
}
