import { authHeader, type AccessToken } from '../../auth';

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
    throw new Error(`Error fetching vehicle data: ${response.statusText}`);
  }
  const data = await response.text();
  return data;
};

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
    throw new Error(`Error impor vehicle data: ${response.statusText}`);
  }
  const data = await response.text();
  return data;
};
