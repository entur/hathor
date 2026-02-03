import { vehicleTypeViewConfig } from '../data/vehicle-types/vehicleTypeViewConfig.ts';
import GenericDataViewPage from './GenericDataViewPage.tsx';
import type { VehicleType } from '../data/vehicle-types/vehicleTypeTypes.ts';
import type { OrderBy } from '../data/vehicle-types/useVehicleTypes.ts';
import AutosysImportFloatingMenu from '../components/dialogs/autosys/AutosysImportFloatingMenu.tsx';

export default function VehicleTypeView() {
  return (
    <GenericDataViewPage<VehicleType, OrderBy>
      viewConfig={{ ...vehicleTypeViewConfig, floatingAction: <AutosysImportFloatingMenu /> }}
    />
  );
}
