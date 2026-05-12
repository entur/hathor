import type { VehicleRow, VehicleColumnKey } from './vehicleTypes.ts';
import { compareWithEmptyLast } from '../../utils/compareWithEmptyLast.ts';
import { transportModeSortValue } from '../netex/transportMode.ts';

/**
 * Resolve a sortable value for a VehicleRow + column key.
 * @param item Vehicle row.
 * @param key Sortable column key.
 * @returns Comparable string|number; the comparator pushes empties last.
 */
export const getVehicleSortValue = (item: VehicleRow, key: VehicleColumnKey): string | number => {
  switch (key) {
    case 'registrationNumber':
      return item.registrationNumber || '';
    case 'version':
      return item.version;
    case 'parentVehicleTypeName':
      return item.parentVehicleTypeName || '';
    case 'parentTransportMode':
      return transportModeSortValue(item.parentTransportMode);
    default: {
      const _exhaustive: never = key;
      return _exhaustive;
    }
  }
};

export const compareVehicles = compareWithEmptyLast(getVehicleSortValue);
