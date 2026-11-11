import { describe, it, expect } from 'vitest';
import { vehicleTypeFormHref } from './vehicleTypeUrlParams.ts';

describe('vehicleTypeFormHref', () => {
  it('url-encodes the full NeTEx id (colons → %3A)', () => {
    expect(vehicleTypeFormHref('NMR:VehicleType:abc-123')).toBe(
      '/vehicle-types/NMR%3AVehicleType%3Aabc-123'
    );
  });
});
