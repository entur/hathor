import { deckPlanViewConfig } from './deckPlanViewConfig.ts';
import GenericDataViewPage from '../../pages/GenericDataViewPage.tsx';
import type { DeckPlan } from '../vehicle-types/types/vehicleTypeTypes.ts';
import { useUrlFilters } from '../../hooks/useUrlFilters.ts';
import type { OrderBy } from './useDeckPlans.ts';

export default function DeckPlanView() {
  const { hasUrlFilters, clearUrlFilters, filterCount } = useUrlFilters();
  return (
    <GenericDataViewPage<DeckPlan, OrderBy>
      viewConfig={deckPlanViewConfig}
      urlFilterInfo={{ hasUrlFilters, clearUrlFilters, filterCount }}
    />
  );
}
