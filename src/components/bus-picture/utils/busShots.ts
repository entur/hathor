import type { BusGroup, ShotStage } from '@entur/iteru-3dbus';
import type { BusInput } from './standardBus.ts';

// One picture, in css px, at the card's 16:10 and about a card's width. The rest as the
// package's own gallery (`src/gallery.js`): its card view, eye pulled in, textures at a third.
const SHOT_W = 400,
  SHOT_H = 250,
  VIEW = 'quarter',
  CLOSER = 0.3,
  DETAIL = 0.35;

type Lib = typeof import('@entur/iteru-3dbus');
interface Stage {
  lib: Lib;
  stage: ShotStage;
  bg: string;
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

const openStage = async (bg: string): Promise<Stage> => {
  const lib = await import('@entur/iteru-3dbus');
  try {
    const s = lib.mkStageShot({ w: SHOT_W, h: SHOT_H, bg });
    const cur: Stage['cur'] = { group: null, len: 0 };
    return { lib, stage: s, bg, go: lib.mkViews(s, () => cur), cur };
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

const shoot = async (inp: BusInput, bg: string): Promise<string> => {
  if (noWebGL) throw new Error('no WebGL');
  // A theme switch: the stage's light follows the colour behind the picture.
  if (stage && (await stage.catch(() => null))?.bg !== bg) dropStage();
  if (!stage) {
    const opening = openStage(bg);
    stage = opening;
    // A stage that failed to load (a chunk 404) is tried again by the next shot.
    opening.catch(() => stage === opening && (stage = null));
  }
  const { lib, stage: s, go, cur } = await stage;
  const group = lib.mkBus(inp, lib.faces(inp), { detail: DETAIL });
  cur.len = lib.total(inp) * lib.MM;
  group.position.x = -cur.len / 2;
  cur.group = group;
  s.add(group);
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
 * closes when the queue drains; the same input on the same background gives the
 * same picture.
 *
 * @param {BusInput} inp a valid bus input
 * @param {string} bg the colour behind the picture (hex or rgb), sets the light
 * @returns {{ url: Promise<string>, release: () => void }} the PNG's URL (rejects when the
 *   bus can't be shot, e.g. no WebGL), and release: the last holder skips a shot still
 *   queued and frees its URL
 */
export const holdBusShot = (inp: BusInput, bg: string) => {
  const key = `${bg}|${JSON.stringify(inp)}`;
  let shot = shots.get(key);
  if (!shot) {
    const entry: Shot = { url: Promise.resolve(''), holders: 0 };
    pending += 1;
    entry.url = queue.then(async () => {
      try {
        if (shots.get(key) !== entry) throw new Error('released before its turn');
        return await shoot(inp, bg);
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
