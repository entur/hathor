import { describe, it, expect } from 'vitest';
import type { FieldSpec } from '../types.ts';
import { defaultCollectionQuery, type CollectionQuery } from '../types.ts';
import { applyQuery, matchRows, sortRows } from './applyQuery.ts';
import { resolveColumns } from './columns.ts';

const FIELDS: Record<string, FieldSpec> = {
  netexId: { kind: 'text', path: ['netexId'] },
  name: { kind: 'name', path: ['name'] },
  transportMode: { kind: 'enum', path: ['transportMode'] },
  length: { kind: 'number', path: ['length'] },
  lowFloor: { kind: 'switch', path: ['lowFloor'] },
  fareClass: { kind: 'enum', path: ['passengerCapacity', 'fareClass'] },
};
const COLS = resolveColumns(FIELDS);
const FF = {
  name: { arg: 'name', op: 'contains' },
  transportMode: { arg: 'transportModes', op: 'anyOf' },
} as const;

const ROWS = [
  {
    netexId: 'T:1',
    name: { value: 'Flirt' },
    transportMode: 'rail',
    length: 74,
    lowFloor: true,
    passengerCapacity: { fareClass: 'first' },
  },
  {
    netexId: 'T:2',
    name: { value: 'Urbino' },
    transportMode: 'bus',
    length: 12,
    lowFloor: false,
    passengerCapacity: null,
  },
  { netexId: 'T:3', name: null, transportMode: 'rail', length: null },
  {
    netexId: 'T:4',
    name: { value: 'coradia' },
    transportMode: 'tram',
    length: 100,
    lowFloor: true,
  },
];

const q = (over: Partial<CollectionQuery>): CollectionQuery => ({
  ...defaultCollectionQuery,
  ...over,
});
const ids = (over: Partial<CollectionQuery>, mode?: 'client' | 'server') =>
  applyQuery(ROWS, COLS, FF, q(over), mode).rows.map(r => r.netexId);

describe('applyQuery', () => {
  it('returns everything for the default query, in input order', () => {
    expect(ids({})).toEqual(['T:1', 'T:2', 'T:3', 'T:4']);
  });

  it('ANDs filters across fields', () => {
    expect(ids({ filters: { transportMode: ['rail'] } })).toEqual(['T:1', 'T:3']);
    expect(ids({ filters: { transportMode: ['rail'], name: 'fli' } })).toEqual(['T:1']);
  });

  it('skips the filter step in server mode but still searches', () => {
    expect(ids({ filters: { transportMode: ['rail'] } }, 'server')).toEqual([
      'T:1',
      'T:2',
      'T:3',
      'T:4',
    ]);
    expect(ids({ filters: { transportMode: ['rail'] }, search: 'urb' }, 'server')).toEqual(['T:2']);
  });

  it('ignores a filter on a field that is not filterable or not a column', () => {
    expect(ids({ filters: { length: '12', ghost: 'x' } })).toEqual(['T:1', 'T:2', 'T:3', 'T:4']);
  });

  it('searches text-like columns, hoisted leaves included, case-insensitively', () => {
    expect(ids({ search: 'FIRST' })).toEqual(['T:1']);
    expect(ids({ search: 't:3' })).toEqual(['T:3']);
    expect(ids({ search: '(' })).toEqual([]);
  });

  it('finds a row by its compact id as shown, and by its full id', () => {
    const rows = [{ netexId: 'VEH:VehicleType:1004' }, { netexId: 'VEH:VehicleType:7' }];
    const hit = (search: string) =>
      applyQuery(rows, COLS, FF, q({ search })).rows.map(r => r.netexId);
    expect(hit('::1004')).toEqual(['VEH:VehicleType:1004']);
    expect(hit('VEH:VehicleType:7')).toEqual(['VEH:VehicleType:7']);
  });

  it('searches only the columns it is told are visible', () => {
    const rows = [{ netexId: 'T:1', name: { value: 'Flirt' } }];
    const visible = COLS.filter(c => c.key === 'name');
    expect(matchRows(rows, COLS, FF, {}, 't:1', 'client', visible)).toEqual([]);
    expect(matchRows(rows, COLS, FF, {}, 'flirt', 'client', visible)).toEqual(rows);
  });

  it('also matches the text an entry shows, e.g. a localized enum label', () => {
    const cols = resolveColumns(FIELDS, [
      {
        field: 'transportMode',
        text: r => ((r as { transportMode: string }).transportMode === 'bus' ? 'Buss' : ''),
      },
    ]);
    const rows = [ROWS[0], ROWS[1]];
    expect(matchRows(rows, cols, FF, {}, 'buss', 'client')).toEqual([ROWS[1]]);
    expect(matchRows(rows, cols, FF, {}, 'bus', 'client')).toEqual([ROWS[1]]); // stored value still matches
  });

  it('does not search numbers or switches', () => {
    expect(ids({ search: '74' })).toEqual([]);
    expect(ids({ search: 'yes' })).toEqual([]);
  });

  it('sorts numbers numerically and text case-insensitively', () => {
    expect(ids({ sort: { field: 'length', dir: 'asc' } })).toEqual(['T:2', 'T:1', 'T:4', 'T:3']);
    expect(ids({ sort: { field: 'name', dir: 'asc' } })).toEqual(['T:4', 'T:1', 'T:2', 'T:3']);
  });

  it('keeps missing values last in both directions', () => {
    expect(ids({ sort: { field: 'length', dir: 'desc' } })).toEqual(['T:4', 'T:1', 'T:2', 'T:3']);
    expect(ids({ sort: { field: 'name', dir: 'desc' } })).toEqual(['T:2', 'T:1', 'T:4', 'T:3']);
  });

  it('sorts a non-numeric value in a number column as missing, last', () => {
    const rows = [
      { netexId: 'a', length: 'n/a' },
      { netexId: 'b', length: 5 },
      { netexId: 'c', length: 2 },
    ];
    const order = (dir: 'asc' | 'desc') =>
      sortRows(rows, COLS, { field: 'length', dir }).map(r => r.netexId);
    expect(order('asc')).toEqual(['c', 'b', 'a']);
    expect(order('desc')).toEqual(['b', 'c', 'a']);
  });

  it('orders text by Norwegian rules whatever the runtime locale: æ, ø, å after z', () => {
    const rows = ['Ål', 'Øst', 'Zeta', 'Ærø', 'alfa'].map(v => ({
      netexId: v,
      name: { value: v },
    }));
    expect(sortRows(rows, COLS, { field: 'name', dir: 'asc' }).map(r => r.netexId)).toEqual([
      'alfa',
      'Zeta',
      'Ærø',
      'Øst',
      'Ål',
    ]);
  });

  it('ignores a sort on an unknown field', () => {
    expect(ids({ sort: { field: 'ghost', dir: 'asc' } })).toEqual(['T:1', 'T:2', 'T:3', 'T:4']);
  });

  it('pages the result and reports the unpaged total', () => {
    const out = applyQuery(ROWS, COLS, FF, q({ pageSize: 3, page: 1 }));
    expect(out.rows.map(r => r.netexId)).toEqual(['T:4']);
    expect(out.total).toBe(4);
    expect(out.page).toBe(1);
  });

  it('clamps a page past the end to the last page', () => {
    const out = applyQuery(
      ROWS,
      COLS,
      FF,
      q({ pageSize: 3, page: 9, filters: { transportMode: ['rail'] } })
    );
    expect(out.page).toBe(0);
    expect(out.rows.map(r => r.netexId)).toEqual(['T:1', 'T:3']);
  });

  it('handles no rows and a non-positive page size', () => {
    expect(applyQuery([], COLS, FF, q({ page: 3 }))).toEqual({ rows: [], total: 0, page: 0 });
    expect(applyQuery(ROWS, COLS, FF, q({ pageSize: 0 })).rows).toHaveLength(4);
  });

  it('does not mutate its input', () => {
    const before = [...ROWS];
    applyQuery(ROWS, COLS, FF, q({ sort: { field: 'length', dir: 'asc' } }));
    expect(ROWS).toEqual(before);
  });
});
