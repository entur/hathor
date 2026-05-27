import { describe, it, expect } from 'vitest';
import {
  isTransportMode,
  toTransportMode,
  transportModeFilters,
  transportModeLabelKey,
  transportModeSortValue,
} from './transportMode.ts';
import type { TransportMode } from './transportMode.ts';

describe('toTransportMode', () => {
  it('passes known NeTEx modes through unchanged', () => {
    expect(toTransportMode('rail')).toBe('rail');
    expect(toTransportMode('trolleyBus')).toBe('trolleyBus');
    expect(toTransportMode('snowAndIce')).toBe('snowAndIce');
  });

  it("maps null, undefined, and empty string to 'unknown'", () => {
    expect(toTransportMode(null)).toBe('unknown');
    expect(toTransportMode(undefined)).toBe('unknown');
    expect(toTransportMode('')).toBe('unknown');
  });

  it("maps unrecognised backend strings to 'unknown'", () => {
    expect(toTransportMode('boat')).toBe('unknown');
    expect(toTransportMode('TRAIN')).toBe('unknown'); // 'train' is not a NeTEx mode
    expect(toTransportMode('underground')).toBe('unknown');
  });

  it('case-folds uppercase GraphQL-enum values onto the canonical NeTEx form', () => {
    expect(toTransportMode('BUS')).toBe('bus');
    expect(toTransportMode('RAIL')).toBe('rail');
    expect(toTransportMode('TRAM')).toBe('tram');
    expect(toTransportMode('METRO')).toBe('metro');
    expect(toTransportMode('WATER')).toBe('water');
    expect(toTransportMode('AIR')).toBe('air');
    expect(toTransportMode('COACH')).toBe('coach');
    expect(toTransportMode('TAXI')).toBe('taxi');
    expect(toTransportMode('LIFT')).toBe('lift');
  });

  it('accepts GraphQL snake-cased enums for camelCase NeTEx modes', () => {
    expect(toTransportMode('TROLLEY_BUS')).toBe('trolleyBus');
    expect(toTransportMode('SNOW_AND_ICE')).toBe('snowAndIce');
  });

  it('accepts aggressively uppercased forms without separators', () => {
    expect(toTransportMode('TROLLEYBUS')).toBe('trolleyBus');
    expect(toTransportMode('SNOWANDICE')).toBe('snowAndIce');
  });
});

describe('isTransportMode', () => {
  it("returns true for known modes and 'unknown'", () => {
    expect(isTransportMode('rail')).toBe(true);
    expect(isTransportMode('unknown')).toBe(true);
  });

  it('returns false for unrecognised strings, null, undefined', () => {
    expect(isTransportMode('boat')).toBe(false);
    expect(isTransportMode(null)).toBe(false);
    expect(isTransportMode(undefined)).toBe(false);
    expect(isTransportMode('')).toBe(false);
  });
});

describe('transportModeLabelKey', () => {
  it('returns the i18n key matching the locale files', () => {
    expect(transportModeLabelKey('rail')).toBe('transportMode.rail');
    expect(transportModeLabelKey('unknown')).toBe('transportMode.unknown');
  });
});

describe('transportModeSortValue', () => {
  it("returns '' for 'unknown' so it sinks via compareWithEmptyLast", () => {
    expect(transportModeSortValue('unknown')).toBe('');
  });

  it('returns the enum id verbatim for known modes', () => {
    expect(transportModeSortValue('rail')).toBe('rail');
    expect(transportModeSortValue('bus')).toBe('bus');
  });
});

describe('transportModeFilters', () => {
  it("intentionally omits 'unknown' — chip filters are for specific known modes only", () => {
    expect(transportModeFilters.some(f => f.id === 'unknown')).toBe(false);
  });

  it('includes a filter entry for every known TransportMode (regression net for forgotten additions)', () => {
    const knownModes: TransportMode[] = [
      'bus',
      'tram',
      'rail',
      'metro',
      'water',
      'air',
      'coach',
      'taxi',
      'cableway',
      'funicular',
      'lift',
      'trolleyBus',
      'snowAndIce',
    ];
    const filterIds = new Set(transportModeFilters.map(f => f.id));
    knownModes.forEach(mode => {
      expect(filterIds.has(mode)).toBe(true);
    });
    expect(transportModeFilters).toHaveLength(knownModes.length);
  });
});
