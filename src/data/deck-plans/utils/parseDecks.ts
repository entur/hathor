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
 * @param xml NeTEx `PublicationDelivery` carrying one or more deck plans.
 * @param id Plan to draw. Omitted takes the first — the ghost/sample path,
 *   whose document holds exactly one. Given but absent throws, mirroring
 *   {@link patchDeckPlanXml}: drawing one plan while a save patches another is
 *   worse than surfacing the shape problem.
 * @returns The decks to draw and whether they are the ghost.
 */
export function parseDecks(mod: DeckRendererModule, xml: string, id?: string): ParsedDecks {
  const plans = mod.parseNeTEx(xml);
  const plan = id === undefined ? plans[0] : plans.find(p => p.attr_id === id);
  if (id !== undefined && !plan) throw new Error(`DeckPlan ${id} not found in document`);

  const decks = plan?.decks ?? [];
  if (decks.length > 0) return { decks, isGhost: false };

  return { decks: mod.parseNeTEx(GHOST_DECK_PLAN_XML)[0]?.decks ?? [], isGhost: true };
}
