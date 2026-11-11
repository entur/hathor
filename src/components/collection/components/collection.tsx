/**
 * `createEntityCollection` — builds a typed, presentational list component for
 * one entity from its `FIELDS` field mapping: a toolbar, and the rows as a DataGrid
 * or as cards. It owns the query (or mirrors a controlled one), runs the shared
 * pipeline once, and hands the same keyed page to whichever view is active.
 */
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Box, Typography } from '@mui/material';
import type { GridDensity } from '@mui/x-data-grid';
import {
  ALL_TOOLS,
  DEFAULT_LABELS,
  usablePageSize,
  defaultCollectionQuery,
  type CollectionOptions,
  type CollectionQuery,
  type CollectionView,
  type Column,
  type EntityCollectionProps,
  type FieldSpec,
  type FilterFields,
  type RowEdit,
} from '../types.ts';
import { matchRows, pageRows, sortRows } from '../utils/applyQuery.ts';
import { resolveCard, resolveColumns } from '../utils/columns.ts';
import { asList } from '../utils/filters.ts';
import { displayValue, keyRows, rowId, valueList } from '../utils/values.ts';
import { CardsView } from './CardsView.tsx';
import { CollectionPager } from './CollectionPager.tsx';
import { CollectionToolbar } from './CollectionToolbar.tsx';
import { GridView } from './GridView.tsx';

const NO_FILTER_FIELDS: FilterFields = {};

/** The component `createEntityCollection` returns: generic over the row type
 *  (inferred from `rows`), with column and card keys fixed to the field mapping's. */
export type EntityCollection<K extends string> = (<E>(
  props: EntityCollectionProps<E, K>
) => ReactNode) & {
  displayName: string;
};
const DEFAULT_DENSITY: GridDensity = 'standard';
const DEFAULT_VIEW: CollectionView = 'grid';
// The rows never get less than this (a grid header and about three rows): on a screen too
// short for it, e.g. a phone held sideways, the page scrolls instead.
const ROWS_MIN_PX = 240;

/**
 * Build a collection component for one entity.
 *
 * @param fields  the entity's `FIELDS` field mapping (e.g. `vehicleTypeFields`);
 *                its keys become the only valid `columns` / `card` keys
 * @param options `filterFields`: the entity's `<Entity>FilterFields`;
 *                omit and no field is filterable
 * @returns a presentational component taking `rows` plus view / query props
 */
export function createEntityCollection<F extends Record<string, FieldSpec>>(
  fields: F,
  options: CollectionOptions = {}
): EntityCollection<Extract<keyof F, string>> {
  const filterFields = options.filterFields ?? NO_FILTER_FIELDS;

  type K = Extract<keyof F, string>;

  const Collection = <E,>({
    rows,
    view: controlledView,
    onViewChange,
    columns,
    card,
    cardMedia,
    reservedHeightForImg,
    tools,
    actions,
    query: controlled,
    onQueryChange,
    filterMode = 'client',
    labels,
    slotProps,
    editHref,
    editState,
    rowTitle,
    focusEditId,
    initialFilters,
  }: EntityCollectionProps<E, K>): ReactNode => {
    // Back from a record's page, open on the page holding it (#291): the default query
    // neither sorts nor filters, so its rows stand in the host's order.
    const [inner, setInner] = useState<CollectionQuery>(() => {
      const open = initialFilters
        ? { ...defaultCollectionQuery, filters: initialFilters }
        : defaultCollectionQuery;
      // shortcut: the record's page is counted in the unfiltered rows; holds while Back from a
      // record drops the filter (`EntityDetailsShell` navigates to the bare list path).
      const i = focusEditId ? rows.findIndex(r => rowId(r) === focusEditId) : -1;
      return i < 0 ? open : { ...open, page: Math.floor(i / open.pageSize) };
    });
    // One-shot: a link drawn again later (a page turned back to) leaves focus alone.
    const pendingFocus = useRef(focusEditId);
    const [density, setDensity] = useState<GridDensity>(DEFAULT_DENSITY);
    const [innerView, setInnerView] = useState<CollectionView>(DEFAULT_VIEW);
    const view = controlledView ?? innerView;
    const onView = (next: CollectionView): void => {
      if (controlledView === undefined) setInnerView(next);
      onViewChange?.(next);
    };
    const [hidden, setHidden] = useState<Record<string, boolean>>({});

    const L = useMemo(() => ({ ...DEFAULT_LABELS, ...labels }), [labels]);
    // Keyed on identity, so a replaced `render` takes effect; hosts keep `columns` stable.
    const cols = useMemo(
      () => resolveColumns(fields, columns, L.id, L.field),
      [columns, L.id, L.field]
    );
    const resolvedCard = useMemo(
      () => resolveCard(fields, cols, card, L.id, L.field),
      [cols, card, L.id, L.field]
    );
    // Named by the card's title (e.g. "Edit Flirt") in both views.
    // Keyed on what it reads, so an inline `card` or `labels` doesn't rebuild the grid's columns.
    const { title } = resolvedCard;
    const { yes, no } = L;
    const edit = useMemo<RowEdit | undefined>(
      () =>
        editHref && {
          href: editHref as (row: unknown) => string,
          name: rowTitle
            ? (rowTitle as (row: unknown) => string)
            : row => (title ? displayValue(row, title, { yes, no }) : ''),
          state: editState,
          takeFocus: id => {
            if (!id || id !== pendingFocus.current) return false;
            pendingFocus.current = undefined;
            // Still where arrival put it — nowhere, or the page's h1 (`CollectionShell`) — so a
            // late-drawn link doesn't pull the reader out of where they went (e.g. Search).
            const active = document.activeElement;
            return !active || active === document.body || active.tagName === 'H1';
          },
        },
      [editHref, editState, rowTitle, title, yes, no]
    );
    // Filters reach every filterable field, shown or not: a condition the host
    // set on a field outside `columns` is applied here, gets a chip, and matches
    // what `toSobekFilter` sends in server mode.
    const filterCols = useMemo(() => {
      const extra = resolveColumns(fields, Object.keys(filterFields), L.id, L.field).filter(
        f => !cols.some(c => c.key === f.key)
      );
      return [...cols, ...extra];
    }, [cols, L.id, L.field]);

    // The effective query, decided once for every reader (pipeline, toolbar,
    // grid, pager, and the next emit): a usable page size, and no sort on a
    // field that is not a column — the grid would report that one back as an
    // empty sort and rewrite the host's query.
    const raw = controlled ?? inner;
    const query = useMemo<CollectionQuery>(() => {
      const sort = raw.sort && cols.some(c => c.key === raw.sort?.field) ? raw.sort : null;
      return { ...raw, sort, pageSize: usablePageSize(raw.pageSize) };
    }, [raw, cols]);

    // An enum filter offers the values the rows carry, in the mapping's order — never a curated
    // or global list (FORK_DECISIONS, TransportMode) — plus any it already filters on. In server
    // mode the rows are a filtered result already, so the mapping's list stands.
    const offered = useMemo(
      () =>
        filterCols.map(c => {
          const all = c.spec.options;
          if (!all || filterMode === 'server') return c;
          const have = new Set([
            ...rows.flatMap(r => valueList(r, c.spec)),
            ...asList(query.filters[c.key]),
          ]);
          return { ...c, spec: { ...c.spec, options: all.filter(o => have.has(o)) } };
        }),
      [filterCols, rows, query.filters, filterMode]
    );

    // Search looks only at what is on screen: the grid's visible columns, or
    // the fields a card shows. A row is never found by text it does not show.
    const searchCols = useMemo(
      () =>
        view === 'grid'
          ? cols.filter(c => hidden[c.key] !== false)
          : [resolvedCard.title, resolvedCard.subtitle, ...resolvedCard.fields].filter(
              (c): c is Column => !!c
            ),
      [view, cols, hidden, resolvedCard]
    );

    // One memo per stage, keyed on what that stage reads: paging re-slices
    // without re-searching, a sort click re-sorts without re-filtering.
    const matched = useMemo(
      () =>
        matchRows(
          rows,
          filterCols,
          filterFields,
          query.filters,
          query.search,
          filterMode,
          searchCols
        ),
      [rows, filterCols, query.filters, query.search, filterMode, searchCols]
    );
    const sorted = useMemo(() => sortRows(matched, cols, query.sort), [matched, cols, query.sort]);
    const result = useMemo(
      () => pageRows(sorted, query.page, query.pageSize),
      [sorted, query.page, query.pageSize]
    );
    const keyed = useMemo(
      () => keyRows(result.rows, result.page * query.pageSize),
      [result, query.pageSize]
    );

    // Anything but an explicit page change returns to the first page: the page
    // index is only meaningful for the result it was chosen in. A page clamped
    // for display (`pageRows`) is not emitted on its own — no emit happens
    // without a user action — and never leaks: every later emit either sets the
    // page explicitly (the grid reports the clamped one) or resets it to 0.
    const onQuery = (patch: Partial<CollectionQuery>): void => {
      const next: CollectionQuery = { ...query, ...patch, page: patch.page ?? 0 };
      if (controlled === undefined) setInner(next);
      onQueryChange?.(next);
    };

    const activeTools = tools === false ? [] : (tools ?? ALL_TOOLS);

    // A new page, search, filter, sort or view starts at its first row. (The grid scrolls
    // its own body back on a page change; this is the cards' scroller.)
    const rowsRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
      if (rowsRef.current) rowsRef.current.scrollTop = 0;
    }, [query, view]);

    return (
      // In a parent of set height the toolbar and pager stay put and the rows scroll
      // between them (#278); in any other, the collection grows to its content.
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 1.5,
          minWidth: 0,
          flex: 1,
          minHeight: 0,
        }}
      >
        {activeTools.length || actions ? (
          <CollectionToolbar
            tools={activeTools}
            view={view}
            onView={onView}
            columns={cols}
            filterColumns={offered}
            filterFields={filterFields}
            query={query}
            onQuery={onQuery}
            density={density}
            onDensity={setDensity}
            hidden={hidden}
            onHidden={setHidden}
            labels={L}
            actions={actions}
          />
        ) : null}
        <Box
          ref={rowsRef}
          data-testid="collection-rows"
          sx={{
            flex: 1,
            minHeight: ROWS_MIN_PX,
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {view === 'grid' ? (
            <GridView
              rows={keyed}
              columns={cols}
              total={result.total}
              page={result.page}
              query={query}
              onQuery={onQuery}
              density={density}
              hidden={hidden}
              labels={L}
              dataGrid={slotProps?.dataGrid}
              edit={edit}
            />
          ) : result.total === 0 ? (
            <Typography variant="body2" color="text.secondary">
              {L.empty}
            </Typography>
          ) : (
            <CardsView
              rows={keyed}
              card={resolvedCard}
              labels={L}
              media={cardMedia as ((row: unknown) => ReactNode) | undefined}
              reservedHeightForImg={reservedHeightForImg}
              cardProps={slotProps?.card}
              edit={edit}
            />
          )}
        </Box>
        {/* One pager under either view (Linje's Pagination; the grid's own footer is off). */}
        <CollectionPager
          total={result.total}
          page={result.page}
          pageSize={query.pageSize}
          onQuery={onQuery}
          labels={L}
        />
      </Box>
    );
  };
  return Object.assign(Collection, { displayName: 'EntityCollection' });
}
