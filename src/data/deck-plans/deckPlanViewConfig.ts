import { createElement } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDeckPlans, type OrderBy } from './useDeckPlans';
import { useDataViewSearch } from '../../hooks/useDataViewSearch.ts';
import { useDataViewTableLogic } from '../../hooks/useDataViewTableLogic.ts';
import DataPageContent from '../../components/data/DataPageContent.tsx';
import NetexId from '../netex/NetexId.tsx';
import type { ColumnDefinition } from '../../components/data/dataTableTypes.ts';
import type { FilterDefinition } from '../../components/search/searchTypes.ts';
import type { DeckPlan } from '../vehicle-types/types/vehicleTypeTypes.ts';
import { getDeckPlanSortValue } from './deckPlanSortValue.ts';

const deckPlanColumns: ColumnDefinition<DeckPlan, OrderBy>[] = [
  {
    id: 'id',
    headerLabel: 'ID',
    isSortable: true,
    renderCell: item => createElement(NetexId, { id: item.id, size: 'small' }),
    display: 'always',
  },
  {
    id: 'name',
    headerLabel: 'Deck Plan',
    isSortable: true,
    renderCell: item => item.name?.value,
    display: 'always',
  },
];

const getDeckPlanFilterKey = (item: DeckPlan): string => item.id;

const DeckPlanFilters: FilterDefinition[] = [
  { id: 'parentDeckPlan', labelKey: 'types.parent', defaultLabel: 'Parent Vehicle Type' },
  { id: 'railVehicle', labelKey: 'types.train', defaultLabel: 'Train' },
  { id: 'metroVehicle', labelKey: 'types.metro', defaultLabel: 'Metro' },
  { id: 'onstreetBus', labelKey: 'types.bus', defaultLabel: 'Bus' },
  { id: 'onstreetTram', labelKey: 'types.tram', defaultLabel: 'Tram' },
  { id: 'ferryStop', labelKey: 'types.ferry', defaultLabel: 'Ferry' },
  { id: 'harbourPort', labelKey: 'types.harbour', defaultLabel: 'Harbour' },
  { id: 'liftStation', labelKey: 'types.lift', defaultLabel: 'Lift' },
];

/** Whole-row click opens the route-based deck-plan editor at `/deck-plans/<id>`. */
const useDeckPlanRowClick = () => {
  const navigate = useNavigate();
  return (item: DeckPlan) => navigate(`/deck-plans/${encodeURIComponent(item.id)}`);
};

export const deckPlanViewConfig = {
  useData: useDeckPlans,
  useSearchRegistration: useDataViewSearch<DeckPlan>,
  useTableLogic: useDataViewTableLogic,
  PageContentComponent: DataPageContent,
  columns: deckPlanColumns,
  getFilterKey: getDeckPlanFilterKey,
  getSortValue: getDeckPlanSortValue,
  filters: () => DeckPlanFilters,
  titleKey: 'deckPlans.title',
  useRowClick: useDeckPlanRowClick,
};
