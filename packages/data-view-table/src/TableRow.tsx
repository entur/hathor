import { useState } from 'react';
import { TableRow as MuiTableRow, TableCell, IconButton } from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import type { ColumnDefinition } from './types.js';
import type { ComponentType } from 'react';

interface Props<T, K extends string> {
  item: T;
  columns: ColumnDefinition<T, K>[];
  compact: boolean;
  selected?: boolean;
  onRowClick?: (item: T) => void;
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

export default function TableRow<T, K extends string>({
  item,
  columns,
  compact,
  selected,
  onRowClick,
  DetailRowComponent,
  detailColumns,
  colSpan,
  handleColumnEvent,
}: Props<T, K>) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <MuiTableRow
        hover
        selected={selected}
        onClick={() => {
          if (compact) setOpen(o => !o);
          onRowClick?.(item);
        }}
        sx={{ cursor: compact || onRowClick ? 'pointer' : 'inherit' }}
      >
        {compact && (
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
          <TableCell key={col.id} align={col.align} sx={col.sx}>
            {col.renderCell(
              item,
              (event, item) => handleColumnEvent && handleColumnEvent(event, col, item)
            )}
          </TableCell>
        ))}
      </MuiTableRow>
      {compact && DetailRowComponent && (
        <DetailRowComponent open={open} item={item} colSpan={colSpan} columns={detailColumns} />
      )}
    </>
  );
}
