import { useCallback, useEffect } from 'react';
import { useSearch } from '../components/search';
import type { SearchContextViewType, SearchResultItem } from '../components/search/searchTypes';
import type { Name } from '../data/vehicle-types/vehicleTypeTypes';

export function useDataViewSearch<T extends { id: string; name?: Name }>(
  allFetchedItems: T[] | null,
  itemsLoading: boolean
) {
  const { setActiveSearchContext, registerSearchFunction } = useSearch();

  const searchData = useCallback(async (): Promise<SearchResultItem[]> => {
    if (itemsLoading || !allFetchedItems) return [];
    return allFetchedItems.map(item => ({
      id: item.id,
      name: item.name?.value,
      type: 'data' as const,
      originalData: item,
    }));
  }, [itemsLoading, allFetchedItems]);

  useEffect(() => {
    const context: SearchContextViewType = 'data';
    setActiveSearchContext(context);
    registerSearchFunction(context, searchData);

    return () => {
      registerSearchFunction(context, null);
    };
  }, [setActiveSearchContext, registerSearchFunction, searchData]);
}
