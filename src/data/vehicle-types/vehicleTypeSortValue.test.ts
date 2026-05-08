import { describe, it, expect } from 'vitest';
import { compareVehicleTypes, getVehicleTypeSortValue } from './vehicleTypeSortValue.ts';
import type { VehicleType } from './vehicleTypeTypes.ts';

const mk = (over: Partial<VehicleType>): VehicleType =>
  ({
    id: 'NMR:VehicleType:x',
    version: 1,
    length: 0,
    width: 0,
    height: 0,
    ...over,
  }) as VehicleType;

describe('compareVehicleTypes', () => {
  it('asc by name keeps rows with no Name at the end (regression: blanks-first bug)', () => {
    const rows = [
      mk({ id: 'a', name: undefined }),
      mk({ id: 'b', name: { value: 'Bravo' } }),
      mk({ id: 'c', name: undefined }),
      mk({ id: 'd', name: { value: 'Alpha' } }),
    ];
    const sorted = [...rows].sort(compareVehicleTypes('name', 'asc'));
    expect(sorted.map(r => r.id)).toEqual(['d', 'b', 'a', 'c']);
  });

  it('desc by name also keeps blanks at the end (not flipped to top)', () => {
    const rows = [
      mk({ id: 'a', name: undefined }),
      mk({ id: 'b', name: { value: 'Bravo' } }),
      mk({ id: 'd', name: { value: 'Alpha' } }),
    ];
    const sorted = [...rows].sort(compareVehicleTypes('name', 'desc'));
    expect(sorted.map(r => r.id)).toEqual(['b', 'd', 'a']);
  });

  it('sorts populated names case-insensitively', () => {
    const rows = [
      mk({ id: '1', name: { value: 'banana' } }),
      mk({ id: '2', name: { value: 'Apple' } }),
      mk({ id: '3', name: { value: 'cherry' } }),
    ];
    const sorted = [...rows].sort(compareVehicleTypes('name', 'asc'));
    expect(sorted.map(r => r.name?.value)).toEqual(['Apple', 'banana', 'cherry']);
  });

  it('sorts dimensions numerically (regression: previously fell through to id)', () => {
    const rows = [
      mk({ id: 'big', length: 20 }),
      mk({ id: 'small', length: 3 }),
      mk({ id: 'mid', length: 10 }),
    ];
    const sorted = [...rows].sort(compareVehicleTypes('dimensions', 'asc'));
    expect(sorted.map(r => r.length)).toEqual([3, 10, 20]);
  });

  it('treats length === 0 as a real value, not empty', () => {
    const rows = [mk({ id: 'zero', length: 0 }), mk({ id: 'one', length: 1 })];
    const sorted = [...rows].sort(compareVehicleTypes('dimensions', 'asc'));
    expect(sorted.map(r => r.id)).toEqual(['zero', 'one']);
  });

  it('sorts by deckPlanName and parks rows without a deckPlan at the end', () => {
    const rows = [
      mk({ id: 'a', deckPlan: undefined }),
      mk({ id: 'b', deckPlan: { id: 'd1', name: { value: 'Zulu' } } }),
      mk({ id: 'c', deckPlan: { id: 'd2', name: { value: 'Alpha' } } }),
    ];
    const sorted = [...rows].sort(compareVehicleTypes('deckPlanName', 'asc'));
    expect(sorted.map(r => r.id)).toEqual(['c', 'b', 'a']);
  });
});

describe('getVehicleTypeSortValue', () => {
  it('returns empty string for missing optional fields', () => {
    const r = mk({ name: undefined, deckPlan: undefined });
    expect(getVehicleTypeSortValue(r, 'name')).toBe('');
    expect(getVehicleTypeSortValue(r, 'deckPlanName')).toBe('');
  });
});
