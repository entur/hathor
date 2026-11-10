import { netexText } from '../../netex/multilingualString.ts';
import type { DeckPlan } from '../types/deckPlanTypes.ts';

/**
 * A deck plan's display name — grid, card, Edit link and page heading (#290): its name,
 * else its id.
 *
 * @param {DeckPlan} dp a listed row or the form's plan
 * @returns {string} the title, `''` for an unnamed create (no id yet)
 */
export const deckPlanTitle = (dp: DeckPlan): string => netexText(dp.name) || dp.id;
