import { Typography } from '@mui/material';
import { useVehicles } from './useVehicles.ts';
import { useDataViewSearch } from '../../../hooks/useDataViewSearch.ts';
import { useDataViewTableLogic } from '../../../hooks/useDataViewTableLogic.ts';
import DataPageContent from '../../../components/data/DataPageContent.tsx';
import RowClickCell from './cells/RowClickCell.tsx';
import TransportModeChip from './cells/TransportModeChip.tsx';
import { getVehicleSortValue } from './vehicleSortValue.ts';
import { useVehicleUrlSelection } from './useVehicleUrlSelection.tsx';
import { transportModeFilters } from '../../netex/transportMode.ts';
import type { ColumnDefinition } from '../../../components/data/dataTableTypes.ts';
import type { VehicleGQLShaped, VehicleColumnKey } from './vehicleGqlShaped.ts';

const vehicleColumns: ColumnDefinition<VehicleGQLShaped, VehicleColumnKey>[] = [
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
    renderCell: item => <TransportModeChip mode={item.parentTransportMode} />,
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

/** Chip-filter key for a row — the inherited parent TransportMode. */
const getVehicleFilterKey = (item: VehicleGQLShaped): string => item.parentTransportMode;

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
  useUrlEffect: useVehicleUrlSelection,
};
