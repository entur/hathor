import {
  vehicleMode,
  type VehicleGQLShaped,
  type VehicleColumnKey,
} from '../types/vehicleGqlShaped.ts';
import { compareWithEmptyLast } from '../../../utils/compareWithEmptyLast.ts';
import { transportModeSortValue } from '../../netex/transportMode.ts';

/**
 * Resolve a sortable value for a VehicleGQLShaped + column key.
 * @param item Vehicle row.
 * @param key Sortable column key.
 * @returns Comparable string|number; the comparator pushes empties last.
 */
export const getVehicleSortValue = (
  item: VehicleGQLShaped,
  key: VehicleColumnKey
): string | number => {
  switch (key) {
    case 'registrationNumber':
      return item.registrationNumber || '';
    case 'operationalNumber':
      return item.operationalNumber || '';
    case 'version':
      return item.version === undefined ? -1 : item.version; // Treat missing version as -1 to sort before any valid versions
    case 'transportTypeName':
      return item.transportType?.name?.value || '';
    case 'transportTypeMode':
      return transportModeSortValue(vehicleMode(item));
    default: {
      const _exhaustive: never = key;
      return _exhaustive;
    }
  }
};

export const compareVehicles = compareWithEmptyLast(getVehicleSortValue);
