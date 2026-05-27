import { describe, it, expect } from 'vitest';
import { symbolIdFor, colorVarFor, SPRITE_MODES } from '../transportModeIconHelpers.ts';

describe('symbolIdFor', () => {
  it('returns the mode unchanged when the sprite has a matching <symbol>', () => {
    expect(symbolIdFor('bus')).toBe('bus');
    expect(symbolIdFor('rail')).toBe('rail');
    expect(symbolIdFor('water')).toBe('water');
    expect(symbolIdFor('unknown')).toBe('unknown');
  });

  it('falls back to "unknown" for modes the sprite has not drawn yet', () => {
    expect(symbolIdFor('taxi')).toBe('unknown');
    expect(symbolIdFor('cableway')).toBe('unknown');
    expect(symbolIdFor('funicular')).toBe('unknown');
    expect(symbolIdFor('lift')).toBe('unknown');
    expect(symbolIdFor('trolleyBus')).toBe('unknown');
    expect(symbolIdFor('snowAndIce')).toBe('unknown');
  });
});

describe('colorVarFor', () => {
  it('returns a var() CSS expression with --tm-unknown as fallback', () => {
    expect(colorVarFor('bus')).toBe('var(--tm-bus, var(--tm-unknown))');
    expect(colorVarFor('rail')).toBe('var(--tm-rail, var(--tm-unknown))');
    expect(colorVarFor('snowAndIce')).toBe('var(--tm-snowAndIce, var(--tm-unknown))');
    expect(colorVarFor('unknown')).toBe('var(--tm-unknown, var(--tm-unknown))');
  });
});

describe('SPRITE_MODES', () => {
  it('contains exactly the 8 modes drawn in TransportModeSprite.tsx', () => {
    expect(SPRITE_MODES).toEqual(
      new Set(['bus', 'coach', 'rail', 'tram', 'metro', 'water', 'air', 'unknown'])
    );
  });
});
