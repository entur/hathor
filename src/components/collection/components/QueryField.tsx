/**
 * Search and filter as one query field. The active filters sit as chips at the
 * start of the search box, the typed text follows them, and the filter button
 * closes the field — so the field reads in the order the query runs: these
 * filters, then this search within what they left. That ordering is what the
 * old "(from cached filter)" caption had to spell out.
 *
 * At most `MAX_TOKENS` chips show; the rest fold into a "+N" chip that opens
 * the panel, so filters never push the rest of the toolbar onto a new line.
 */
import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import {
  Badge,
  Box,
  Button,
  Chip,
  IconButton,
  InputAdornment,
  TextField,
  Tooltip,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import SearchIcon from '@mui/icons-material/Search';
import type { CollectionLabels, CollectionQuery, Column, FilterFields } from '../types.ts';
import { activeFilterColumns, chipText, withFilter } from '../utils/filters.ts';
import { FilterPanel } from './FilterPanel.tsx';

const MAX_TOKENS = 2,
  MAX_TOKENS_NARROW = 1; // chips shown before the rest fold into "+N"
const TOKEN_VALUE_MAX = 14; // characters of a chip's value before it is cut
const FIELD_W = 280,
  FIELD_W_FILTERED = 620; // the field widens while it carries chips
const INPUT_MIN_CH = 10,
  INPUT_MIN_CH_NARROW = 6; // typed text keeps this much room beside the chips
/** A compact count that stays inside the field's border. */
const BADGE_SX = {
  '& .MuiBadge-badge': { fontSize: '0.65rem', height: 16, minWidth: 16, px: 0.5 },
} as const;
const ELLIPSIS = '…';
const FIELD = '\u0000field'; // focus target: the input, never a column key

const shorten = (text: string): string =>
  text.length > TOKEN_VALUE_MAX ? `${text.slice(0, TOKEN_VALUE_MAX - 1)}${ELLIPSIS}` : text;

export interface QueryFieldProps {
  /** Render the text input (`'search'` tool). */
  search: boolean;
  /** Render the filter button, chips and panel (`'filter'` tool). */
  filter: boolean;
  columns: readonly Column[];
  filterFields: FilterFields;
  query: CollectionQuery;
  onQuery: (patch: Partial<CollectionQuery>) => void;
  labels: CollectionLabels;
}

/**
 * Render the query field: search input with filter chips and the filter
 * button inside it. With search trimmed, the button and chips stand alone on
 * the same line; with filtering trimmed, a plain search box.
 *
 * @param search       show the text input
 * @param filter       show the filter button, chips and panel
 * @param columns      resolved columns
 * @param filterFields the entity's `<Entity>FilterFields`
 * @param query        current query
 * @param onQuery      receives search / filters patches
 * @param labels       UI strings
 * @returns the field, or `null` when both tools are trimmed
 */
export function QueryField({
  search,
  filter,
  columns,
  filterFields,
  query,
  onQuery,
  labels,
}: QueryFieldProps): React.ReactNode {
  const anchorRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const chipRefs = useRef(new Map<string, HTMLDivElement>());
  // Where focus goes once a chip removal has re-rendered: a chip's key, or
  // `FIELD` for the input (or the Filters button with search trimmed). Without
  // it, focus falls to <body> with the removed chip.
  const focusNext = useRef<string | null>(null);
  const [open, setOpen] = useState(false);
  // Below `sm` the field is about as wide as the screen: one chip, then "+N".
  // Material's useTheme falls back to the default theme when the host has no provider.
  const narrow = useMediaQuery(useTheme().breakpoints.down('sm'));

  const active = filter ? activeFilterColumns(columns, filterFields, query.filters) : [];
  const activeKeys = active.map(c => c.key).join('\u0000');

  useEffect(() => {
    const target = focusNext.current;
    if (target === null) return;
    focusNext.current = null;
    (chipRefs.current.get(target) ?? inputRef.current ?? buttonRef.current)?.focus();
  }, [activeKeys]);

  if (!search && !filter) return null;

  const shown = active.slice(0, narrow ? MAX_TOKENS_NARROW : MAX_TOKENS);
  const folded = active.length - shown.length;
  const openPanel = (): void => setOpen(true);
  const remove = (key: string): void =>
    onQuery({ filters: withFilter(query.filters, key, undefined) });
  /** Remove from a chip, and keep focus on the chip row: next filter, else
   *  previous, else the field. Uses every active filter, not just the shown
   *  chips — removing one unfolds the next, which is where focus should land. */
  const removeFromChip = (key: string): void => {
    const at = active.findIndex(c => c.key === key);
    focusNext.current = active[at + 1]?.key ?? active[at - 1]?.key ?? FIELD;
    remove(key);
  };

  const tokens = active.length ? (
    // Chips give way before anything else: they shrink to an ellipsis (full text
    // in `title`), so the text area and the filter button always keep their room.
    <Box
      role="group"
      aria-label={labels.activeFilters}
      sx={{ display: 'flex', gap: 0.5, minWidth: 0, flexShrink: 1 }}
    >
      {shown.map(c => {
        const full = chipText(query.filters[c.key]);
        const text = `${c.label}: ${shorten(chipText(query.filters[c.key], c.entryLabel))}`;
        return (
          <Chip
            key={c.key}
            ref={(el: HTMLDivElement | null) => {
              if (el) chipRefs.current.set(c.key, el);
              else chipRefs.current.delete(c.key);
            }}
            size="small"
            sx={{ minWidth: 0, flexShrink: 1 }}
            label={text}
            title={`${c.label}: ${full}`}
            aria-label={`${text}, ${labels.removeFilter}`}
            onDelete={() => removeFromChip(c.key)}
          />
        );
      })}
      {folded ? (
        <Chip
          size="small"
          variant="outlined"
          sx={{ flexShrink: 0 }}
          label={`+${folded}`}
          aria-label={labels.moreFilters(folded)}
          onClick={openPanel}
        />
      ) : null}
    </Box>
  ) : null;

  // One trigger, two shapes: an icon at the field's end, or a labelled button
  // when search is trimmed. Same name, popup state, badge and action either way.
  const badge = (
    <Badge badgeContent={active.length} color="primary" overlap="circular" sx={BADGE_SX}>
      <FilterListIcon fontSize="small" />
    </Badge>
  );
  const triggerProps = {
    'aria-label': labels.filters,
    'aria-haspopup': 'dialog',
    'aria-expanded': open,
    onClick: openPanel,
  } as const;

  const panel = filter ? (
    <FilterPanel
      anchor={open ? anchorRef.current : null}
      onClose={() => setOpen(false)}
      columns={columns}
      filterFields={filterFields}
      filters={query.filters}
      onChange={filters => onQuery({ filters })}
      labels={labels}
    />
  ) : null;

  // Backspace in an empty field takes the last filter back, as token fields do.
  // On the input itself: the chips sit beside it, so their own Backspace never reaches it.
  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>): void => {
    const last = active[active.length - 1];
    if (e.key === 'Backspace' && !query.search && last) remove(last.key);
  };

  if (!search) {
    return (
      <Box
        data-query-field
        ref={anchorRef}
        sx={{ display: 'flex', alignItems: 'center', gap: 1, minHeight: 40 }}
      >
        <Button ref={buttonRef} size="small" startIcon={badge} {...triggerProps}>
          {labels.filters}
        </Button>
        {tokens}
        {panel}
      </Box>
    );
  }

  return (
    <Box
      data-query-field
      sx={{ width: active.length ? FIELD_W_FILTERED : FIELD_W, maxWidth: '100%' }}
    >
      <TextField
        ref={anchorRef}
        inputRef={inputRef}
        fullWidth
        size="small"
        placeholder={labels.searchPlaceholder}
        value={query.search}
        onChange={e => onQuery({ search: e.target.value })}
        slotProps={{
          htmlInput: {
            'aria-label': labels.search,
            onKeyDown,
            // Basis 0, growing into what is left: the chips keep their natural
            // width until space runs out, and only then shrink.
            style: {
              width: 0,
              flexGrow: 1,
              minWidth: `${narrow ? INPUT_MIN_CH_NARROW : INPUT_MIN_CH}ch`,
            },
          },
          input: {
            startAdornment: (
              <InputAdornment
                position="start"
                sx={{ gap: 1, maxHeight: 'none', mr: 0.5, minWidth: 0, flexShrink: 1 }}
              >
                <SearchIcon fontSize="small" color="action" />
                {tokens}
              </InputAdornment>
            ),
            endAdornment: filter ? (
              <InputAdornment position="end" sx={{ flexShrink: 0 }}>
                <Tooltip title={labels.filters}>
                  <IconButton size="small" {...triggerProps}>
                    {badge}
                  </IconButton>
                </Tooltip>
              </InputAdornment>
            ) : undefined,
          },
        }}
      />
      {panel}
    </Box>
  );
}
