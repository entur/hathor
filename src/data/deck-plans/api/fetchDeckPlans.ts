import type { AccessToken } from '../../../auth/index.ts';
import { fetchDeckPlansRequest } from '../../../graphql/vehicles/queries/fetchDeckPlans.ts';
import type { DeckPlanContext } from '../types/deckPlanTypes.ts';
import type { DeckPlan, Name } from '../../vehicle-types/types/vehicleTypeTypes.ts';
import type { Page } from '../../../graphql/paginationTypes.ts';
import { FETCH_ALL_SIZE } from '../../../graphql/paginationTypes.ts';

interface DeckPlanWire {
  netexId: string;
  name?: Name | null;
  version: number;
}

const projectDeckPlan = (dp: DeckPlanWire): DeckPlan => ({
  id: dp.netexId,
  name: dp.name ?? undefined,
  version: dp.version,
});

export const fetchDeckPlans = async (
  applicationBaseUrl: string,
  dataOwnerRef: string,
  token: AccessToken
): Promise<DeckPlanContext> => {
  const raw: { deckPlans: Page<DeckPlanWire> } = await fetchDeckPlansRequest(
    applicationBaseUrl,
    token,
    { size: FETCH_ALL_SIZE, filter: { dataOwnerRef } }
  );
  return { deckPlans: raw.deckPlans.content.map(projectDeckPlan) };
};
