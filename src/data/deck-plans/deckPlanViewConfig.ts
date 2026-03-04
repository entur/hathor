import { createElement } from 'react';
import Link from '@mui/material/Link';
import { useDeckPlans, type OrderBy } from './useDeckPlans';
import { useDataViewSearch } from '../../hooks/useDataViewSearch.ts';
import { useDataViewTableLogic } from '../../hooks/useDataViewTableLogic.ts';
import DataPageContent from '../../components/data/DataPageContent.tsx';
import type { ColumnDefinition } from '../../components/data/dataTableTypes.ts';
import type { FilterDefinition } from '../../components/search/searchTypes.ts';
import type { DeckPlan } from '../vehicle-types/vehicleTypeTypes.ts';

/**
 * Defines the columns for the DeckPlan data table.
 */
const DeckPlanColumns: ColumnDefinition<DeckPlan, OrderBy>[] = [
  {
    id: 'id',
    headerLabel: 'ID',
    isSortable: true,
    renderCell: item => item.id,
    display: 'always',
  },
  {
    id: 'name',
    headerLabel: 'Deck Plan',
    isSortable: true,
    renderCell: item => item.name?.value,
    display: 'always',
  },
  {
    id: 'edit',
    headerLabel: 'Edit',
    isSortable: false,
    renderCell: item => createElement(Link, { href: `/deck-plans/${item.id}` }, 'Edit'),
    display: 'always',
  },
];

/**
 * A function to extract the key used for filtering DeckPlans by category.
 */
const getDeckPlanFilterKey = (item: DeckPlan): string => {
  return item.id;
};

/**
 * A function to get the specific value from a DeckPlan for sorting.
 */
const getDeckPlanSortValue = (item: DeckPlan, key: OrderBy): string | number => {
  switch (key) {
    case 'name':
      return item.name?.value || '';
    case 'id':
      return item.id;
    default:
      return '';
  }
};
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
export const deckPlanViewConfig = {
  useData: useDeckPlans,
  useSearchRegistration: useDataViewSearch<DeckPlan>,
  useTableLogic: useDataViewTableLogic,
  PageContentComponent: DataPageContent,
  columns: DeckPlanColumns,
  getFilterKey: getDeckPlanFilterKey,
  getSortValue: getDeckPlanSortValue,
  filters: DeckPlanFilters,
  title: 'Deck Plans',
};
