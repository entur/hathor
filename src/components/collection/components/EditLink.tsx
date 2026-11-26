import { IconButton, Tooltip } from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { Link as RouterLink } from 'react-router-dom';
import type { RowEdit } from '../types.ts';
import { rowId } from '../utils/values.ts';

/**
 * A record's Edit link (user test II, F2): a real link to its details page, drawn as Linje's
 * pencil IconButton with an "Edit" tooltip, named "Edit <title>", and marked `data-edit-id`.
 * The collection's `focusEditId` record's link focuses itself as it is drawn (#291).
 *
 * @param row   the record
 * @param edit  where it links and what it is called
 * @param label the tooltip and name prefix ("Edit")
 * @returns the link
 */
export function EditLink({ row, edit, label }: { row: unknown; edit: RowEdit; label: string }) {
  const name = edit.name(row);
  const id = rowId(row);
  return (
    <Tooltip title={label}>
      <IconButton
        ref={(el: HTMLElement | null) => {
          if (el && edit.takeFocus(id)) el.focus();
        }}
        component={RouterLink}
        to={edit.href(row)}
        state={edit.state}
        data-edit-id={id}
        aria-label={name ? `${label} ${name}` : label}
      >
        <EditOutlinedIcon />
      </IconButton>
    </Tooltip>
  );
}
