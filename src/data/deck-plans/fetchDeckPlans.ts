import type { AccessToken } from '../../auth/index.ts';
import { fetchDeckPlansRequest } from '../../graphql/vehicles/queries/fetchDeckPlans.ts';
import type { DeckPlanContext } from './deckPlanTypes.ts';
import type { DeckPlan } from '../vehicle-types/vehicleTypeTypes.ts';
import type { Page } from '../../types/paginationTypes.ts';
import { FETCH_ALL_SIZE } from '../../types/paginationTypes.ts';

export const fetchDeckPlans = async (
  applicationBaseUrl: string,
  token: AccessToken
): Promise<DeckPlanContext> => {
  const raw: { deckPlans: Page<DeckPlan> } = await fetchDeckPlansRequest(
    applicationBaseUrl,
    token,
    { size: FETCH_ALL_SIZE }
  );
  return { deckPlans: raw.deckPlans.content };
};
