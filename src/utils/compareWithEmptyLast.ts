import type { Order } from '../components/data/dataTableTypes.ts';

/**
 * Build a generic comparator that keeps rows with empty/nullish sort values
 * at the end regardless of asc/desc direction. Closes over a feature-specific
 * `getSortValue(item, key)` so per-feature `OrderBy` unions stay type-safe.
 *
 * @param getSortValue Resolves a sortable string|number for a given item + key.
 * @returns Curried `(orderBy, order) => (a, b) => number` suitable for Array.sort.
 */
export const compareWithEmptyLast =
  <T, K extends string>(getSortValue: (item: T, key: K) => string | number) =>
  (orderBy: K, order: Order) =>
  (a: T, b: T): number => {
    const va = getSortValue(a, orderBy);
    const vb = getSortValue(b, orderBy);
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
