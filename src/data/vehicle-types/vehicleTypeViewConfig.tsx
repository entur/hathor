import { Link } from 'react-router-dom';
import { Chip, Typography } from '@mui/material';
import { useVehicleTypes } from './useVehicleTypes.ts';
import { useDataViewSearch } from '../../hooks/useDataViewSearch.ts';
import { useDataViewTableLogic } from '../../hooks/useDataViewTableLogic.ts';
import DataPageContent from '../../components/data/DataPageContent.tsx';
import VehicleListCell from './cells/VehicleListCell.tsx';
import type { ColumnDefinition } from '../../components/data/dataTableTypes.ts';
import type { OrderBy } from './useVehicleTypes.ts';
import type { FilterDefinition } from '../../components/search/searchTypes.ts';
import type { VehicleType } from './vehicleTypeTypes.ts';

const fmtDim = (v: VehicleType) => {
  const parts = [
    v.length != null && `L:${v.length}`,
    v.width != null && `W:${v.width}`,
    v.height != null && `H:${v.height}`,
  ].filter(Boolean);
  return parts.length ? parts.join(', ') : '';
};

const vehicleTypeColumns: ColumnDefinition<VehicleType, OrderBy>[] = [
  {
    id: 'id',
    headerLabel: 'ID',
    isSortable: true,
    renderCell: item => (
      <Chip
        label={item.id}
        component={Link}
        to={`/vehicle-type/${encodeURIComponent(item.id)}`}
        clickable
        size="small"
        variant="outlined"
      />
    ),
    display: 'always',
  },
  {
    id: 'name',
    headerLabel: 'Name',
    isSortable: true,
    renderCell: item => item.name?.value,
    display: 'always',
  },
  {
    id: 'dimensions',
    headerLabel: 'Dimensions',
    isSortable: true,
    renderCell: item => (
      <Typography variant="body2" sx={{ whiteSpace: 'nowrap' }}>
        {fmtDim(item)}
      </Typography>
    ),
    display: 'always',
  },
  {
    id: 'deckPlanName',
    headerLabel: 'Deck Plan',
    isSortable: true,
    renderCell: item => item.deckPlan?.name?.value,
    display: 'desktop-only',
  },
  {
    id: 'vehicles',
    headerLabel: 'Vehicles',
    isSortable: false,
    renderCell: item => <VehicleListCell vehicles={item.vehicles ?? []} />,
    sx: { maxWidth: '25%' },
    display: 'desktop-only',
  },
];

const getVehicleTypeFilterKey = (item: VehicleType): string => {
  return item.id;
};

const getVehicleTypeSortValue = (item: VehicleType, key: OrderBy): string | number => {
  switch (key) {
    case 'name':
      return item.name?.value || '';
    case 'id':
      return item.id;
    case 'dimensions':
      return item.length;
    case 'deckPlanName':
      return item.deckPlan?.name?.value || '';
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
