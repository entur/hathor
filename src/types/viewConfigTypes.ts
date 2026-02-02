import type { ComponentType, ReactNode } from 'react';
import type { ColumnDefinition, Order } from '../components/data/dataTableTypes';
import type {
  FilterDefinition,
  SearchContextViewType,
  SearchResultItem,
} from '../components/search/searchTypes';

/**
 * Return shape of a data-fetching hook used by {@link ViewConfig}.
 *
 * @typeParam T - The entity type displayed in the table.
 * @typeParam K - Union of column key strings.
 */
export interface UseDataReturn<T, K extends string> {
  /** All fetched entities, or `null` while the initial request is in flight. */
  allData: T[] | null;
  /** Total number of entities returned by the backend. */
  totalCount: number;
  /** Whether data is currently being fetched. */
  loading: boolean;
  /** Human-readable error message, or `null` when there is no error. */
  error: string | null;
  /** Current sort direction. */
  order: Order;
  /** Column key the table is currently sorted by. */
  orderBy: K;
  /** Toggle or change the sort column. */
  handleRequestSort: (property: K) => void;
  /** Zero-based page index for pagination. */
  page: number;
  /** Number of rows displayed per page. */
  rowsPerPage: number;
  /** Set the current page index. */
  setPage: (page: number) => void;
  /** Set the number of rows per page. */
  setRowsPerPage: (rowsPerPage: number) => void;
  /** Optimistically append a new row to the local dataset. */
  addRow?: (newRow: T) => void;
  /** Optimistically update an existing row in the local dataset. */
  updateRow?: (updatedRow: T, column: ColumnDefinition<T, K>) => void;
}

/**
 * Parameters passed to the `useTableLogic` hook by {@link GenericDataViewPage}.
 *
 * @typeParam T - The entity type displayed in the table.
 * @typeParam K - Union of column key strings.
 */
export interface UseTableLogicParams<T, K extends string> {
  /** Full dataset as returned by the data hook. */
  allData: T[] | null;
  /** Unfiltered total count from the backend. */
  originalTotalCount: number;
  /** Items matching the current search query. */
  searchResults: SearchResultItem[];
  /** Raw search query string. */
  searchQuery: string;
  /** The autocomplete item the user selected, if any. */
  selectedItem: SearchResultItem | null;
  /** Which search context is active (e.g. `'data'`). */
  activeSearchContext: SearchContextViewType;
  /** Current sort direction. */
  order: Order;
  /** Column key the table is currently sorted by. */
  orderBy: K;
  /** Zero-based page index. */
  page: number;
  /** Rows per page. */
  rowsPerPage: number;
  /** Currently active filter keys. */
  activeFilters: string[];
  /** Derives a filter key from an entity so it can be matched against {@link activeFilters}. */
  getFilterKey?: (item: T) => string;
  /** Derives a comparable value for a given column, used for client-side sorting. */
  getSortValue: (item: T, key: K) => string | number;
}

/**
 * Props injected into the {@link ViewConfig.PageContentComponent} by
 * {@link GenericDataViewPage}.
 *
 * @typeParam T - The entity type displayed in the table.
 * @typeParam K - Union of column key strings.
 */
export interface PageContentComponentProps<T, K extends string> {
  /** Rows to render in the current page. */
  data: T[];
  /** Whether the data source is still loading. */
  loading: boolean;
  /** Error message to display, or `null`. */
  error: string | null;
  /** Total row count (after search/filter) for pagination. */
  totalCount: number;
  /** Current sort direction. */
  order: Order;
  /** Column key the table is currently sorted by. */
  orderBy: K;
  /** Toggle or change the sort column. */
  handleRequestSort: (property: K) => void;
  /** Zero-based page index. */
  page: number;
  /** Rows per page. */
  rowsPerPage: number;
  /** Set the current page index. */
  setPage: (page: number) => void;
  /** Set the number of rows per page. */
  setRowsPerPage: (rowsPerPage: number) => void;
  /** Column definitions driving the table header and cell rendering. */
  columns: ColumnDefinition<T, K>[];
  /** Optional page title rendered above the table. */
  title?: string;
  /** Callback fired when a column-level action is triggered (e.g. inline edit). */
  handleColumnEvent?: (event: string, column: ColumnDefinition<T, K>, item: T) => void;
}

/**
 * Complete configuration object that drives a {@link GenericDataViewPage}.
 *
 * Each page (e.g. VehicleTypeView) assembles a `ViewConfig` and passes it to
 * `GenericDataViewPage` which handles layout, search wiring, sidebar, and pagination.
 *
 * @typeParam T - The entity type displayed in the table.
 * @typeParam K - Union of column key strings.
 */
export interface ViewConfig<T, K extends string> {
  /** Callback fired when a column-level action is triggered. */
  handleColumnEvent?: (event: string, column: ColumnDefinition<T, K>, item: T) => void;
  /** Hook that fetches and manages the entity dataset. */
  useData: () => UseDataReturn<T, K>;
  /** Hook that registers the dataset with the global search context. */
  useSearchRegistration: (allData: T[] | null, dataLoading: boolean) => void;
  /** Hook that filters, sorts, and paginates data for the table. */
  useTableLogic: (params: UseTableLogicParams<T, K>) => {
    dataForTable: T[];
    currentTotalForTable: number;
  };
  /** Component that renders the table and surrounding chrome. */
  PageContentComponent: ComponentType<PageContentComponentProps<T, K>>;
  /** Column definitions for the data table. */
  columns: ColumnDefinition<T, K>[];
  /** Derives a filter key from an entity for client-side filtering. */
  getFilterKey?: (item: T) => string;
  /** Derives a sortable value for a given column key. */
  getSortValue: (item: T, key: K) => string | number;
  /** Filter chips shown in the search bar. */
  filters?: FilterDefinition[];
  /** Page title rendered in the content header. */
  title?: string;
  /**
   * Optional floating action rendered in the bottom-right of the content area.
   * Useful for a MUI `SpeedDial`, `Fab`, or similar overlay component.
   */
  floatingAction?: ReactNode;
}
