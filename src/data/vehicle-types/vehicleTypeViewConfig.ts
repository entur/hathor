import { useVehicleTypes } from './useVehicleTypes.ts';
import { useDataViewSearch } from '../../hooks/useDataViewSearch.ts';
import { useDataViewTableLogic } from '../../hooks/useDataViewTableLogic.ts';
import DataPageContent from '../../components/data/DataPageContent.tsx';
import type { ColumnDefinition } from '../../components/data/dataTableTypes.ts';
import type { OrderBy } from './useVehicleTypes.ts';
import type { FilterDefinition } from '../../components/search/searchTypes.ts';
import type { VehicleType } from './vehicleTypeTypes.ts';

/**
 * Defines the columns for the VehicleType data table.
 */
const vehicleTypeColumns: ColumnDefinition<VehicleType, OrderBy>[] = [
  {
    id: 'id',
    headerLabel: 'ID',
    isSortable: true,
    renderCell: item => item.id,
    display: 'always',
  },
  {
    id: 'length',
    headerLabel: 'Length',
    isSortable: true,
    renderCell: item => item.length,
    display: 'always',
  },
  {
    id: 'height',
    headerLabel: 'Height',
    isSortable: true,
    renderCell: item => item.height,
    display: 'always',
  },
  {
    id: 'width',
    headerLabel: 'Width',
    isSortable: true,
    renderCell: item => item.width,
    display: 'always',
  },
  {
    id: 'deckPlanName',
    headerLabel: 'Deck Plan',
    isSortable: true,
    renderCell: item => item.deckPlan?.name?.value,
    display: 'always',
  },
  {
    id: 'vehicles',
    headerLabel: 'Vehicles',
    isSortable: false,
    renderCell: item => item.vehicles?.map(vehicle => vehicle.registrationNumber).join(', ') || '',
    display: 'always',
  },
];

/**
 * A function to extract the key used for filtering Products by category.
 */
const getVehicleTypeFilterKey = (item: VehicleType): string => {
  return item.id;
};

/**
 * A function to get the specific value from a VehicleType for sorting.
 */
const getVehicleTypeSortValue = (item: VehicleType, key: OrderBy): string | number => {
  switch (key) {
    case 'name':
      return item.name.value;
    case 'id':
      return item.id;
    case 'length':
      return item.length;
    case 'height':
      return item.height;
    case 'width':
      return item.width;
    default:
      return '';
  }
};
const vehicleTypeFilters: FilterDefinition[] = [
  { id: 'parentVehicleType', labelKey: 'types.parent', defaultLabel: 'Parent Vehicle Type' },
  { id: 'railVehicle', labelKey: 'types.train', defaultLabel: 'Train' },
  { id: 'metroVehicle', labelKey: 'types.metro', defaultLabel: 'Metro' },
  { id: 'onstreetBus', labelKey: 'types.bus', defaultLabel: 'Bus' },
  { id: 'onstreetTram', labelKey: 'types.tram', defaultLabel: 'Tram' },
  { id: 'ferryStop', labelKey: 'types.ferry', defaultLabel: 'Ferry' },
  { id: 'harbourPort', labelKey: 'types.harbour', defaultLabel: 'Harbour' },
  { id: 'liftStation', labelKey: 'types.lift', defaultLabel: 'Lift' },
];
export const vehicleTypeViewConfig = {
  useData: useVehicleTypes,
  useSearchRegistration: useDataViewSearch,
  useTableLogic: useDataViewTableLogic,
  PageContentComponent: DataPageContent,
  columns: vehicleTypeColumns,
  getFilterKey: getVehicleTypeFilterKey,
  getSortValue: getVehicleTypeSortValue,
  filters: vehicleTypeFilters,
  title: 'Vehicle Types',
};
