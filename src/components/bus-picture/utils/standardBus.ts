/** The outer dims a record may carry, as Sobek sends them: metres. */
export type BusDim = 'length' | 'width' | 'height';
export type BusDims = Partial<Record<BusDim, number | null>>;
/** Which record the picture stands for: picks the body colour. */
export type BusPaint = 'vehicleType' | 'vehicle';

/** `@entur/iteru-3dbus` input (contract v3.0), narrowed to what {@link toBusInput} builds. */
export interface BusInput {
  schema_version: '3.0';
  width_mm: number;
  height_mm: number;
  tyre: { size: string };
  base_color: { hex: string };
  sections: [
    {
      length_mm: number;
      axles_mm: number[];
      doors_hint: { zone: 'front_overhang' | 'between_axles'; leaves: 1 | 2 }[];
    },
  ];
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
 * Builds the bus a record is drawn as: its own outer dims where usable, the
 * {@link STANDARD_BUS} for everything else.
 *
 * @param {BusDims} dims length, width and height in metres; any may be missing
 * @param {BusPaint} paint body colour: white for a vehicle type, red for a vehicle
 * @returns {{ inp: BusInput, fallback: BusDim[] }} the input, and the dims drawn as the default
 */
export const toBusInput = (dims: BusDims, paint: BusPaint) => {
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
  return { inp, fallback: DIMS.filter(d => usableMm(dims, d) === undefined) };
};
