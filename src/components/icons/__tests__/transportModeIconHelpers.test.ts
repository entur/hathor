import { describe, it, expect } from 'vitest';
import { colorVarFor } from '../transportModeIconHelpers.ts';

describe('colorVarFor', () => {
  it('returns a var() CSS expression with --tm-fallback as the base fallback', () => {
    expect(colorVarFor('BUS')).toBe('var(--tm-BUS, var(--tm-fallback))');
    expect(colorVarFor('RAIL')).toBe('var(--tm-RAIL, var(--tm-fallback))');
    expect(colorVarFor('LIFT')).toBe('var(--tm-LIFT, var(--tm-fallback))');
    expect(colorVarFor('SNOW_AND_ICE')).toBe('var(--tm-SNOW_AND_ICE, var(--tm-fallback))');
    expect(colorVarFor('UNKNOWN')).toBe('var(--tm-UNKNOWN, var(--tm-fallback))');
    expect(colorVarFor('OTHER')).toBe('var(--tm-OTHER, var(--tm-fallback))');
  });
});
