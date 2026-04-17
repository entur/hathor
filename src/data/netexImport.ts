import { authHeader, type AccessToken } from '../auth/authUtils.ts';

/**
 * Import NeTEx into Sobek by POSTing raw XML to the import endpoint.
 * Returns the response body on success.
 */
export const importAsNetexToBackend = async (
  applicationImportBaseUrl: string,
  netexXml: string,
  token: AccessToken
): Promise<string> => {
  const response = await fetch(applicationImportBaseUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/xml',
      ...authHeader(token),
    },
    body: netexXml,
  });
  if (!response.ok) {
    throw new Error(`Error importing vehicle data: ${response.statusText}`);
  }
  return response.text();
};
