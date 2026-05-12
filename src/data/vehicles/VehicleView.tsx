import { vehicleViewConfig } from './vehicleViewConfig.tsx';
import GenericDataViewPage from '../../pages/GenericDataViewPage.tsx';
import type { VehicleRow, VehicleColumnKey } from './vehicleTypes.ts';

/**
 * `/vehicle` route entry point — hands the assembled `vehicleViewConfig` to
 * the generic data view page. No URL-filter / import affordances in iter 1;
 * those can be added alongside (or after) the Sobek `vehicles(filter)`
 * pushdown listed in GH #24.
 */
export default function VehicleView() {
  return <GenericDataViewPage<VehicleRow, VehicleColumnKey> viewConfig={vehicleViewConfig} />;
}
