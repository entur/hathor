import type { MultilingualString } from '../../netex/multilingualString.ts';

export type DeckPlan = {
  id: string;
  version?: number;
  name?: MultilingualString;
  description?: MultilingualString;
};

export type DeckPlanContext = {
  deckPlans: DeckPlan[];
};
