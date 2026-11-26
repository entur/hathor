/**
 * Camera motion for the live 3D view: an ∞ flown around the bus, eased in from wherever
 * the camera rests and eased back out to that pose. Plain math on the stage's camera and
 * orbit target, run from the stage's own frame ticks — no three.js import, so it is
 * testable without WebGL. Ported from entur/iteru-webcomps `src/stories/busMotion.ts`,
 * plus `onLoop` so the host can fly one short ∞ and stop.
 *
 * The path is a 1:2 Lissajous on the viewing sphere: the azimuth swings left and right
 * while the elevation dips twice per swing, so the eye traces an ∞ with the bus always in
 * frame. A weight `w` (0 = at rest, 1 = on the path) scales the offset from the rest pose,
 * so going in or out is continuous — no jump.
 */
import type { Stage, Vec3 } from '@entur/iteru-3dbus';
import { REDUCED_MOTION_QUERY } from '../../../utils/motion.ts';

/** `orbit` = the reader drives the camera; `animate` = it flies the ∞. */
export type BusMotion = 'orbit' | 'animate';

// One ∞ per PERIOD_MS at full weight; BLEND_MS to ease onto or off it. SWING / DIP are the
// path's half-widths (azimuth / elevation, radians). PHI_* keep the eye above the ground
// and off the pole. MAX_STEP_MS caps a frame after a hidden tab, so the path resumes
// instead of leaping.
export const PERIOD_MS = 8_000,
  BLEND_MS = 1_500;
const SWING = Math.PI * 0.22,
  DIP = Math.PI * 0.06;
const PHI_MIN = 0.12,
  PHI_MAX = Math.PI / 2 - 0.08;
const MAX_STEP_MS = 100;
const TAU = 2 * Math.PI;

/** Eye position relative to the orbit target, in three.js `Spherical` terms. */
type Sph = { r: number; theta: number; phi: number };

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const ease = (t: number) => (t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2);

const toSph = (p: Vec3, t: Vec3): Sph => {
  const x = p.x - t.x,
    y = p.y - t.y,
    z = p.z - t.z,
    r = Math.hypot(x, y, z);
  return { r, theta: Math.atan2(x, z), phi: Math.acos(clamp(y / (r || 1), -1, 1)) };
};

/**
 * The ∞'s offset from the rest pose at a phase.
 *
 * @param {number} a phase in radians; one ∞ per 2π
 * @returns {{ dTheta: number, dPhi: number }} azimuth and elevation offsets, both 0 at phase 0
 */
export const eight = (a: number): { dTheta: number; dPhi: number } => ({
  dTheta: SWING * Math.sin(a),
  dPhi: DIP * Math.sin(2 * a),
});

export interface MotionOpts {
  /** The reader grabbed the view mid-flight: the camera stays put, now theirs. */
  onTakeOver?: () => void;
  /** The flight finished a whole ∞. */
  onLoop?: () => void;
  now?: () => number;
  /** `prefers-reduced-motion`: easing collapses to a cut. */
  reduced?: () => boolean;
}

/**
 * Attaches the ∞ to a live stage. Starts at rest; drive it with `set`.
 *
 * @param {Pick<Stage, 'cam' | 'ctl' | 'ticks'>} stage a live `mkStage` stage (its `ticks` run each frame)
 * @param {MotionOpts} opts take-over and loop callbacks, plus an injectable clock for tests
 * @returns {{ set: (motion: BusMotion) => void, dispose: () => void }} ease in or out, and detach
 */
export function mkMotion(stage: Pick<Stage, 'cam' | 'ctl' | 'ticks'>, opts: MotionOpts) {
  const now = opts.now ?? (() => performance.now());
  // One MediaQueryList for the controller's life, read per frame.
  let mq: MediaQueryList | undefined;
  const reduced = opts.reduced ?? (() => (mq ??= matchMedia(REDUCED_MOTION_QUERY)).matches);
  let w = 0,
    phase = 0,
    last = now();
  let base: Sph | null = null; // the rest pose, while the ∞ is (partly) on
  let tween: { from: number; to: number; t0: number } | null = null;

  const tick = () => {
    const t = now(),
      dt = Math.min(t - last, MAX_STEP_MS);
    last = t;
    if (tween) {
      const k = reduced() ? 1 : Math.min(1, (t - tween.t0) / BLEND_MS);
      w = tween.from + (tween.to - tween.from) * ease(k);
      if (k >= 1) tween = null;
    }
    if (!base) return;
    // The loop's own speed rides the weight too: it gathers pace from a standstill going
    // in, and slows to one coming out.
    const before = Math.floor(phase / TAU);
    phase += w * (dt / PERIOD_MS) * TAU;
    const loopDone = Math.floor(phase / TAU) > before;
    const { dTheta, dPhi } = eight(phase);
    // Clamp the path point, then blend: at w = 0 the eye is exactly at rest, even when
    // the reader left it outside the clamp band.
    const onPath = clamp(base.phi + dPhi, PHI_MIN, PHI_MAX);
    const theta = base.theta + w * dTheta,
      phi = base.phi + w * (onPath - base.phi);
    const { target } = stage.ctl,
      s = Math.sin(phi) * base.r;
    stage.cam.position.set(
      target.x + s * Math.sin(theta),
      target.y + base.r * Math.cos(phi),
      target.z + s * Math.cos(theta)
    );
    // Eased all the way out — this frame put the eye back at rest: the orbit controls' again.
    if (w <= 0 && !tween) base = null;
    if (loopDone) opts.onLoop?.();
  };

  // A grab on the canvas ends the flight on the spot: no ease, the camera stays.
  const grab = () => {
    if (!base) return;
    base = null;
    tween = null;
    w = 0;
    opts.onTakeOver?.();
  };

  stage.ticks.push(tick);
  stage.ctl.addEventListener('start', grab);

  return {
    /** Ease onto the ∞ (`animate`) or back to the rest pose (`orbit`). */
    set(motion: BusMotion) {
      const to = motion === 'animate' ? 1 : 0;
      if (to === 1 && !base) {
        base = toSph(stage.cam.position, stage.ctl.target);
        phase = 0;
        w = 0;
      }
      if (base) tween = { from: w, to, t0: now() };
    },
    dispose() {
      const i = stage.ticks.indexOf(tick);
      if (i >= 0) stage.ticks.splice(i, 1);
      stage.ctl.removeEventListener('start', grab);
    },
  };
}
