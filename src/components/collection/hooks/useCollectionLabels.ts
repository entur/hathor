import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { CollectionLabels } from '../types.ts';

/**
 * The collection's UI strings in the current language — `collection.*` keys,
 * plus the shared `edit`. One source for every entity's collection page.
 *
 * @returns {CollectionLabels} every label, stable until the language changes
 */
export function useCollectionLabels(): CollectionLabels {
  const { t } = useTranslation();
  return useMemo(
    () => ({
      search: t('collection.search'),
      searchPlaceholder: t('collection.searchPlaceholder'),
      id: t('collection.id'),
      filters: t('collection.filters'),
      activeFilters: t('collection.activeFilters'),
      removeFilter: t('collection.removeFilter'),
      moreFilters: count => t('collection.moreFilters', { count }),
      notFilterable: t('collection.notFilterable'),
      sortBy: t('collection.sortBy'),
      sortNone: t('collection.sortNone'),
      sortDirection: t('collection.sortDirection'),
      columns: t('collection.columns'),
      density: t('collection.density'),
      densities: {
        compact: t('collection.density.compact'),
        standard: t('collection.density.standard'),
        comfortable: t('collection.density.comfortable'),
      },
      view: t('collection.view'),
      views: {
        grid: t('collection.view.grid'),
        'cards-sm': t('collection.view.cards-sm'),
        'cards-big': t('collection.view.cards-big'),
      },
      empty: t('collection.empty'),
      edit: t('edit'),
      pagination: t('collection.pagination'),
      showingRows: (from, to, total) => t('collection.showingRows', { from, to, total }),
      rowsPerPage: t('collection.rowsPerPage'),
      rowsPerPageMenu: size => t('collection.rowsPerPageMenu', { size }),
      goToPage: page => t('collection.goToPage', { page }),
      lastPage: t('collection.lastPage'),
      previousPage: t('collection.previousPage'),
      nextPage: t('collection.nextPage'),
      currentPage: t('collection.currentPage'),
      yes: t('collection.yes'),
      no: t('collection.no'),
    }),
    [t]
  );
}
