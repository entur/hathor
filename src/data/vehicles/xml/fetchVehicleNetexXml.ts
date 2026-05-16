import { authHeader, type AccessToken } from '../../../auth';

/**
 * Fetch one Vehicle as NeTEx PublicationDelivery XML from Sobek.
 *
 * Calls `GET ${applicationImportBaseUrl}/vehicles/{id}` with
 * `Accept: application/xml`. Unknown ids return an empty ResourceFrame
 * (200 with no `<Vehicle>`) — caller distinguishes via `parseVehicleXml`
 * returning `null`. Throws on non-2xx with body text in the message.
 */
export async function fetchVehicleNetexXml(
  applicationImportBaseUrl: string,
  id: string,
  token: AccessToken
): Promise<string> {
  const response = await fetch(`${applicationImportBaseUrl}/vehicles/${encodeURIComponent(id)}`, {
    method: 'GET',
    headers: { Accept: 'application/xml', ...authHeader(token) },
  });
  if (!response.ok) {
    const body = await response.text().catch(() => '');
    throw new Error(body || `Error fetching vehicle ${id}: ${response.statusText}`);
  }
  return response.text();
}
