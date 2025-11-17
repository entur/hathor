import React, { useState, useCallback, useRef, type ReactNode, useEffect } from 'react';
import { SearchContext } from './SearchContextInstance.ts';
import type {
  SearchContextViewType,
  SearchResultItem,
  SearchFunction,
  StopPlaceTypeFilter,
  FilterDefinition,
} from './searchTypes.ts';

function debounce<F extends (...args: string[]) => void>(func: F, waitFor: number) {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  const debounced = (...args: Parameters<F>) => {
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => func(...args), waitFor);
  };

  return debounced;
}

interface SearchProviderProps {
  children: ReactNode;
}

export const SearchProvider: React.FC<SearchProviderProps> = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeSearchContext, setActiveSearchContext] = useState<SearchContextViewType>(null);
  const [searchResults, setSearchResults] = useState<SearchResultItem[]>([]);
  const [suggestionResults, setSuggestionResults] = useState<SearchResultItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<SearchResultItem | null>(null);
  const [activeFilters, setActiveFilters] = useState<StopPlaceTypeFilter[]>([]);
  const [filterConfig, setFilterConfig] = useState<FilterDefinition[]>([]);

  const searchFunctionsRef = useRef<
    Partial<Record<NonNullable<SearchContextViewType>, SearchFunction>>
  >({});

  const filterConfigsRef = useRef<
    Partial<Record<NonNullable<SearchContextViewType>, FilterDefinition[]>>
  >({});

  const registerSearchFunction = useCallback(
    (contextType: SearchContextViewType, func: SearchFunction | null) => {
      if (contextType) {
        if (func) {
          searchFunctionsRef.current[contextType] = func;
        } else {
          delete searchFunctionsRef.current[contextType];
        }
      }
    },
    []
  );

  const registerFilterConfig = useCallback(
    (contextType: SearchContextViewType, config: FilterDefinition[] | null) => {
      if (contextType) {
        if (config) {
          filterConfigsRef.current[contextType] = config;
        } else {
          delete filterConfigsRef.current[contextType];
        }

        if (activeSearchContext === contextType) {
          setFilterConfig(config || []);
        }
      }
    },
    [activeSearchContext]
  );

  const executeSearch = useCallback(
    async (query: string, filters: StopPlaceTypeFilter[]): Promise<SearchResultItem[]> => {
      if (!query.trim() || !activeSearchContext) return [];
      const searchFunc = searchFunctionsRef.current[activeSearchContext];
      if (!searchFunc) {
        console.warn(`No search function registered for active context: ${activeSearchContext}`);
        return [];
      }
      setIsLoading(true);
      try {
        return await searchFunc(query, filters);
      } catch (error) {
        console.error(`Search failed for context ${activeSearchContext}:`, error);
        return [];
      } finally {
        setIsLoading(false);
      }
    },
    [activeSearchContext]
  );

  const performLiveSearch = useCallback(
    debounce(async (query: string) => {
      if (!query.trim()) {
        setSuggestionResults([]);
        setSearchResults([]);
        return;
      }
      const results = await executeSearch(query, activeFilters);
      setSuggestionResults(results);
      setSearchResults(results);
    }, 300),
    [executeSearch, activeFilters]
  );

  const performSuggestionOnlySearch = useCallback(
    debounce(async (query: string) => {
      if (!query.trim()) {
        setSuggestionResults([]);
        return;
      }
      const results = await executeSearch(query, activeFilters);
      setSuggestionResults(results);
    }, 300),
    [executeSearch, activeFilters]
  );

  const performSearch = useCallback(async () => {
    setSuggestionResults([]);
    const results = await executeSearch(searchQuery, activeFilters);
    setSearchResults(results);
  }, [searchQuery, executeSearch, activeFilters]);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setSearchResults([]);
    setSuggestionResults([]);
    setSelectedItem(null);
    setActiveFilters([]);
  }, []);

  useEffect(() => {
    clearSearch();
    setFilterConfig(filterConfigsRef.current[activeSearchContext!] || []);
  }, [activeSearchContext, clearSearch]);

  const handleSetSearchQuery = useCallback(
    (query: string) => {
      setSearchQuery(query);
      setSelectedItem(null);

      if (activeSearchContext === 'data') {
        performLiveSearch(query);
      } else {
        performSuggestionOnlySearch(query);
        if (!query.trim()) {
          setSearchResults([]);
        }
      }
    },
    [activeSearchContext, performLiveSearch, performSuggestionOnlySearch]
  );

  const updateFilters = useCallback((newFilters: StopPlaceTypeFilter[]) => {
    setActiveFilters(newFilters);
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      handleSetSearchQuery(searchQuery);
    }
  }, [activeFilters, handleSetSearchQuery]);

  useEffect(() => {
    clearSearch();
  }, [activeSearchContext, clearSearch]);

  return (
    <SearchContext.Provider
      value={{
        searchQuery,
        setSearchQuery: handleSetSearchQuery,
        activeSearchContext,
        setActiveSearchContext,
        searchResults,
        suggestionResults,
        isLoading,
        performSearch,
        clearSearch,
        selectedItem,
        setSelectedItem,
        registerSearchFunction,
        activeFilters,
        updateFilters,
        filterConfig,
        registerFilterConfig,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};
