import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const MODULE = { parseNeTEx: () => [] };

vi.mock('@opentrainticketing/netex-deckplan-editor/webcomponent', () => ({ default: MODULE }));

/** Fresh module per test — the loader memoises across calls by design. */
const load = async () => await import('./loadDeckRenderer.ts');

/** A `whenDefined` that never settles: the bundle loaded, the tag never came. */
const never = () => new Promise<never>(() => {});

/**
 * `customElements.whenDefined` has no rejection path, so a bundle that loads
 * without registering `<deck-rendering>` used to leave the promise pending for
 * the session: `useDeckRenderer` stuck at `loading: true`, spinner forever, and
 * no alert to press Retry from. A hang is not a rejection, so the `attempt`
 * counter that fixed the inert Retry does not reach it either.
 */
describe('loadDeckRenderer', () => {
  beforeEach(() => vi.resetModules());
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  it('resolves with the module once the tag registers', async () => {
    vi.stubGlobal('customElements', { whenDefined: () => Promise.resolve() });
    const { loadDeckRenderer } = await load();

    await expect(loadDeckRenderer()).resolves.toBe(MODULE);
  });

  it('rejects when the tag never registers, rather than hanging', async () => {
    vi.useFakeTimers();
    vi.stubGlobal('customElements', { whenDefined: never });
    const { loadDeckRenderer, TAG_DEFINE_MS } = await load();

    const settled = expect(loadDeckRenderer()).rejects.toThrow(/deck-rendering.*not registered/);
    await vi.advanceTimersByTimeAsync(TAG_DEFINE_MS);

    await settled;
  });

  it('clears the memo after that failure so a later mount retries', async () => {
    vi.useFakeTimers();
    const whenDefined = vi.fn().mockImplementationOnce(never).mockResolvedValueOnce(undefined);
    vi.stubGlobal('customElements', { whenDefined });
    const { loadDeckRenderer, TAG_DEFINE_MS } = await load();

    const settled = expect(loadDeckRenderer()).rejects.toThrow();
    await vi.advanceTimersByTimeAsync(TAG_DEFINE_MS);
    await settled;

    await expect(loadDeckRenderer()).resolves.toBe(MODULE);
  });

  it('shares one load between concurrent callers', async () => {
    const whenDefined = vi.fn(() => Promise.resolve());
    vi.stubGlobal('customElements', { whenDefined });
    const { loadDeckRenderer } = await load();

    await Promise.all([loadDeckRenderer(), loadDeckRenderer()]);

    expect(whenDefined).toHaveBeenCalledTimes(1);
  });

  // The timer must not outlive the race — a 10s handle left armed on every
  // successful load keeps the process (and vitest) awake for no reason.
  it('clears the timer when the tag registers first', async () => {
    vi.useFakeTimers();
    vi.stubGlobal('customElements', { whenDefined: () => Promise.resolve() });
    const { loadDeckRenderer } = await load();

    await loadDeckRenderer();

    expect(vi.getTimerCount()).toBe(0);
  });
});
