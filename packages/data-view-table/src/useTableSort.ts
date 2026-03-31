import { useMemo } from 'react';
import type { Order } from './types.js';

export interface UseTableSortParams<T, K extends string> {
  data: T[] | null;
  totalCount?: number;
  order: Order;
  orderBy: K;
  page: number;
  rowsPerPage: number;
  getSortValue: (item: T, key: K) => string | number;
  searchQuery?: string;
  activeFilters?: string[];
  getFilterKey?: (item: T) => string;
}

export interface UseTableSortResult<T> {
  rows: T[];
  filteredCount: number;
}

export function useTableSort<T, K extends string>({
  data,
  totalCount,
  order,
  orderBy,
  page,
  rowsPerPage,
  getSortValue,
  searchQuery,
  activeFilters,
  getFilterKey,
}: UseTableSortParams<T, K>): UseTableSortResult<T> {
  return useMemo(() => {
    let items = data ?? [];

    // Category filter
    if (activeFilters?.length && getFilterKey) {
      items = items.filter(v => activeFilters.includes(getFilterKey(v)));
    }

    // Text search — match against any column's sort value
    if (searchQuery?.trim()) {
      const q = searchQuery.trim().toLowerCase();
      items = items.filter(v => {
        const val = getSortValue(v, orderBy);
        return String(val).toLowerCase().includes(q);
      });
    }

    // Sort
    const sorted = [...items].sort((a, b) => {
      const va = getSortValue(a, orderBy);
      const vb = getSortValue(b, orderBy);

      if (typeof va === 'string' && typeof vb === 'string') {
        const cmp = va.toLowerCase().localeCompare(vb.toLowerCase());
        return order === 'asc' ? cmp : -cmp;
      }

      if (va < vb) return order === 'asc' ? -1 : 1;
      if (va > vb) return order === 'asc' ? 1 : -1;
      return 0;
    });

    const didFilter = !!(activeFilters?.length || searchQuery?.trim());
    const filteredCount = didFilter ? sorted.length : (totalCount ?? sorted.length);
    const rows = sorted.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

    return { rows, filteredCount };
  }, [
    data,
    totalCount,
    order,
    orderBy,
    page,
    rowsPerPage,
    getSortValue,
    searchQuery,
    activeFilters,
    getFilterKey,
  ]);
}
