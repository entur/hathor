import { Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useVehicles } from '../hooks/useVehicles.ts';
import { useDataViewSearch } from '../../../hooks/useDataViewSearch.ts';
import { useDataViewTableLogic } from '../../../hooks/useDataViewTableLogic.ts';
import DataPageContent from '../../../components/data/DataPageContent.tsx';
import TransportModeIcon from '../../../components/icons/TransportModeIcon.tsx';
import { getVehicleSortValue } from '../utils/vehicleSortValue.ts';
import { useVehicleUrlSelection } from '../hooks/useVehicleUrlSelection.tsx';
import { vehicleSelectedHref } from '../utils/vehicleUrlParams.ts';
import { transportModeFilters } from '../../netex/transportMode.ts';
import type { ColumnDefinition } from '../../../components/data/dataTableTypes.ts';
import {
  vehicleMode,
  type VehicleGQLShaped,
  type VehicleColumnKey,
} from '../types/vehicleGqlShaped.ts';

const vehicleColumns: ColumnDefinition<VehicleGQLShaped, VehicleColumnKey>[] = [
  {
    id: 'registrationNumber',
    headerLabel: 'vehicles.field.registrationNumber',
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
    headerLabel: 'vehicles.field.operationalNumber',
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
    headerLabel: 'vehicles.field.parentVehicleType',
    isSortable: true,
    renderCell: item => item.transportType?.name?.value ?? '—',
    display: 'always',
  },
  {
    id: 'transportTypeMode',
    headerLabel: 'vehicles.field.parentTransportMode',
    isSortable: true,
    renderCell: item => <TransportModeIcon mode={vehicleMode(item)} />,
    display: 'desktop-only',
  },
  {
    id: 'version',
    headerLabel: 'vehicles.field.version',
    isSortable: true,
    renderCell: item => item.version,
    display: 'desktop-only',
  },
];

const getVehicleFilterKey = (item: VehicleGQLShaped): string => vehicleMode(item);

const useVehicleRowClick = () => {
  const navigate = useNavigate();
  return (item: VehicleGQLShaped) => navigate(vehicleSelectedHref(item.id));
};

export const vehicleViewConfig = {
  useData: useVehicles,
  useSearchRegistration: useDataViewSearch,
  useTableLogic: useDataViewTableLogic,
  PageContentComponent: DataPageContent,
  columns: vehicleColumns,
  getFilterKey: getVehicleFilterKey,
  getSortValue: getVehicleSortValue,
  filters: transportModeFilters,
  titleKey: 'vehicles.title',
  useUrlEffect: useVehicleUrlSelection,
  useRowClick: useVehicleRowClick,
};
