import { beforeEach, describe, expect, it, vi } from 'vitest';
import { toBusInput } from './standardBus.ts';

// The package's three.js side, faked: a stage that "shoots" a PNG per bus.
const lib = vi.hoisted(() => ({
  mkStageShot: vi.fn(),
  mkBus: vi.fn(() => ({ position: { x: 0 } })),
  mkViews: vi.fn(() => () => undefined),
  faces: vi.fn(() => ({})),
  total: vi.fn(() => 12_000),
  MM: 0.001,
}));
vi.mock('@entur/iteru-3dbus', () => lib);

const BG = 'rgb(255, 255, 255)',
  DARK = 'rgb(20, 20, 20)';
const SHOT_MS = 5; // a real shot waits on toBlob: a macrotask, not a microtask
const BUS = toBusInput({}, 'vehicleType').inp;
const OTHER = toBusInput({ length: 18 }, 'vehicleType').inp;

const fakeStage = () => ({
  cam: { position: { lerp: vi.fn() } },
  ctl: { target: {} },
  add: vi.fn(),
  drop: vi.fn(),
  shot: vi.fn(() => new Promise<Blob>(r => setTimeout(() => r(new Blob(['png'])), SHOT_MS))),
  dispose: vi.fn(),
});
const tick = () => new Promise(r => setTimeout(r, 0));

/** A fresh module per test: the stage, queue and cache are module state. */
const load = async () => (await import('./busShots.ts')).holdBusShot;

beforeEach(() => {
  vi.resetModules();
  vi.clearAllMocks();
  lib.mkStageShot.mockImplementation(fakeStage);
});

describe('holdBusShot', () => {
  it('shoots the same bus once for every card that holds it', async () => {
    const hold = await load();
    const a = hold(BUS, BG),
      b = hold(BUS, BG);
    expect(await a.url).toBe(await b.url);
    expect(lib.mkBus).toHaveBeenCalledTimes(1);
  });

  it('skips a shot whose last holder let go before its turn', async () => {
    const hold = await load();
    const first = hold(BUS, BG);
    const gone = hold(OTHER, BG);
    gone.release();
    await tick();
    await first.url;
    await expect(gone.url).rejects.toThrow('released before its turn');
    expect(lib.mkBus).toHaveBeenCalledTimes(1);
  });

  it('keeps the picture over a remount in the same tick', async () => {
    const hold = await load();
    const a = hold(BUS, BG);
    const url = await a.url;
    a.release();
    const b = hold(BUS, BG);
    await tick();
    expect(await b.url).toBe(url);
    expect(lib.mkBus).toHaveBeenCalledTimes(1);
  });

  it('closes the stage when the queue drains and opens one for the next shot', async () => {
    const hold = await load();
    await hold(BUS, BG).url;
    await tick();
    const [first] = lib.mkStageShot.mock.results.map(r => r.value);
    expect(first.dispose).toHaveBeenCalledTimes(1);
    await hold(OTHER, BG).url;
    expect(lib.mkStageShot).toHaveBeenCalledTimes(2);
  });

  it('shoots again on another background, on a stage lit for it', async () => {
    const hold = await load();
    const light = hold(BUS, BG),
      dark = hold(BUS, DARK);
    expect(await light.url).not.toBe(await dark.url);
    expect(lib.mkStageShot.mock.calls.map(([o]) => o.bg)).toEqual([BG, DARK]);
  });

  it('does not keep a failed shot: the next hold tries again', async () => {
    const hold = await load();
    lib.mkBus.mockImplementationOnce(() => {
      throw new Error('bad bus');
    });
    const failed = hold(BUS, BG);
    await expect(failed.url).rejects.toThrow('bad bus');
    await tick();
    await hold(BUS, BG).url;
    expect(lib.mkBus).toHaveBeenCalledTimes(2);
  });

  it('asks for a WebGL context once per page load, not once per card', async () => {
    const hold = await load();
    lib.mkStageShot.mockImplementation(() => {
      throw new Error('Error creating WebGL context');
    });
    await expect(hold(BUS, BG).url).rejects.toThrow('WebGL context');
    await expect(hold(OTHER, BG).url).rejects.toThrow('no WebGL');
    expect(lib.mkStageShot).toHaveBeenCalledTimes(1);
  });
});
