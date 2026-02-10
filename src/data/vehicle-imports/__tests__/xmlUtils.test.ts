import { describe, expect, it } from 'vitest';
import { XMLParser } from 'fast-xml-parser';
import type { ImportEntry, FramesByQueryRegNumber } from '../types';
import { findResourceFrame, mergeResourceFrames, toArray } from '../xmlUtils';
import { makeXml } from './__fixtures__/makeXml';

const parser = new XMLParser({ ignoreAttributes: false });

function framesByReg(...regNumbers: string[]): FramesByQueryRegNumber {
  const set: FramesByQueryRegNumber = {};
  for (const rn of regNumbers) {
    const parsed = parser.parse(makeXml({ vehicleReg: rn, vehicleId: `NMR:Vehicle:${rn}` }));
    set[rn] = findResourceFrame(parsed)!;
  }
  return set;
}

describe('mergeResourceFrames', () => {
  it('returns empty arrays for empty input', () => {
    const merged = mergeResourceFrames({});
    expect(merged.vehicles).toEqual([]);
  });

  it('deduplicates entities by @_id', () => {
    const frames = framesByReg('AB1234', 'CD5678');
    const merged = mergeResourceFrames(frames);
    // Both fixtures share NMR:VehicleType:1 etc. by default
    expect(merged.vehicleTypes).toHaveLength(1);
    expect(merged.vehicles).toHaveLength(2);
  });

  it('injects OperationalNumber for vehicles with matching entries', () => {
    const frames = framesByReg('AB1234', 'CD5678');
    const entries: ImportEntry[] = [
      { queryRegNumber: 'AB1234', operationalRef: 'OP-001' },
      { queryRegNumber: 'CD5678', operationalRef: 'OP-002' },
    ];

    const merged = mergeResourceFrames(frames, entries);

    expect(merged.vehicles).toHaveLength(2);
    expect(merged.vehicles[0].OperationalNumber).toBe('OP-001');
    expect(merged.vehicles[1].OperationalNumber).toBe('OP-002');
  });

  it('leaves vehicles untouched when entry has no operationalRef', () => {
    const frames = framesByReg('AB1234');
    const entries: ImportEntry[] = [{ queryRegNumber: 'AB1234' }];

    const merged = mergeResourceFrames(frames, entries);
    expect(merged.vehicles[0].OperationalNumber).toBeUndefined();
  });

  it('only injects for matching vehicles in a mixed set', () => {
    const frames = framesByReg('AB1234', 'CD5678');
    const entries: ImportEntry[] = [{ queryRegNumber: 'CD5678', operationalRef: 'OP-ONLY' }];

    const merged = mergeResourceFrames(frames, entries);

    expect(merged.vehicles[0].OperationalNumber).toBeUndefined();
    expect(merged.vehicles[1].OperationalNumber).toBe('OP-ONLY');
  });

  it('works with empty entries (backward compat)', () => {
    const frames = framesByReg('AB1234');
    const merged = mergeResourceFrames(frames);

    expect(merged.vehicles).toHaveLength(1);
    expect(merged.vehicles[0].OperationalNumber).toBeUndefined();
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
