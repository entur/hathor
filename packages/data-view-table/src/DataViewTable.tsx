import { useRef, useState, type ComponentType, type ReactNode } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material';
import TableHeader from './TableHeader.js';
import DataTableRow from './TableRow.js';
import MobileDetailRow from './MobileDetailRow.js';
import { useTableSort } from './useTableSort.js';
import { useCompactView } from './useCompactView.js';
import type { ColumnDefinition, Order } from './types.js';

export interface DataViewTableProps<T extends { id: string }, K extends string> {
  data: T[] | null;
  totalCount?: number;
  loading?: boolean;
  error?: string | null;
  columns: ColumnDefinition<T, K>[];
  getSortValue: (item: T, key: K) => string | number;

  // Controlled or uncontrolled sort
  defaultSort?: { order: Order; orderBy: K };
  order?: Order;
  orderBy?: K;
  onSortChange?: (order: Order, orderBy: K) => void;

  // Controlled or uncontrolled pagination
  defaultRowsPerPage?: number;
  page?: number;
  rowsPerPage?: number;
  onPageChange?: (page: number) => void;
  onRowsPerPageChange?: (rpp: number) => void;
  rowsPerPageOptions?: number[];

  // Row selection
  onRowClick?: (item: T) => void;
  selectedId?: string;

  // Optional features
  searchQuery?: string;
  activeFilters?: string[];
  getFilterKey?: (item: T) => string;
  title?: string;
  noDataLabel?: string;
  totalLabel?: (n: number) => string;
  handleColumnEvent?: (event: string, col: ColumnDefinition<T, K>, item: T) => void;
  floatingAction?: ReactNode;
}

export function DataViewTable<T extends { id: string }, K extends string>(
  props: DataViewTableProps<T, K>
) {
  const {
    data,
    totalCount,
    loading = false,
    columns,
    getSortValue,
    searchQuery,
    activeFilters,
    getFilterKey,
    title,
    noDataLabel = 'No data to display.',
    totalLabel = n => `${n} entries`,
    onRowClick,
    selectedId,
    handleColumnEvent,
    floatingAction,
    rowsPerPageOptions = [10, 25, 100],
  } = props;

  // Sort state — controlled or uncontrolled
  const [localOrder, setLocalOrder] = useState<Order>(props.defaultSort?.order ?? 'asc');
  const [localOrderBy, setLocalOrderBy] = useState<K>(props.defaultSort?.orderBy ?? ('' as K));
  const order = props.order ?? localOrder;
  const orderBy = props.orderBy ?? localOrderBy;

  const handleRequestSort = (col: K) => {
    const isAsc = orderBy === col && order === 'asc';
    const next: Order = isAsc ? 'desc' : 'asc';
    setLocalOrder(next);
    setLocalOrderBy(col);
    props.onSortChange?.(next, col);
  };

  // Pagination state — controlled or uncontrolled
  const [localPage, setLocalPage] = useState(0);
  const [localRpp, setLocalRpp] = useState(props.defaultRowsPerPage ?? 10);
  const page = props.page ?? localPage;
  const rowsPerPage = props.rowsPerPage ?? localRpp;

  const setPage = (p: number) => {
    setLocalPage(p);
    props.onPageChange?.(p);
  };
  const setRpp = (r: number) => {
    setLocalRpp(r);
    setLocalPage(0);
    props.onRowsPerPageChange?.(r);
    props.onPageChange?.(0);
  };

  // Sort + filter + paginate
  const { rows, filteredCount } = useTableSort({
    data,
    totalCount,
    order,
    orderBy,
    page,
    rowsPerPage,
    getSortValue,
    searchQuery,
    activeFilters,
    getFilterKey,
  });

  // Responsive compact view
  const containerRef = useRef<HTMLDivElement>(null);
  const compact = useCompactView(containerRef, loading);

  const visibleCols = columns.filter(c => c.display !== 'desktop-only' || !compact);
  const detailCols = columns.filter(c => c.display === 'desktop-only');
  const colSpan = visibleCols.length + (compact ? 1 : 0);

  const DetailRow = MobileDetailRow as ComponentType<{
    open: boolean;
    item: T;
    colSpan: number;
    columns: ColumnDefinition<T, K>[];
  }>;

  return (
    <Box
      ref={containerRef}
      sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
    >
      {title && (
        <Box p={2}>
          <Typography variant="h4" component="h2" align="center">
            {title}
          </Typography>
        </Box>
      )}
      <Box px={2} pb={1}>
        <Typography>{totalLabel(filteredCount)}</Typography>
      </Box>

      <TableContainer sx={{ flexGrow: 1, minHeight: 0, overflow: 'auto' }}>
        <Table stickyHeader>
          <TableHeader
            compact={compact}
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
            columns={visibleCols}
          />
          <TableBody>
            {rows.map(item => (
              <DataTableRow
                key={item.id}
                item={item}
                compact={compact}
                selected={selectedId === item.id}
                onRowClick={onRowClick}
                columns={visibleCols}
                DetailRowComponent={DetailRow}
                detailColumns={detailCols}
                colSpan={colSpan}
                handleColumnEvent={handleColumnEvent}
              />
            ))}
            {rows.length === 0 && !loading && (
              <TableRow>
                <TableCell colSpan={colSpan} align="center">
                  {noDataLabel}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
        {floatingAction}
        <TablePagination
          rowsPerPageOptions={rowsPerPageOptions}
          component="div"
          count={filteredCount}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(_, p) => setPage(p)}
          onRowsPerPageChange={e => setRpp(parseInt(e.target.value, 10))}
        />
      </Box>
    </Box>
  );
}
