import { deckPlanViewConfig } from '../data/deck-plans/deckPlanViewConfig.ts';
import GenericDataViewPage from './GenericDataViewPage.tsx';
import type { DeckPlan } from '../data/vehicle-types/vehicleTypeTypes.ts';
import { useUrlFilters } from '../hooks/useUrlFilters.ts';
import type { OrderBy } from '../data/deck-plans/useDeckPlans.ts';

export default function DeckPlanView() {
  const { hasUrlFilters, clearUrlFilters, filterCount } = useUrlFilters();

  return (
    <GenericDataViewPage<DeckPlan, OrderBy>
      viewConfig={{ ...deckPlanViewConfig }}
      urlFilterInfo={{ hasUrlFilters, clearUrlFilters, filterCount }}
    />
  );
}
