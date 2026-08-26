import { describe, it, expect } from 'vitest';
import { compareVehicles, getVehicleSortValue } from './vehicleSortValue.ts';
import type { VehicleGQLShaped } from '../types/vehicleGqlShaped.ts';

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
      transportMode: 'UNKNOWN',
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

  it('sorts by operationalNumber and parks rows without one at the end', () => {
    const rows = [
      mk({ id: 'a', operationalNumber: undefined }),
      mk({ id: 'b', operationalNumber: 'OP-200' }),
      mk({ id: 'c', operationalNumber: undefined }),
      mk({ id: 'd', operationalNumber: 'OP-100' }),
    ];
    const sorted = [...rows].sort(compareVehicles('operationalNumber', 'asc'));
    expect(sorted.map(r => r.id)).toEqual(['d', 'b', 'a', 'c']);
  });

  it('sorts by name and parks rows without one at the end', () => {
    const rows = [
      mk({ id: 'a', name: undefined }),
      mk({ id: 'b', name: { value: 'Zulu' } }),
      mk({ id: 'c', name: undefined }),
      mk({ id: 'd', name: { value: 'Alpha' } }),
    ];
    const sorted = [...rows].sort(compareVehicles('name', 'asc'));
    expect(sorted.map(r => r.id)).toEqual(['d', 'b', 'a', 'c']);
  });

  it('sorts by transportType name and parks rows without a transportType at the end', () => {
    const rows = [
      mk({ id: 'a' }),
      withTType({ id: 'b' }, { name: { value: 'Zulu' } }),
      withTType({ id: 'c' }, { name: { value: 'Alpha' } }),
    ];
    const sorted = [...rows].sort(compareVehicles('transportTypeName', 'asc'));
    expect(sorted.map(r => r.id)).toEqual(['c', 'b', 'a']);
  });

  it('treats whitespace-only transportType name as empty (Sobek #121 regression)', () => {
    const rows = [
      withTType({ id: 'ws-1' }, { name: { value: '\n                ' } }),
      withTType({ id: 'aa' }, { name: { value: 'aa' } }),
      withTType({ id: 'ws-2' }, { name: { value: '   ' } }),
      withTType({ id: 'zz' }, { name: { value: 'zz' } }),
    ];
    const sorted = [...rows].sort(compareVehicles('transportTypeName', 'asc'));
    expect(sorted.map(r => r.id)).toEqual(['aa', 'zz', 'ws-1', 'ws-2']);
  });

  it('sorts by transportType mode (UNKNOWN at its slot); only a missing transportType parks last', () => {
    const rows = [
      withTType({ id: 'a' }, { transportMode: 'UNKNOWN' }),
      withTType({ id: 'b' }, { transportMode: 'TRAM' }),
      withTType({ id: 'c' }, { transportMode: 'BUS' }),
      mk({ id: 'd' }), // no transportType → genuinely empty → parks last
    ];
    const sorted = [...rows].sort(compareVehicles('transportTypeMode', 'asc'));
    // BUS < TRAM < UNKNOWN (alphabetical), then the transportType-less row last.
    expect(sorted.map(r => r.id)).toEqual(['c', 'b', 'a', 'd']);
  });
});

describe('getVehicleSortValue', () => {
  it('returns empty string for a missing transportType', () => {
    const r = mk({});
    expect(getVehicleSortValue(r, 'transportTypeName')).toBe('');
    expect(getVehicleSortValue(r, 'transportTypeMode')).toBe('');
  });

  it('returns the NeTEx id verbatim for the id column', () => {
    expect(getVehicleSortValue(mk({ id: 'NMR:Vehicle:42' }), 'id')).toBe('NMR:Vehicle:42');
  });
});
