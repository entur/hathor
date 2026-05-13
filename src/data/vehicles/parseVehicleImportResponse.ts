import { XMLParser } from 'fast-xml-parser';

const parser = new XMLParser({ ignoreAttributes: false });

/**
 * Extract the persisted `Vehicle/@id` from an /import response body that
 * echoes the saved NeTEx. Returns `null` when the response is empty, not
 * XML, or doesn't contain a Vehicle in either layout (CompositeFrame-wrapped
 * or flat ResourceFrame).
 *
 * Used by the create-flow after-save to deep-link `/vehicle?selected=<id>`.
 * The D3 fallback (issue #69) is caller-side refetch + locate by
 * `RegistrationNumber` when this returns `null`.
 */
export function parseVehicleImportResponse(body: string): string | null {
  if (!body || !body.trim()) return null;
  let parsed: Record<string, unknown>;
  try {
    parsed = parser.parse(body) as Record<string, unknown>;
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
