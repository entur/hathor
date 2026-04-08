import type { DeckPlan } from '../vehicle-types/vehicleTypeTypes';

export type DeckPlanContext = {
  deckPlans: DeckPlan[];
};

export type DeckPlanPage = {
  content: DeckPlan[];
  totalElements: number;
  page: number;
  size: number;
};
