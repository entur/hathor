import { applySpec, type BrokenRule, type BusSpec } from './busSpec.ts';
import type { TransportMode } from '../../../data/netex/transportMode.ts';

/** The outer dims a record may carry, as Sobek sends them: metres. */
export type BusDim = 'length' | 'width' | 'height';
export type BusDims = Partial<Record<BusDim, number | null>>;
/** Which record the picture stands for: picks the body colour. */
export type BusPaint = 'vehicleType' | 'vehicle';

/** What {@link toBusInput} names in place of a dim: `shape` = the facts were drawn as the standard's. */
export type BusFallback = BusDim | 'shape';

export interface DoorHint {
  zone: 'front_overhang' | 'between_axles' | 'rear_overhang';
  leaves: 1 | 2;
  bias?: 'front' | 'middle' | 'rear';
}
export interface BusSection {
  length_mm: number;
  axles_mm: number[];
  doors_hint?: DoorHint[];
  /** Trailer section of an articulated bus: the bellows ahead of it. */
  bellows_ahead_mm?: number;
}

/** `@entur/iteru-3dbus` input (contract v3.0), narrowed to what {@link toBusInput} builds. */
export interface BusInput {
  schema_version: '3.0';
  width_mm: number;
  height_mm: number;
  tyre: { size: string };
  base_color: { hex: string };
  win_band_height_mm?: number;
  /** Present: two decks. */
  upper_win_band_height_mm?: number;
  sections: [BusSection] | [BusSection, BusSection];
}

const MM_PER_M = 1000;

/**
 * What GraphQL can't give yet: a 12 m, two-axle, two-door city bus. A record's
 * outer dims replace `dimsMm`; the rest always comes from here.
 */
export const STANDARD_BUS = {
  dimsMm: { length: 12_000, width: 2_550, height: 3_200 },
  /** What can be drawn; a dim outside it is drawn as the default. The package schema's bounds,
   *  but no shorter than 7.5 m: below that two double doors run into the axles. */
  rangeMm: { length: [7_500, 30_000], width: [1_500, 4_000], height: [1_500, 6_000] },
  /** Front axle at a fixed overhang (it holds the front door); rear axle as a share of the length. */
  frontAxleMm: 2_700,
  rearAxleAt: 0.717,
  doors: [
    { zone: 'front_overhang', leaves: 2 },
    { zone: 'between_axles', leaves: 2 },
  ],
  tyre: '275/70 R22.5',
  color: { vehicleType: '#FFFFFF', vehicle: '#D32F2F' },
} as const;

/** Modes the package can draw. No mode (or `UNKNOWN`) is drawn as the standard bus too. */
export const DRAWN_MODES: ReadonlySet<TransportMode> = new Set([
  'BUS',
  'COACH',
  'TROLLEY_BUS',
  'UNKNOWN',
]);

const DIMS: readonly BusDim[] = ['length', 'width', 'height'];

/** The record's dim in mm, or `undefined` when it is missing or outside the schema's bounds. */
const usableMm = (dims: BusDims, dim: BusDim): number | undefined => {
  const m = dims[dim];
  if (m == null || !Number.isFinite(m)) return undefined;
  const mm = Math.round(m * MM_PER_M);
  const [min, max] = STANDARD_BUS.rangeMm[dim];
  return mm >= min && mm <= max ? mm : undefined;
};

/**
 * Builds the bus a record is drawn as: its own outer dims where usable, its facts
 * (axles, doors, decks, …) where drawable, the {@link STANDARD_BUS} for everything else.
 *
 * @param {BusDims} dims length, width and height in metres; any may be missing
 * @param {BusPaint} paint body colour: white for a vehicle type, red for a vehicle
 * @param {BusSpec} [spec] the shape facts; none = the standard bus's shape
 * @returns {{ inp: BusInput, fallback: BusFallback[], broken: BrokenRule[] }} the input, what
 *   was drawn as the default, and the rules the spec broke (then the shape is the default)
 */
export const toBusInput = (
  dims: BusDims,
  paint: BusPaint,
  spec?: BusSpec
): { inp: BusInput; fallback: BusFallback[]; broken: BrokenRule[] } => {
  const mm = (d: BusDim) => usableMm(dims, d) ?? STANDARD_BUS.dimsMm[d];
  const length = mm('length');
  const inp: BusInput = {
    schema_version: '3.0',
    width_mm: mm('width'),
    height_mm: mm('height'),
    tyre: { size: STANDARD_BUS.tyre },
    base_color: { hex: STANDARD_BUS.color[paint] },
    sections: [
      {
        length_mm: length,
        axles_mm: [STANDARD_BUS.frontAxleMm, Math.round(length * STANDARD_BUS.rearAxleAt)],
        doors_hint: STANDARD_BUS.doors.map(d => ({ ...d })),
      },
    ],
  };
  const fallback: BusFallback[] = DIMS.filter(d => usableMm(dims, d) === undefined);
  if (!spec) return { inp, fallback, broken: [] };
  const shaped = applySpec(inp, spec, !fallback.includes('length'));
  return shaped.ok
    ? { inp: shaped.inp, fallback, broken: [] }
    : { inp, fallback: [...fallback, 'shape'], broken: shaped.errs };
};
