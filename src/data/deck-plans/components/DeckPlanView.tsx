import { deckPlanViewConfig } from './deckPlanViewConfig.tsx';
import GenericDataViewPage from '../../../pages/GenericDataViewPage.tsx';
import type { DeckPlan } from '../types/deckPlanTypes.ts';
import { useUrlFilters } from '../../../hooks/useUrlFilters.ts';
import type { OrderBy } from '../hooks/useDeckPlans.ts';
import NewEntityFab from '../../../components/NewEntityFab.tsx';
import { useTranslation } from 'react-i18next';

export default function DeckPlanView() {
  const { hasUrlFilters, clearUrlFilters, filterCount } = useUrlFilters();
  const { t } = useTranslation();
  return (
    <GenericDataViewPage<DeckPlan, OrderBy>
      viewConfig={{
        ...deckPlanViewConfig,
        addAction: (
          <NewEntityFab
            label={t('deckPlans.actions.new')}
            to="/deck-plans?selected=new"
            testid="create-deck-plan-fab"
          />
        ),
      }}
      urlFilterInfo={{ hasUrlFilters, clearUrlFilters, filterCount }}
    />
  );
}
