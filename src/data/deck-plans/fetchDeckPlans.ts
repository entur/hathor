import type { AccessToken } from '../../auth/index.ts';
import { fetchDeckPlansRequest } from '../../graphql/vehicles/queries/fetchDeckPlans.ts';
import type { DeckPlanContext, DeckPlanPage } from './deckPlanTypes.ts';

export const fetchDeckPlans = async (
  applicationBaseUrl: string,
  token: AccessToken
): Promise<DeckPlanContext> => {
  const raw: { deckPlans: DeckPlanPage } = await fetchDeckPlansRequest(applicationBaseUrl, token, {
    size: 10000,
  });
  return { deckPlans: raw.deckPlans.content };
};
