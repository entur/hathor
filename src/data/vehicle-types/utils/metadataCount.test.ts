import { describe, it, expect } from 'vitest';
import { metadataCount } from './metadataCount.ts';

describe('metadataCount', () => {
  it('is 0 when the VehicleType has neither privateCode nor keyValues', () => {
    expect(metadataCount({ id: 'x', version: 1 })).toBe(0);
  });

  it('counts privateCode as 1', () => {
    expect(metadataCount({ id: 'x', version: 1, privateCode: { value: 'PC-1' } })).toBe(1);
  });

  it('counts each keyValues entry', () => {
    expect(
      metadataCount({
        id: 'x',
        version: 1,
        keyValues: [
          { key: 'imported-id', values: ['A'] },
          { key: 'MaximumEngineEffectKW', values: ['265'] },
        ],
      })
    ).toBe(2);
  });

  it('sums privateCode + keyValues', () => {
    expect(
      metadataCount({
        id: 'x',
        version: 1,
        privateCode: { value: 'PC-1' },
        keyValues: [{ key: 'imported-id', values: ['A'] }],
      })
    ).toBe(2);
  });
});
