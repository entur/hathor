import { vehicleTypeViewConfig } from '../data/vehicle-types/vehicleTypeViewConfig.ts';
import GenericDataViewPage from './GenericDataViewPage.tsx';
import type { VehicleType } from '../data/vehicle-types/vehicleTypeTypes.ts';
import type { OrderBy } from '../data/vehicle-types/useVehicleTypes.ts';
import AutosysImportFloatingMenu from '../components/dialogs/autosys/AutosysImportFloatingMenu.tsx';
import { useUrlFilters } from '../hooks/useUrlFilters.ts';

export default function VehicleTypeView() {
  const { hasUrlFilters, clearUrlFilters, filterCount } = useUrlFilters();

  return (
    <GenericDataViewPage<VehicleType, OrderBy>
      viewConfig={{ ...vehicleTypeViewConfig, floatingAction: <AutosysImportFloatingMenu /> }}
      urlFilterInfo={{ hasUrlFilters, clearUrlFilters, filterCount }}
    />
  );
}
