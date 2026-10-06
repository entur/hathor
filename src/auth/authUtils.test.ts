import { describe, expect, it } from 'vitest';
import { returnTo } from './authUtils';

describe('returnTo', () => {
  it('returns the stored path, query and hash intact', () => {
    expect(returnTo({ returnTo: '/vehicle-types?selected=NMR:VehicleType:1#top' })).toBe(
      '/vehicle-types?selected=NMR:VehicleType:1#top'
    );
  });

  it.each([
    ['missing state', undefined],
    ['null state', null],
    ['state without returnTo', {}],
    ['non-string returnTo', { returnTo: 42 }],
    ['empty returnTo', { returnTo: '' }],
    ['relative path without leading slash', { returnTo: 'vehicle-types' }],
    ['absolute URL', { returnTo: 'https://evil.example/vehicle-types' }],
    ['protocol-relative URL', { returnTo: '//evil.example' }],
    ['backslash protocol-relative URL', { returnTo: '/\\evil.example' }],
  ])('falls back to home for %s', (_, state) => {
    expect(returnTo(state)).toBe('/');
  });
});
