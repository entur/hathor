import { describe, it, expect } from 'vitest';
import { restructNetexId } from './restructNetexId.ts';

describe('restructNetexId', () => {
  it('splices the donor codespace and given type around a bare value', () => {
    expect(restructNetexId('NMR:Vehicle:V1', 'VehicleType', '42')).toBe('NMR:VehicleType:42');
  });

  it('passes the value through unchanged when it already contains a colon', () => {
    // forward-compat: once sobek#125 ships, the nested id will already be full.
    expect(restructNetexId('NMR:Vehicle:V1', 'VehicleType', 'NMR:VehicleType:rail')).toBe(
      'NMR:VehicleType:rail'
    );
  });

  it('returns the value unchanged when the donor has no codespace separator', () => {
    expect(restructNetexId('noncolonical', 'VehicleType', '42')).toBe('42');
  });

  it('preserves codespaces beyond the default NMR', () => {
    expect(restructNetexId('FOO:Vehicle:V1', 'VehicleType', '7')).toBe('FOO:VehicleType:7');
  });
});
