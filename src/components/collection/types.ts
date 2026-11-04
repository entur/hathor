/**
 * Public types for the schema-driven entity collection (grid / cards list).
 * Presentational: rows come in as a prop; nothing here fetches.
 */
import type { ReactNode } from 'react';
import type { CardProps } from '@mui/material';
import type { DataGridProps, GridDensity } from '@mui/x-data-grid';
import { humanize } from './utils/humanize.ts';

/** Value families a field can hold; `grid` (an array-of-objects relation) never shows in a collection. */
type FieldKind =
  | 'text'
  | 'number'
  | 'name'
  | 'switch'
  | 'enum'
  | 'enumMulti'
  | 'grid'
  | 'reference'
  | 'date'
  | 'datetime';

/** One field of an entity's hand-written field mapping (`<entity>Fields`). */
export interface FieldSpec {
  kind: FieldKind;
  /** Access path into the row (length 1 = top-level; >1 = flattened leaf). */
  path: readonly string[];
  /** Member list for `enum` / `enumMulti` — the filter's suggestions. */
  options?: readonly string[];
  /** Not on sobek's wire yet: a fetched list never carries it, so it is never shown. */
  patched?: boolean;
}

/** A column or card entry: a field mapping key plus overrides. `K` is the field mapping's key
 *  union, `E` the row type. */
export interface FieldEntry<K extends string = string, E = unknown> {
  field: K;
  /** Overrides the humanized default label. */
  label?: string;
  /** Draws the value wherever the field shows (grid cell, card field or title) —
   *  e.g. an icon plus its text. Display only: sort, filter and search still read
   *  the field's text. Read only this field: a filter option is drawn from a row
   *  holding just its value. A field shown only on an explicit `card` (not in `columns`)
   *  has no entry, so no `render`. Hathor's addition to the sandbox interface. */
  render?(row: E): ReactNode;
  /** Text a search also matches, beside the stored value — what `render` shows when it
   *  differs (e.g. a localized enum label). Hathor's addition, with `render`. */
  text?(row: E): string;
}

/** `cards-sm`: compact text cards. `cards-big`: wider cards with room for a
 *  picture at the top (`cardMedia`). */
export type CollectionView = 'grid' | 'cards-sm' | 'cards-big';
/** `view` is the grid / small cards / large cards switch. */
export type CollectionTool = 'search' | 'filter' | 'sort' | 'columns' | 'density' | 'view';
export type FilterOp = 'contains' | 'anyOf';

/** One filterable field: the sobek filter argument it feeds and how it matches. */
export interface FilterFieldSpec {
  arg: string;
  op: FilterOp;
}
/** Field key → filter spec. Hand-written per entity as `<Entity>FilterFields`. */
export type FilterFields = Readonly<Record<string, FilterFieldSpec>>;
/** `contains` takes a string, `anyOf` a string list. */
export type FilterValue = string | readonly string[];

export interface CollectionSort {
  field: string;
  dir: 'asc' | 'desc';
}

/** Everything that decides which rows are shown. Plain and serialisable. */
export interface CollectionQuery {
  /** One condition per field key; AND across fields. */
  filters: Readonly<Record<string, FilterValue>>;
  search: string;
  sort: CollectionSort | null;
  page: number;
  pageSize: number;
}

/** Which fields a card shows. Keys are entity field keys. */
export interface CardSpec<K extends string = string> {
  title: K;
  subtitle?: K;
  fields: K[];
}

/** UI strings. English defaults; localisation is the host's job. */
export interface CollectionLabels {
  search: string;
  searchPlaceholder: string;
  /** Caption of the identity field (`netexId`): column, card, filter, chip. */
  id: string;
  /** Caption of any other field no column entry names — card-only, filter-only or
   *  default columns. Default: the key, humanized. */
  field: (key: string) => string;
  filters: string;
  activeFilters: string;
  /** Appended to a filter chip's accessible name: it is a remove button. */
  removeFilter: string;
  /** Accessible name of the "+N" chip folding the filters not shown. */
  moreFilters: (count: number) => string;
  notFilterable: string;
  sortBy: string;
  sortNone: string;
  sortDirection: string;
  columns: string;
  density: string;
  /** Names of the grid densities in the density menu. */
  densities: Record<GridDensity, string>;
  /** Accessible name of the view switch. */
  view: string;
  /** Names of the views on the view switch (each button's name and tooltip). */
  views: Record<CollectionView, string>;
  empty: string;
  /** The Edit link's text; its accessible name adds the record's title. */
  edit: string;
  /** The pager (after Linje's `Pagination`): its landmark name, the rows shown,
   *  the rows-per-page menu and the page buttons' names. */
  pagination: string;
  showingRows: (from: number, to: number, total: number) => string;
  rowsPerPage: string;
  rowsPerPageMenu: (size: number) => string;
  goToPage: (page: number) => string;
  lastPage: string;
  previousPage: string;
  nextPage: string;
  currentPage: string;
  yes: string;
  no: string;
}

export interface CollectionSlotProps {
  /** Spread onto the DataGrid before the props the collection owns. */
  dataGrid?: Partial<DataGridProps>;
  /** Spread onto every card. */
  card?: CardProps;
}

export interface CollectionOptions {
  /** The entity's `<Entity>FilterFields`. Omit → nothing is filterable. */
  filterFields?: FilterFields;
}

/** `K` is the entity's field-key union, inferred from the field mapping by
 *  `createEntityCollection`, so a misspelt column or card key fails to compile. */
export interface EntityCollectionProps<E, K extends string = string> {
  rows: readonly E[];
  /** Controlled view. Omit for uncontrolled (starts on `'grid'`; the
   *  toolbar's view switch changes it). */
  view?: CollectionView;
  /** Fired with the view picked on the toolbar's switch. */
  onViewChange?: (view: CollectionView) => void;
  /** Whitelist, order, labels and renders. Omit → every eligible field. Keep it stable
   *  (module level or `useMemo`): a new array rebuilds the grid's columns. */
  columns?: readonly (K | FieldEntry<K, E>)[];
  /** Omit → `name` as title plus the first columns. */
  card?: CardSpec<K>;
  /** `cards-big` only: what fills the picture area at the top of a row's card
   *  (an `<img>` fills it, scaled to fit). Omit, or return nothing, and the
   *  area is left blank, so every card keeps the same height. The area is a
   *  size container: `cqh` / `cqw` in the media measure the part that shows,
   *  which a `reservedHeightForImg` cuts from the picture's top. Media with a
   *  `data-card-media-compact` element (a line of text instead of a picture)
   *  shrinks the area to it instead. */
  cardMedia?: (row: E) => ReactNode;
  /** `cards-big` only: the picture area's height in px — all the room the
   *  picture gets, so it sets how tall a big card is. The picture keeps its
   *  16:10 shape at the card's width and stands on the area's bottom edge;
   *  what doesn't fit is cut from its top (a 3D shot's empty sky first).
   *  Omit → the area is the full 16:10. */
  reservedHeightForImg?: number;
  /** Toolbar whitelist; `false` hides the toolbar's tools. Default: all. */
  tools?: readonly CollectionTool[] | false;
  /** Host buttons at the end of the toolbar. */
  actions?: ReactNode;
  /** Controlled query. Omit for uncontrolled. */
  query?: CollectionQuery;
  onQueryChange?: (next: CollectionQuery) => void;
  /** `'client'` (default) applies `filters` to `rows`; `'server'` only emits them. */
  filterMode?: 'client' | 'server';
  labels?: Partial<CollectionLabels>;
  slotProps?: CollectionSlotProps;
  /** The record's details page. Set → an Edit link per grid row and card, named
   *  "Edit <title>" and marked `data-edit-id` (the row's id) for focus return.
   *  Keep it stable (module level): the grid rebuilds its columns when it changes. */
  editHref?: (row: E) => string;
  /** Router state the Edit link carries (e.g. the details page's `{ initialMode: 'edit' }`). */
  editState?: unknown;
}

/** A record's Edit link, as both views draw it. */
export interface RowEdit {
  href: (row: unknown) => string;
  /** The record's title text, for the link's accessible name. */
  name: (row: unknown) => string;
  state?: unknown;
}

/**
 * A resolved, renderable field: mapped key, display label, its `FieldSpec`,
 * and the field's own display and match rules. `resolveColumns` decides those
 * rules once (the identity field compacts and matches on its last segment;
 * every other field shows and matches its text as is), so no view or filter
 * branches on which field it holds.
 */
export interface Column {
  key: string;
  label: string;
  spec: FieldSpec;
  /** The shown text, from the full formatted text. */
  display: (text: string) => string;
  /** Does one of a row's values match one typed filter entry? */
  matches: (have: string, typed: string) => boolean;
  /** A typed filter entry as a chip or tag shows it. */
  entryLabel: (typed: string) => string;
  /** The shown text as a card reads it: the identity adds the row's version
   *  (`::1004/ver3`) — the grid has a Version column, a card does not. */
  cardText: (shown: string, row: unknown) => string;
  /** Shown in the secondary text colour (the identity). */
  muted: boolean;
  /** The entry's `render`, when it has one. */
  render?: (row: unknown) => ReactNode;
  /** The entry's `text`, when it has one: matched by search. */
  text?: (row: unknown) => string;
}

/** A visible row with the unique key both views identify it by. */
export interface KeyedRow {
  key: string;
  entity: unknown;
}

/** The filter conditions of a query, keyed by field. */
export type CollectionFilters = CollectionQuery['filters'];

export interface ResolvedCard {
  title?: Column;
  subtitle?: Column;
  fields: Column[];
}

const PAGE_SIZES = [10, 25, 50, 100];
const DEFAULT_PAGE_SIZE = 25;
/** The community DataGrid throws above this. */
const MAX_PAGE_SIZE = 100;

/**
 * A page size both views can render: a whole number in `1..100`. Anything else
 * (zero, negative, `NaN`) falls back to the default; larger values are capped.
 *
 * @param size the requested page size
 * @returns the usable page size
 */
export const usablePageSize = (size: number): number =>
  Number.isFinite(size) && size >= 1
    ? Math.min(Math.trunc(size), MAX_PAGE_SIZE)
    : DEFAULT_PAGE_SIZE;

/**
 * The pager's size choices, with the current size added when it is not one of
 * the standard ones (a pager cannot show a size it does not list).
 *
 * @param size the current page size
 * @returns ascending size options
 */
export const pageSizesFor = (size: number): number[] =>
  PAGE_SIZES.includes(size) ? PAGE_SIZES : [...PAGE_SIZES, size].sort((a, b) => a - b);

export const ALL_TOOLS: readonly CollectionTool[] = [
  'search',
  'filter',
  'sort',
  'columns',
  'density',
  'view',
];

export const DEFAULT_LABELS: CollectionLabels = {
  search: 'Search',
  searchPlaceholder: 'Search these rows',
  id: 'Id',
  field: humanize,
  filters: 'Filters',
  activeFilters: 'Active filters',
  removeFilter: 'remove filter',
  moreFilters: count => `${count} more filter${count === 1 ? '' : 's'}`,
  notFilterable: 'Not filterable in sobek yet',
  sortBy: 'Sort by',
  sortNone: 'None',
  sortDirection: 'Sort direction',
  columns: 'Columns',
  density: 'Density',
  densities: { compact: 'Compact', standard: 'Standard', comfortable: 'Comfortable' },
  view: 'View',
  views: { grid: 'Table', 'cards-sm': 'Small cards', 'cards-big': 'Large cards' },
  empty: 'No rows',
  edit: 'Edit',
  pagination: 'Pagination',
  showingRows: (from, to, total) => `Showing rows ${from}–${to} of ${total}`,
  rowsPerPage: 'Show',
  rowsPerPageMenu: size => `${size} rows per page, change`,
  goToPage: page => `Go to page ${page}`,
  lastPage: ', last page',
  previousPage: 'Go to previous page',
  nextPage: 'Go to next page',
  currentPage: 'Current page:',
  yes: 'Yes',
  no: 'No',
};

/** The query an uncontrolled collection starts from; also a seed for hosts.
 *  Frozen (filters too): it is shared by every instance and every host. */
export const defaultCollectionQuery: CollectionQuery = Object.freeze({
  filters: Object.freeze({}),
  search: '',
  sort: null,
  page: 0,
  pageSize: DEFAULT_PAGE_SIZE,
});
