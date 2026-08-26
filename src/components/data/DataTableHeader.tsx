import { Box, TableCell, TableHead, TableRow, TableSortLabel, Tooltip } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useTranslation } from 'react-i18next';
import type { ColumnDefinition, Order } from './dataTableTypes.ts';

const LOCK_TOOLTIP_KEY = 'data.table.sortLocked';
const LOCK_TOOLTIP_FALLBACK = 'Close details to change sort';
const LOCK_DIM_OPACITY = 0.55;

interface Props<T, K extends string> {
  useCompactView: boolean;
  order: Order;
  orderBy: K;
  onRequestSort: (prop: K) => void;
  columns: ColumnDefinition<T, K>[];
  /** When true, sortable headers render dimmed, the click is a no-op, and
   *  hover surfaces a lock tooltip. The active-column sort arrow stays
   *  visible so the user retains context on the current order. */
  sortLocked?: boolean;
}

export default function DataTableHeader<T, K extends string>({
  useCompactView,
  order,
  orderBy,
  onRequestSort,
  columns,
  sortLocked = false,
}: Props<T, K>) {
  const { t } = useTranslation();
  const lockText = t(LOCK_TOOLTIP_KEY, LOCK_TOOLTIP_FALLBACK);
  const lockTitle = (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
      <LockOutlinedIcon fontSize="small" />
      <span>{lockText}</span>
    </Box>
  );

  return (
    <TableHead>
      <TableRow>
        {useCompactView && <TableCell padding="none" />}
        {columns.map(col => {
          // `headerLabel` may be either an i18n key or a bare English string;
          // i18next checks the flat-key map first, so unrecognised values fall
          // through to themselves and read as English in both bundles.
          const label = <b>{t(col.headerLabel, col.headerLabel)}</b>;
          if (!col.isSortable) {
            return (
              <TableCell key={col.id} align={col.align} sx={col.sx}>
                {label}
              </TableCell>
            );
          }
          const sortLabel = (
            <TableSortLabel
              active={orderBy === col.id}
              direction={orderBy === col.id ? order : 'asc'}
              onClick={sortLocked ? undefined : () => onRequestSort(col.id)}
              sx={sortLocked ? { opacity: LOCK_DIM_OPACITY, cursor: 'not-allowed' } : undefined}
            >
              {label}
            </TableSortLabel>
          );
          return (
            <TableCell key={col.id} align={col.align} sx={col.sx}>
              {sortLocked ? (
                <Tooltip title={lockTitle} arrow>
                  <span>{sortLabel}</span>
                </Tooltip>
              ) : (
                sortLabel
              )}
            </TableCell>
          );
        })}
      </TableRow>
    </TableHead>
  );
}
