import { authHeader, type AccessToken } from '../../auth';

/**
 * Fetch NeTEx XML for a single deck plan from Sobek
 * Throws with the response body (or statusText) on non-OK responses so that
 * downstream error translation can match known backend error patterns.
 */
export const fetchDeckPlanDetails = async (
  applicationNeTExBaseUrl: string,
  id: string,
  token: AccessToken
): Promise<string> => {
  const response = await fetch(`${applicationNeTExBaseUrl}/deckplans/${id}`, {
    method: 'GET',
    headers: authHeader(token),
  });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(body || `Error fetching deck plan data: ${response.statusText}`);
  }
  const data = await response.text();
  return data;
};

/**
 * Import a deck plan into Sobek by POSTing its NeTEx XML to the import endpoint.
 * Returns the response body on success.
 */
export const saveDeckPlanAsNetexToBackend = async (
  applicationImportBaseUrl: string,
  deckPlanData: string,
  token: AccessToken
): Promise<string> => {
  const response = await fetch(`${applicationImportBaseUrl}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/xml',
      ...authHeader(token),
    },
    body: deckPlanData,
  });
  if (!response.ok) {
    throw new Error(`Error importing deck plan data: ${response.statusText}`);
  }
  const data = await response.text();
  return data;
};
