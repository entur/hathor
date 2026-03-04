import { useCallback, useEffect } from 'react';
import { useSearch } from '../components/search';
import type { SearchContextViewType, SearchResultItem } from '../components/search/searchTypes';
import type { Name } from '../data/vehicle-types/vehicleTypeTypes';

export function useDataViewSearch<T extends { id: string; name?: Name }>(
  allFetchedItems: T[] | null,
  itemsLoading: boolean
) {
  const { setActiveSearchContext, registerSearchFunction } = useSearch();

  const searchStopPlaceData = useCallback(async (): Promise<SearchResultItem[]> => {
    if (itemsLoading || !allFetchedItems) return [];
    // const lowerQuery = query.toLowerCase();
    return (
      allFetchedItems
        // .filter(sp => {
        //   const textMatch =
        //     sp.name.value.toLowerCase().includes(lowerQuery) ||
        //     sp.id.toLowerCase().includes(lowerQuery);

        //   const typeKey =
        //     sp.__typename === 'ParentStopPlace' ? 'parentStopPlace' : sp.stopPlaceType;
        //   const typeMatch = filters.length === 0 || filters.includes(typeKey);

        //   return textMatch && typeMatch;
        // })
        .map(sp => ({
          id: sp.id,
          name: sp.name?.value,
          type: 'data' as const,
          originalData: sp,
        }))
    );
  }, [itemsLoading, allFetchedItems]);

  useEffect(() => {
    const context: SearchContextViewType = 'data';
    setActiveSearchContext(context);
    registerSearchFunction(context, searchStopPlaceData);

    return () => {
      registerSearchFunction(context, null);
    };
  }, [setActiveSearchContext, registerSearchFunction, searchStopPlaceData]);
}
