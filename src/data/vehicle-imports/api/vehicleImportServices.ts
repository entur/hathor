import { authHeader, type AccessToken } from '../../../auth';
import type { ImportEntry } from '../types/importTypes';
import { VEHICLE_TYPE_KIND } from '../../vehicle-types/types/vehicleTypeTypes.ts';

/**
 * Fetch NeTEx XML for many vehicles in one request to shepet's bulk endpoint.
 * Shepet owns the document: it dedupes entities, sets `OperationalNumber` from
 * the input and stamps `dataOwnerRef` as the frame's owning ResponsibilitySet.
 * A plate that fails still yields a 200; its error sits in the ResourceFrame's
 * `keyList` (see `assembleAutosysResults`).
 *
 * @param {string} motorVehicleRegistryProxy - Bulk endpoint URL from config.
 * @param {string} dataOwnerRef - NeTEx id of the organisation that will own the import.
 * @param {ImportEntry[]} entries - Plates to fetch, with optional operational numbers.
 * @param {AccessToken} token - Bearer token.
 * @returns {Promise<string>} The `PublicationDelivery` XML.
 * @throws {Error} With the response body (or statusText) on a non-OK response.
 */
export const fetchVehiclesFromAutosys = async (
  motorVehicleRegistryProxy: string,
  dataOwnerRef: string,
  entries: ImportEntry[],
  token: AccessToken
): Promise<string> => {
  const url = new URL(motorVehicleRegistryProxy);
  url.searchParams.set('dataOwner', dataOwnerRef);
  const body = entries.map(({ queryRegNumber, operationalRef }) => ({
    registrationNumber: queryRegNumber,
    ...(operationalRef && { operationalNumber: operationalRef }),
  }));
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeader(token) },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(errorBody || `Error fetching vehicle data: ${response.statusText}`);
  }
  return response.text();
};

/**
 * Import a vehicle into Sobek by POSTing its NeTEx XML to the import endpoint.
 * Returns the response body on success.
 *
 * @param {string} applicationImportBaseUrl - Sobek NeTEx import URL from config.
 * @param {string} vehicleData - The `PublicationDelivery` XML to import.
 * @param {AccessToken} token - Bearer token.
 * @returns {Promise<string>} The import response XML.
 * @throws {Error} With the response body (or statusText) on a non-OK response.
 */
export const importAsNetexToBackend = async (
  applicationImportBaseUrl: string,
  vehicleData: string,
  token: AccessToken
): Promise<string> => {
  const url = new URL(applicationImportBaseUrl);
  // Sobek requires it (400 without): NeTEx has no field for a vehicle type's kind.
  url.searchParams.set('vehicleTypeKind', VEHICLE_TYPE_KIND);
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/xml',
      ...authHeader(token),
    },
    body: vehicleData,
  });
  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(errorBody || `Error importing vehicle data: ${response.statusText}`);
  }
  const data = await response.text();
  return data;
};
