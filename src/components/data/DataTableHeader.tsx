import { TableCell, TableHead, TableRow, TableSortLabel } from '@mui/material';
import type { ColumnDefinition, Order } from './dataTableTypes.ts';

interface Props<T, K extends string> {
  useCompactView: boolean;
  order: Order;
  orderBy: K;
  onRequestSort: (prop: K) => void;
  columns: ColumnDefinition<T, K>[];
}

export default function DataTableHeader<T, K extends string>({
  useCompactView,
  order,
  orderBy,
  onRequestSort,
  columns,
}: Props<T, K>) {
  return (
    <TableHead>
      <TableRow>
        {useCompactView && <TableCell padding="none" />}
        {columns.map(col => (
          <TableCell key={col.id} align={col.align}>
            {col.isSortable ? (
              <TableSortLabel
                active={orderBy === col.id}
                direction={orderBy === col.id ? order : 'asc'}
                onClick={() => onRequestSort(col.id)}
              >
                <b>{col.headerLabel}</b>
              </TableSortLabel>
            ) : (
              <b>{col.headerLabel}</b>
            )}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}
