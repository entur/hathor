import { describe, it, expect } from 'vitest';
import { schema, validate } from '@entur/iteru-3dbus/core';
import { STANDARD_BUS, toBusInput } from './standardBus.ts';

describe('toBusInput', () => {
  it('draws a record without dims as the standard bus, all three flagged', () => {
    const { inp, fallback } = toBusInput({}, 'vehicleType');
    expect(inp.sections[0].length_mm).toBe(STANDARD_BUS.dimsMm.length);
    expect(inp.width_mm).toBe(STANDARD_BUS.dimsMm.width);
    expect(inp.height_mm).toBe(STANDARD_BUS.dimsMm.height);
    expect(fallback).toEqual(['length', 'width', 'height']);
  });

  it('takes the dims a record has, metres to mm, and flags only the rest', () => {
    const { inp, fallback } = toBusInput({ length: 14.95, height: null }, 'vehicleType');
    expect(inp.sections[0].length_mm).toBe(14_950);
    expect(inp.sections[0].axles_mm).toEqual([2700, 10719]);
    expect(fallback).toEqual(['width', 'height']);
  });

  it('draws a dim it cannot draw (a 74 m train, a 6 m minibus) as the default', () => {
    const { inp, fallback } = toBusInput({ length: 74, width: 2.9, height: 4 }, 'vehicleType');
    expect(inp.sections[0].length_mm).toBe(STANDARD_BUS.dimsMm.length);
    expect(fallback).toEqual(['length']);
    expect(toBusInput({ length: 6 }, 'vehicleType').fallback).toContain('length');
  });

  it('paints a vehicle type white and a vehicle red', () => {
    expect(toBusInput({}, 'vehicleType').inp.base_color.hex).toBe('#FFFFFF');
    expect(toBusInput({}, 'vehicle').inp.base_color.hex).toBe('#D32F2F');
  });

  it.each([
    ['the default', {}],
    ['a full record', { length: 12.4, width: 2.55, height: 3.3 }],
    ['the shortest, narrowest, lowest', { length: 7.5, width: 1.5, height: 1.5 }],
    ['the longest, widest, highest', { length: 30, width: 4, height: 6 }],
  ])('passes the package validate: %s', (_, dims) => {
    expect(validate(toBusInput(dims, 'vehicle').inp)).toEqual([]);
  });

  it("keeps the drawable range inside the package schema's bounds", () => {
    const bounds = (p: { minimum?: number; maximum?: number }) => [p.minimum, p.maximum];
    const length = schema.$defs.section_common.properties.length_mm;
    expect(STANDARD_BUS.rangeMm.width).toEqual(bounds(schema.properties.width_mm));
    expect(STANDARD_BUS.rangeMm.height).toEqual(bounds(schema.properties.height_mm));
    expect(STANDARD_BUS.rangeMm.length[1]).toBe(length.maximum);
    expect(STANDARD_BUS.rangeMm.length[0]).toBeGreaterThanOrEqual(length.minimum!);
  });
});
