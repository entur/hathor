import type { Order } from '../../components/data/dataTableTypes.ts';
import type { VehicleType } from './vehicleTypeTypes.ts';
import type { OrderBy } from './useVehicleTypes.ts';

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
    default:
      return '';
  }
};

// Empty/nullish values sort to the end regardless of direction so VehicleTypes
// missing an optional NeTEx Name (etc.) don't dominate the first page.
export const compareVehicleTypes =
  (orderBy: OrderBy, order: Order) =>
  (a: VehicleType, b: VehicleType): number => {
    const va = getVehicleTypeSortValue(a, orderBy);
    const vb = getVehicleTypeSortValue(b, orderBy);
    const aEmpty = va === '' || va == null;
    const bEmpty = vb === '' || vb == null;
    if (aEmpty && bEmpty) return 0;
    if (aEmpty) return 1;
    if (bEmpty) return -1;
    const ca = typeof va === 'string' ? va.toLowerCase() : va;
    const cb = typeof vb === 'string' ? vb.toLowerCase() : vb;
    if (ca < cb) return order === 'asc' ? -1 : 1;
    if (ca > cb) return order === 'asc' ? 1 : -1;
    return 0;
  };
