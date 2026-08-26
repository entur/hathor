import { describe, it, expect } from 'vitest';
import {
  isTransportMode,
  transportModeFilters,
  transportModeLabelKey,
  transportModeSortValue,
} from './transportMode.ts';

/**
 * Mirror of `enum TransportMode` in `src/graphql/sobek.schema.graphqls` — all
 * 21 members. The canonical `TransportMode` union must keep this exact count
 * (the 13-mode chip set and 14-mode sprite set are presentation subsets; the
 * enum itself stays in lockstep with the schema).
 */
const SCHEMA_ENUM: string[] = [
  'AIR',
  'ALL',
  'ANY_MODE',
  'BUS',
  'CABLEWAY',
  'COACH',
  'FERRY',
  'FUNICULAR',
  'INTERCITY_RAIL',
  'LIFT',
  'METRO',
  'OTHER',
  'RAIL',
  'SELF_DRIVE',
  'SNOW_AND_ICE',
  'TAXI',
  'TRAM',
  'TROLLEY_BUS',
  'UNKNOWN',
  'URBAN_RAIL',
  'WATER',
];

describe('isTransportMode', () => {
  it('recognises every one of the 21 Sobek schema enum members (enum count in lockstep with schema)', () => {
    expect(SCHEMA_ENUM).toHaveLength(21);
    SCHEMA_ENUM.forEach(mode => expect(isTransportMode(mode)).toBe(true));
  });

  it('returns true for the Sobek enum members (incl. UNKNOWN)', () => {
    expect(isTransportMode('RAIL')).toBe(true);
    expect(isTransportMode('TROLLEY_BUS')).toBe(true);
    expect(isTransportMode('UNKNOWN')).toBe(true);
  });

  it('returns false for unrecognised strings, lowercase, null, undefined', () => {
    expect(isTransportMode('boat')).toBe(false);
    expect(isTransportMode('rail')).toBe(false); // canonical form is now UPPER_CASE
    expect(isTransportMode(null)).toBe(false);
    expect(isTransportMode(undefined)).toBe(false);
    expect(isTransportMode('')).toBe(false);
  });
});

describe('transportModeLabelKey', () => {
  it('returns the i18n key matching the locale files', () => {
    expect(transportModeLabelKey('RAIL')).toBe('transportMode.RAIL');
    expect(transportModeLabelKey('UNKNOWN')).toBe('transportMode.UNKNOWN');
  });
});

describe('transportModeSortValue', () => {
  it('returns the enum id verbatim — UNKNOWN is no longer forced last', () => {
    expect(transportModeSortValue('UNKNOWN')).toBe('UNKNOWN');
    expect(transportModeSortValue('RAIL')).toBe('RAIL');
    expect(transportModeSortValue('BUS')).toBe('BUS');
  });
});

describe('transportModeFilters (data-driven — no curated subset)', () => {
  it('derives one chip per distinct mode present in the data, deduped and sorted', () => {
    const filters = transportModeFilters(['RAIL', 'BUS', 'RAIL', 'FERRY']);
    expect(filters.map(f => f.id)).toEqual(['BUS', 'FERRY', 'RAIL']);
    expect(filters.every(f => f.labelKey === `transportMode.${f.id}`)).toBe(true);
  });

  it('returns an empty chip list when the data carries no modes', () => {
    expect(transportModeFilters([])).toEqual([]);
  });
});
