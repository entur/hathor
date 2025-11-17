import { useVehicleImports } from './useVehicleImports.ts';
import { useDataViewSearch } from '../../hooks/useDataViewSearch.ts';
import { useDataViewTableLogic } from '../../hooks/useDataViewTableLogic.ts';
import DataPageContent from '../../components/data/DataPageContent.tsx';
import type { ColumnDefinition } from '../../components/data/dataTableTypes.ts';
import type { FilterDefinition } from '../../components/search/searchTypes.ts';
import type { VehicleImport } from './vehicleImportTypes.ts';
import type { OrderBy } from './useVehicleImports.ts';
import { TextField } from '@mui/material';

/**
 * Defines the columns for the vehicleImport data table.
 */
const vehicleImportColumns: ColumnDefinition<VehicleImport, OrderBy>[] = [
  {
    id: 'registrationNumber',
    headerLabel: 'Registration Number',
    isSortable: true,
    renderCell: (item, event) => (
      <TextField
        label="Registration Number"
        value={item.registrationNumber}
        onChange={e => {
          item.registrationNumber = e.target.value;
          event('updated', item);
        }}
        onBlur={() => event('blur', item)}
        fullWidth
      />
    ),
    display: 'always',
  },
  {
    id: 'operationalId',
    headerLabel: 'Operational ID',
    isSortable: true,
    renderCell: (item, event) => (
      <TextField
        label="Operational ID"
        value={item.operationalId}
        onChange={e => {
          item.operationalId = e.target.value;
          event('updated', item);
        }}
        onBlur={() => event('blur', item)}
        fullWidth
      />
    ),
    display: 'always',
  },
  {
    id: 'status',
    headerLabel: 'Status',
    isSortable: false,
    renderCell: item => item.status,
    display: 'always',
  },
];

/**
 * A function to extract the key used for filtering Products by category.
 */
const getVehicleImportFilterKey = (item: VehicleImport): string => {
  return item.registrationNumber;
};

/**
 * A function to get the specific value from a vehicleImport for sorting.
 */
const getVehicleImportSortValue = (
  item: VehicleImport,
  key: OrderBy
): string | number | undefined => {
  switch (key) {
    case 'registrationNumber':
      return item.registrationNumber;
    case 'operationalId':
      return item.operationalId;
    default:
      return '';
  }
};
const vehicleImportFilters: FilterDefinition[] = [
  { id: 'parentvehicleImport', labelKey: 'types.parent', defaultLabel: 'Parent Vehicle Type' },
  { id: 'railVehicle', labelKey: 'types.train', defaultLabel: 'Train' },
  { id: 'metroVehicle', labelKey: 'types.metro', defaultLabel: 'Metro' },
  { id: 'onstreetBus', labelKey: 'types.bus', defaultLabel: 'Bus' },
  { id: 'onstreetTram', labelKey: 'types.tram', defaultLabel: 'Tram' },
  { id: 'ferryStop', labelKey: 'types.ferry', defaultLabel: 'Ferry' },
  { id: 'harbourPort', labelKey: 'types.harbour', defaultLabel: 'Harbour' },
  { id: 'liftStation', labelKey: 'types.lift', defaultLabel: 'Lift' },
];
export const vehicleImportViewConfig = {
  useData: useVehicleImports,
  useSearchRegistration: useDataViewSearch,
  useTableLogic: useDataViewTableLogic,
  PageContentComponent: DataPageContent,
  columns: vehicleImportColumns,
  getFilterKey: getVehicleImportFilterKey,
  getSortValue: getVehicleImportSortValue,
  filters: vehicleImportFilters,
  title: 'Vehicles Import',
};
