import { TableRow, TableCell, Collapse, Box, Typography } from '@mui/material';
import type { ColumnDefinition } from './dataTableTypes.ts';

interface Props<T, K extends string> {
  open: boolean;
  item: T;
  colSpan: number;
  columns: ColumnDefinition<T, K>[];
}

/**
 * A generic, expandable row that displays additional data columns.
 * It's designed to show columns that are hidden in the compact table view.
 */
export default function MobileDetailRow<T, K extends string>({
  open,
  item,
  colSpan,
  columns,
}: Props<T, K>) {
  if (columns.length === 0) {
    return null;
  }

  return (
    <TableRow>
      <TableCell colSpan={colSpan} sx={{ p: 0, borderBottom: 'none' }}>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <Box
            sx={{
              m: 2,
              ml: { xs: 2, sm: 7 },
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: 2,
            }}
          >
            {columns.map(col => (
              <Box key={col.id}>
                <Typography variant="subtitle2" component="div" gutterBottom>
                  <strong>{col.headerLabel}</strong>
                </Typography>
                <Box>{col.renderCell(item)}</Box>
              </Box>
            ))}
          </Box>
        </Collapse>
      </TableCell>
    </TableRow>
  );
}
