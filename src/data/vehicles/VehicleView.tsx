import { vehicleViewConfig } from './vehicleViewConfig.tsx';
import GenericDataViewPage from '../../pages/GenericDataViewPage.tsx';
import NewVehicleFab from './NewVehicleFab.tsx';
import type { VehicleRow, VehicleColumnKey } from './vehicleTypes.ts';

/**
 * `/vehicle` route entry point. URL-filter affordances will arrive with
 * the Sobek `vehicles(filter)` pushdown (GH #24).
 */
export default function VehicleView() {
  return (
    <GenericDataViewPage<VehicleRow, VehicleColumnKey>
      viewConfig={{ ...vehicleViewConfig, floatingAction: <NewVehicleFab /> }}
    />
  );
}
