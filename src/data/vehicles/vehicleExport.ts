import { authHeader, type AccessToken } from '../../auth/authUtils.ts';
import { findResourceFrame, toArray, xmlParser } from '../xmlUtils.ts';
import type { ParsedXml } from '../netexTypes.ts';

/** GET a single Vehicle's NeTEx XML from Sobek's export endpoint.
 *  Throws with the response body on non-OK responses. */
export async function fetchVehicleNetexXml(
  applicationImportBaseUrl: string,
  id: string,
  token: AccessToken
): Promise<string> {
  const base = applicationImportBaseUrl.replace(/\/$/, '');
  const url = `${base}/vehicles/${encodeURIComponent(id)}`;
  const res = await fetch(url, {
    method: 'GET',
    headers: { Accept: 'application/xml', ...authHeader(token) },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(body || `Error fetching vehicle ${id}: ${res.statusText}`);
  }
  return res.text();
}

/** Drill the parsed PublicationDelivery for the first `<Vehicle>` element.
 *  Handles both CompositeFrame-wrapped and flat-ResourceFrame shapes. */
export function extractVehicleFromPublicationDelivery(xml: string): Record<string, unknown> | null {
  const parsed = xmlParser.parse(xml);
  const rf = findResourceFrame(parsed);
  if (!rf) return null;
  const vehicles = toArray<ParsedXml>(rf.vehicles?.Vehicle);
  return vehicles[0] ?? null;
}
