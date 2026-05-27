import type { AccessToken } from '../../auth/index.ts';
import { fetchDeckPlansRequest } from '../../graphql/vehicles/queries/fetchDeckPlans.ts';
import type { DeckPlanContext } from './deckPlanTypes.ts';
import type { DeckPlan, Name } from '../vehicle-types/vehicleTypeTypes.ts';
import type { Page } from '../../graphql/paginationTypes.ts';
import { FETCH_ALL_SIZE } from '../../graphql/paginationTypes.ts';

interface DeckPlanWire {
  netexId: string;
  name?: Name | null;
}

const projectDeckPlan = (dp: DeckPlanWire): DeckPlan => ({
  id: dp.netexId,
  name: dp.name ?? undefined,
});

export const fetchDeckPlans = async (
  applicationBaseUrl: string,
  token: AccessToken
): Promise<DeckPlanContext> => {
  const raw: { deckPlans: Page<DeckPlanWire> } = await fetchDeckPlansRequest(
    applicationBaseUrl,
    token,
    { size: FETCH_ALL_SIZE }
  );
  return { deckPlans: raw.deckPlans.content.map(projectDeckPlan) };
};
