// @vitest-environment jsdom
/**
 * Contract tests for `createEntityCollection`, run per fixture registry.
 * Rows, labels and filterable fields are derived from the registry and its
 * filter map, so another entity's registry is covered by adding it to `ENTITIES`.
 */
import { beforeAll, describe, it, expect, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { humanize } from '../utils/humanize.ts';
import {
  defaultCollectionQuery,
  type EntityCollectionProps,
  type FieldSpec,
  type FilterFields,
} from '../types.ts';
import { resolveColumns } from '../utils/columns.ts';
import { createEntityCollection } from './collection.tsx';

// The grid is lazily imported. Load its module once up front, so the first
// grid test here doesn't spend its whole `findBy` wait importing it
// (borderline when every test file runs in parallel).
beforeAll(async () => {
  await import('@mui/x-data-grid');
});

const ROW_COUNT = 3;
const GRID_SLOT = { dataGrid: { disableVirtualization: true } };

/** A VehicleType-shaped registry: two top-level text fields, a nested name, and
 *  a patched and a grid field the collection must never show. */
const VEHICLE_TYPE_FIELDS: Record<string, FieldSpec> = {
  netexId: { kind: 'text', path: ['netexId'] },
  name: { kind: 'name', path: ['name'] },
  shortName: { kind: 'text', path: ['shortName'] },
  transportMode: { kind: 'enum', path: ['transportMode'], options: ['bus', 'rail'] },
  propulsionTypes: {
    kind: 'enumMulti',
    path: ['propulsionTypes'],
    options: ['diesel', 'electric'],
  },
  lowFloor: { kind: 'switch', path: ['lowFloor'] },
  length: { kind: 'number', path: ['length'] },
  deckPlanName: { kind: 'name', path: ['deckPlan', 'name'] },
  manufacturer: { kind: 'text', path: ['manufacturer'], patched: true },
  vehicles: { kind: 'grid', path: ['vehicles'] },
};
/** Sobek's `VehicleTypeFilter` arguments. */
const VEHICLE_TYPE_FILTER_FIELDS: FilterFields = {
  netexId: { arg: 'netexIds', op: 'anyOf' },
  transportMode: { arg: 'transportModes', op: 'anyOf' },
  name: { arg: 'name', op: 'contains' },
};
const ENTITIES = [
  { entity: 'VehicleType', fields: VEHICLE_TYPE_FIELDS, filterFields: VEHICLE_TYPE_FILTER_FIELDS },
];

/** Rows built from the registry: every top-level text / name field gets a
 *  value unique to its row, so any of them can serve as a search needle. */
const makeRows = (fields: Record<string, FieldSpec>, n: number): Record<string, unknown>[] =>
  Array.from({ length: n }, (_, i) =>
    Object.fromEntries(
      Object.entries(fields).flatMap(([key, spec]): [string, unknown][] =>
        spec.path.length !== 1
          ? []
          : spec.kind === 'text'
            ? [[key, `${key}-${i}`]]
            : spec.kind === 'name'
              ? [[key, { value: `${key}-${i}` }]]
              : []
      )
    )
  );

describe('typed keys', () => {
  const _TYPED = createEntityCollection({
    a: { kind: 'text', path: ['a'] } as FieldSpec,
    b: { kind: 'text', path: ['b'] } as FieldSpec,
  });
  type Props = Parameters<typeof _TYPED>[0];

  it('checks column and card keys against the registry at compile time', () => {
    const ok: Props = {
      rows: [],
      columns: ['a', { field: 'b', label: 'B' }],
      card: { title: 'a', fields: ['b'] },
    };
    // @ts-expect-error — 'c' is not a field of the registry
    const badColumn: Props = { rows: [], columns: ['c'] };
    // @ts-expect-error — 'c' is not a field of the registry
    const badCard: Props = { rows: [], card: { title: 'c', fields: [] } };
    expect([ok, badColumn, badCard]).toHaveLength(3);
  });
});

describe('defaultCollectionQuery', () => {
  it('is frozen, filters included, so no host or instance can change the shared seed', () => {
    expect(Object.isFrozen(defaultCollectionQuery)).toBe(true);
    expect(Object.isFrozen(defaultCollectionQuery.filters)).toBe(true);
  });
});

describe.each(ENTITIES)('$entity collection', ({ entity, fields, filterFields }) => {
  const Collection = createEntityCollection(fields, { filterFields });
  const rows = makeRows(fields, ROW_COUNT);
  const cols = resolveColumns(fields);
  const textCol = cols.find(c => c.spec.kind === 'text' && c.spec.path.length === 1);
  if (!textCol) throw new Error(`${entity} has no top-level text column to drive the tests with`);
  const needle = `${textCol.key}-1`;
  const otherText = cols.find(
    c => c.spec.kind === 'text' && c.spec.path.length === 1 && c.key !== textCol.key
  );
  if (!otherText)
    throw new Error(`${entity} has no second top-level text column to drive the tests with`);

  const mount = async (props: Partial<EntityCollectionProps<Record<string, unknown>>> = {}) => {
    await act(async () => {
      render(<Collection rows={rows} slotProps={GRID_SLOT} {...props} />);
    });
  };
  const gridRows = async (): Promise<number> => (await screen.findAllByRole('row')).length - 1; // minus header

  it('never offers a patched or grid field', () => {
    const banned = Object.entries(fields)
      .filter(([, s]) => s.patched || s.kind === 'grid')
      .map(([k]) => k);
    expect(cols.map(c => c.key).filter(k => banned.includes(k))).toEqual([]);
  });

  it.each(['cards-sm', 'cards-big'] as const)('shows every row as a card in %s', async view => {
    await mount({ view });
    expect(screen.getAllByRole('listitem')).toHaveLength(ROW_COUNT);
  });

  it("fills a big card's picture area from cardMedia, per row; small cards have none", async () => {
    const cardMedia = (row: Record<string, unknown>) => <img alt={String(row[textCol.key])} />;
    await mount({ view: 'cards-big', cardMedia });
    const items = screen.getAllByRole('listitem');
    items.forEach((item, i) =>
      expect(within(item).getByRole('img').getAttribute('alt')).toBe(`${textCol.key}-${i}`)
    );
    cleanup();
    await mount({ view: 'cards-sm', cardMedia });
    expect(screen.queryAllByRole('img')).toHaveLength(0);
  });

  it('switches view from the toolbar on its own when uncontrolled', async () => {
    const onViewChange = vi.fn();
    await mount({ onViewChange });
    expect(await gridRows()).toBe(ROW_COUNT);
    await act(async () => fireEvent.click(screen.getByRole('button', { name: 'Small cards' })));
    expect(onViewChange).toHaveBeenCalledWith('cards-sm');
    expect(screen.getAllByRole('listitem')).toHaveLength(ROW_COUNT);
  });

  it('only reports a picked view when controlled — the host decides', async () => {
    const onViewChange = vi.fn();
    await mount({ view: 'cards-sm', onViewChange });
    await act(async () => fireEvent.click(screen.getByRole('button', { name: 'Large cards' })));
    expect(onViewChange).toHaveBeenCalledWith('cards-big');
    expect(screen.getByRole('button', { name: 'Small cards' }).getAttribute('aria-pressed')).toBe(
      'true'
    );
  });

  it('shows the same rows in the grid', async () => {
    await mount({ view: 'grid' });
    expect(await gridRows()).toBe(ROW_COUNT);
  });

  it('applies one controlled query identically to both views', async () => {
    const query = { ...defaultCollectionQuery, search: needle };
    await mount({ view: 'cards-sm', query });
    expect(screen.getAllByRole('listitem')).toHaveLength(1);
    cleanup();
    await mount({ view: 'grid', query });
    expect(await gridRows()).toBe(1);
  });

  it('narrows the cards as the user types, and emits the query', async () => {
    const onQueryChange = vi.fn();
    await mount({ view: 'cards-sm', onQueryChange });
    fireEvent.change(screen.getByRole('textbox', { name: 'Search' }), {
      target: { value: needle },
    });
    expect(screen.getAllByRole('listitem')).toHaveLength(1);
    expect(onQueryChange).toHaveBeenLastCalledWith({ ...defaultCollectionQuery, search: needle });
  });

  it('returns to the first page when the query narrows', async () => {
    const onQueryChange = vi.fn();
    await mount({
      view: 'cards-sm',
      onQueryChange,
      query: { ...defaultCollectionQuery, pageSize: 1, page: 2 },
    });
    fireEvent.change(screen.getByRole('textbox', { name: 'Search' }), {
      target: { value: needle },
    });
    expect(onQueryChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ page: 0, search: needle })
    );
  });

  it('shows the last valid page when a controlled page is out of range', async () => {
    await mount({ view: 'cards-sm', query: { ...defaultCollectionQuery, pageSize: 2, page: 9 } });
    expect(screen.getAllByRole('listitem')).toHaveLength(ROW_COUNT - 2);
  });

  it('keeps the toolbar and says so when nothing matches', async () => {
    await mount({ view: 'cards-sm', query: { ...defaultCollectionQuery, search: 'no-such-row' } });
    expect(screen.queryAllByRole('listitem')).toHaveLength(0);
    expect(screen.getByText('No rows')).toBeTruthy();
    expect(screen.getByRole('textbox', { name: 'Search' })).toBeTruthy();
  });

  it('renders the grid overlay, not a crash, for no rows at all', async () => {
    await mount({ view: 'grid', rows: [] });
    expect(await screen.findByText('No rows')).toBeTruthy();
  });

  it('enables exactly the filter fields in the popover', async () => {
    await mount({ view: 'cards-sm' });
    fireEvent.click(screen.getByRole('button', { name: 'Filters' }));
    const pop = screen.getByRole('dialog');
    const open = cols.filter(c => filterFields[c.key]);
    const blocked = cols.filter(c => !filterFields[c.key]);
    expect(open.length).toBeGreaterThan(0);
    open.forEach(c => expect(within(pop).getAllByLabelText(c.label).length).toBeGreaterThan(0));
    const blockedList = within(pop).getByRole('list', { name: 'Not filterable in sobek yet' });
    blocked.forEach(c =>
      expect(within(blockedList).getAllByText(c.label).length).toBeGreaterThan(0)
    );
  });

  it('applies a filter in client mode and leaves the rows alone in server mode', async () => {
    const filterable = cols.find(
      c => filterFields[c.key]?.op === 'contains' && c.spec.path.length === 1
    );
    if (!filterable)
      throw new Error(`${entity} has no top-level contains filter to drive this test with`);
    const filters = { [filterable.key]: `${filterable.key}-1` };
    await mount({ view: 'cards-sm', query: { ...defaultCollectionQuery, filters } });
    expect(screen.getAllByRole('listitem')).toHaveLength(1);
    cleanup();
    await mount({
      view: 'cards-sm',
      filterMode: 'server',
      query: { ...defaultCollectionQuery, filters },
    });
    expect(screen.getAllByRole('listitem')).toHaveLength(ROW_COUNT);
  });

  it('renders no column for a patched or grid field', async () => {
    await mount({ view: 'grid' });
    await gridRows();
    Object.entries(fields)
      .filter(([, s]) => s.patched || s.kind === 'grid')
      .forEach(([key]) =>
        expect(screen.queryByRole('columnheader', { name: humanize(key) })).toBeNull()
      );
  });

  it('shows the last valid page in the grid when a controlled page is out of range', async () => {
    await mount({ view: 'grid', query: { ...defaultCollectionQuery, pageSize: 2, page: 9 } });
    expect(await gridRows()).toBe(ROW_COUNT - 2);
  });

  it('ignores a stale sort field in the grid without rewriting the host query', async () => {
    const onQueryChange = vi.fn();
    await mount({
      view: 'grid',
      onQueryChange,
      query: {
        ...defaultCollectionQuery,
        page: 1,
        pageSize: 2,
        sort: { field: 'no-such-field', dir: 'asc' },
      },
    });
    expect(await gridRows()).toBe(ROW_COUNT - 2);
    expect(onQueryChange).not.toHaveBeenCalled();
  });

  it('survives a page size the grid cannot take', async () => {
    await mount({ view: 'grid', query: { ...defaultCollectionQuery, pageSize: 250 } });
    expect(await gridRows()).toBe(ROW_COUNT);
    cleanup();
    await mount({ view: 'cards-sm', query: { ...defaultCollectionQuery, pageSize: 0 } });
    expect(screen.getAllByRole('listitem')).toHaveLength(ROW_COUNT);
    expect(screen.getByText(`1–${ROW_COUNT} of ${ROW_COUNT}`)).toBeTruthy();
  });

  it('reorders the grid when a header is clicked', async () => {
    await mount({ view: 'grid', columns: [textCol.key] });
    await gridRows();
    const firstCell = (): string | null => screen.getAllByRole('row')[1].textContent;
    const header = screen.getByRole('columnheader', { name: textCol.label });
    fireEvent.click(header);
    expect(firstCell()).toContain(`${textCol.key}-0`);
    fireEvent.click(header);
    expect(firstCell()).toContain(`${textCol.key}-${ROW_COUNT - 1}`);
  });

  it('emits a grid page-size change once, keeping the page the grid reports', async () => {
    const onQueryChange = vi.fn();
    const many = makeRows(fields, 30);
    await mount({
      view: 'grid',
      rows: many,
      onQueryChange,
      query: { ...defaultCollectionQuery, page: 1 },
    });
    await gridRows();
    // jsdom: the grid may still hold its footer hidden while it measures, so
    // the pager's select is looked up including hidden elements. This test is
    // about what is emitted, not about the select's accessibility.
    fireEvent.mouseDown(
      await screen.findByRole('combobox', { name: /rows per page/i, hidden: true })
    );
    fireEvent.click(within(screen.getByRole('listbox')).getByRole('option', { name: '10' }));
    expect(onQueryChange.mock.calls.map(([q]) => [q.page, q.pageSize])).toEqual([[1, 10]]);
  });

  it('does not find a row by a field its card does not show', async () => {
    await mount({
      view: 'cards-sm',
      card: { title: textCol.key, fields: [] },
      query: { ...defaultCollectionQuery, search: `${otherText.key}-1` },
    });
    expect(screen.queryAllByRole('listitem')).toHaveLength(0);
  });

  it('does not find a row by a grid column the user has hidden', async () => {
    await mount({ view: 'grid' });
    await gridRows();
    fireEvent.click(screen.getByRole('button', { name: 'Columns' }));
    fireEvent.click(screen.getByRole('menuitemcheckbox', { name: otherText.label }));
    fireEvent.keyDown(screen.getByRole('menu'), { key: 'Escape' });
    fireEvent.change(screen.getByRole('textbox', { name: 'Search' }), {
      target: { value: `${otherText.key}-1` },
    });
    expect(await screen.findByText('No rows')).toBeTruthy();
  });

  it('applies and shows a filter on a filterable field the columns leave out', async () => {
    const filterable = cols.find(
      c => filterFields[c.key]?.op === 'contains' && c.spec.path.length === 1
    );
    if (!filterable)
      throw new Error(`${entity} has no top-level contains filter to drive this test with`);
    const shownKey = [textCol, otherText].find(c => c.key !== filterable.key)!.key;
    await mount({
      view: 'cards-sm',
      columns: [shownKey],
      query: { ...defaultCollectionQuery, filters: { [filterable.key]: `${filterable.key}-1` } },
    });
    expect(screen.getAllByRole('listitem')).toHaveLength(1);
    expect(
      within(screen.getByRole('group', { name: 'Active filters' })).getByText(
        new RegExp(`^${filterable.label}: `)
      )
    ).toBeTruthy();
  });

  it('trims the toolbar to the tools asked for', async () => {
    await mount({ view: 'grid', tools: ['search'] });
    expect(screen.getByRole('textbox', { name: 'Search' })).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Filters' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'Density' })).toBeNull();
  });

  it('hides every tool but keeps host actions when tools is false', async () => {
    await mount({ view: 'grid', tools: false, actions: <button>Host action</button> });
    expect(screen.queryByRole('textbox', { name: 'Search' })).toBeNull();
    expect(screen.getByRole('button', { name: 'Host action' })).toBeTruthy();
  });

  it('labels a column with a host override', async () => {
    await mount({ view: 'grid', columns: [{ field: textCol.key, label: 'Custom label' }] });
    expect(await screen.findByRole('columnheader', { name: 'Custom label' })).toBeTruthy();
    expect(screen.queryByRole('columnheader', { name: humanize(textCol.key) })).toBeNull();
  });
});
