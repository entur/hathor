import { describe, it, expect, vi } from 'vitest';
import { BLEND_MS, PERIOD_MS, eight, mkMotion } from './busMotion.ts';

const vec = (x: number, y: number, z: number) => {
  const v = {
    x,
    y,
    z,
    set: (a: number, b: number, c: number) => Object.assign(v, { x: a, y: b, z: c }),
  };
  return v;
};

/** A stage with the frame loop driven by hand, and the clock with it. */
const rig = (reduced = false) => {
  let t = 0;
  const reduce = () => (reduced = true);
  const starts: (() => void)[] = [];
  const stage = {
    cam: { position: vec(-13, 3, -15) },
    ctl: {
      target: vec(0, 1.5, 0),
      addEventListener: (_: 'start', fn: () => void) => starts.push(fn),
      removeEventListener: (_: 'start', fn: () => void) => starts.splice(starts.indexOf(fn), 1),
    },
    ticks: [] as (() => void)[],
  };
  const onTakeOver = vi.fn();
  const onLoop = vi.fn();
  const m = mkMotion(stage, { onTakeOver, onLoop, now: () => t, reduced: () => reduced });
  const pos = () => ({ ...stage.cam.position });
  /** Advance `ms` in 16 ms frames; returns the largest single-frame step. */
  const run = (ms: number) => {
    let worst = 0;
    for (let s = 0; s < ms; s += 16) {
      const a = pos();
      t += 16;
      stage.ticks.forEach(f => f());
      const b = pos();
      worst = Math.max(worst, Math.hypot(b.x - a.x, b.y - a.y, b.z - a.z));
    }
    return worst;
  };
  const grab = () => starts.forEach(f => f());
  return { stage, m, pos, run, grab, reduce, onTakeOver, onLoop, starts };
};

const dist = (a: { x: number; y: number; z: number }, b: typeof a) =>
  Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z);

describe('eight — the ∞ path', () => {
  it('starts at the rest pose and crosses it twice per loop', () => {
    expect(eight(0)).toEqual({ dTheta: 0, dPhi: 0 });
    expect(eight(Math.PI).dTheta).toBeCloseTo(0);
    expect(eight(Math.PI).dPhi).toBeCloseTo(0);
  });

  it("dips twice per swing: elevation runs at double the azimuth's frequency", () => {
    expect(Math.sign(eight(Math.PI / 4).dPhi)).toBe(1);
    expect(Math.sign(eight((3 * Math.PI) / 4).dPhi)).toBe(-1);
    expect(eight(Math.PI / 2).dTheta).toBeGreaterThan(0);
    expect(eight((3 * Math.PI) / 2).dTheta).toBeLessThan(0);
  });
});

describe('mkMotion', () => {
  it('stays put until set to animate', () => {
    const { pos, run } = rig();
    const rest = pos();
    run(1000);
    expect(pos()).toEqual(rest);
  });

  it('eases in with no jump, keeping its distance from the target', () => {
    const { m, run, pos, stage } = rig();
    const r0 = dist(pos(), stage.ctl.target);
    m.set('animate');
    // The first frames barely move: an ease, not a cut.
    expect(run(100)).toBeLessThan(0.001);
    expect(run(PERIOD_MS)).toBeLessThan(0.5);
    expect(dist(pos(), stage.ctl.target)).toBeCloseTo(r0, 5);
  });

  it('eases back out to exactly the pose it left', () => {
    const { m, run, pos } = rig();
    const rest = pos();
    m.set('animate');
    run(BLEND_MS);
    // Peak speed over one whole loop, at full weight.
    const cruise = run(PERIOD_MS) * 1.05;
    expect(dist(pos(), rest)).toBeGreaterThan(1);
    m.set('orbit');
    // A slow ease, not a snap back: it cuts across the ∞ to rest, so it may
    // outpace the loop a little, but stays within the same order of speed.
    expect(run(BLEND_MS + 1_000)).toBeLessThan(2.5 * cruise);
    expect(dist(pos(), rest)).toBeLessThan(1e-9);
    // Fully out: nothing moves the camera any more.
    const after = pos();
    run(1000);
    expect(pos()).toEqual(after);
  });

  it('hands over on a grab instantly: the camera stays where it is', () => {
    const { m, run, pos, grab, onTakeOver } = rig();
    m.set('animate');
    run(BLEND_MS + 1_000);
    grab();
    expect(onTakeOver).toHaveBeenCalledOnce();
    const held = pos();
    run(1000);
    expect(pos()).toEqual(held);
    // The host answers with set('orbit'): already at rest, so no ease-out.
    m.set('orbit');
    run(1000);
    expect(pos()).toEqual(held);
  });

  it('ignores grabs while at rest — orbiting is not a take-over', () => {
    const { grab, onTakeOver } = rig();
    grab();
    expect(onTakeOver).not.toHaveBeenCalled();
  });

  it('stays at rest under reduced motion', () => {
    const { m, run, pos } = rig(true);
    const rest = pos();
    m.set('animate');
    run(3_000);
    expect(dist(pos(), rest)).toBeLessThan(1e-9);
  });

  it('stops where it is when reduced motion comes on mid-flight', () => {
    const { m, run, pos, reduce, onLoop } = rig();
    m.set('animate');
    run(3_000);
    reduce();
    run(16);
    const stopped = pos();
    run(PERIOD_MS);
    expect(dist(pos(), stopped)).toBe(0);
    expect(onLoop).not.toHaveBeenCalled();
  });

  it('reports each whole loop, the first one slowed only by the ease in', () => {
    const { m, run, onLoop } = rig();
    m.set('animate');
    run(PERIOD_MS - 100);
    expect(onLoop).not.toHaveBeenCalled();
    run(BLEND_MS + 200);
    expect(onLoop).toHaveBeenCalledOnce();
  });

  it('detaches from the stage', () => {
    const { m, stage, starts } = rig();
    m.dispose();
    expect(stage.ticks).toHaveLength(0);
    expect(starts).toHaveLength(0);
  });
});
