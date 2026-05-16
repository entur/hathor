import { TableCell, TableHead, TableRow, TableSortLabel } from '@mui/material';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
  return (
    <TableHead>
      <TableRow>
        {useCompactView && <TableCell padding="none" />}
        {columns.map(col => {
          // `headerLabel` may be either an i18n key or a bare English string;
          // i18next checks the flat-key map first, so unrecognised values fall
          // through to themselves and read as English in both bundles.
          const label = <b>{t(col.headerLabel, col.headerLabel)}</b>;
          return (
            <TableCell key={col.id} align={col.align} sx={col.sx}>
              {col.isSortable ? (
                <TableSortLabel
                  active={orderBy === col.id}
                  direction={orderBy === col.id ? order : 'asc'}
                  onClick={() => onRequestSort(col.id)}
                >
                  {label}
                </TableSortLabel>
              ) : (
                label
              )}
            </TableCell>
          );
        })}
      </TableRow>
    </TableHead>
  );
}
