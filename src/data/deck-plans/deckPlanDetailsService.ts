import { XMLBuilder } from 'fast-xml-parser';
import { authHeader, type AccessToken } from '../../auth';
import { addDataOwnerRefToFrame, findResourceFrame, xmlParser } from '../netex/xmlUtils';

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
  const response = await fetch(`${applicationNeTExBaseUrl}/deckplans/${encodeURIComponent(id)}`, {
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
  dataOwnerRef: string,
  deckPlanData: string,
  token: AccessToken
): Promise<string> => {
  const xml = xmlParser.parse(deckPlanData);
  if (!xml) {
    throw new Error('Invalid XML data');
  }
  const resourceFrame = findResourceFrame(xml);
  if (!resourceFrame) {
    throw new Error('No ResourceFrame found in XML data');
  }
  const builder = new XMLBuilder({
    ignoreAttributes: false,
    format: true,
    suppressEmptyNode: true,
  });
  addDataOwnerRefToFrame(
    xml.PublicationDelivery?.dataObjects?.CompositeFrame ?? resourceFrame,
    resourceFrame,
    dataOwnerRef
  );
  const response = await fetch(`${applicationImportBaseUrl}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/xml',
      ...authHeader(token),
    },
    body: builder.build(xml),
  });
  if (!response.ok) {
    throw new Error(`Error importing deck plan data: ${response.statusText}`);
  }
  const data = await response.text();
  return data;
};
