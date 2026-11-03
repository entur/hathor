/**
 * The collection's own toolbar, rendered above either view (so it cannot use
 * the DataGrid's toolbar primitives, which need a mounted grid). Which tools
 * show is the host's whitelist; `columns` and `density` exist in grid view only.
 * The view switch (grid / small cards / large cards) sits at the end, before
 * the host's actions.
 *
 * One row when it fits; on narrower screens the tools after the query field
 * (sort, columns, density, view, actions) wrap onto the next line. Filters never add
 * a row: search and filter share a single `QueryField`, which carries the
 * active filters as chips inside the search box (capped, the rest folded into
 * "+N"), so a filter never pushes a tool onto a new line.
 */
import { useState, type ReactNode } from 'react';
import {
  Box,
  Checkbox,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
} from '@mui/material';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import DensityMediumIcon from '@mui/icons-material/DensityMedium';
import GridViewIcon from '@mui/icons-material/GridView';
import TableRowsIcon from '@mui/icons-material/TableRows';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import type { GridDensity } from '@mui/x-data-grid';
import type {
  CollectionLabels,
  CollectionQuery,
  CollectionTool,
  CollectionView,
  Column,
  FilterFields,
} from '../types.ts';
import { QueryField } from './QueryField.tsx';

const DENSITIES: GridDensity[] = ['compact', 'standard', 'comfortable'];
const GRID_ONLY: readonly CollectionTool[] = ['columns', 'density'];
const SORT_W = 180;
const NO_SORT = ''; // select value for "unsorted"
// The view switch, in its order: rows, many small tiles, fewer big ones.
const VIEW_ICONS: Record<CollectionView, ReactNode> = {
  grid: <TableRowsIcon fontSize="small" />,
  'cards-sm': <ViewModuleIcon fontSize="small" />,
  'cards-big': <GridViewIcon fontSize="small" />,
};
const VIEWS = Object.keys(VIEW_ICONS) as CollectionView[];

/** An icon button that opens a menu; owns its anchor. `children` gets `close`. */
function ToolMenu({
  label,
  icon,
  children,
}: {
  label: string;
  icon: ReactNode;
  children: (close: () => void) => ReactNode;
}): React.ReactNode {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const close = (): void => setAnchor(null);
  return (
    <>
      <Tooltip title={label}>
        <IconButton
          size="small"
          aria-label={label}
          aria-haspopup="menu"
          aria-expanded={!!anchor}
          onClick={e => setAnchor(e.currentTarget)}
        >
          {icon}
        </IconButton>
      </Tooltip>
      <Menu open={!!anchor} anchorEl={anchor} onClose={close}>
        {children(close)}
      </Menu>
    </>
  );
}

export interface CollectionToolbarProps {
  tools: readonly CollectionTool[];
  view: CollectionView;
  onView: (view: CollectionView) => void;
  columns: readonly Column[];
  /** What the filter reaches: `columns` plus filterable fields not shown. */
  filterColumns: readonly Column[];
  filterFields: FilterFields;
  query: CollectionQuery;
  onQuery: (patch: Partial<CollectionQuery>) => void;
  density: GridDensity;
  onDensity: (d: GridDensity) => void;
  hidden: Readonly<Record<string, boolean>>;
  onHidden: (next: Record<string, boolean>) => void;
  labels: CollectionLabels;
  actions?: ReactNode;
}

/**
 * Render the toolbar.
 *
 * @param tools        which tools to show
 * @param view         active view; grid-only tools drop out in either cards view
 * @param onView       receives the view picked on the switch
 * @param columns      resolved columns
 * @param filterColumns what the filter reaches (shown columns + filterable others)
 * @param filterFields the entity's `<Entity>FilterFields`
 * @param query        effective query (its sort names a real column)
 * @param onQuery      receives search / filters / sort patches
 * @param density      grid density
 * @param onDensity    density setter
 * @param hidden       column visibility model (key → `false` when hidden)
 * @param onHidden     visibility setter
 * @param labels       UI strings
 * @param actions      host buttons, rendered last
 * @returns the toolbar row
 */
export function CollectionToolbar({
  tools,
  view,
  onView,
  columns,
  filterColumns,
  filterFields,
  query,
  onQuery,
  density,
  onDensity,
  hidden,
  onHidden,
  labels,
  actions,
}: CollectionToolbarProps): React.ReactNode {
  const has = (tool: CollectionTool): boolean =>
    tools.includes(tool) && (view === 'grid' || !GRID_ONLY.includes(tool));
  // The effective query already drops a sort on a field that is not a column.
  const sorted = query.sort;
  const visible = columns.filter(c => hidden[c.key] !== false).length;

  return (
    <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap', alignItems: 'center' }}>
      <QueryField
        search={has('search')}
        filter={has('filter')}
        columns={filterColumns}
        filterFields={filterFields}
        query={query}
        onQuery={onQuery}
        labels={labels}
      />
      {has('sort') ? (
        <>
          <TextField
            select
            size="small"
            label={labels.sortBy}
            value={sorted?.field ?? NO_SORT}
            onChange={e =>
              onQuery({
                sort: e.target.value ? { field: e.target.value, dir: sorted?.dir ?? 'asc' } : null,
              })
            }
            sx={{ width: SORT_W }}
          >
            <MenuItem value={NO_SORT}>{labels.sortNone}</MenuItem>
            {columns.map(c => (
              <MenuItem key={c.key} value={c.key}>
                {c.label}
              </MenuItem>
            ))}
          </TextField>
          <Tooltip title={labels.sortDirection}>
            <span>
              <IconButton
                size="small"
                aria-label={labels.sortDirection}
                disabled={!sorted}
                onClick={() =>
                  sorted &&
                  onQuery({ sort: { ...sorted, dir: sorted.dir === 'asc' ? 'desc' : 'asc' } })
                }
              >
                {sorted?.dir === 'desc' ? (
                  <ArrowDownwardIcon fontSize="small" />
                ) : (
                  <ArrowUpwardIcon fontSize="small" />
                )}
              </IconButton>
            </span>
          </Tooltip>
        </>
      ) : null}
      {has('columns') ? (
        <ToolMenu label={labels.columns} icon={<ViewColumnIcon fontSize="small" />}>
          {() =>
            columns.map(c => {
              const shown = hidden[c.key] !== false;
              // The last visible column stays: hiding it would leave an empty grid.
              const last = shown && visible === 1;
              return (
                <MenuItem
                  key={c.key}
                  role="menuitemcheckbox"
                  aria-checked={shown}
                  disabled={last}
                  dense
                  onClick={() => !last && onHidden({ ...hidden, [c.key]: !shown })}
                >
                  {/* Visual only: the item already is the checkbox for assistive tech. */}
                  <Checkbox
                    size="small"
                    edge="start"
                    checked={shown}
                    tabIndex={-1}
                    disableRipple
                    slotProps={{ input: { 'aria-hidden': true } }}
                  />
                  {c.label}
                </MenuItem>
              );
            })
          }
        </ToolMenu>
      ) : null}
      {has('density') ? (
        <ToolMenu label={labels.density} icon={<DensityMediumIcon fontSize="small" />}>
          {close =>
            DENSITIES.map(d => (
              <MenuItem
                key={d}
                selected={d === density}
                onClick={() => {
                  onDensity(d);
                  close();
                }}
              >
                {labels.densities[d]}
              </MenuItem>
            ))
          }
        </ToolMenu>
      ) : null}
      <Box sx={{ flex: 1 }} />
      {has('view') ? (
        <ToggleButtonGroup
          exclusive
          size="small"
          value={view}
          onChange={(_e, v: CollectionView | null) => v && onView(v)}
          aria-label={labels.view}
        >
          {VIEWS.map(v => (
            <Tooltip key={v} title={labels.views[v]}>
              <ToggleButton value={v} aria-label={labels.views[v]}>
                {VIEW_ICONS[v]}
              </ToggleButton>
            </Tooltip>
          ))}
        </ToggleButtonGroup>
      ) : null}
      {actions}
    </Stack>
  );
}
