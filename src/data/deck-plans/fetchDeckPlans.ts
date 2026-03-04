import type { AccessToken } from '../../auth/index.ts';
import { fetchDeckPlansRequest } from '../../graphql/vehicles/queries/fetchDeckPlans.ts';
import type { DeckPlanContext } from './deckPlanTypes.ts';

let fetchedDeckPlans: DeckPlanContext | undefined = undefined;

export const fetchDeckPlans = async (
  applicationBaseUrl: string,
  token: AccessToken
): Promise<DeckPlanContext> => {
  fetchedDeckPlans = await fetchDeckPlansRequest(applicationBaseUrl, token);

  return Object.assign({}, fetchedDeckPlans);
};
