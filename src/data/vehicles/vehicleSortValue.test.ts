import { describe, it, expect } from 'vitest';
import { compareVehicles, getVehicleSortValue } from './vehicleSortValue.ts';
import type { VehicleRow } from './vehicleTypes.ts';

const mk = (over: Partial<VehicleRow>): VehicleRow => ({
  id: 'NMR:Vehicle:x',
  registrationNumber: 'AA-00000',
  version: 1,
  ...over,
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

  it('sorts by parentVehicleTypeName and parks rows without a parent at the end', () => {
    const rows = [
      mk({ id: 'a', parentVehicleTypeName: undefined }),
      mk({ id: 'b', parentVehicleTypeName: 'Zulu' }),
      mk({ id: 'c', parentVehicleTypeName: 'Alpha' }),
    ];
    const sorted = [...rows].sort(compareVehicles('parentVehicleTypeName', 'asc'));
    expect(sorted.map(r => r.id)).toEqual(['c', 'b', 'a']);
  });

  it('treats whitespace-only parentVehicleTypeName as empty (Sobek #121 regression)', () => {
    const rows = [
      mk({ id: 'ws-1', parentVehicleTypeName: '\n                ' }),
      mk({ id: 'aa', parentVehicleTypeName: 'aa' }),
      mk({ id: 'ws-2', parentVehicleTypeName: '   ' }),
      mk({ id: 'zz', parentVehicleTypeName: 'zz' }),
    ];
    const sorted = [...rows].sort(compareVehicles('parentVehicleTypeName', 'asc'));
    expect(sorted.map(r => r.id)).toEqual(['aa', 'zz', 'ws-1', 'ws-2']);
  });

  it('sorts by parentTransportMode and parks rows without one at the end', () => {
    const rows = [
      mk({ id: 'a', parentTransportMode: undefined }),
      mk({ id: 'b', parentTransportMode: 'tram' }),
      mk({ id: 'c', parentTransportMode: 'bus' }),
    ];
    const sorted = [...rows].sort(compareVehicles('parentTransportMode', 'asc'));
    expect(sorted.map(r => r.id)).toEqual(['c', 'b', 'a']);
  });
});

describe('getVehicleSortValue', () => {
  it('returns empty string for missing optional fields', () => {
    const r = mk({ parentVehicleTypeName: undefined, parentTransportMode: undefined });
    expect(getVehicleSortValue(r, 'parentVehicleTypeName')).toBe('');
    expect(getVehicleSortValue(r, 'parentTransportMode')).toBe('');
  });
});
