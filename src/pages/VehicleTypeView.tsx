import { vehicleTypeViewConfig } from '../data/vehicle-types/vehicleTypeViewConfig.tsx';
import GenericDataViewPage from './GenericDataViewPage.tsx';
import type { VehicleType } from '../data/vehicle-types/vehicleTypeTypes.ts';
import type { OrderBy } from '../data/vehicle-types/useVehicleTypes.ts';
import AutosysImportButton from '../components/dialogs/AutosysImportButton.tsx';

export default function VehicleTypeView() {
  return (
    <GenericDataViewPage<VehicleType, OrderBy>
      viewConfig={{ ...vehicleTypeViewConfig, floatingAction: <AutosysImportButton /> }}
    />
  );
}
