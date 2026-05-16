import { vehicleViewConfig } from './projection/vehicleViewConfig.tsx';
import GenericDataViewPage from '../../pages/GenericDataViewPage.tsx';
import NewVehicleFab from './NewVehicleFab.tsx';
import type { VehicleGQLShaped, VehicleColumnKey } from './projection/vehicleGqlShaped.ts';

/**
 * `/vehicle` route entry point. URL-filter affordances will arrive with
 * the Sobek `vehicles(filter)` pushdown (GH #24).
 */
export default function VehicleView() {
  return (
    <GenericDataViewPage<VehicleGQLShaped, VehicleColumnKey>
      viewConfig={{ ...vehicleViewConfig, floatingAction: <NewVehicleFab /> }}
    />
  );
}
