import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Deck, DeckPlan } from '@opentrainticketing/netex-deckplan-editor';
import { parseDecks } from './parseDecks.ts';
import type { DeckRendererModule } from './loadDeckRenderer.ts';

/** Stand-in for the fetched ghost document; recognised by its NeTEx id. */
const GHOST_XML = '<ghost id="GHOST:DeckPlan:1"/>';
const isGhostXml = (xml: string) => xml.includes('GHOST:DeckPlan:1');

/**
 * `parseDecks` fetches the ghost from `public/` on first use, so every test
 * that reaches the empty-decks branch needs the response stubbed. Modules are
 * fresh per test (`mkMod`), so the per-module cache never leaks between them.
 */
beforeEach(() => {
  vi.stubGlobal(
    'fetch',
    vi.fn(() => Promise.resolve({ ok: true, text: () => Promise.resolve(GHOST_XML) }))
  );
});
afterEach(() => vi.unstubAllGlobals());

/** Minimal stand-in for the renderer's `Deck` — `parseDecks` only moves them. */
const mkDeck = (id: string) => ({ attr_id: id }) as unknown as Deck;
const mkPlan = (...decks: Deck[]) => ({ decks }) as unknown as DeckPlan;

/**
 * Stub of the renderer bundle. `parseDecks` takes the module as a parameter
 * precisely so these tests never load 152 KB of Vue; the real parser is
 * exercised against real NeTEx in `DeckRendering.stories.tsx`.
 */
const mkMod = (fn: (xml: string) => DeckPlan[]): DeckRendererModule => ({
  parseNeTEx: vi.fn(fn),
});

describe('parseDecks', () => {
  it('returns the first plan’s decks', async () => {
    const decks = [mkDeck('a'), mkDeck('b')];
    const mod = mkMod(() => [mkPlan(...decks), mkPlan(mkDeck('ignored'))]);

    await expect(parseDecks(mod, '<xml/>')).resolves.toEqual({ decks, isGhost: false });
  });

  it('falls back to the ghost plan when the document has no decks', async () => {
    const ghost = mkDeck('ghost');
    const mod = mkMod(xml => (isGhostXml(xml) ? [mkPlan(ghost)] : [mkPlan()]));

    await expect(parseDecks(mod, '<xml/>')).resolves.toEqual({ decks: [ghost], isGhost: true });
    expect(mod.parseNeTEx).toHaveBeenCalledWith(expect.stringContaining('GHOST:DeckPlan:1'));
  });

  // The empty-`<decks/>` case is every row on real Sobek data today, and the
  // ghost is a constant — parsing it once per bundle, not once per call.
  it('fetches and parses the ghost once per renderer bundle', async () => {
    const ghost = mkDeck('ghost');
    const mod = mkMod(xml => (isGhostXml(xml) ? [mkPlan(ghost)] : [mkPlan()]));

    await parseDecks(mod, '<xml/>');
    await parseDecks(mod, '<other/>');

    const ghostParses = vi.mocked(mod.parseNeTEx).mock.calls.filter(([xml]) => isGhostXml(xml));
    expect(ghostParses).toHaveLength(1);
  });

  it('falls back to the ghost plan when the document has no deck plans at all', async () => {
    const ghost = mkDeck('ghost');
    const mod = mkMod(xml => (isGhostXml(xml) ? [mkPlan(ghost)] : []));

    await expect(parseDecks(mod, '<xml/>')).resolves.toEqual({ decks: [ghost], isGhost: true });
  });

  it('propagates a parser failure rather than silently showing the ghost', async () => {
    // The upstream parser walks a hardcoded CompositeFrame path, so a flat
    // ResourceFrame throws. That is a fetch/shape problem worth surfacing —
    // rendering a SAMPLE deck would misreport it as an empty plan.
    const mod = mkMod(() => {
      throw new TypeError("Cannot read properties of undefined (reading 'frames')");
    });

    await expect(parseDecks(mod, '<flat/>')).rejects.toThrow(TypeError);
  });

  it('does not parse the ghost when real decks are present', () => {
    const mod = mkMod(() => [mkPlan(mkDeck('a'))]);
    parseDecks(mod, '<xml/>');

    expect(mod.parseNeTEx).toHaveBeenCalledTimes(1);
    expect(mod.parseNeTEx).not.toHaveBeenCalledWith(expect.stringContaining('GHOST:DeckPlan:1'));
  });
});

/**
 * A document can carry more than one DeckPlan. `patchDeckPlanXml` already
 * selects by id before writing, so the render path must select by the same id
 * — otherwise the Edit tab draws one plan while a save patches another.
 */
describe('parseDecks — plan selection by id', () => {
  const mkPlanWithId = (id: string, ...decks: Deck[]) =>
    ({ attr_id: id, decks }) as unknown as DeckPlan;

  it('renders the plan matching the requested id, not merely the first', async () => {
    const wanted = mkDeck('wanted');
    const mod = mkMod(() => [
      mkPlanWithId('NMR:DeckPlan:1', mkDeck('other')),
      mkPlanWithId('NMR:DeckPlan:2', wanted),
    ]);

    await expect(parseDecks(mod, '<xml/>', 'NMR:DeckPlan:2')).resolves.toEqual({
      decks: [wanted],
      isGhost: false,
    });
  });

  it('throws when the requested id is absent, mirroring patchDeckPlanXml', async () => {
    // Showing the ghost here would misreport a shape/fetch problem as an
    // empty plan — the same reason a parser failure propagates.
    const mod = mkMod(() => [mkPlanWithId('NMR:DeckPlan:1', mkDeck('other'))]);

    await expect(parseDecks(mod, '<xml/>', 'NMR:DeckPlan:2')).rejects.toThrow(/NMR:DeckPlan:2/);
  });

  it('still falls back to the ghost when the matched plan carries no decks', async () => {
    const ghost = mkDeck('ghost');
    const mod = mkMod(xml =>
      isGhostXml(xml) ? [mkPlan(ghost)] : [mkPlanWithId('NMR:DeckPlan:2')]
    );

    await expect(parseDecks(mod, '<xml/>', 'NMR:DeckPlan:2')).resolves.toEqual({
      decks: [ghost],
      isGhost: true,
    });
  });

  it('takes the first plan when no id is given (the ghost/sample path)', async () => {
    const decks = [mkDeck('a')];
    const mod = mkMod(() => [mkPlanWithId('NMR:DeckPlan:1', ...decks)]);

    await expect(parseDecks(mod, '<xml/>')).resolves.toEqual({ decks, isGhost: false });
  });
});
