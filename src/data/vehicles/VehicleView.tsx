import { vehicleViewConfig } from './vehicleViewConfig.tsx';
import GenericDataViewPage from '../../pages/GenericDataViewPage.tsx';
import NewVehicleFab from './NewVehicleFab.tsx';
import type { VehicleRow, VehicleColumnKey } from './vehicleTypes.ts';

/**
 * `/vehicle` route entry point — hands the assembled `vehicleViewConfig` to
 * the generic data view page. The `+ New Vehicle` FAB navigates to
 * `/vehicle/new` (per issue #69). URL-filter affordances will arrive with
 * the Sobek `vehicles(filter)` pushdown listed in GH #24.
 */
export default function VehicleView() {
  return (
    <GenericDataViewPage<VehicleRow, VehicleColumnKey>
      viewConfig={{ ...vehicleViewConfig, floatingAction: <NewVehicleFab /> }}
    />
  );
}
