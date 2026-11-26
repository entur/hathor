/**
 * A street for the live bus: a road under it, and houses and blocks of flats beyond, in the
 * ground's colours so the bus stays the subject. Plain three.js, loaded with the live stage.
 * Scene units are metres; the bus stands at the origin, its length along x, in the road's
 * near lane. The same street every time (a fixed seed).
 */
import {
  BoxGeometry,
  CylinderGeometry,
  Group,
  Mesh,
  MeshStandardMaterial,
  PlaneGeometry,
} from 'three';
import { FLOOR_LIGHT, type StageColours } from './stageTheme.ts';

// The road: two 3.5 m lanes, the bus centred in the near one; long enough to run into the fog.
// Marking and road sit a little over the ground disc, so they don't flicker into it.
const LANE_W = 3.5,
  ROAD_L = 160,
  ROAD_Y = 0.01,
  LINE_Y = 0.02;
const DASH_L = 3,
  DASH_GAP = 6,
  DASH_W = 0.15;
// The buildings: rows either side, past where the camera orbits (it rests ~20 m out), along
// ±ROW_X; a lot each, with gaps. Sizes in metres as [min, max].
const ROWS_Z = [45, 62],
  ROW_X = 80,
  GAP_M = [2, 7];
const HOUSE = { w: [7, 11], d: 9, h: [4.5, 7] },
  FLATS = { w: [12, 22], d: 13, h: [10, 22] },
  FLATS_SHARE = 0.4;
const SEED = 0x5eed;
const HALF_TURN = Math.PI / 2;

/** A seeded uniform random in [0, 1) (mulberry32): the same street on every load. */
const rng = (seed: number) => () => {
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 2 ** 32;
};

/** A lit material that shows `css` where the ground's light falls, as the ground does. */
const lit = (css: string) => {
  const m = new MeshStandardMaterial({ roughness: 1 });
  m.color.set(css).multiplyScalar(1 / FLOOR_LIGHT);
  return m;
};

const flat = (
  w: number,
  d: number,
  material: MeshStandardMaterial,
  x: number,
  y: number,
  z: number
) => {
  const m = new Mesh(new PlaneGeometry(w, d).rotateX(-HALF_TURN), material);
  m.position.set(x, y, z);
  return m;
};

/**
 * A row of houses (pitched roofs) and blocks of flats along x, at depth `z` from the road.
 *
 * @returns {Mesh[]} the buildings' meshes
 */
const row = (z: number, side: 1 | -1, next: () => number, materials: MeshStandardMaterial[]) => {
  const pick = ([lo, hi]: number[]) => lo + next() * (hi - lo);
  const meshes: Mesh[] = [];
  for (let x = -ROW_X; x < ROW_X;) {
    const flats = next() < FLATS_SHARE,
      kind = flats ? FLATS : HOUSE;
    const w = pick(kind.w),
      h = pick(kind.h),
      d = kind.d;
    const material = materials[Math.floor(next() * materials.length)];
    const cz = side * (z + d / 2);
    const body = new Mesh(new BoxGeometry(w, h, d), material);
    body.position.set(x + w / 2, h / 2, cz);
    meshes.push(body);
    if (!flats) {
      // A triangular prism, ridge across the row: its apex up, its base the house's width.
      const r = w / Math.sqrt(3);
      const roof = new Mesh(new CylinderGeometry(r, r, d, 3).rotateX(-HALF_TURN), material);
      roof.position.set(x + w / 2, h + r / 2, cz);
      meshes.push(roof);
    }
    x += w + pick(GAP_M);
  }
  return meshes;
};

/**
 * Builds the street.
 *
 * @param {StageColours} colours the stage's colours: road, line and buildings are used
 * @returns {Group} the street, to `stage.add` (and `stage.drop`, which frees it)
 */
export const mkScenery = (colours: StageColours): Group => {
  const next = rng(SEED);
  const road = lit(colours.road),
    line = lit(colours.line),
    buildings = colours.buildings.map(lit);
  const dashes = Array.from({ length: Math.ceil(ROAD_L / (DASH_L + DASH_GAP)) }, (_, i) =>
    flat(DASH_L, DASH_W, line, -ROAD_L / 2 + i * (DASH_L + DASH_GAP), LINE_Y, LANE_W / 2)
  );
  return new Group().add(
    flat(ROAD_L, 2 * LANE_W, road, 0, ROAD_Y, LANE_W / 2),
    ...dashes,
    ...ROWS_Z.flatMap(z => [...row(z, 1, next, buildings), ...row(z, -1, next, buildings)])
  );
};
