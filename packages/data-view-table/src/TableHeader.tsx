import { TableCell, TableHead, TableRow, TableSortLabel } from '@mui/material';
import type { ColumnDefinition, Order } from './types.js';

interface Props<T, K extends string> {
  compact: boolean;
  order: Order;
  orderBy: K;
  onRequestSort: (prop: K) => void;
  columns: ColumnDefinition<T, K>[];
}

export default function TableHeader<T, K extends string>({
  compact,
  order,
  orderBy,
  onRequestSort,
  columns,
}: Props<T, K>) {
  return (
    <TableHead>
      <TableRow>
        {compact && <TableCell padding="none" />}
        {columns.map(col => (
          <TableCell key={col.id} align={col.align} sx={col.sx}>
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
