/**
 * Grid view: a MUI X DataGrid that only displays. Sorting and paging run in
 * server mode and the grid's own filtering is off — the rows it gets are the
 * shared pipeline's output, already keyed, and header clicks / page changes
 * are reported back as query patches.
 */
import { useMemo } from 'react';
import { Box } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import type {
  DataGridProps,
  GridColDef,
  GridDensity,
  GridSortModel,
  GridValidRowModel,
} from '@mui/x-data-grid';
import { LazyDataGrid } from '../LazyDataGrid.tsx';
import {
  pageSizesFor,
  type CollectionLabels,
  type CollectionQuery,
  type Column,
  type KeyedRow,
  type RowEdit,
} from '../types.ts';
import { EditLink } from './EditLink.tsx';
import { displayValue, EMPTY_TEXT, fullTitle, rawValue } from '../utils/values.ts';

const COL_MIN_W = 120;
const FALLBACK_H = 240;
const NO_SORT: GridSortModel = [];

/** The lazily loaded grid is untyped in its rows, so the getters narrow here. */
const entityOf = (row: GridValidRowModel): unknown => (row as KeyedRow).entity;
/** Module-level, so its identity never changes: the grid rebuilds its row cache when it does. */
const getRowId = (row: GridValidRowModel): string => (row as KeyedRow).key;

const toColDef = (col: Column, labels: Pick<CollectionLabels, 'yes' | 'no'>): GridColDef => {
  const base = { field: col.key, headerName: col.label, flex: 1, minWidth: COL_MIN_W } as const;
  if (col.spec.kind === 'number') {
    return {
      ...base,
      type: 'number',
      valueGetter: (_v, row) => (rawValue(entityOf(row), col.spec) as number | null) ?? null,
    };
  }
  if (col.spec.kind === 'switch') {
    // Missing reads as a dash, as on a card — not as "no".
    return {
      ...base,
      type: 'boolean',
      valueGetter: (_v, row) => {
        const v = rawValue(entityOf(row), col.spec);
        return v == null ? null : Boolean(v);
      },
      renderCell: p =>
        p.value == null ? (
          EMPTY_TEXT
        ) : p.value ? (
          <CheckIcon fontSize="small" color="success" titleAccess={labels.yes} />
        ) : (
          <CloseIcon fontSize="small" sx={{ color: 'text.disabled' }} titleAccess={labels.no} />
        ),
    };
  }
  return {
    ...base,
    valueGetter: (_v, row) => displayValue(entityOf(row), col),
    // Shortened text (a compact id) keeps the full value on hover — the cards' rule too.
    renderCell: p => (
      <Box
        component="span"
        title={fullTitle(entityOf(p.row), col)}
        sx={col.muted ? { color: 'text.secondary' } : undefined}
      >
        {p.value}
      </Box>
    ),
  };
};

/** The column drawn by the entry's `render` when it has one (the value stays text). */
const withRender = (def: GridColDef, { render }: Column): GridColDef =>
  render ? { ...def, renderCell: p => render(entityOf(p.row)) } : def;

const EDIT_FIELD = '__edit'; // never a mapped key: the field mapping keys are field names
const EDIT_COL_W = 96;

/** The trailing Edit-link column: not sortable, not in the Columns chooser. */
const editColDef = (edit: RowEdit, label: string): GridColDef => ({
  field: EDIT_FIELD,
  headerName: label,
  width: EDIT_COL_W,
  sortable: false,
  hideable: false,
  renderCell: p => <EditLink row={entityOf(p.row)} edit={edit} label={label} />,
});

export interface GridViewProps {
  /** The visible page, keyed (`keyRows`). */
  rows: readonly KeyedRow[];
  columns: readonly Column[];
  total: number;
  page: number;
  /** The effective query: its sort names a real column, its page size is usable. */
  query: CollectionQuery;
  onQuery: (patch: Partial<CollectionQuery>) => void;
  density: GridDensity;
  /** Column key → `false` when hidden (the DataGrid's visibility model). */
  hidden: Readonly<Record<string, boolean>>;
  labels: CollectionLabels;
  dataGrid?: Partial<DataGridProps>;
  /** Set → a trailing Edit-link column. */
  edit?: RowEdit;
}

/**
 * Render the visible page as a DataGrid.
 *
 * @param rows     the visible page, keyed
 * @param columns  resolved columns
 * @param total    unpaged row count, for the pager
 * @param page     clamped page index
 * @param query    effective query (sort + page size are read from it)
 * @param onQuery  receives sort / page / pageSize patches
 * @param density  grid density
 * @param hidden   column visibility model
 * @param labels   UI strings
 * @param dataGrid host passthrough, applied before the owned props
 * @param edit     set → a trailing Edit-link column
 * @returns the grid
 */
export function GridView({
  rows,
  columns,
  total,
  page,
  query,
  onQuery,
  density,
  hidden,
  labels,
  dataGrid,
  edit,
}: GridViewProps): React.ReactNode {
  const { yes, no } = labels;
  const colDefs = useMemo(() => {
    const defs = columns.map(c => withRender(toColDef(c, { yes, no }), c));
    return edit ? [...defs, editColDef(edit, labels.edit)] : defs;
  }, [columns, yes, no, edit, labels.edit]);
  const { sort, pageSize } = query;
  // Stable models: the grid re-applies sorting / paging whenever their identity changes.
  const sortModel = useMemo<GridSortModel>(
    () => (sort ? [{ field: sort.field, sort: sort.dir }] : NO_SORT),
    [sort]
  );
  const paginationModel = useMemo(() => ({ page, pageSize }), [page, pageSize]);

  return (
    // In the collection's rows box (a flex column) the grid fills a box of set height, its
    // body scrolling under fixed headers, or sizes to its content in any other.
    <LazyDataGrid
      fallbackHeight={FALLBACK_H}
      disableColumnMenu
      disableRowSelectionOnClick
      {...dataGrid}
      // Owned, after the host's props: the grid's own filter would run a
      // second filter over just this page (`filterMode="server"` stops a host
      // `filterModel` too, not only the UI), and a page size the pager doesn't
      // list (or above 100) breaks the community grid. The collection draws
      // the pager under both views, so the grid's footer stays off. Every row of
      // the page (at most 100) is drawn, so an Edit link below the fold is there
      // to take focus back from the details page.
      disableVirtualization
      disableColumnFilter
      hideFooter
      filterMode="server"
      pageSizeOptions={pageSizesFor(pageSize)}
      rows={rows as KeyedRow[]}
      columns={colDefs}
      getRowId={getRowId}
      density={density}
      columnVisibilityModel={hidden}
      sortingMode="server"
      sortModel={sortModel}
      onSortModelChange={model =>
        onQuery({ sort: model[0]?.sort ? { field: model[0].field, dir: model[0].sort } : null })
      }
      paginationMode="server"
      rowCount={total}
      paginationModel={paginationModel}
      onPaginationModelChange={m => onQuery({ page: m.page, pageSize: m.pageSize })}
      localeText={{ noRowsLabel: labels.empty, ...dataGrid?.localeText }}
    />
  );
}
