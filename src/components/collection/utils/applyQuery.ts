/**
 * The pipeline both views render from: filter → search, then sort, then page.
 * Pure, so the grid and the cards cannot disagree about what is visible. The
 * stages are separate so `collection.tsx` can memoise each on what it reads —
 * a page change re-slices without re-searching, a sort click re-sorts without
 * re-filtering.
 */
import {
  usablePageSize,
  type CollectionQuery,
  type CollectionSort,
  type Column,
  type FieldSpec,
  type FilterFields,
} from '../types.ts';
import { matchesFilter } from './filters.ts';
import { formatValue, rawValue } from './values.ts';

/** Text order follows Norwegian rules (æ, ø, å after z), not the runtime's locale. */
const SORT_LOCALE = 'nb';
const COLLATOR = new Intl.Collator(SORT_LOCALE);

/** Kinds the free-text search looks into. */
const SEARCHABLE: readonly FieldSpec['kind'][] = ['text', 'name', 'enum', 'enumMulti', 'reference'];

export interface QueryResult<E> {
  /** The visible page. */
  rows: E[];
  /** Row count after filter + search, before paging. */
  total: number;
  /** The page actually returned (the requested one, clamped into range). */
  page: number;
}

type SortKey = number | string | null;

/** `null` for a missing value, so it can be ordered last in either direction. */
const sortKey = (row: unknown, spec: FieldSpec): SortKey => {
  const v = rawValue(row, spec);
  if (v == null) return null;
  if (spec.kind === 'number') {
    const n = Number(v);
    return Number.isFinite(n) ? n : null; // not a number: ordered like a missing value
  }
  if (spec.kind === 'switch') return Number(Boolean(v));
  return formatValue(row, spec).toLowerCase() || null;
};

const compare = (a: SortKey, b: SortKey): number =>
  typeof a === 'number' && typeof b === 'number' ? a - b : COLLATOR.compare(String(a), String(b));

/** Does the search needle appear in the cell, as stored or as shown (a compact id)? */
const cellHas = (row: unknown, col: Column, needle: string): boolean => {
  const text = formatValue(row, col.spec);
  if (text.toLowerCase().includes(needle)) return true;
  const shown = col.display(text);
  return shown !== text && shown.toLowerCase().includes(needle);
};

/**
 * Filter and search: the rows the query keeps, in input order.
 *
 * @param rows          the collection (never mutated)
 * @param columns       the columns filters may target (shown or not)
 * @param filterFields  the entity's `<Entity>FilterFields`
 * @param filters       `CollectionQuery.filters`
 * @param search        `CollectionQuery.search`
 * @param filterMode    `'server'` skips the filter step (the host applied it)
 * @param searchColumns the columns the user can see; search looks only here,
 *                      so a row is never found by text it does not show
 * @returns the kept rows
 */
export function matchRows<E>(
  rows: readonly E[],
  columns: readonly Column[],
  filterFields: FilterFields,
  filters: CollectionQuery['filters'],
  search: string,
  filterMode: 'client' | 'server' = 'client',
  searchColumns: readonly Column[] = columns
): E[] {
  const byKey = new Map(columns.map(c => [c.key, c]));
  const conditions =
    filterMode === 'server'
      ? []
      : Object.entries(filters).flatMap(([key, value]) => {
          const col = byKey.get(key);
          const target = filterFields[key];
          return col && target ? [{ col, op: target.op, value }] : [];
        });
  const needle = search.trim().toLowerCase();
  const searchable = searchColumns.filter(c => SEARCHABLE.includes(c.spec.kind));

  return rows.filter(
    row =>
      conditions.every(c => matchesFilter(row, c.col, c.op, c.value)) &&
      (!needle || searchable.some(c => cellHas(row, c, needle)))
  );
}

/**
 * Sort by one column; missing values last in either direction. A sort on a
 * field that is not a column leaves the order as it is.
 *
 * @param rows    the kept rows (never mutated)
 * @param columns the resolved columns
 * @param sort    `CollectionQuery.sort`
 * @returns the rows in order
 */
export function sortRows<E>(
  rows: readonly E[],
  columns: readonly Column[],
  sort: CollectionSort | null
): E[] {
  const col = sort ? columns.find(c => c.key === sort.field) : undefined;
  if (!sort || !col) return [...rows];
  const flip = sort.dir === 'desc' ? -1 : 1;
  return rows
    .map(row => ({ row, key: sortKey(row, col.spec) }))
    .sort((x, y) =>
      x.key === null || y.key === null
        ? Number(x.key === null) - Number(y.key === null)
        : flip * compare(x.key, y.key)
    )
    .map(x => x.row);
}

/**
 * Slice one page; a page past the end is clamped to the last one.
 *
 * @param rows     the sorted rows
 * @param page     requested page index
 * @param pageSize requested page size (made usable, as everywhere)
 * @returns the visible page, the unpaged total and the clamped page index
 */
export function pageRows<E>(rows: readonly E[], page: number, pageSize: number): QueryResult<E> {
  const size = usablePageSize(pageSize);
  const total = rows.length;
  const at = Math.min(Math.max(page, 0), Math.max(Math.ceil(total / size) - 1, 0));
  return { rows: rows.slice(at * size, at * size + size), total, page: at };
}

/**
 * Apply a whole query to the rows in memory — the three stages in one call.
 *
 * @param rows         the collection (never mutated)
 * @param columns      the resolved columns
 * @param filterFields the entity's `<Entity>FilterFields`
 * @param query        filters, search, sort and paging
 * @param filterMode   `'server'` skips the filter step
 * @returns the visible page, the unpaged total and the clamped page index
 */
export function applyQuery<E>(
  rows: readonly E[],
  columns: readonly Column[],
  filterFields: FilterFields,
  query: CollectionQuery,
  filterMode: 'client' | 'server' = 'client'
): QueryResult<E> {
  const kept = matchRows(rows, columns, filterFields, query.filters, query.search, filterMode);
  return pageRows(sortRows(kept, columns, query.sort), query.page, query.pageSize);
}
