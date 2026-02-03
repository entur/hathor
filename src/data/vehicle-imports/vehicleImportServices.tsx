import { authHeader, type AccessToken } from '../../auth';

/**
 * Fetch NeTEx XML for a single vehicle from the Autosys registry.
 * Throws with the response body (or statusText) on non-OK responses so that
 * downstream error translation can match known backend error patterns.
 */
export const fetchVehicleFromAutosys = async (
  applicationGetAutosysUrl: string,
  registrationNumber: string,
  token: AccessToken
): Promise<string> => {
  const response = await fetch(`${applicationGetAutosysUrl}${registrationNumber}`, {
    method: 'GET',
    headers: authHeader(token),
  });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(body || `Error fetching vehicle data: ${response.statusText}`);
  }
  const data = await response.text();
  return data;
};

/**
 * Import a vehicle into Sobek by POSTing its NeTEx XML to the import endpoint.
 * Returns the response body on success.
 */
export const importVehicle = async (
  applicationImportBaseUrl: string,
  vehicleData: string,
  token: AccessToken
): Promise<string> => {
  const response = await fetch(`${applicationImportBaseUrl}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/xml',
      ...authHeader(token),
    },
    body: vehicleData,
  });
  if (!response.ok) {
    throw new Error(`Error importing vehicle data: ${response.statusText}`);
  }
  const data = await response.text();
  return data;
};
