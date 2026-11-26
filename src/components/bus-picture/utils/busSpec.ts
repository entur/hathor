/**
 * The facts a record may know beyond its outer dims, ported from the input side of iteru-3dbus
 * PR 57's `fromSpec` (`src/spec.js`, entur/iteru-3dbus#57). Its rendering choices (tyre, rear
 * twin, window band of a high floor, the two-axle rigid proportions) are not taken: a fact only
 * changes what it names, on top of the standard bus.
 *
 * shortcut: a copy of PR 57's proportions; import `fromSpec`'s parts if a release ships them.
 */
import type { BusInput, BusSection, DoorHint } from './standardBus.ts';

/** What a record may know about its shape; every fact is optional. */
export interface BusSpec {
  /** Rigid 2–3, articulated 3–4. The first is single, the rest twin. Default 2 (articulated 3). */
  axles?: number;
  /** Leaves of each door, front to rear: `[2, 2, 2]` or `"2+2+2"`; `[]` / `""` is no doors.
   *  Default the standard bus's `2+2` (articulated `2+2+2`). */
  doors?: (1 | 2)[] | string;
  decks?: 'single' | 'double';
  articulated?: boolean;
  /** Widens the side window band. */
  lowFloor?: boolean;
}

// PR 57's proportions, as fractions of a length unless marked mm.
const BELLOWS_MM = 600,
  LEAD = 0.58,
  PAIR_MM = 1400;
const REAR3 = 0.2; // rear overhang of a rigid three-axle bus
const ART_FRONT = 0.255,
  ART_REAR = 0.81,
  TRAIL_AT = 0.67,
  TRAIL_PAIR = 0.55; // axle places in an articulated bus's sections
const LOW_FLOOR_WIN_MM = 1500,
  UPPER_DECK = 0.2,
  UPPER_ROUND_MM = 50;
const ARTICULATED_DOORS = [2, 2, 2] as const;
// The limits of what is drawn, per body: below a length, or past a count, PR 57's axle and
// door places clash. Found by sweeping the package's validator (busSpec.test.ts), rounded
// up to safe values; the length limits hold for any leaves (two-leaf doors are the widest).
const AXLES = { rigid: [2, 3], articulated: [3, 4] } as const,
  MAX_DOORS = { rigid: 3, articulated: 5 } as const;
const MIN_ARTICULATED_MM = 15_000,
  MIN_TRIAXLE_MM = 9_000,
  MIN_TRIAXLE_3_DOORS_MM = 10_000,
  MIN_ARTICULATED_5_DOORS_MM = 18_500,
  MIN_DOUBLE_DECK_MM = 1_600; // below, the upper band leaves no room for the lower windows
const MM_PER_M = 1000;

/** A rule the facts break: its text is `busView.rule.<key>`, given the rest (lengths in m). */
export interface BrokenRule {
  key:
    | 'axlesRigid'
    | 'axlesArticulated'
    | 'leaves'
    | 'doorsRigid'
    | 'doorsArticulated'
    | 'articulatedDouble'
    | 'articulatedLength'
    | 'triaxleLength'
    | 'triaxle3DoorsLength'
    | 'articulated5DoorsLength'
    | 'doubleHeight';
  min?: number;
  max?: number;
  length?: number;
  height?: number;
  axles?: number;
  doors?: number;
}

/** Parses `"2+2+2"` or `[2, 2, 2]` into leaves per door. */
const leavesOf = (doors: BusSpec['doors']): number[] =>
  typeof doors === 'string'
    ? doors.trim() === ''
      ? []
      : doors.split(/\s*\+\s*/).map(Number)
    : [...(doors ?? [])];

/** Door hints for doors of the given leaves; `first` is the section at the front. */
const hints = (ls: number[], first: boolean): DoorHint[] =>
  ls.map((l, i) => {
    const n = ls.length,
      last = i === n - 1;
    const [zone, bias]: [DoorHint['zone'], DoorHint['bias']?] = first
      ? i === 0
        ? ['front_overhang']
        : last && n > 2
          ? ['rear_overhang']
          : ['between_axles'] // the package's middle, as the standard bus's doors
      : i === 0
        ? ['front_overhang', n > 1 ? 'front' : undefined]
        : last
          ? ['rear_overhang']
          : ['between_axles', 'middle'];
    return { zone, leaves: l as 1 | 2, ...(bias && { bias }) };
  });

const section = (length_mm: number, axles_mm: number[], doors: DoorHint[]): BusSection => ({
  length_mm,
  axles_mm,
  ...(doors.length > 0 && { doors_hint: doors }),
});

/**
 * The standard bus with the record's facts on top.
 *
 * @param {BusInput} base the standard bus at the record's dims, from `toBusInput`
 * @param {BusSpec} spec the facts; any may be missing
 * @param {boolean} [lengthKnown] false when `base` has the standard length, not the record's:
 *   then the bus is drawn as long as its shape needs, not held to the standard's
 * @returns {{ ok: true, inp: BusInput } | { ok: false, errs: BrokenRule[] }} the input, or
 *   every rule the facts break
 */
export const applySpec = (
  base: BusInput,
  spec: BusSpec,
  lengthKnown = true
): { ok: true; inp: BusInput } | { ok: false; errs: BrokenRule[] } => {
  const { articulated = false, decks = 'single', lowFloor = false } = spec;
  const n = spec.axles ?? (articulated ? 3 : 2);
  const ls =
    spec.doors !== undefined
      ? leavesOf(spec.doors)
      : articulated
        ? [...ARTICULATED_DOORS]
        : undefined;
  const given = base.sections[0].length_mm;
  const body = articulated ? 'articulated' : 'rigid';
  const [lo, hi] = AXLES[body];
  const doorCount = ls?.length ?? base.sections[0].doors_hint?.length ?? 0;
  // The lengths a body needs, shortest first: only the longest that applies is told.
  const needs: [boolean, BrokenRule, number][] = [
    [articulated, { key: 'articulatedLength' }, MIN_ARTICULATED_MM],
    [
      articulated && doorCount === MAX_DOORS.articulated,
      { key: 'articulated5DoorsLength', doors: 5 },
      MIN_ARTICULATED_5_DOORS_MM,
    ],
    [!articulated && n === 3, { key: 'triaxleLength', axles: 3 }, MIN_TRIAXLE_MM],
    [
      !articulated && n === 3 && doorCount === 3,
      { key: 'triaxle3DoorsLength', axles: 3, doors: 3 },
      MIN_TRIAXLE_3_DOORS_MM,
    ],
  ];
  const need = needs.filter(([applies]) => applies).at(-1);
  const L = !lengthKnown && need ? Math.max(given, need[2]) : given;
  const rules: [broken: boolean, BrokenRule][] = [
    [
      !(Number.isInteger(n) && n >= lo && n <= hi),
      { key: articulated ? 'axlesArticulated' : 'axlesRigid', min: lo, max: hi },
    ],
    [!(ls ?? []).every(l => l === 1 || l === 2), { key: 'leaves' }],
    [
      doorCount > MAX_DOORS[body],
      { key: articulated ? 'doorsArticulated' : 'doorsRigid', max: MAX_DOORS[body] },
    ],
    [articulated && decks === 'double', { key: 'articulatedDouble' }],
    [
      decks === 'double' && base.height_mm < MIN_DOUBLE_DECK_MM,
      {
        key: 'doubleHeight',
        min: MIN_DOUBLE_DECK_MM / MM_PER_M,
        height: base.height_mm / MM_PER_M,
      },
    ],
  ];
  const errs: BrokenRule[] = [
    ...rules.filter(([broken]) => broken).map(([, rule]) => rule),
    ...(need && L < need[2] ? [{ ...need[1], min: need[2] / MM_PER_M, length: L / MM_PER_M }] : []),
  ];
  if (errs.length > 0) return { ok: false, errs };

  const [std] = base.sections;
  let sections: BusInput['sections'];
  if (articulated) {
    const lead = Math.round((L - BELLOWS_MM) * LEAD),
      trail = L - BELLOWS_MM - lead;
    const at = Math.round(trail * (n === 4 ? TRAIL_PAIR : TRAIL_AT));
    const trailAxles = n === 4 ? [at - PAIR_MM / 2, at + PAIR_MM / 2] : [at];
    const doors = ls ?? [];
    const cut = Math.min(doors.length, Math.max(2, doors.length - Math.ceil(doors.length / 3)));
    sections = [
      section(
        lead,
        [Math.round(lead * ART_FRONT), Math.round(lead * ART_REAR)],
        hints(doors.slice(0, cut), true)
      ),
      {
        ...section(trail, trailAxles, hints(doors.slice(cut), false)),
        bellows_ahead_mm: BELLOWS_MM,
      },
    ];
  } else {
    const rear = Math.round(L * (1 - REAR3));
    const axles = n === 2 ? std.axles_mm : [std.axles_mm[0], rear - PAIR_MM, rear];
    sections = [section(L, axles, ls ? hints(ls, true) : (std.doors_hint ?? []))];
  }

  const H = base.height_mm;
  return {
    ok: true,
    inp: {
      ...base,
      ...(lowFloor && { win_band_height_mm: LOW_FLOOR_WIN_MM }),
      ...(decks === 'double' && {
        upper_win_band_height_mm: Math.round((H * UPPER_DECK) / UPPER_ROUND_MM) * UPPER_ROUND_MM,
      }),
      sections,
    },
  };
};
