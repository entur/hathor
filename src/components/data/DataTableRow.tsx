import { useState } from 'react';
import { TableRow, TableCell, IconButton } from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import type { ColumnDefinition } from './dataTableTypes.ts';
import type { ComponentType } from 'react';

interface Props<T, K extends string> {
  item: T;
  columns: ColumnDefinition<T, K>[];
  useCompactView: boolean;
  DetailRowComponent?: ComponentType<{
    open: boolean;
    item: T;
    colSpan: number;
    columns: ColumnDefinition<T, K>[];
  }>;
  detailColumns: ColumnDefinition<T, K>[];
  colSpan: number;
  handleColumnEvent?: (event: string, column: ColumnDefinition<T, K>, item: T) => void;
}

export default function DataTableRow<T, K extends string>({
  item,
  columns,
  useCompactView,
  DetailRowComponent,
  detailColumns,
  colSpan,
  handleColumnEvent,
}: Props<T, K>) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow
        hover
        onClick={useCompactView ? () => setOpen(o => !o) : undefined}
        sx={{ cursor: useCompactView ? 'pointer' : 'inherit' }}
      >
        {useCompactView && (
          <TableCell padding="none">
            <IconButton
              size="small"
              onClick={e => {
                e.stopPropagation();
                setOpen(o => !o);
              }}
            >
              {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
            </IconButton>
          </TableCell>
        )}
        {columns.map(col => (
          <TableCell key={col.id} align={col.align}>
            {col.renderCell(
              item,
              (event, item) => handleColumnEvent && handleColumnEvent(event, col, item)
            )}
          </TableCell>
        ))}
      </TableRow>
      {useCompactView && DetailRowComponent && (
        <DetailRowComponent open={open} item={item} colSpan={colSpan} columns={detailColumns} />
      )}
    </>
  );
}
