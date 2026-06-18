import { TableRow, TableCell, Collapse, Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import type { ColumnDefinition } from './dataTableTypes.ts';

interface Props<T, K extends string> {
  open: boolean;
  item: T;
  colSpan: number;
  columns: ColumnDefinition<T, K>[];
  handleColumnEvent?: (event: string, column: ColumnDefinition<T, K>, item: T) => void;
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
  handleColumnEvent,
}: Props<T, K>) {
  // `headerLabel` may be an i18n key or a bare string — resolve it the same way
  // DataTableHeader does, so compact-view labels are translated, not raw keys.
  const { t } = useTranslation();

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
                  <strong>{t(col.headerLabel, col.headerLabel)}</strong>
                </Typography>
                <Box>
                  {col.renderCell(
                    item,
                    (event, item) => handleColumnEvent && handleColumnEvent(event, col, item)
                  )}
                </Box>
              </Box>
            ))}
          </Box>
        </Collapse>
      </TableCell>
    </TableRow>
  );
}
