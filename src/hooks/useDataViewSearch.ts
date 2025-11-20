import { useCallback, useEffect } from 'react';
import { useSearch } from '../components/search';
import type {
  SearchContextViewType,
  SearchResultItem
} from '../components/search/searchTypes';
import type { VehicleType } from '../data/vehicle-types/vehicleTypeTypes';

export function useDataViewSearch(
  allFetchedStopPlaces: VehicleType[] | null,
  stopPlacesLoading: boolean
) {
  const { setActiveSearchContext, registerSearchFunction } = useSearch();

  const searchStopPlaceData = useCallback(
    async (): Promise<SearchResultItem[]> => {
      if (stopPlacesLoading || !allFetchedStopPlaces) return [];
      // const lowerQuery = query.toLowerCase();
      return allFetchedStopPlaces
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
          name: sp.name.value,
          type: 'data' as const,
          originalData: sp,
        }));
    },
    [stopPlacesLoading, allFetchedStopPlaces]
  );

  useEffect(() => {
    const context: SearchContextViewType = 'data';
    setActiveSearchContext(context);
    registerSearchFunction(context, searchStopPlaceData);

    return () => {
      registerSearchFunction(context, null);
    };
  }, [setActiveSearchContext, registerSearchFunction, searchStopPlaceData]);
}
