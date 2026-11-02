import i18next from 'i18next';
import { XMLBuilder } from 'fast-xml-parser';
import { authHeader, type AccessToken } from '../../../auth';
import { addDataOwnerRefToFrame, findResourceFrame, xmlParser } from '../../netex/xmlUtils';

/**
 * Fetch NeTEx XML for a single deck plan from Sobek
 * Throws with the response body (or statusText) on non-OK responses so that
 * downstream error translation can match known backend error patterns.
 *
 * @param {string} applicationNeTExBaseUrl - Sobek NeTEx base URL from config.
 * @param {string} dataOwnerRef - NeTEx id of the owning organisation; Sobek requires it and
 *   treats a deck plan owned by anyone else as not found.
 * @param {string} id - NeTEx id of the deck plan.
 * @param {AccessToken} token - Bearer token.
 * @returns {Promise<string>} The `PublicationDelivery` XML.
 */
export const fetchDeckPlanDetails = async (
  applicationNeTExBaseUrl: string,
  dataOwnerRef: string,
  id: string,
  token: AccessToken
): Promise<string> => {
  const url = new URL(`${applicationNeTExBaseUrl}/deckplans/${encodeURIComponent(id)}`);
  url.searchParams.set('dataOwner', dataOwnerRef);
  const response = await fetch(url, {
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
  // Verbatim: this re-serializes the whole document to graft the owning
  // organisation on, so coercing text here would undo patchDeckPlanXml's
  // care with the geometry.
  const xml = xmlParser.parse(deckPlanData);
  if (!xml) {
    throw new Error(i18next.t('deckPlans.invalidXml'));
  }
  const resourceFrame = findResourceFrame(xml);
  if (!resourceFrame) {
    throw new Error(i18next.t('deckPlans.noResourceFrame'));
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
