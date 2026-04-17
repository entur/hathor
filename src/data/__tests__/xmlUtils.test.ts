import { describe, expect, it } from 'vitest';
import { toArray } from '../xmlUtils';

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
