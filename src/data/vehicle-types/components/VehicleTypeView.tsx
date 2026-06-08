import { vehicleTypeViewConfig } from './vehicleTypeViewConfig.tsx';
import GenericDataViewPage from '../../../pages/GenericDataViewPage.tsx';
import type { VehicleType } from '../types/vehicleTypeTypes.ts';
import type { OrderBy } from '../hooks/useVehicleTypes.ts';
import AutosysImportFloatingMenu from '../../vehicle-imports/components/AutosysImportFloatingMenu.tsx';
import { useUrlFilters } from '../../../hooks/useUrlFilters.ts';
import NewVehicleTypeFab from './NewVehicleTypeFab.tsx';

export default function VehicleTypeView() {
  const { hasUrlFilters, clearUrlFilters, filterCount } = useUrlFilters();

  return (
    <GenericDataViewPage<VehicleType, OrderBy>
      viewConfig={{
        ...vehicleTypeViewConfig,
        importAction: <AutosysImportFloatingMenu />,
        addAction: <NewVehicleTypeFab />,
      }}
      urlFilterInfo={{ hasUrlFilters, clearUrlFilters, filterCount }}
    />
  );
}
