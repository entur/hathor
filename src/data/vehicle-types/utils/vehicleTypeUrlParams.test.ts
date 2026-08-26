import { describe, it, expect } from 'vitest';
import { VEHICLE_TYPE_SELECTED_PARAM, vehicleTypeSelectedHref } from './vehicleTypeUrlParams.ts';

describe('vehicleTypeUrlParams', () => {
  it('uses the `selected` param key (matches /vehicles)', () => {
    expect(VEHICLE_TYPE_SELECTED_PARAM).toBe('selected');
  });

  it('builds a /vehicle-types href with the param', () => {
    expect(vehicleTypeSelectedHref('NMR:VehicleType:1')).toBe(
      '/vehicle-types?selected=NMR%3AVehicleType%3A1'
    );
  });

  it('url-encodes the full NeTEx id (colons → %3A)', () => {
    const href = vehicleTypeSelectedHref('NMR:VehicleType:abc-123');
    expect(href).toContain('selected=NMR%3AVehicleType%3Aabc-123');
    expect(href).not.toContain(':');
  });
});
