import { describe, it, expect } from 'vitest';
import type { FieldSpec } from '../types.ts';
import { resolveCard, resolveColumns } from './columns.ts';

const FIELDS: Record<string, FieldSpec> = {
  netexId: { kind: 'text', path: ['netexId'] },
  name: { kind: 'name', path: ['name'] },
  transportMode: { kind: 'enum', path: ['transportMode'], options: ['bus', 'rail'] },
  range: { kind: 'number', path: ['range'], patched: true },
  vehicles: { kind: 'grid', path: ['vehicles'] },
  length: { kind: 'number', path: ['length'] },
};

describe('resolveColumns', () => {
  it('defaults to every eligible field in field mapping order, humanized', () => {
    expect(resolveColumns(FIELDS).map(c => [c.key, c.label])).toEqual([
      ['netexId', 'Id'],
      ['name', 'Name'],
      ['transportMode', 'Transport mode'],
      ['length', 'Length'],
    ]);
  });

  it('never yields a patched or a grid field, even when asked for', () => {
    expect(resolveColumns(FIELDS, ['range', 'vehicles', 'name']).map(c => c.key)).toEqual(['name']);
  });

  it('honours whitelist order and per-entry labels', () => {
    const cols = resolveColumns(FIELDS, [{ field: 'length', label: 'Lengde' }, 'netexId']);
    expect(cols.map(c => [c.key, c.label])).toEqual([
      ['length', 'Lengde'],
      ['netexId', 'Id'],
    ]);
  });

  it('drops keys the field mapping does not know', () => {
    expect(resolveColumns(FIELDS, ['nope', 'name']).map(c => c.key)).toEqual(['name']);
  });
});

describe('id caption', () => {
  it('captions the identity field with the given id label, unless the entry names one', () => {
    expect(resolveColumns(FIELDS, ['netexId'], 'Identifikator')[0].label).toBe('Identifikator');
    expect(
      resolveColumns(FIELDS, [{ field: 'netexId', label: 'NeTEx' }], 'Identifikator')[0].label
    ).toBe('NeTEx');
  });

  it('passes the id label through to an explicit card', () => {
    const card = resolveCard(FIELDS, [], { title: 'name', fields: ['netexId'] }, 'Identifikator');
    expect(card.fields[0].label).toBe('Identifikator');
  });
});

describe('resolveCard', () => {
  const cols = resolveColumns(FIELDS);

  it('defaults to name as title and the other columns as fields', () => {
    const card = resolveCard(FIELDS, cols);
    expect(card.title?.key).toBe('name');
    expect(card.subtitle).toBeUndefined();
    expect(card.fields.map(c => c.key)).toEqual(['netexId', 'transportMode', 'length']);
  });

  it('falls back to the first column when there is no name', () => {
    const noName = cols.filter(c => c.key !== 'name');
    expect(resolveCard(FIELDS, noName).title?.key).toBe('netexId');
  });

  it('resolves an explicit card against the field mapping, not the column whitelist', () => {
    const card = resolveCard(FIELDS, resolveColumns(FIELDS, ['name']), {
      title: 'name',
      subtitle: 'netexId',
      fields: ['length', 'range'],
    });
    expect(card.subtitle?.key).toBe('netexId');
    expect(card.fields.map(c => c.key)).toEqual(['length']);
  });

  it("keeps a column's label override on an explicit card", () => {
    const labelled = resolveColumns(FIELDS, ['name', { field: 'length', label: 'Length (m)' }]);
    const card = resolveCard(FIELDS, labelled, { title: 'name', fields: ['length', 'netexId'] });
    expect(card.fields.map(c => c.label)).toEqual(['Length (m)', 'Id']);
  });

  it('survives an empty column list', () => {
    expect(resolveCard(FIELDS, [])).toEqual({ title: undefined, subtitle: undefined, fields: [] });
  });
});
