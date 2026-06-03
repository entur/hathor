import type { DeckPlan } from '../types/vehicleTypeTypes.ts';

/**
 * Display label for a VehicleType's deck plan in the table column: the deck-plan
 * name, or — when the name is empty/whitespace (Sobek serialises an empty NeTEx
 * name as a whitespace string, sobek#121) — the NeTEx id in parentheses so the
 * cell isn't blank. Empty string when the VehicleType has no deck plan.
 *
 * @param deckPlan The VehicleType's deck plan, if any.
 * @returns The column label.
 */
export const deckPlanLabel = (deckPlan?: DeckPlan): string =>
  deckPlan ? deckPlan.name?.value?.trim() || `(${deckPlan.id})` : '';
