import { vehicleTypeViewConfig } from './vehicleTypeViewConfig.tsx';
import GenericDataViewPage from '../../pages/GenericDataViewPage.tsx';
import type { VehicleType } from './vehicleTypeTypes.ts';
import type { OrderBy } from './useVehicleTypes.ts';
import AutosysImportFloatingMenu from '../../components/dialogs/AutosysImportFloatingMenu.tsx';
import { useUrlFilters } from '../../hooks/useUrlFilters.ts';

export default function VehicleTypeView() {
  const { hasUrlFilters, clearUrlFilters, filterCount } = useUrlFilters();

  return (
    <GenericDataViewPage<VehicleType, OrderBy>
      viewConfig={{ ...vehicleTypeViewConfig, floatingAction: <AutosysImportFloatingMenu /> }}
      urlFilterInfo={{ hasUrlFilters, clearUrlFilters, filterCount }}
    />
  );
}
