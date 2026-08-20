import type { Deck } from '@opentrainticketing/netex-deckplan-editor';
import type { DeckRendererModule } from './loadDeckRenderer.ts';
import { GHOST_DECK_PLAN_XML } from './ghostDeckPlanXml.ts';

/** Decks to draw, and whether they stand in for a plan that has none. */
export interface ParsedDecks {
  decks: Deck[];
  /** `true` when the document carried no decks and the SAMPLE plan was used. */
  isGhost: boolean;
}

/**
 * Resolve the decks to render from a deck plan's NeTEx document.
 *
 * A document with no decks — the common case on real Sobek data, where
 * `<decks/>` comes back empty — yields the ghost plan instead, flagged so
 * callers can label it SAMPLE.
 *
 * Parser failures propagate. The upstream parser walks a hardcoded
 * `CompositeFrame` path, so a differently shaped document throws; showing the
 * ghost there would misreport a fetch/shape problem as an empty plan.
 *
 * The module is a parameter rather than an import so this stays synchronous
 * and unit-testable — see {@link loadDeckRenderer} for why the decks must come
 * from that exact bundle.
 *
 * @param mod Renderer bundle, from `loadDeckRenderer()`.
 * @param xml NeTEx `PublicationDelivery` for one deck plan.
 * @returns The decks to draw and whether they are the ghost.
 */
export function parseDecks(mod: DeckRendererModule, xml: string): ParsedDecks {
  const decks = mod.parseNeTEx(xml)[0]?.decks ?? [];
  if (decks.length > 0) return { decks, isGhost: false };

  return { decks: mod.parseNeTEx(GHOST_DECK_PLAN_XML)[0]?.decks ?? [], isGhost: true };
}
