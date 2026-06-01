import { useState } from 'react';
import { TableRow, TableCell, IconButton } from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import type { ColumnDefinition } from './dataTableTypes.ts';
import type { ComponentType, MouseEvent } from 'react';

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
  onRowClick?: (item: T) => void;
}

export default function DataTableRow<T, K extends string>({
  item,
  columns,
  useCompactView,
  DetailRowComponent,
  detailColumns,
  colSpan,
  handleColumnEvent,
  onRowClick,
}: Props<T, K>) {
  const [open, setOpen] = useState(false);
  const rowOnClick = useCompactView
    ? () => setOpen(o => !o)
    : onRowClick
      ? (e: MouseEvent<HTMLElement>) => {
          // A clickable row may host its own links/buttons (e.g. the vehicle
          // chips in the Vehicles column linking to `/vehicles?selected=…`).
          // Bail when the click originated from an interactive child so the
          // row's navigation doesn't hijack the element's own handler.
          if ((e.target as HTMLElement).closest('a, button')) return;
          onRowClick(item);
        }
      : undefined;

  return (
    <>
      <TableRow hover onClick={rowOnClick} sx={{ cursor: rowOnClick ? 'pointer' : 'inherit' }}>
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
          <TableCell key={col.id} align={col.align} sx={col.sx}>
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
