import type { BusGroup, ShotStage } from '@entur/iteru-3dbus';
import type { BusInput } from './standardBus.ts';

// One picture, in css px, at the card's 16:10 and about a big card's width. The rest as the
// package's own gallery (`src/gallery.js`): its card view, eye pulled in, textures at a third.
const SHOT_W = 400,
  SHOT_H = 250,
  VIEW = 'quarter',
  CLOSER = 0.3,
  DETAIL = 0.35;

interface Stage {
  stage: ShotStage;
  go: (view: string, instant?: boolean) => void;
  /** What the camera views frame: the bus on stage now. */
  cur: { group: BusGroup | null; len: number };
}
interface Shot {
  url: Promise<string>;
  holders: number;
}

/** Every picture on the page shares one stage — a browser keeps only so many WebGL contexts. */
let stage: Promise<Stage> | null = null;
let queue: Promise<unknown> = Promise.resolve();
const shots = new Map<string, Shot>();

const openStage = async (bg: string): Promise<Stage> => {
  const lib = await import('@entur/iteru-3dbus');
  const s = lib.mkStageShot({ w: SHOT_W, h: SHOT_H, bg });
  const cur: Stage['cur'] = { group: null, len: 0 };
  return { stage: s, go: lib.mkViews(s, () => cur), cur };
};

/** Gives the WebGL context back once no picture is held or queued. */
const closeStage = () => {
  if (shots.size > 0 || !stage) return;
  const done = stage;
  stage = null;
  void done.then(s => s.stage.dispose()).catch(() => undefined);
};

const shoot = async (inp: BusInput, bg: string): Promise<string> => {
  // shortcut: the stage keeps the first picture's bg (light vs dark ground) and the cache
  // ignores bg, so a theme switch keeps the old light until the page lets go; key on bg if seen.
  stage ??= openStage(bg);
  const [lib, { stage: s, go, cur }] = await Promise.all([import('@entur/iteru-3dbus'), stage]);
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
 * Holds the picture of one bus while it is on screen. Shots run one at a time
 * on the shared stage; the same input gives the same picture.
 *
 * @param {BusInput} inp a valid bus input
 * @param {string} bg the colour behind the picture (hex or rgb), sets the light
 * @returns {{ url: Promise<string>, release: () => void }} the PNG's URL (rejects when the
 *   bus can't be shot, e.g. no WebGL), and release: the last holder skips a shot still
 *   queued and frees its URL
 */
export const holdBusShot = (inp: BusInput, bg: string) => {
  const key = JSON.stringify(inp);
  let shot = shots.get(key);
  if (!shot) {
    const entry: Shot = { url: Promise.resolve(''), holders: 0 };
    entry.url = queue.then(() => {
      if (shots.get(key) !== entry) throw new Error('released before its turn');
      return shoot(inp, bg);
    });
    queue = entry.url.catch(() => undefined);
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
      void queue.then(closeStage);
    });
  };
  return { url: held.url, release };
};
