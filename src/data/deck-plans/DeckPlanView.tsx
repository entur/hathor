import { getDeckPlanViewConfig } from './deckPlanViewConfig.ts';
import GenericDataViewPage from '../../pages/GenericDataViewPage.tsx';
import type { DeckPlan } from '../vehicle-types/types/vehicleTypeTypes.ts';
import { useUrlFilters } from '../../hooks/useUrlFilters.ts';
import type { OrderBy } from './useDeckPlans.ts';
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
