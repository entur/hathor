import { useEffect, useState } from 'react';
import type { Deck } from '@opentrainticketing/netex-deckplan-editor';
import { loadDeckRenderer } from '../utils/loadDeckRenderer.ts';
import { parseDecks } from '../utils/parseDecks.ts';

interface UseDeckRendererResult {
  /** Decks to draw; empty until the bundle has loaded. */
  decks: Deck[];
  /** `true` when `decks` is the SAMPLE stand-in for a plan with none. */
  isGhost: boolean;
  /** Bundle load or parse in flight. */
  loading: boolean;
  /** Load or parse failure; `null` while healthy. */
  error: string | null;
}

/**
 * Resolve a deck plan's NeTEx body into renderable decks.
 *
 * Covers only the renderer's own two failure modes — fetching the bundle and
 * parsing the document. The body fetch itself is `useDeckPlanXml`'s job, so an
 * empty `xml` reads as "nothing to do yet", not an error.
 *
 * @param xml NeTEx body for one deck plan; empty pauses the hook.
 * @param id Plan to draw within that body; omitted takes the first.
 */
export function useDeckRenderer(xml: string, id?: string): UseDeckRendererResult {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [isGhost, setIsGhost] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!xml) {
      setDecks([]);
      setIsGhost(false);
      setLoading(false);
      setError(null);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    loadDeckRenderer()
      .then(mod => {
        if (cancelled) return;
        const parsed = parseDecks(mod, xml, id);
        setDecks(parsed.decks);
        setIsGhost(parsed.isGhost);
      })
      .catch((e: unknown) => {
        if (cancelled) return;
        setDecks([]);
        setIsGhost(false);
        setError(e instanceof Error ? e.message : String(e));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [xml, id]);

  return { decks, isGhost, loading, error };
}
