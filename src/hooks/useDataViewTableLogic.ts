import { useMemo } from 'react';
import type { SearchResultItem, SearchContextViewType } from '../components/search/searchTypes';
import type { Order } from '../components/data/dataTableTypes';
import { compareWithEmptyLast } from '../utils/compareWithEmptyLast.ts';

interface UseDataViewTableLogicParams<T, K extends string> {
  allData: T[] | null;
  originalTotalCount: number;
  searchResults: SearchResultItem[];
  searchQuery: string;
  selectedItem: SearchResultItem | null;
  activeSearchContext: SearchContextViewType;
  order: Order;
  orderBy: K;
  page: number;
  rowsPerPage: number;
  activeFilters: string[];
  getFilterKey?: (item: T) => string | readonly string[];
  getSortValue: (item: T, key: K) => string | number;
}

export function useDataViewTableLogic<T, K extends string>({
  allData,
  originalTotalCount,
  searchResults,
  searchQuery,
  selectedItem,
  activeSearchContext,
  order,
  orderBy,
  page,
  rowsPerPage,
  activeFilters,
  getFilterKey,
  getSortValue,
}: UseDataViewTableLogicParams<T, K>) {
  return useMemo(() => {
    let baseData: T[];
    let currentTotal: number;
    const isDataSearchActive = activeSearchContext === 'data';

    if (isDataSearchActive && selectedItem) {
      baseData = [selectedItem.originalData as T];
      currentTotal = 1;
    } else if (isDataSearchActive && searchQuery.trim()) {
      baseData = searchResults
        .filter(result => result.type === 'data' && result.originalData)
        .map(result => result.originalData as T);
      currentTotal = baseData.length;
    } else {
      baseData = allData || [];
      if (isDataSearchActive && activeFilters.length > 0 && getFilterKey) {
        baseData = baseData.filter(item => {
          const raw = getFilterKey(item);
          const keys = typeof raw === 'string' ? [raw] : raw;
          return keys.some(k => activeFilters.includes(k));
        });
      }
      currentTotal =
        isDataSearchActive && activeFilters.length > 0 ? baseData.length : originalTotalCount;
    }

    let sortedData = baseData;
    if (isDataSearchActive && (searchQuery.trim() || selectedItem)) {
      sortedData = [...baseData].sort(compareWithEmptyLast(getSortValue)(orderBy, order));
    }

    const paginated = sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return { dataForTable: paginated, currentTotalForTable: currentTotal };
  }, [
    activeSearchContext,
    searchQuery,
    searchResults,
    selectedItem,
    allData,
    originalTotalCount,
    order,
    orderBy,
    page,
    rowsPerPage,
    activeFilters,
    getFilterKey,
    getSortValue,
  ]);
}
