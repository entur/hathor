import type { DeckPlan } from '../types/deckPlanTypes.ts';
import { netexName } from '../../netex/multilingualString.ts';

/**
 * Canonical editable projection of a DeckPlan: name and description trimmed
 * (blank → absent, lang kept) and always last, so two equal forms stringify
 * equal. Sobek re-pads `<Text>` on serialize (sobek#180), so hydrating an
 * untrimmed record would read as dirty the moment the editor opens — the
 * editor applies this both on hydrate and in the dirty compare.
 *
 * @param {DeckPlan} dp - Deck plan as fetched or as edited.
 * @returns {DeckPlan} The same deck plan with trimmed name and description.
 */
export const normaliseDeckPlan = ({ name, description, ...rest }: DeckPlan): DeckPlan => ({
  ...rest,
  name: netexName(name),
  description: netexName(description),
});
