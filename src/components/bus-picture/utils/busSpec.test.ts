import { describe, expect, it } from 'vitest';
import { validate } from '@entur/iteru-3dbus/core';
import type { BrokenRule, BusSpec } from './busSpec.ts';
import { STANDARD_BUS, toBusInput } from './standardBus.ts';

const FULL = { length: 12, width: 2.55, height: 3.2 };
// Every length the standard bus takes, by 0.5 m; every leaf mix of 1–5 doors, and 6.
const LENGTHS_M = Array.from({ length: 46 }, (_, i) => 7.5 + i / 2);
const DOORS = [
  undefined,
  '',
  '2+2+2+2+2+2',
  ...[1, 2, 3, 4, 5].flatMap(n =>
    Array.from({ length: 2 ** n }, (_, m) =>
      Array.from({ length: n }, (_, i) => ((m >> i) & 1) + 1).join('+')
    )
  ),
];
const SPECS: BusSpec[] = [false, true].flatMap(articulated =>
  [undefined, 2, 3, 4, 5].flatMap(axles =>
    DOORS.flatMap(doors =>
      (['single', 'double'] as const).flatMap(decks =>
        [false, true].map(lowFloor => ({ articulated, axles, doors, decks, lowFloor }))
      )
    )
  )
);
const keys = (spec: BusSpec, length: number) =>
  toBusInput({ ...FULL, length }, 'vehicle', spec).broken.map(r => r.key);

describe('toBusInput with a spec', () => {
  it('without a spec draws exactly as before', () => {
    expect(toBusInput({ length: 14.95 }, 'vehicle')).toEqual(
      toBusInput({ length: 14.95 }, 'vehicle', undefined)
    );
    expect(toBusInput({ length: 14.95 }, 'vehicle').inp.sections).toEqual([
      {
        length_mm: 14_950,
        axles_mm: [2_700, 10_719],
        doors_hint: STANDARD_BUS.doors.map(d => ({ ...d })),
      },
    ]);
  });

  it('an empty spec draws the standard shape', () => {
    expect(toBusInput({ length: 12 }, 'vehicleType', {})).toEqual(
      toBusInput({ length: 12 }, 'vehicleType')
    );
  });

  // The rules are the whole truth: what they let through, the package draws (at both
  // heights, so a double deck's upper band is checked too).
  it('draws every fact the rules allow, at every length and height', () => {
    const rejected = SPECS.flatMap(spec =>
      LENGTHS_M.flatMap(length =>
        [1.5, 1.6, 3.2, 4.2].flatMap(height => {
          const { inp, broken } = toBusInput({ ...FULL, length, height }, 'vehicle', spec);
          const errs = broken.length === 0 ? validate(inp) : [];
          return errs.length > 0 ? [`${JSON.stringify(spec)} at ${length} m: ${errs[0]}`] : [];
        })
      )
    );
    expect(rejected).toEqual([]);
  });

  it.each<[BusSpec, number, string]>([
    [{ articulated: true }, 15, 'articulatedLength'],
    [{ articulated: true, doors: '2+2+2+2+2' }, 18.5, 'articulated5DoorsLength'],
    [{ axles: 3 }, 9, 'triaxleLength'],
    [{ axles: 3, doors: '2+2+2' }, 10, 'triaxle3DoorsLength'],
  ])('%o is drawn from %d m, and below that breaks %s', (spec, min, key) => {
    expect(keys(spec, min)).toEqual([]);
    expect(toBusInput({ ...FULL, length: min - 0.1 }, 'vehicle', spec).broken).toEqual([
      expect.objectContaining({ key, min, length: min - 0.1 }),
    ]);
  });

  it('a double-decker is drawn from 1.6 m tall, and below that breaks doubleHeight', () => {
    const at = (height: number) =>
      toBusInput({ ...FULL, height }, 'vehicle', { decks: 'double' }).broken;
    expect(at(1.6)).toEqual([]);
    expect(at(1.55)).toEqual([{ key: 'doubleHeight', min: 1.6, height: 1.55 }]);
  });

  // A record without a length isn't held to the standard 12 m: the shape gets the length it needs.
  it.each<[BusSpec, number]>([
    [{ articulated: true }, 15_000],
    [{ articulated: true, doors: '2+2+2+2+2' }, 18_500],
    [{ axles: 3, doors: '2+2+2' }, 12_000],
  ])('without a length, draws %o at %d mm', (spec, mm) => {
    const { inp, fallback, broken } = toBusInput({}, 'vehicle', spec);
    expect(broken).toEqual([]);
    expect(fallback).toContain('length');
    expect(inp.sections.reduce((sum, s) => sum + s.length_mm + (s.bellows_ahead_mm ?? 0), 0)).toBe(
      mm
    );
  });

  it('draws the standard two doors where the standard bus has them', () => {
    expect(toBusInput(FULL, 'vehicle', { doors: '2+2' }).inp).toEqual(
      toBusInput(FULL, 'vehicle').inp
    );
  });

  it('tells only the longest length a bus needs', () => {
    expect(keys({ axles: 3, doors: '1+1+1' }, 8)).toEqual(['triaxle3DoorsLength']);
  });

  it('articulated: two sections behind bellows, three axles by default', () => {
    const [lead, trail] = toBusInput({ length: 18 }, 'vehicle', { articulated: true }).inp.sections;
    expect(lead.axles_mm).toHaveLength(2);
    expect(trail?.axles_mm).toHaveLength(1);
    expect(trail?.bellows_ahead_mm).toBe(600);
  });

  it('a double deck gets an upper window band; low floor a wider one', () => {
    expect(
      toBusInput({ height: 4.2 }, 'vehicle', { decks: 'double' }).inp.upper_win_band_height_mm
    ).toBe(850);
    expect(toBusInput({}, 'vehicle', { lowFloor: true }).inp.win_band_height_mm).toBe(1500);
    expect(toBusInput({}, 'vehicle', { lowFloor: false }).inp).not.toHaveProperty(
      'win_band_height_mm'
    );
  });

  it('no doors when told none', () => {
    expect(toBusInput({}, 'vehicle', { doors: [] }).inp.sections[0]).not.toHaveProperty(
      'doors_hint'
    );
  });

  it.each<[BusSpec, BrokenRule[]]>([
    [{ axles: 5 }, [{ key: 'axlesRigid', min: 2, max: 3 }]],
    [{ articulated: true, axles: 2 }, [{ key: 'axlesArticulated', min: 3, max: 4 }]],
    [{ doors: '2+3' }, [{ key: 'leaves' }]],
    [{ doors: '1+1+1+1' }, [{ key: 'doorsRigid', max: 3 }]],
    [{ articulated: true, doors: '1+1+1+1+1+1' }, [{ key: 'doorsArticulated', max: 5 }]],
    [{ articulated: true, decks: 'double' }, [{ key: 'articulatedDouble' }]],
  ])('draws %o as the standard shape, and says why', (spec, broken) => {
    const at18 = { ...FULL, length: 18.5 };
    const out = toBusInput(at18, 'vehicle', spec);
    expect(out.broken).toEqual(broken);
    expect(out.fallback).toEqual(['shape']);
    expect(out.inp).toEqual(toBusInput(at18, 'vehicle').inp);
  });
});
