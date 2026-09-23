import type { Deck } from '@opentrainticketing/netex-deckplan-editor';
import type { DeckRendererModule } from './loadDeckRenderer.ts';
import { loadGhostDeckPlanXml } from './loadGhostDeckPlan.ts';

/**
 * The ghost's decks, fetched and parsed once per renderer bundle.
 *
 * Keyed on the module rather than a plain module-level variable because
 * `loadDeckRenderer` drops its memo after a failed load, and decks are matched
 * against their own bundle's classes with `instanceof` — decks parsed through
 * a previous copy would render without seats. The promise itself is cached, so
 * several decks resolving at once share one fetch and one parse.
 */
const ghostCache = new WeakMap<DeckRendererModule, Promise<Deck[]>>();

const ghostDecks = (mod: DeckRendererModule): Promise<Deck[]> => {
  const hit = ghostCache.get(mod);
  if (hit) return hit;

  const decks = loadGhostDeckPlanXml()
    .then(xml => mod.parseNeTEx(xml)[0]?.decks ?? [])
    .catch(e => {
      ghostCache.delete(mod);
      throw e;
    });
  ghostCache.set(mod, decks);
  return decks;
};

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
 * callers can label it SAMPLE. The ghost is fetched from `public/` on first
 * use and cached, so a plan that has decks never pays for it.
 *
 * Parser failures propagate. The upstream parser walks a hardcoded
 * `CompositeFrame` path, so a differently shaped document throws; showing the
 * ghost there would misreport a fetch/shape problem as an empty plan.
 *
 * The module is a parameter rather than an import so this never pulls the
 * 152 KB renderer into a unit test — see {@link loadDeckRenderer} for why the
 * decks must come from that exact bundle. Async only because the ghost
 * document is fetched on first use rather than bundled.
 *
 * @param mod Renderer bundle, from `loadDeckRenderer()`.
 * @param xml NeTEx `PublicationDelivery` carrying one or more deck plans.
 * @param id Plan to draw. Omitted takes the first — the ghost/sample path,
 *   whose document holds exactly one. Given but absent throws, mirroring
 *   {@link patchDeckPlanXml}: drawing one plan while a save patches another is
 *   worse than surfacing the shape problem.
 * @returns The decks to draw and whether they are the ghost.
 */
export async function parseDecks(
  mod: DeckRendererModule,
  xml: string,
  id?: string
): Promise<ParsedDecks> {
  const plans = mod.parseNeTEx(xml);
  const plan = id === undefined ? plans[0] : plans.find(p => p.attr_id === id);
  if (id !== undefined && !plan) throw new Error(`DeckPlan ${id} not found in document`);

  const decks = plan?.decks ?? [];
  if (decks.length > 0) return { decks, isGhost: false };

  return { decks: await ghostDecks(mod), isGhost: true };
}
