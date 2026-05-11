import type { DeckPlan } from '../vehicle-types/vehicleTypeTypes.ts';
import type { OrderBy } from './useDeckPlans.ts';
import { compareWithEmptyLast } from '../../utils/compareWithEmptyLast.ts';

/**
 * Resolve the sort value for a DeckPlan column key. Optional NeTEx fields
 * collapse to '' so the empty-last comparator can park missing rows at the end.
 *
 * @param item Deck plan row.
 * @param key Active sort column.
 * @returns String|number suitable for comparison.
 */
export const getDeckPlanSortValue = (item: DeckPlan, key: OrderBy): string | number => {
  switch (key) {
    case 'name':
      return item.name?.value || '';
    case 'id':
      return item.id;
    default: {
      const _exhaustive: never = key;
      return _exhaustive;
    }
  }
};

export const compareDeckPlans = compareWithEmptyLast(getDeckPlanSortValue);
