import type { Vehicle, VehicleColumnKey } from './vehicleTypes.ts';
import { compareWithEmptyLast } from '../../utils/compareWithEmptyLast.ts';

/**
 * Resolve a sortable value for a Vehicle row + column key.
 * @param item Vehicle row.
 * @param key Sortable column key.
 * @returns Comparable string|number; the comparator pushes empties last.
 */
export const getVehicleSortValue = (item: Vehicle, key: VehicleColumnKey): string | number => {
  switch (key) {
    case 'registrationNumber':
      return item.registrationNumber || '';
    case 'version':
      return item.version;
    case 'parentVehicleTypeName':
      return item.parentVehicleTypeName || '';
    case 'parentTransportMode':
      return item.parentTransportMode || '';
    default: {
      const _exhaustive: never = key;
      return _exhaustive;
    }
  }
};

export const compareVehicles = compareWithEmptyLast(getVehicleSortValue);
