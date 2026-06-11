import { useRef, type ComponentType, type ReactNode } from 'react';
import { useContainerResponsiveView } from '../../hooks/useContainerResponsiveView';
import {
  Box,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material';
import DataTableHeader from './DataTableHeader.tsx';
import DataTableRow from './DataTableRow.tsx';
import HeadBreadcrumbs from './HeadBreadcrumbs.tsx';
import { useTranslation } from 'react-i18next';
import type { Order, ColumnDefinition } from './dataTableTypes.ts';
import MobileDetailRow from './MobileDetailRow.tsx';
import type { UrlFilterInfo } from '../../pages/viewConfigTypes.ts';

const COMPACT_VIEW_THRESHOLD = 700;

interface DataPageContentProps<T, K extends string> {
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
  /** i18n key for the title; resolved here and used for the breadcrumb leaf. Takes precedence over {@link title}. */
  titleKey?: string;
  handleColumnEvent?: (event: string, column: ColumnDefinition<T, K>, item: T) => void;
  onRowClick?: (item: T) => void;
  /** NeTEx id of the row currently shown in the sidebar editor; that row gets a highlight. */
  selectedId?: string | null;
  /** "Add new" action, right-aligned in the list-head. */
  addAction?: ReactNode;
  /** "Import" action, right-aligned in the list-head after {@link addAction}. */
  importAction?: ReactNode;
  urlFilterInfo?: UrlFilterInfo;
  /** Forwarded to {@link DataTableHeader}; when true, every sortable header
   *  is dimmed, click is suppressed, and hover shows the lock tooltip. */
  sortLocked?: boolean;
}

export default function DataPageContent<
  T extends { id: string; version?: number },
  K extends string,
>({
  data,
  loading,
  totalCount,
  order,
  orderBy,
  handleRequestSort,
  page,
  rowsPerPage,
  setPage,
  setRowsPerPage,
  columns,
  title,
  titleKey,
  handleColumnEvent,
  onRowClick,
  selectedId,
  addAction,
  importAction,
  urlFilterInfo,
  sortLocked,
}: DataPageContentProps<T, K>) {
  const { t } = useTranslation();
  const resolvedTitle = titleKey ? t(titleKey) : title;
  const hasActions = Boolean(addAction || importAction);
  const containerRef = useRef<HTMLDivElement>(null);
  const compact = useContainerResponsiveView(containerRef, COMPACT_VIEW_THRESHOLD, loading);

  const visibleColumns = columns.filter(col => col.display !== 'desktop-only' || !compact);
  const detailColumns = columns.filter(col => col.display === 'desktop-only');
  const colSpan = visibleColumns.length + (compact ? 1 : 0);

  const detailComponent = MobileDetailRow as ComponentType<{
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
      {resolvedTitle && (
        <Box px={2} pt={2} pb={0.5}>
          <HeadBreadcrumbs title={resolvedTitle} />
        </Box>
      )}
      <Box px={2} pb={1} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {resolvedTitle && (
          <Typography variant="h5" component="h2">
            {resolvedTitle}
          </Typography>
        )}
        <Typography data-testid="total-entries" data-count={totalCount}>
          {t('data.totalEntries', { count: totalCount })}
        </Typography>
        {urlFilterInfo && urlFilterInfo.filterCount > 0 && (
          <Chip
            label={t('data.filteredCount', 'Filtering on IDs', {
              count: urlFilterInfo.filterCount,
            })}
            onDelete={urlFilterInfo.clearUrlFilters}
            color="primary"
            size="small"
            data-testid="url-filter-chip"
            data-filter-count={urlFilterInfo.filterCount}
          />
        )}
        {hasActions && (
          <>
            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {addAction}
              {importAction}
            </Box>
          </>
        )}
      </Box>

      <TableContainer sx={{ flexGrow: 1, minHeight: 0, overflow: 'auto' }}>
        <Table stickyHeader>
          <DataTableHeader
            useCompactView={compact}
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
            columns={visibleColumns}
            sortLocked={sortLocked}
          />
          <TableBody>
            {data.map(item => (
              <DataTableRow
                key={`${item.id}-${item.version ?? ''}`}
                item={item}
                useCompactView={compact}
                columns={visibleColumns}
                DetailRowComponent={detailComponent}
                detailColumns={detailColumns}
                colSpan={colSpan}
                handleColumnEvent={handleColumnEvent}
                onRowClick={onRowClick}
                selected={selectedId != null && item.id === selectedId}
              />
            ))}
            {data.length === 0 && !loading && (
              <TableRow data-testid="no-data-row">
                <TableCell colSpan={colSpan} align="center">
                  {t('data.noResults', 'No data to display.')}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={totalCount}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(_, newPage) => setPage(newPage)}
            onRowsPerPageChange={event => {
              setRowsPerPage(parseInt(event.target.value, 10));
              setPage(0);
            }}
            labelRowsPerPage={t('data.pagination.rowsPerPage', 'Rows per page:')}
            labelDisplayedRows={({ from, to, count }) =>
              count === -1
                ? t('data.pagination.displayedRowsOfMore', {
                    from,
                    to,
                    count: to,
                    defaultValue: '{{from}}–{{to}} of more than {{count}}',
                  })
                : t('data.pagination.displayedRows', {
                    from,
                    to,
                    count,
                    defaultValue: '{{from}}–{{to}} of {{count}}',
                  })
            }
            data-testid="table-pagination"
            slotProps={{
              displayedRows: {
                'data-testid': 'pagination-displayed-rows',
                'data-count': totalCount,
              } as React.HTMLAttributes<HTMLParagraphElement>,
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}
