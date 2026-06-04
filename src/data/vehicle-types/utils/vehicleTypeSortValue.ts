import type { VehicleType } from '../types/vehicleTypeTypes.ts';
import type { OrderBy } from '../hooks/useVehicleTypes.ts';
import { compareWithEmptyLast } from '../../../utils/compareWithEmptyLast.ts';
import { transportModeSortValue, UNKNOWN_TRANSPORT_MODE } from '../../netex/transportMode.ts';

export const getVehicleTypeSortValue = (item: VehicleType, key: OrderBy): string | number => {
  switch (key) {
    case 'name':
      return item.name?.value || '';
    case 'id':
      return item.id;
    case 'dimensions':
      return item.length ?? 0;
    case 'deckPlanName':
      return item.deckPlan?.name?.value || '';
    case 'transportMode':
      return transportModeSortValue(item.transportMode ?? UNKNOWN_TRANSPORT_MODE);
    default: {
      const _exhaustive: never = key;
      return _exhaustive;
    }
  }
};

export const compareVehicleTypes = compareWithEmptyLast(getVehicleTypeSortValue);
