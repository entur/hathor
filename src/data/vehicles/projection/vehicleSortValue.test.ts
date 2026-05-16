import { describe, it, expect } from 'vitest';
import { compareVehicles, getVehicleSortValue } from './vehicleSortValue.ts';
import type { VehicleGQLShaped } from './vehicleGqlShaped.ts';

const mk = (over: Partial<VehicleGQLShaped>): VehicleGQLShaped => ({
  id: 'NMR:Vehicle:x',
  registrationNumber: 'AA-00000',
  version: 1,
  ...over,
});

const withTType = (
  base: Partial<VehicleGQLShaped>,
  tt: Partial<NonNullable<VehicleGQLShaped['transportType']>>
): VehicleGQLShaped =>
  mk({
    ...base,
    transportType: {
      id: 'NMR:VehicleType:x',
      version: 1,
      transportMode: 'unknown',
      ...tt,
    },
  });

describe('compareVehicles', () => {
  it('asc by registrationNumber keeps rows with empty regNo at the end', () => {
    const rows = [
      mk({ id: 'a', registrationNumber: '' }),
      mk({ id: 'b', registrationNumber: 'BB-22222' }),
      mk({ id: 'c', registrationNumber: '' }),
      mk({ id: 'd', registrationNumber: 'AA-11111' }),
    ];
    const sorted = [...rows].sort(compareVehicles('registrationNumber', 'asc'));
    expect(sorted.map(r => r.id)).toEqual(['d', 'b', 'a', 'c']);
  });

  it('desc by registrationNumber also keeps blanks at the end', () => {
    const rows = [
      mk({ id: 'a', registrationNumber: '' }),
      mk({ id: 'b', registrationNumber: 'BB-22222' }),
      mk({ id: 'd', registrationNumber: 'AA-11111' }),
    ];
    const sorted = [...rows].sort(compareVehicles('registrationNumber', 'desc'));
    expect(sorted.map(r => r.id)).toEqual(['b', 'd', 'a']);
  });

  it('sorts version numerically (regression: never falls through to id)', () => {
    const rows = [
      mk({ id: 'big', version: 20 }),
      mk({ id: 'small', version: 3 }),
      mk({ id: 'mid', version: 10 }),
    ];
    const sorted = [...rows].sort(compareVehicles('version', 'asc'));
    expect(sorted.map(r => r.version)).toEqual([3, 10, 20]);
  });

  it('treats version === 0 as a real value, not empty', () => {
    const rows = [mk({ id: 'zero', version: 0 }), mk({ id: 'one', version: 1 })];
    const sorted = [...rows].sort(compareVehicles('version', 'asc'));
    expect(sorted.map(r => r.id)).toEqual(['zero', 'one']);
  });

  it('sorts by transportType name and parks rows without a transportType at the end', () => {
    const rows = [
      mk({ id: 'a' }),
      withTType({ id: 'b' }, { name: 'Zulu' }),
      withTType({ id: 'c' }, { name: 'Alpha' }),
    ];
    const sorted = [...rows].sort(compareVehicles('transportTypeName', 'asc'));
    expect(sorted.map(r => r.id)).toEqual(['c', 'b', 'a']);
  });

  it('treats whitespace-only transportType name as empty (Sobek #121 regression)', () => {
    const rows = [
      withTType({ id: 'ws-1' }, { name: '\n                ' }),
      withTType({ id: 'aa' }, { name: 'aa' }),
      withTType({ id: 'ws-2' }, { name: '   ' }),
      withTType({ id: 'zz' }, { name: 'zz' }),
    ];
    const sorted = [...rows].sort(compareVehicles('transportTypeName', 'asc'));
    expect(sorted.map(r => r.id)).toEqual(['aa', 'zz', 'ws-1', 'ws-2']);
  });

  it("sorts by transportType mode and parks 'unknown' / missing rows at the end", () => {
    const rows = [
      withTType({ id: 'a' }, { transportMode: 'unknown' }),
      withTType({ id: 'b' }, { transportMode: 'tram' }),
      withTType({ id: 'c' }, { transportMode: 'bus' }),
      mk({ id: 'd' }),
    ];
    const sorted = [...rows].sort(compareVehicles('transportTypeMode', 'asc'));
    expect(sorted.map(r => r.id)).toEqual(['c', 'b', 'a', 'd']);
  });
});

describe('getVehicleSortValue', () => {
  it("returns empty string for missing transportType and for 'unknown' mode", () => {
    const r = mk({});
    expect(getVehicleSortValue(r, 'transportTypeName')).toBe('');
    expect(getVehicleSortValue(r, 'transportTypeMode')).toBe('');
  });
});
