import { getDeckPlanViewConfig } from '../data/deck-plans/deckPlanViewConfig.ts';
import GenericDataViewPage from './GenericDataViewPage.tsx';
import type { DeckPlan } from '../data/vehicle-types/vehicleTypeTypes.ts';
import { useUrlFilters } from '../hooks/useUrlFilters.ts';
import type { OrderBy } from '../data/deck-plans/useDeckPlans.ts';
import { useNavigate } from 'react-router-dom';

export default function DeckPlanView() {
  const { hasUrlFilters, clearUrlFilters, filterCount } = useUrlFilters();
  const navigate = useNavigate();

  return (
    <GenericDataViewPage<DeckPlan, OrderBy>
      viewConfig={{ ...getDeckPlanViewConfig(navigate) }}
      urlFilterInfo={{ hasUrlFilters, clearUrlFilters, filterCount }}
    />
  );
}
