import { Chip, Typography } from '@mui/material';
import { useVehicles } from './useVehicles.ts';
import { useDataViewSearch } from '../../hooks/useDataViewSearch.ts';
import { useDataViewTableLogic } from '../../hooks/useDataViewTableLogic.ts';
import DataPageContent from '../../components/data/DataPageContent.tsx';
import RowClickCell from './cells/RowClickCell.tsx';
import { getVehicleSortValue } from './vehicleSortValue.ts';
import { transportModeFilters } from '../netex/transportMode.ts';
import type { ColumnDefinition } from '../../components/data/dataTableTypes.ts';
import type { Vehicle, VehicleColumnKey } from './vehicleTypes.ts';

const vehicleColumns: ColumnDefinition<Vehicle, VehicleColumnKey>[] = [
  {
    id: 'registrationNumber',
    headerLabel: 'Registration Number',
    isSortable: true,
    renderCell: item => (
      <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
        {item.registrationNumber}
      </Typography>
    ),
    display: 'always',
  },
  {
    id: 'parentVehicleTypeName',
    headerLabel: 'Vehicle Type',
    isSortable: true,
    renderCell: item => item.parentVehicleTypeName ?? '—',
    display: 'always',
  },
  {
    id: 'parentTransportMode',
    headerLabel: 'Transport Mode',
    isSortable: true,
    renderCell: item =>
      item.parentTransportMode ? (
        <Chip label={item.parentTransportMode} size="small" variant="outlined" />
      ) : (
        '—'
      ),
    display: 'desktop-only',
  },
  {
    id: 'version',
    headerLabel: 'Version',
    isSortable: true,
    renderCell: item => item.version,
    display: 'desktop-only',
  },
  {
    id: 'actions',
    headerLabel: '',
    isSortable: false,
    renderCell: item => <RowClickCell item={item} />,
    display: 'always',
  },
];

/**
 * Derives the chip-filter key for a Vehicle row. Returns the vehicle's parent
 * TransportMode (inherited from its VehicleType during flatten). The
 * `useDataViewTableLogic` hook matches this against the user's active filter
 * ids (multi-select-OR).
 */
const getVehicleFilterKey = (item: Vehicle): string => item.parentTransportMode ?? '';

export const vehicleViewConfig = {
  useData: useVehicles,
  useSearchRegistration: useDataViewSearch,
  useTableLogic: useDataViewTableLogic,
  PageContentComponent: DataPageContent,
  columns: vehicleColumns,
  getFilterKey: getVehicleFilterKey,
  getSortValue: getVehicleSortValue,
  filters: transportModeFilters,
  title: 'Vehicles',
};
