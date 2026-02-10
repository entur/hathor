import { describe, expect, it } from 'vitest';
import { mergeResourceFrames, toArray } from '../xmlUtils';

describe('mergeResourceFrames', () => {
  it('returns empty arrays for empty frames', () => {
    const merged = mergeResourceFrames([]);

    expect(merged.vehicleTypes).toEqual([]);
    expect(merged.deckPlans).toEqual([]);
    expect(merged.vehicleModels).toEqual([]);
    expect(merged.vehicles).toEqual([]);
  });
});

describe('toArray', () => {
  it('wraps a single value', () => {
    expect(toArray('a')).toEqual(['a']);
  });

  it('returns an array as-is', () => {
    expect(toArray([1, 2])).toEqual([1, 2]);
  });

  it('returns empty array for undefined', () => {
    expect(toArray(undefined)).toEqual([]);
  });

  it('returns empty array for null', () => {
    expect(toArray(null)).toEqual([]);
  });
});
