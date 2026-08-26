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
    case 'name':
      return item.name?.value || '';
    case 'id':
      return item.id;
    case 'registrationNumber':
      return item.registrationNumber || '';
    case 'operationalNumber':
      return item.operationalNumber || '';
    case 'transportTypeName':
      return item.transportType?.name?.value || '';
    case 'transportTypeMode':
      // A present mode (incl. UNKNOWN) sorts at its slot; a missing
      // transportType is genuinely empty → empty-last (like the name above).
      return item.transportType ? transportModeSortValue(vehicleMode(item)) : '';
    default: {
      const _exhaustive: never = key;
      return _exhaustive;
    }
  }
};

export const compareVehicles = compareWithEmptyLast(getVehicleSortValue);
