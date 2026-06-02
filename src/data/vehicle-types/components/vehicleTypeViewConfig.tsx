import { useNavigate } from 'react-router-dom';
import { Chip, Typography } from '@mui/material';
import { useVehicleTypes } from '../hooks/useVehicleTypes.ts';
import { useDataViewSearch } from '../../../hooks/useDataViewSearch.ts';
import { useDataViewTableLogic } from '../../../hooks/useDataViewTableLogic.ts';
import DataPageContent from '../../../components/data/DataPageContent.tsx';
import VehicleListCell from './cells/VehicleListCell.tsx';
import type { ColumnDefinition } from '../../../components/data/dataTableTypes.ts';
import type { OrderBy } from '../hooks/useVehicleTypes.ts';
import type { VehicleType } from '../types/vehicleTypeTypes.ts';
import { getVehicleTypeSortValue } from '../utils/vehicleTypeSortValue.ts';
import TransportModeIcon from '../../../components/icons/TransportModeIcon.tsx';
import { toTransportMode, transportModeFilters } from '../../netex/transportMode.ts';
import { useVehicleTypeUrlSelection } from '../hooks/useVehicleTypeUrlSelection.tsx';
import { vehicleTypeSelectedHref } from '../utils/vehicleTypeUrlParams.ts';

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
    renderCell: item => <Chip label={item.id} size="small" variant="outlined" />,
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
    id: 'transportMode',
    headerLabel: 'Transport Mode',
    isSortable: true,
    renderCell: item => <TransportModeIcon mode={toTransportMode(item.transportMode)} />,
    align: 'center',
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

/**
 * Filter keys for a VehicleType row — both the full NeTEx id and the
 * canonical TransportMode (normalised to `'unknown'` when missing or
 * non-enum). The id covers URL-driven deep-link filtering
 * (`?filter=NMR:VehicleType:2`, used by the import-result flow); the mode
 * covers the header-dropdown chip set. The two filter dimensions coexist
 * via `useDataViewTableLogic`'s any-match-wins predicate.
 */
const getVehicleTypeFilterKey = (item: VehicleType): readonly string[] => [
  item.id,
  toTransportMode(item.transportMode),
];

/** Whole-row click opens the read-only sidebar via `/vehicle-types?selected=<id>`. */
const useVehicleTypeRowClick = () => {
  const navigate = useNavigate();
  return (item: VehicleType) => navigate(vehicleTypeSelectedHref(item.id));
};

export const vehicleTypeViewConfig = {
  useData: useVehicleTypes,
  useSearchRegistration: useDataViewSearch,
  useTableLogic: useDataViewTableLogic,
  PageContentComponent: DataPageContent,
  columns: vehicleTypeColumns,
  getFilterKey: getVehicleTypeFilterKey,
  getSortValue: getVehicleTypeSortValue,
  filters: transportModeFilters,
  titleKey: 'vehicleType.title',
  useUrlEffect: useVehicleTypeUrlSelection,
  useRowClick: useVehicleTypeRowClick,
};
