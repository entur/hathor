import type { VehicleType } from './vehicleTypeTypes.ts';
import type { OrderBy } from './useVehicleTypes.ts';
import { compareWithEmptyLast } from '../../utils/compareWithEmptyLast.ts';
import { toTransportMode, transportModeSortValue } from '../netex/transportMode.ts';

export const getVehicleTypeSortValue = (item: VehicleType, key: OrderBy): string | number => {
  switch (key) {
    case 'name':
      return item.name?.value || '';
    case 'id':
      return item.id;
    case 'dimensions':
      return item.length;
    case 'deckPlanName':
      return item.deckPlan?.name?.value || '';
    case 'transportMode':
      return transportModeSortValue(toTransportMode(item.transportMode));
    default: {
      const _exhaustive: never = key;
      return _exhaustive;
    }
  }
};

export const compareVehicleTypes = compareWithEmptyLast(getVehicleTypeSortValue);
