import type { ComponentType } from 'react';
import type { ColumnDefinition, Order } from '../components/data/dataTableTypes';
import type {
  FilterDefinition,
  SearchContextViewType,
  SearchResultItem,
} from '../components/search/searchTypes';

// The return shape of a useData hook
export interface UseDataReturn<T, K extends string> {
  allData: T[] | null;
  totalCount: number;
  loading: boolean;
  error: string | null;
  order: Order;
  orderBy: K;
  handleRequestSort: (property: K) => void;
  page: number;
  rowsPerPage: number;
  setPage: (page: number) => void;
  setRowsPerPage: (rowsPerPage: number) => void;
  addRow?: (newRow: T) => void;
  updateRow?: (updatedRow: T) => void;
}

// The parameters for the useTableLogic hook
export interface UseTableLogicParams<T, K extends string> {
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

// The props for the main page content component (e.g., DataPageContent)
export interface PageContentComponentProps<T, K extends string> {
  data: T[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  order: Order;
  orderBy: K;
  handleRequestSort: (property: K) => void;
  page: number;
  rowsPerPage: number;
  setPage: (page: number) => void;
  setRowsPerPage: (rowsPerPage: number) => void;
  columns: ColumnDefinition<T, K>[];
  title?: string;
  handleColumnEvent?: (event: string, column: ColumnDefinition<T, K>, item: T) => void;
}

// The complete ViewConfig type definition
export interface ViewConfig<T, K extends string> {
  handleColumnEvent?: (event: string, column: ColumnDefinition<T, K>, item: T) => void;
  useData: () => UseDataReturn<T, K>;
  useSearchRegistration: (allData: T[] | null, dataLoading: boolean) => void;
  useTableLogic: (params: UseTableLogicParams<T, K>) => {
    dataForTable: T[];
    currentTotalForTable: number;
  };
  PageContentComponent: ComponentType<PageContentComponentProps<T, K>>;
  columns: ColumnDefinition<T, K>[];
  getFilterKey?: (item: T) => string;
  getSortValue: (item: T, key: K) => string | number;
  filters?: FilterDefinition[];
  title?: string;
}
