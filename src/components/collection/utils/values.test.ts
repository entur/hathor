import { describe, it, expect, vi } from 'vitest';
import type { FieldSpec } from '../types.ts';
import { resolveColumns } from './columns.ts';
import {
  compactId,
  displayValue,
  formatValue,
  fullTitle,
  keyRows,
  rawValue,
  rowKeys,
  valueList,
  withVersion,
} from './values.ts';

const spec = (kind: FieldSpec['kind'], ...path: string[]): FieldSpec => ({ kind, path });

describe('rawValue', () => {
  it('reads a top-level and a hoisted leaf by path', () => {
    const row = { length: 12, passengerCapacity: { fareClass: 'firstClass' } };
    expect(rawValue(row, spec('number', 'length'))).toBe(12);
    expect(rawValue(row, spec('enum', 'passengerCapacity', 'fareClass'))).toBe('firstClass');
  });

  it('unwraps a name field to its value leaf', () => {
    expect(rawValue({ name: { lang: 'en', value: 'Flirt' } }, spec('name', 'name'))).toBe('Flirt');
  });

  it('yields undefined through a null parent or a null name', () => {
    expect(
      rawValue({ passengerCapacity: null }, spec('enum', 'passengerCapacity', 'fareClass'))
    ).toBeUndefined();
    expect(rawValue({ name: null }, spec('name', 'name'))).toBeUndefined();
  });
});

describe('formatValue', () => {
  it('renders null and undefined as an empty string', () => {
    expect(formatValue({}, spec('text', 'x'))).toBe('');
    expect(formatValue({ x: null }, spec('number', 'x'))).toBe('');
  });

  it('keeps zero and false visible', () => {
    expect(formatValue({ x: 0 }, spec('number', 'x'))).toBe('0');
    expect(formatValue({ x: false }, spec('switch', 'x'), { yes: 'Ja', no: 'Nei' })).toBe('Nei');
    expect(formatValue({ x: true }, spec('switch', 'x'))).toBe('Yes');
  });

  it('joins a multi-enum and drops null members', () => {
    expect(formatValue({ x: ['a', null, 'b'] }, spec('enumMulti', 'x'))).toBe('a, b');
    expect(formatValue({ x: null }, spec('enumMulti', 'x'))).toBe('');
  });

  it('trims an ISO timestamp to a date or a minute', () => {
    const row = { x: '2024-03-05T14:07:59.000Z' };
    expect(formatValue(row, spec('date', 'x'))).toBe('2024-03-05');
    expect(formatValue(row, spec('datetime', 'x'))).toBe('2024-03-05 14:07');
  });
});

describe('rowKeys', () => {
  it('keys a row by netexId + version, the NeTEx identity', () => {
    expect(rowKeys([{ netexId: 'A', version: '2' }])).toEqual(['A@2']);
  });

  it('falls back to the bare netexId, then id, when there is no version', () => {
    expect(rowKeys([{ netexId: 'A' }, { id: 7 }, { netexId: 'B', version: '' }])).toEqual([
      'A',
      '7',
      'B',
    ]);
  });

  it('keeps two versions of one entity apart', () => {
    const keys = rowKeys([
      { netexId: 'A', version: '1' },
      { netexId: 'A', version: '2' },
    ]);
    expect(new Set(keys).size).toBe(2);
  });

  it('keys id-less rows by position across pages, never colliding with a real id', () => {
    const keys = rowKeys([{ id: 21 }, {}, null], 20);
    expect(new Set(keys).size).toBe(3);
    expect(keys[1]).not.toBe('21');
    expect(rowKeys([{}], 20)).not.toEqual(rowKeys([{}], 0));
  });

  it('still gives a repeated identity unique keys, after warning, so both rows render', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const keys = rowKeys([
      { netexId: 'A', version: '1' },
      { netexId: 'A', version: '1' },
      { netexId: 'A', version: '1' },
    ]);
    expect(keys[0]).toBe('A@1');
    expect(new Set(keys).size).toBe(3);
    expect(warn).toHaveBeenCalledTimes(1);
    warn.mockRestore();
  });

  it('warns about a repeated identity instead of hiding it', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    rowKeys([{ netexId: 'A', version: '1' }, { netexId: 'B' }, { netexId: 'A', version: '1' }]);
    expect(warn).toHaveBeenCalledTimes(1);
    expect(String(warn.mock.calls[0][0])).toContain('A@1');
    warn.mockRestore();
  });

  it('stays quiet when every identity is unique', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    rowKeys([
      { netexId: 'A', version: '1' },
      { netexId: 'A', version: '2' },
    ]);
    expect(warn).not.toHaveBeenCalled();
    warn.mockRestore();
  });
});

describe('compactId', () => {
  it('keeps only the last segment of a NeTEx id, marked with ::', () => {
    expect(compactId('VEH:VehicleType:1004')).toBe('::1004');
  });

  it('leaves a value that is not segmented, or ends in a colon, as it is', () => {
    expect(compactId('1004')).toBe('1004');
    expect(compactId('VEH:VehicleType:')).toBe('VEH:VehicleType:');
    expect(compactId('')).toBe('');
  });
});

describe('displayValue', () => {
  const [ID, NAME] = resolveColumns({
    netexId: { kind: 'text', path: ['netexId'] },
    name: { kind: 'name', path: ['name'] },
  });
  const row = { netexId: 'VEH:VehicleType:1004', name: { value: 'A:B:C' } };

  it('compacts the id column only', () => {
    expect(displayValue(row, ID)).toBe('::1004');
    expect(displayValue(row, NAME)).toBe('A:B:C');
  });
});

describe('valueList', () => {
  const LIST: FieldSpec = { kind: 'enumMulti', path: ['xs'] };
  it('drops null members, wraps a single value, and is empty for nothing', () => {
    expect(valueList({ xs: ['a', null, 'b'] }, LIST)).toEqual(['a', 'b']);
    expect(valueList({ xs: 'a' }, LIST)).toEqual(['a']);
    expect(valueList({}, LIST)).toEqual([]);
  });
});

describe('fullTitle', () => {
  const [ID, NAME] = resolveColumns({
    netexId: { kind: 'text', path: ['netexId'] },
    name: { kind: 'name', path: ['name'] },
  });
  it('gives the full text only where the shown text is shortened', () => {
    const row = { netexId: 'VEH:VehicleType:1004', name: { value: 'Flirt' } };
    expect(fullTitle(row, ID)).toBe('VEH:VehicleType:1004');
    expect(fullTitle(row, NAME)).toBeUndefined();
  });
});

describe('keyRows', () => {
  it('pairs each row with its key, positions counted from the offset', () => {
    const a = { netexId: 'A' };
    expect(keyRows([a, {}], 50)).toEqual([
      { key: 'A', entity: a },
      { key: 'row:51', entity: {} },
    ]);
  });
});

describe('withVersion', () => {
  it('appends the version as /verNUM, and leaves text without one alone', () => {
    expect(withVersion('::1004', { version: '3' })).toBe('::1004/ver3');
    expect(withVersion('::1004', { version: '' })).toBe('::1004');
    expect(withVersion('::1004', {})).toBe('::1004');
    expect(withVersion('', { version: '3' })).toBe('');
  });
});
