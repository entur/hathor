/**
 * The shared filter panel: a popover with one control per field sobek can
 * filter on, and the remaining fields listed as plain text. Controlled and
 * stateless — the trigger (and the active-filter chips) live in `QueryField`;
 * this edits `filters` through `onChange` and works the same above either view.
 */
import { useId } from 'react';
import {
  Autocomplete,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  Popover,
  Stack,
  TextField,
} from '@mui/material';
import type { CollectionFilters, CollectionLabels, Column, FilterFields } from '../types.ts';
import { asList, asText, cleanList, withFilter } from '../utils/filters.ts';

const POPOVER_W = 320,
  BLOCKED_MAX_H = 220;

export interface FilterPanelProps {
  /** Element the panel opens from; `null` keeps it closed. */
  anchor: HTMLElement | null;
  onClose: () => void;
  columns: readonly Column[];
  filterFields: FilterFields;
  filters: CollectionFilters;
  onChange: (filters: CollectionFilters) => void;
  labels: CollectionLabels;
}

/**
 * Render the filter panel.
 *
 * @param anchor       element to open from; `null` = closed
 * @param onClose      close request (outside click, Escape)
 * @param columns      resolved columns (the fields on offer)
 * @param filterFields the entity's `<Entity>FilterFields`
 * @param filters      current conditions
 * @param onChange     receives the whole next `filters` object
 * @param labels       UI strings
 * @returns the popover
 */
export function FilterPanel({
  anchor,
  onClose,
  columns,
  filterFields,
  filters,
  onChange,
  labels,
}: FilterPanelProps): React.ReactNode {
  const open = columns.filter(c => filterFields[c.key]);
  const blocked = columns.filter(c => !filterFields[c.key]);
  const blockedHeading = useId();

  return (
    <Popover
      open={!!anchor}
      anchorEl={anchor}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      slotProps={{
        paper: { role: 'dialog', 'aria-label': labels.filters, sx: { width: POPOVER_W, mt: 0.5 } },
      }}
    >
      <Stack spacing={2} sx={{ p: 2 }}>
        {open.map(c =>
          filterFields[c.key].op === 'contains' ? (
            <TextField
              key={c.key}
              size="small"
              label={c.label}
              value={asText(filters[c.key])}
              onChange={e => onChange(withFilter(filters, c.key, e.target.value))}
            />
          ) : (
            <Autocomplete
              key={c.key}
              multiple
              size="small"
              freeSolo={!c.spec.options}
              // Free text (ids) commits on blur too: leaving the field or the
              // panel must not silently drop what was typed.
              autoSelect={!c.spec.options}
              // Tags read as the column shows its values (a compact `::1004` id).
              getOptionLabel={c.entryLabel}
              options={[...(c.spec.options ?? [])]}
              value={asList(filters[c.key])}
              onChange={(_e, next) => onChange(withFilter(filters, c.key, cleanList(next)))}
              renderInput={params => <TextField {...params} label={c.label} />}
            />
          )
        )}
      </Stack>
      {blocked.length ? (
        <>
          <Divider />
          {/* Plain text under a heading that names the list: these are not
              controls, so they carry no disabled state, and they use the
              secondary text colour, which keeps readable contrast. */}
          <List
            dense
            disablePadding
            aria-labelledby={blockedHeading}
            sx={{ maxHeight: BLOCKED_MAX_H, overflowY: 'auto' }}
          >
            <ListSubheader id={blockedHeading}>{labels.notFilterable}</ListSubheader>
            {blocked.map(c => (
              <ListItem key={c.key} sx={{ color: 'text.secondary' }}>
                <ListItemText primary={c.label} />
              </ListItem>
            ))}
          </List>
        </>
      ) : null}
    </Popover>
  );
}
