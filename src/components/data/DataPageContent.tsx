import { useRef, type ComponentType } from 'react';
import { useContainerResponsiveView } from '../../hooks/useContainerResponsiveView';
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
import DataTableHeader from './DataTableHeader.tsx';
import DataTableRow from './DataTableRow.tsx';
import { useTranslation } from 'react-i18next';
import type { Order, ColumnDefinition } from './dataTableTypes.ts';
import MobileDetailRow from './MobileDetailRow.tsx';

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
  handleColumnEvent?: (event: string, column: ColumnDefinition<T, K>, item: T) => void;
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
  handleColumnEvent,
}: DataPageContentProps<T, K>) {
  const { t } = useTranslation();
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
      {title && (
        <Box p={2}>
          <Typography variant="h4" component="h2" align="center">
            {title}
          </Typography>
        </Box>
      )}
      <Box px={2} pb={1}>
        <Typography>{t('data.totalEntries', { count: totalCount })}</Typography>
      </Box>

      <TableContainer sx={{ flexGrow: 1, overflow: 'auto' }}>
        <Table stickyHeader>
          <DataTableHeader
            useCompactView={compact}
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
            columns={visibleColumns}
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
              />
            ))}
            {data.length === 0 && !loading && (
              <TableRow>
                <TableCell colSpan={colSpan} align="center">
                  {t('data.noResults', 'No data to display.')}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

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
      />
    </Box>
  );
}
