import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

/** What a history-fallback host serves for a missing asset: 200, and HTML. */
const SPA_FALLBACK = '<!doctype html>\n<html><body><div id="root"></div></body></html>';

const ok = (body: string) => Promise.resolve(new Response(body, { status: 200 }));

/** Fresh module per test — the loader memoises across calls by design. */
const load = async () => (await import('./loadGhostDeckPlan.ts')).loadGhostDeckPlanXml;

/**
 * The ghost is fetched, not bundled, so every deployment detail that can point
 * the fetch at the wrong place — a missing `public/` asset, a wrong `BASE_URL`,
 * a host that answers both with its SPA shell — lands here rather than in a
 * build error. `r.ok` alone cannot see any of it.
 */
describe('loadGhostDeckPlanXml', () => {
  beforeEach(() => vi.resetModules());
  afterEach(() => vi.unstubAllGlobals());

  it('resolves with the document', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() => ok('<?xml version="1.0"?><PublicationDelivery/>'))
    );

    await expect((await load())()).resolves.toContain('PublicationDelivery');
  });

  it('accepts a document opening straight at the root element', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() => ok('  <PublicationDelivery/>'))
    );

    await expect((await load())()).resolves.toContain('PublicationDelivery');
  });

  // The whole point: 200 + HTML used to pass `r.ok` and fail one layer out as
  // "Could not render the deck plan: <parser internals>".
  it('rejects an SPA fallback served as 200, naming the asset', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() => ok(SPA_FALLBACK))
    );

    await expect((await load())()).rejects.toThrow(/sample-deck-plan\.xml is not NeTEx XML/);
  });

  it('rejects a non-200', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() => Promise.resolve(new Response('', { status: 404 })))
    );

    await expect((await load())()).rejects.toThrow('Sample deck plan 404');
  });

  it('clears the memo after a failure so a later mount refetches', async () => {
    const fetchMock = vi
      .fn()
      .mockImplementationOnce(() => ok(SPA_FALLBACK))
      .mockImplementationOnce(() => ok('<?xml version="1.0"?><PublicationDelivery/>'));
    vi.stubGlobal('fetch', fetchMock);
    const loadGhostDeckPlanXml = await load();

    await expect(loadGhostDeckPlanXml()).rejects.toThrow();

    await expect(loadGhostDeckPlanXml()).resolves.toContain('PublicationDelivery');
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('shares one request between concurrent callers', async () => {
    const fetchMock = vi.fn(() => ok('<?xml version="1.0"?><PublicationDelivery/>'));
    vi.stubGlobal('fetch', fetchMock);
    const loadGhostDeckPlanXml = await load();

    await Promise.all([loadGhostDeckPlanXml(), loadGhostDeckPlanXml()]);

    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
