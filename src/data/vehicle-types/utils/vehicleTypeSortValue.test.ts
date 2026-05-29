import { describe, it, expect } from 'vitest';
import { compareVehicleTypes, getVehicleTypeSortValue } from './vehicleTypeSortValue.ts';
import type { VehicleType } from '../types/vehicleTypeTypes.ts';

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

  it('treats whitespace-only Name as empty (regression: Sobek returns "\\n  " for empty Name)', () => {
    const rows = [
      mk({ id: 'ws-1', name: { value: '\n                ' } }),
      mk({ id: 'aa', name: { value: 'aa' } }),
      mk({ id: 'ws-2', name: { value: '   ' } }),
      mk({ id: 'zz', name: { value: 'zz' } }),
    ];
    const sorted = [...rows].sort(compareVehicleTypes('name', 'asc'));
    expect(sorted.map(r => r.id)).toEqual(['aa', 'zz', 'ws-1', 'ws-2']);
  });

  it('sorts by transportMode alphabetically by NeTEx id, locale-independent', () => {
    const rows = [
      mk({ id: 'a', transportMode: 'tram' }),
      mk({ id: 'b', transportMode: 'bus' }),
      mk({ id: 'c', transportMode: 'rail' }),
    ];
    const sorted = [...rows].sort(compareVehicleTypes('transportMode', 'asc'));
    expect(sorted.map(r => r.id)).toEqual(['b', 'c', 'a']);
  });

  it('parks rows with no transportMode at the end on asc (regression: empty-last)', () => {
    const rows = [
      mk({ id: 'no-mode-1', transportMode: undefined }),
      mk({ id: 'bus', transportMode: 'bus' }),
      mk({ id: 'no-mode-2', transportMode: undefined }),
      mk({ id: 'rail', transportMode: 'rail' }),
    ];
    const sorted = [...rows].sort(compareVehicleTypes('transportMode', 'asc'));
    expect(sorted.map(r => r.id)).toEqual(['bus', 'rail', 'no-mode-1', 'no-mode-2']);
  });

  it('parks rows with no transportMode at the end on desc as well', () => {
    const rows = [
      mk({ id: 'no-mode', transportMode: undefined }),
      mk({ id: 'bus', transportMode: 'bus' }),
      mk({ id: 'rail', transportMode: 'rail' }),
    ];
    const sorted = [...rows].sort(compareVehicleTypes('transportMode', 'desc'));
    expect(sorted.map(r => r.id)).toEqual(['rail', 'bus', 'no-mode']);
  });

  it('treats backend strings outside the NeTEx enum as unknown (empty-last)', () => {
    const rows = [
      mk({ id: 'garbage', transportMode: 'not-a-real-mode' }),
      mk({ id: 'bus', transportMode: 'bus' }),
    ];
    const sorted = [...rows].sort(compareVehicleTypes('transportMode', 'asc'));
    expect(sorted.map(r => r.id)).toEqual(['bus', 'garbage']);
  });
});

describe('getVehicleTypeSortValue', () => {
  it('returns empty string for missing optional fields', () => {
    const r = mk({ name: undefined, deckPlan: undefined });
    expect(getVehicleTypeSortValue(r, 'name')).toBe('');
    expect(getVehicleTypeSortValue(r, 'deckPlanName')).toBe('');
  });
});
