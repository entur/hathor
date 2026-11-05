import { useState } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { netexText } from '../../netex/multilingualString.ts';
import { useDeckRenderer } from '../hooks/useDeckRenderer.ts';
import BodyState from '../../../components/feedback/BodyState.tsx';
import DeckRendering from './DeckRendering.tsx';

interface DeckStripProps {
  /** NeTEx XML body; empty draws nothing. */
  xml: string;
  /** Plan to draw within the body; omitted takes the first. */
  id?: string;
  /** Body fetch in flight. */
  loading: boolean;
  /** Body fetch error, shown with a Retry. */
  fetchError: string | null;
  /** Refetch trigger from the parent hook. */
  onRetry: () => void;
}

/**
 * Horizontal strip of read-only deck renderings for the fetched body.
 *
 * Decks draw `vertical`: at ~26.4m × 2.8m, native orientation overflows the
 * sidebar for even one deck, where rotated columns sit side by side and read
 * as a vehicle seen from above. A plan with no decks shows the SAMPLE ghost.
 *
 * `id` picks the plan out of a multi-plan envelope — the same id the save
 * patches by. Undefined (the form has not hydrated yet) falls back to the
 * first plan rather than throwing on a blank id.
 *
 * Owns the whole slot: fetching the body and parsing it are two phases of one
 * wait, so they share a single `BodyState` rather than each drawing their own
 * spinner and alert into the same space.
 */
export default function DeckStrip({ xml, id, loading, fetchError, onRetry }: DeckStripProps) {
  const { t } = useTranslation();
  // Retry has two jobs here: refetch the body (the parent's) and re-run the
  // parse (ours). A body that comes back byte-identical leaves `xml`
  // referentially equal, so without the counter the renderer's own failures —
  // bundle load, ghost fetch, parse — would have an inert Retry button.
  const [attempt, setAttempt] = useState(0);
  const retry = () => {
    setAttempt(n => n + 1);
    onRetry();
  };
  const { decks, isGhost, loading: parsing, error: parseError } = useDeckRenderer(xml, id, attempt);

  const body =
    decks.length === 0 ? null : (
      <Stack spacing={1} data-testid="deck-plan-decks">
        {isGhost && (
          <Box data-testid="deck-plan-decks-sample">
            <Typography variant="subtitle2">{t('deckPlans.deck.sample')}</Typography>
            <Typography variant="caption" color="text.secondary">
              {t('deckPlans.deck.sampleHint')}
            </Typography>
          </Box>
        )}
        <Stack direction="row" spacing={2} sx={{ overflowX: 'auto', pb: 1 }}>
          {decks.map((deck, i) => (
            <Stack
              // Position, not id: every deck the editor exports carries
              // `Deck/id/1`, so a plan merged from several exports repeats ids.
              key={i}
              spacing={0.5}
              alignItems="center"
              sx={{ flex: '0 0 auto' }}
            >
              <DeckRendering deck={deck} vertical data-testid={`deck-plan-deck-${i}`} />
              <Typography variant="caption" color="text.secondary" noWrap>
                {netexText(deck.Name) ?? t('deckPlans.deck.label', { n: i + 1 })}
              </Typography>
            </Stack>
          ))}
        </Stack>
      </Stack>
    );

  return (
    <BodyState
      loading={loading || parsing}
      // A parse failure is reported where the fetch failure is; Retry refetches
      // the body, which re-parses it.
      error={fetchError ?? (parseError && `${t('deckPlans.render.error')}: ${parseError}`)}
      onRetry={retry}
      testIdPrefix="deck-plan-decks"
    >
      {body}
    </BodyState>
  );
}
