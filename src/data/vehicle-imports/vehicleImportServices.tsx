export const fetchVehicleFromAutosys = async (
  applicationGetAutosysUrl: string,
  registrationNumber: string,
  token: string
): Promise<string> => {
  const response = await fetch(`${applicationGetAutosysUrl}${registrationNumber}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
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
  token: string
): Promise<string> => {
  const response = await fetch(`${applicationImportBaseUrl}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/xml',
      Authorization: `Bearer ${token}`,
    },
    body: vehicleData,
  });
  if (!response.ok) {
    throw new Error(`Error impor vehicle data: ${response.statusText}`);
  }
  const data = await response.text();
  return data;
};
