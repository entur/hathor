import type { Order } from '../components/data/dataTableTypes.ts';

/**
 * Returns true for null/undefined or — for strings — visually blank values
 * (incl. whitespace-only).
 *
 * TEMP WORKAROUND tied to entur/sobek#121: Sobek currently serializes empty
 * NeTEx Name elements as whitespace strings (e.g. "\n     ") rather than
 * null/empty, so any "is this blank?" check in hathor must trim. Once Sobek
 * emits null/"" the `.trim()` branch can be dropped.
 *
 * @param v Sortable string or number (or nullish).
 * @returns true if the value should sort to the end.
 */
export const isEmpty = (v: string | number | null | undefined): boolean =>
  v == null || (typeof v === 'string' && v.trim() === '');

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
    const aEmpty = isEmpty(va);
    const bEmpty = isEmpty(vb);
    if (aEmpty && bEmpty) return 0;
    if (aEmpty) return 1;
    if (bEmpty) return -1;
    const ca = typeof va === 'string' ? va.toLowerCase() : va;
    const cb = typeof vb === 'string' ? vb.toLowerCase() : vb;
    const dir = order === 'asc' ? 1 : -1;
    if (ca < cb) return -dir;
    if (ca > cb) return dir;
    return 0;
  };
