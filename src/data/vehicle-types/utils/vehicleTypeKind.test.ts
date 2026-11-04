import { describe, it, expect } from 'vitest';
import { vehicleTypeKindOf } from './vehicleTypeKind.ts';

describe('vehicleTypeKindOf', () => {
  it('reads CONTRACTUAL from the CVT codespace', () => {
    expect(vehicleTypeKindOf('CVT:VehicleType:7')).toBe('CONTRACTUAL');
  });

  it('treats any other codespace, and a new (empty) id, as PHYSICAL', () => {
    expect(vehicleTypeKindOf('NMR:VehicleType:7')).toBe('PHYSICAL');
    expect(vehicleTypeKindOf('')).toBe('PHYSICAL');
  });
});
