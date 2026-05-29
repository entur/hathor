import { describe, it, expect } from 'vitest';
import { symbolIdFor, colorVarFor, SPRITE_MODES } from '../transportModeIconHelpers.ts';

describe('symbolIdFor', () => {
  it('returns the mode unchanged when the sprite has a dedicated <symbol>', () => {
    expect(symbolIdFor('bus')).toBe('bus');
    expect(symbolIdFor('coach')).toBe('coach');
    expect(symbolIdFor('taxi')).toBe('taxi');
    expect(symbolIdFor('trolleyBus')).toBe('trolleyBus');
    expect(symbolIdFor('rail')).toBe('rail');
    expect(symbolIdFor('tram')).toBe('tram');
    expect(symbolIdFor('metro')).toBe('metro');
    expect(symbolIdFor('cableway')).toBe('cableway');
    expect(symbolIdFor('funicular')).toBe('funicular');
    expect(symbolIdFor('lift')).toBe('lift');
    expect(symbolIdFor('water')).toBe('water');
    expect(symbolIdFor('air')).toBe('air');
    expect(symbolIdFor('snowAndIce')).toBe('snowAndIce');
    expect(symbolIdFor('unknown')).toBe('unknown');
  });
});

describe('colorVarFor', () => {
  it('returns a var() CSS expression with --tm-unknown as fallback', () => {
    expect(colorVarFor('bus')).toBe('var(--tm-bus, var(--tm-unknown))');
    expect(colorVarFor('rail')).toBe('var(--tm-rail, var(--tm-unknown))');
    expect(colorVarFor('lift')).toBe('var(--tm-lift, var(--tm-unknown))');
    expect(colorVarFor('snowAndIce')).toBe('var(--tm-snowAndIce, var(--tm-unknown))');
    expect(colorVarFor('unknown')).toBe('var(--tm-unknown, var(--tm-unknown))');
  });
});

describe('SPRITE_MODES', () => {
  it('contains exactly the 14 modes with a dedicated <symbol> in TransportModeSprite.tsx', () => {
    expect(SPRITE_MODES).toEqual(
      new Set([
        'bus',
        'coach',
        'taxi',
        'trolleyBus',
        'rail',
        'tram',
        'metro',
        'cableway',
        'funicular',
        'lift',
        'water',
        'air',
        'snowAndIce',
        'unknown',
      ])
    );
  });
});
