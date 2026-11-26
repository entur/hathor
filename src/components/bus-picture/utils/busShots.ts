import type { BusGroup, ShotStage } from '@entur/iteru-3dbus';
import type { BusInput } from './standardBus.ts';
import { groundOf, themeStage } from './stageTheme.ts';

// Textures at a third, as the package's own gallery (`src/gallery.js`).
const DETAIL = 0.35;

/** The pose a picture is shot from, and the live canvas opens on. */
export const VIEW = 'quarter';

export type Lib = typeof import('@entur/iteru-3dbus');

/** A picture's size in css px. */
export type ShotSize = { w: number; h: number };
/** A card's picture: its 16:10, about a card's width. */
export const CARD_SHOT: ShotSize = { w: 400, h: 250 };

/** How far the eye moves from the package's framing toward the bus: the card view pulled in. */
export const CLOSER = 0.3;

/**
 * Builds a bus centred on the stage (the package puts its front at x = 0).
 *
 * @param {Lib} lib the loaded package
 * @param {BusInput} inp a valid bus input
 * @param {number} [detail] texture density, 1 = full (the package's default)
 * @returns {{ group: BusGroup, len: number }} the group and its overall length in scene units
 */
export const centredBus = (lib: Lib, inp: BusInput, detail?: number) => {
  const group = lib.mkBus(inp, lib.faces(inp), detail === undefined ? undefined : { detail });
  const len = lib.total(inp) * lib.MM;
  group.position.x = -len / 2;
  return { group, len };
};
interface Stage {
  lib: Lib;
  stage: ShotStage;
  bg: string;
  size: ShotSize;
  go: (view: string, instant?: boolean) => void;
  /** What the camera views frame: the bus on stage now. */
  cur: { group: BusGroup | null; len: number };
}
interface Shot {
  url: Promise<string>;
  holders: number;
}

/** One stage for every picture on the page — a browser keeps only so many WebGL contexts —
 *  open only while shots are queued. */
let stage: Promise<Stage> | null = null;
let queue: Promise<unknown> = Promise.resolve();
let pending = 0;
/** Set once the browser has refused a WebGL context: no card tries again on this page load. */
let noWebGL = false;
const shots = new Map<string, Shot>();

const openStage = async (bg: string, size: ShotSize): Promise<Stage> => {
  const lib = await import('@entur/iteru-3dbus');
  try {
    const s = lib.mkStageShot({ ...size, bg });
    const cur: Stage['cur'] = { group: null, len: 0 };
    return { lib, stage: s, bg, size, go: lib.mkViews(s, () => cur), cur };
  } catch (e) {
    noWebGL = true;
    throw e;
  }
};

/** Gives the WebGL context back. */
const dropStage = () => {
  const done = stage;
  stage = null;
  void done?.then(s => s.stage.dispose()).catch(() => undefined);
};

const shoot = async (
  inp: BusInput,
  bg: string,
  size: ShotSize,
  ground: string
): Promise<string> => {
  if (noWebGL) throw new Error('no WebGL');
  // A theme switch: the stage's light follows the colour behind the picture. Another size:
  // shortcut: a stage per size, so mixed sizes on one page reopen it per switch; resize it
  // in place if a page ever mixes many.
  const open = stage && (await stage.catch(() => null));
  if (stage && (open?.bg !== bg || open.size.w !== size.w || open.size.h !== size.h)) dropStage();
  if (!stage) {
    const opening = openStage(bg, size);
    stage = opening;
    // A stage that failed to load (a chunk 404) is tried again by the next shot.
    opening.catch(() => stage === opening && (stage = null));
  }
  const { lib, stage: s, go, cur } = await stage;
  const { group, len } = centredBus(lib, inp, DETAIL);
  cur.len = len;
  cur.group = group;
  s.add(group);
  // The stage is shared: every shot sets its own ground, the package's or the host's.
  if (group.parent) themeStage(group.parent, { sky: bg, ground });
  try {
    go(VIEW, true);
    s.cam.position.lerp(s.ctl.target, CLOSER);
    return URL.createObjectURL(await s.shot());
  } finally {
    s.drop(group);
    cur.group = null;
  }
};

/**
 * Holds the picture of one bus while its card is mounted (shot whether or not it
 * is scrolled into view). Shots run one at a time on the shared stage, which
 * closes when the queue drains; the same input on the same background at the same size
 * gives the same picture.
 *
 * @param {BusInput} inp a valid bus input
 * @param {string} bg the colour behind the picture (hex or rgb), sets the light
 * @param {ShotSize} [size] the picture's size in css px; a card's by default
 * @param {string} [ground] the ground's colour; the package's shade of `bg` by default
 * @returns {{ url: Promise<string>, release: () => void }} the PNG's URL (rejects when the
 *   bus can't be shot, e.g. no WebGL), and release: the last holder skips a shot still
 *   queued and frees its URL
 */
export const holdBusShot = (
  inp: BusInput,
  bg: string,
  size: ShotSize = CARD_SHOT,
  ground: string = groundOf(bg)
) => {
  const key = `${bg}|${ground}|${size.w}x${size.h}|${JSON.stringify(inp)}`;
  let shot = shots.get(key);
  if (!shot) {
    const entry: Shot = { url: Promise.resolve(''), holders: 0 };
    pending += 1;
    entry.url = queue.then(async () => {
      try {
        if (shots.get(key) !== entry) throw new Error('released before its turn');
        return await shoot(inp, bg, size, ground);
      } finally {
        pending -= 1;
        if (pending === 0) dropStage();
      }
    });
    // A failed shot is not kept: the next picture of this bus tries again.
    queue = entry.url.catch(() => shots.get(key) === entry && shots.delete(key));
    shots.set(key, entry);
    shot = entry;
  }
  const held = shot;
  held.holders += 1;
  const release = () => {
    held.holders -= 1;
    // A tick later: a remount (StrictMode, a view switch) keeps the picture.
    setTimeout(() => {
      if (held.holders > 0 || shots.get(key) !== held) return;
      shots.delete(key);
      void held.url.then(URL.revokeObjectURL, () => undefined);
    });
  };
  return { url: held.url, release };
};
