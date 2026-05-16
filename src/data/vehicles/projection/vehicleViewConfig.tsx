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
import { vehicleMode, type VehicleGQLShaped, type VehicleColumnKey } from './vehicleGqlShaped.ts';

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
    id: 'operationalNumber',
    headerLabel: 'Operational Number',
    isSortable: true,
    renderCell: item =>
      item.operationalNumber ? (
        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
          {item.operationalNumber}
        </Typography>
      ) : (
        '—'
      ),
    display: 'desktop-only',
  },
  {
    id: 'transportTypeName',
    headerLabel: 'Vehicle Type',
    isSortable: true,
    renderCell: item => item.transportType?.name ?? '—',
    display: 'always',
  },
  {
    id: 'transportTypeMode',
    headerLabel: 'Transport Mode',
    isSortable: true,
    renderCell: item => <TransportModeChip mode={vehicleMode(item)} />,
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

const getVehicleFilterKey = (item: VehicleGQLShaped): string => vehicleMode(item);

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
