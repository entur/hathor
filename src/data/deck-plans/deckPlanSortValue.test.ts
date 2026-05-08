import { describe, it, expect } from 'vitest';
import { compareDeckPlans, getDeckPlanSortValue } from './deckPlanSortValue.ts';
import type { DeckPlan } from '../vehicle-types/vehicleTypeTypes.ts';

const mk = (over: Partial<DeckPlan>): DeckPlan =>
  ({
    id: 'NMR:DeckPlan:x',
    ...over,
  }) as DeckPlan;

describe('compareDeckPlans', () => {
  it('asc by name keeps rows with no Name at the end (regression: blanks-first bug, issue #63)', () => {
    const rows = [
      mk({ id: 'a', name: undefined }),
      mk({ id: 'b', name: { value: 'Bravo' } }),
      mk({ id: 'c', name: undefined }),
      mk({ id: 'd', name: { value: 'Alpha' } }),
    ];
    const sorted = [...rows].sort(compareDeckPlans('name', 'asc'));
    expect(sorted.map(r => r.id)).toEqual(['d', 'b', 'a', 'c']);
  });

  it('desc by name also keeps blanks at the end (not flipped to top)', () => {
    const rows = [
      mk({ id: 'a', name: undefined }),
      mk({ id: 'b', name: { value: 'Bravo' } }),
      mk({ id: 'd', name: { value: 'Alpha' } }),
    ];
    const sorted = [...rows].sort(compareDeckPlans('name', 'desc'));
    expect(sorted.map(r => r.id)).toEqual(['b', 'd', 'a']);
  });

  it('sorts populated names case-insensitively', () => {
    const rows = [
      mk({ id: '1', name: { value: 'banana' } }),
      mk({ id: '2', name: { value: 'Apple' } }),
      mk({ id: '3', name: { value: 'cherry' } }),
    ];
    const sorted = [...rows].sort(compareDeckPlans('name', 'asc'));
    expect(sorted.map(r => r.name?.value)).toEqual(['Apple', 'banana', 'cherry']);
  });

  it('sorts by id when orderBy is id', () => {
    const rows = [mk({ id: 'c' }), mk({ id: 'a' }), mk({ id: 'b' })];
    const sorted = [...rows].sort(compareDeckPlans('id', 'asc'));
    expect(sorted.map(r => r.id)).toEqual(['a', 'b', 'c']);
  });
});

describe('getDeckPlanSortValue', () => {
  it('returns empty string for missing optional name', () => {
    const r = mk({ name: undefined });
    expect(getDeckPlanSortValue(r, 'name')).toBe('');
  });

  it('returns the id verbatim for the id key', () => {
    const r = mk({ id: 'NMR:DeckPlan:42' });
    expect(getDeckPlanSortValue(r, 'id')).toBe('NMR:DeckPlan:42');
  });
});
