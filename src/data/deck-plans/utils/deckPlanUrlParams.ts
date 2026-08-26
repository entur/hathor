/** Query-param key on `/deck-plans` driving the deep-link slider — mirrors `/vehicle-types` and `/vehicles`. */
export const DECK_PLAN_SELECTED_PARAM = 'selected';

/** Build the `/deck-plans?selected=<id>` href for a DeckPlan row id. */
export const deckPlanSelectedHref = (id: string): string =>
  `/deck-plans?${DECK_PLAN_SELECTED_PARAM}=${encodeURIComponent(id)}`;
