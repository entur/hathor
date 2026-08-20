import { describe, expect, it, vi } from 'vitest';
import type { Deck, DeckPlan } from '@opentrainticketing/netex-deckplan-editor';
import { parseDecks } from './parseDecks.ts';
import { GHOST_DECK_PLAN_XML } from './ghostDeckPlanXml.ts';
import type { DeckRendererModule } from './loadDeckRenderer.ts';

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
  it('returns the first plan’s decks', () => {
    const decks = [mkDeck('a'), mkDeck('b')];
    const mod = mkMod(() => [mkPlan(...decks), mkPlan(mkDeck('ignored'))]);

    expect(parseDecks(mod, '<xml/>')).toEqual({ decks, isGhost: false });
  });

  it('falls back to the ghost plan when the document has no decks', () => {
    const ghost = mkDeck('ghost');
    const mod = mkMod(xml => (xml === GHOST_DECK_PLAN_XML ? [mkPlan(ghost)] : [mkPlan()]));

    expect(parseDecks(mod, '<xml/>')).toEqual({ decks: [ghost], isGhost: true });
    expect(mod.parseNeTEx).toHaveBeenCalledWith(GHOST_DECK_PLAN_XML);
  });

  it('falls back to the ghost plan when the document has no deck plans at all', () => {
    const ghost = mkDeck('ghost');
    const mod = mkMod(xml => (xml === GHOST_DECK_PLAN_XML ? [mkPlan(ghost)] : []));

    expect(parseDecks(mod, '<xml/>')).toEqual({ decks: [ghost], isGhost: true });
  });

  it('propagates a parser failure rather than silently showing the ghost', () => {
    // The upstream parser walks a hardcoded CompositeFrame path, so a flat
    // ResourceFrame throws. That is a fetch/shape problem worth surfacing —
    // rendering a SAMPLE deck would misreport it as an empty plan.
    const mod = mkMod(() => {
      throw new TypeError("Cannot read properties of undefined (reading 'frames')");
    });

    expect(() => parseDecks(mod, '<flat/>')).toThrow(TypeError);
  });

  it('does not parse the ghost when real decks are present', () => {
    const mod = mkMod(() => [mkPlan(mkDeck('a'))]);
    parseDecks(mod, '<xml/>');

    expect(mod.parseNeTEx).toHaveBeenCalledTimes(1);
    expect(mod.parseNeTEx).not.toHaveBeenCalledWith(GHOST_DECK_PLAN_XML);
  });
});
