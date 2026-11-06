import { Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import type { RowEdit } from '../types.ts';
import { rowId } from '../utils/values.ts';

/**
 * A record's Edit link (user test II, F2): a real link to its details page,
 * named "Edit <title>", and marked `data-edit-id` so `CollectionShell` can
 * return focus to it.
 *
 * @param row   the record
 * @param edit  where it links and what it is called
 * @param label the visible text ("Edit")
 * @returns the link
 */
export function EditLink({ row, edit, label }: { row: unknown; edit: RowEdit; label: string }) {
  const name = edit.name(row);
  return (
    <Button
      component={RouterLink}
      to={edit.href(row)}
      state={edit.state}
      size="small"
      data-edit-id={rowId(row)}
      aria-label={name ? `${label} ${name}` : undefined}
    >
      {label}
    </Button>
  );
}
