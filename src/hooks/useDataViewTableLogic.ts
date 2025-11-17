import { useMemo } from 'react';
import type { SearchResultItem, SearchContextViewType } from '../components/search/searchTypes';
import type { Order } from '../data/vehicle-types/useStopPlaces.ts';

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
  getFilterKey?: (item: T) => string;
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
          const typeKey = getFilterKey(item);
          return activeFilters.includes(typeKey);
        });
      }
      currentTotal =
        isDataSearchActive && activeFilters.length > 0 ? baseData.length : originalTotalCount;
    }

    let sortedData = baseData;
    if (isDataSearchActive && (searchQuery.trim() || selectedItem)) {
      sortedData = [...baseData].sort((a, b) => {
        const valA = getSortValue(a, orderBy);
        const valB = getSortValue(b, orderBy);

        if (typeof valA === 'string' && typeof valB === 'string') {
          const comp = valA.toLowerCase().localeCompare(valB.toLowerCase());
          return order === 'asc' ? comp : -comp;
        }

        if (valA < valB) return order === 'asc' ? -1 : 1;
        if (valA > valB) return order === 'asc' ? 1 : -1;
        return 0;
      });
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
