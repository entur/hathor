import { describe, it, expect } from 'vitest';

// Test the sort/filter/paginate logic directly (no React, pure function)
// useTableSort wraps useMemo, so we extract the core logic for unit testing.

interface Item {
  id: string;
  name: string;
  score: number;
  category: string;
}

type SortKey = 'name' | 'id' | 'score';

const getSortValue = (item: Item, key: SortKey): string | number => {
  switch (key) {
    case 'name':
      return item.name;
    case 'id':
      return item.id;
    case 'score':
      return item.score;
  }
};

const items: Item[] = [
  { id: '3', name: 'Charlie', score: 80, category: 'A' },
  { id: '1', name: 'Alice', score: 95, category: 'B' },
  { id: '2', name: 'Bob', score: 70, category: 'A' },
  { id: '4', name: 'Diana', score: 88, category: 'B' },
  { id: '5', name: 'Eve', score: 60, category: 'A' },
];

// Extract the pure logic from useTableSort to test without React
function tableSort<T, K extends string>(params: {
  data: T[] | null;
  totalCount?: number;
  order: 'asc' | 'desc';
  orderBy: K;
  page: number;
  rowsPerPage: number;
  getSortValue: (item: T, key: K) => string | number;
  searchQuery?: string;
  activeFilters?: string[];
  getFilterKey?: (item: T) => string;
}): { rows: T[]; filteredCount: number } {
  let result = params.data ?? [];

  if (params.activeFilters?.length && params.getFilterKey) {
    result = result.filter(v => params.activeFilters!.includes(params.getFilterKey!(v)));
  }

  if (params.searchQuery?.trim()) {
    const q = params.searchQuery.trim().toLowerCase();
    result = result.filter(v => {
      const val = params.getSortValue(v, params.orderBy);
      return String(val).toLowerCase().includes(q);
    });
  }

  const sorted = [...result].sort((a, b) => {
    const va = params.getSortValue(a, params.orderBy);
    const vb = params.getSortValue(b, params.orderBy);

    if (typeof va === 'string' && typeof vb === 'string') {
      const cmp = va.toLowerCase().localeCompare(vb.toLowerCase());
      return params.order === 'asc' ? cmp : -cmp;
    }

    if (va < vb) return params.order === 'asc' ? -1 : 1;
    if (va > vb) return params.order === 'asc' ? 1 : -1;
    return 0;
  });

  const didFilter = !!(params.activeFilters?.length || params.searchQuery?.trim());
  const filteredCount = didFilter ? sorted.length : (params.totalCount ?? sorted.length);
  const rows = sorted.slice(
    params.page * params.rowsPerPage,
    (params.page + 1) * params.rowsPerPage
  );

  return { rows, filteredCount };
}

describe('tableSort', () => {
  it('sorts strings ascending', () => {
    const { rows } = tableSort({
      data: items,
      order: 'asc',
      orderBy: 'name' as SortKey,
      page: 0,
      rowsPerPage: 10,
      getSortValue,
    });
    expect(rows.map(r => r.name)).toEqual(['Alice', 'Bob', 'Charlie', 'Diana', 'Eve']);
  });

  it('sorts strings descending', () => {
    const { rows } = tableSort({
      data: items,
      order: 'desc',
      orderBy: 'name' as SortKey,
      page: 0,
      rowsPerPage: 10,
      getSortValue,
    });
    expect(rows.map(r => r.name)).toEqual(['Eve', 'Diana', 'Charlie', 'Bob', 'Alice']);
  });

  it('sorts numbers ascending', () => {
    const { rows } = tableSort({
      data: items,
      order: 'asc',
      orderBy: 'score' as SortKey,
      page: 0,
      rowsPerPage: 10,
      getSortValue,
    });
    expect(rows.map(r => r.score)).toEqual([60, 70, 80, 88, 95]);
  });

  it('sorts numbers descending', () => {
    const { rows } = tableSort({
      data: items,
      order: 'desc',
      orderBy: 'score' as SortKey,
      page: 0,
      rowsPerPage: 10,
      getSortValue,
    });
    expect(rows.map(r => r.score)).toEqual([95, 88, 80, 70, 60]);
  });

  it('paginates correctly', () => {
    const p0 = tableSort({
      data: items,
      order: 'asc',
      orderBy: 'name' as SortKey,
      page: 0,
      rowsPerPage: 2,
      getSortValue,
    });
    expect(p0.rows.map(r => r.name)).toEqual(['Alice', 'Bob']);
    expect(p0.filteredCount).toBe(5);

    const p1 = tableSort({
      data: items,
      order: 'asc',
      orderBy: 'name' as SortKey,
      page: 1,
      rowsPerPage: 2,
      getSortValue,
    });
    expect(p1.rows.map(r => r.name)).toEqual(['Charlie', 'Diana']);
  });

  it('filters by category', () => {
    const { rows, filteredCount } = tableSort({
      data: items,
      order: 'asc',
      orderBy: 'name' as SortKey,
      page: 0,
      rowsPerPage: 10,
      getSortValue,
      activeFilters: ['A'],
      getFilterKey: (item: Item) => item.category,
    });
    expect(rows.map(r => r.name)).toEqual(['Bob', 'Charlie', 'Eve']);
    expect(filteredCount).toBe(3);
  });

  it('returns empty for null data', () => {
    const { rows, filteredCount } = tableSort({
      data: null,
      order: 'asc',
      orderBy: 'name' as SortKey,
      page: 0,
      rowsPerPage: 10,
      getSortValue,
    });
    expect(rows).toEqual([]);
    expect(filteredCount).toBe(0);
  });

  it('uses totalCount override when no filtering', () => {
    const { filteredCount } = tableSort({
      data: items,
      totalCount: 100,
      order: 'asc',
      orderBy: 'name' as SortKey,
      page: 0,
      rowsPerPage: 10,
      getSortValue,
    });
    expect(filteredCount).toBe(100);
  });

  it('ignores totalCount override when filtering', () => {
    const { filteredCount } = tableSort({
      data: items,
      totalCount: 100,
      order: 'asc',
      orderBy: 'name' as SortKey,
      page: 0,
      rowsPerPage: 10,
      getSortValue,
      activeFilters: ['B'],
      getFilterKey: (item: Item) => item.category,
    });
    expect(filteredCount).toBe(2);
  });
});
