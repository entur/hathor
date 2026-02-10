import { useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSearch } from '../components/search';

const FILTER_PARAM = 'filter';

interface UseUrlFiltersResult {
  hasUrlFilters: boolean;
  filterCount: number;
  clearUrlFilters: () => void;
}

/**
 * Bidirectional sync between URL query params and SearchContext.activeFilters.
 * - On mount or URL change: parses ?filter=ID1,ID2 and calls updateFilters()
 * - Exposes clearUrlFilters() to remove the URL param and clear filters
 */
export function useUrlFilters(): UseUrlFiltersResult {
  const [searchParams, setSearchParams] = useSearchParams();
  const { updateFilters, setActiveSearchContext, activeSearchContext } = useSearch();
  const lastAppliedFilterRef = useRef<string | null>(null);

  // Parse filter IDs from URL
  const filterParam = searchParams.get(FILTER_PARAM);
  const filterIds = filterParam ? filterParam.split(',').filter(id => id.trim()) : [];

  // First effect: set the search context to 'data' if we have URL filters
  useEffect(() => {
    if (filterIds.length > 0 && activeSearchContext !== 'data') {
      setActiveSearchContext('data');
    }
  }, [filterIds.length, activeSearchContext, setActiveSearchContext]);

  // Second effect: apply filters after context is set to 'data'
  // Re-applies when filterParam changes (e.g., after import navigation)
  useEffect(() => {
    // Skip if filter hasn't changed
    if (filterParam === lastAppliedFilterRef.current) return;

    if (activeSearchContext === 'data' && filterIds.length > 0) {
      // Use setTimeout to ensure this runs after SearchContext's clearSearch effect
      const timeoutId = setTimeout(() => {
        updateFilters(filterIds);
        lastAppliedFilterRef.current = filterParam;
      }, 0);
      return () => clearTimeout(timeoutId);
    } else if (!filterParam) {
      // Clear filters when URL param is removed
      lastAppliedFilterRef.current = null;
    }
  }, [activeSearchContext, filterIds, filterParam, updateFilters]);

  const clearUrlFilters = useCallback(() => {
    updateFilters([]);
    setSearchParams(params => {
      params.delete(FILTER_PARAM);
      return params;
    });
  }, [updateFilters, setSearchParams]);

  const hasUrlFilters = !!filterParam && filterParam.length > 0;

  return {
    hasUrlFilters,
    filterCount: filterIds.length,
    clearUrlFilters,
  };
}
