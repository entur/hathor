import { useEffect, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, waitFor } from 'storybook/test';
import { Box, Stack, Typography } from '@mui/material';
import type { Deck } from '@opentrainticketing/netex-deckplan-editor';
import DeckRendering, { DECK_SCALE } from './DeckRendering.tsx';
import { loadDeckRenderer } from '../utils/loadDeckRenderer.ts';
import { GHOST_DECK_PLAN_XML } from '../utils/ghostDeckPlanXml.ts';

/** Seat pitch and half-width used to lay the sample spots out, in metres. */
const PITCH = 0.9,
  AISLE = 0.75;

/** Sample deck with two rows of four seats either side of an aisle. */
const SAMPLE_XML = sampleDeckPlanXml();

/**
 * Resolve a `Deck` through the renderer bundle's own parser. Stories cannot
 * import `parseNeTEx` statically without pulling the chunk into the main
 * bundle, so they go through the same memoised loader the app uses.
 */
function useDeck(xml: string, index = 0): Deck | null {
  const [deck, setDeck] = useState<Deck | null>(null);
  useEffect(() => {
    let live = true;
    loadDeckRenderer().then(m => {
      if (live) setDeck(m.parseNeTEx(xml)[0]?.decks[index] ?? null);
    });
    return () => {
      live = false;
    };
  }, [xml, index]);
  return deck;
}

/** Story shell — labels a rendering and holds the frame until the deck parses. */
function Framed({
  label,
  xml,
  vertical,
  scale,
}: {
  label: string;
  xml: string;
  vertical?: boolean;
  scale?: number;
}) {
  const deck = useDeck(xml);
  return (
    <Stack spacing={0.5} alignItems="flex-start">
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      {deck ? (
        <DeckRendering
          deck={deck}
          vertical={vertical}
          scale={scale}
          data-testid={`deck-${label}`}
        />
      ) : (
        <Box sx={{ width: 80, height: 40 }} />
      )}
    </Stack>
  );
}

const meta: Meta<typeof DeckRendering> = {
  title: 'data/deck-plans/DeckRendering',
  component: DeckRendering,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Read-only SVG deck rendering, backed by `<deck-rendering>` from `@opentrainticketing/netex-deckplan-editor`. The element is created detached and populated before insertion — Vue renders in `connectedCallback` and dereferences `deck.getBoundingBox()` there, so a deck assigned after insertion is too late. `scale` is mandatory upstream (`stageSize` multiplies by `props.scale ?? 0`), hence the `DECK_SCALE` default. Decks are drawn `vertical` in the sidebar so several fit side by side.',
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof DeckRendering>;

/**
 * The `SAMPLE` fallback — what renders when a real plan carries an empty
 * `<decks/>`. A bare 26.4m × 2.8m outline, no deck spaces.
 */
export const Ghost: Story = {
  render: () => <Framed label="ghost" xml={GHOST_DECK_PLAN_XML} vertical />,
  play: async ({ canvasElement }) => {
    const svg = await waitForSvg(canvasElement);
    // Non-degenerate box proves `scale` reached the element — unset, the
    // element's own `?? 0` collapses it to the 10px padding alone.
    expect(svg.getBoundingClientRect().height).toBeGreaterThan(100);

    // hathor's sheet must be adopted: the package ships its renderer styles to
    // a CSS file its `exports` map doesn't expose, so nothing styles the
    // shadow root otherwise.
    const root = canvasElement.querySelector('deck-rendering')!.shadowRoot!;
    expect(root.adoptedStyleSheets.length).toBeGreaterThan(0);

    // Unstyled, the outline falls back to `getShape()`'s `stroke: 'gray'`
    // presentation attribute. Anything else means the sheet won the cascade.
    const outline = svg.querySelector('rect.vehicle-deck')!;
    expect(getComputedStyle(outline).stroke).not.toBe('rgb(128, 128, 128)');
  },
};

/**
 * A populated deck, in both orientations. `vertical` is what the sidebar uses:
 * eight seats fit a narrow column, where the native orientation overflows.
 */
export const Orientations: Story = {
  render: () => (
    <Stack direction="row" spacing={4} alignItems="flex-start">
      <Framed label="vertical" xml={SAMPLE_XML} vertical />
      <Framed label="horizontal" xml={SAMPLE_XML} />
    </Stack>
  ),
  play: async ({ canvasElement }) => {
    const svg = await waitForSvg(canvasElement);
    // Seats only render when the parsed deck spaces satisfy the bundle's own
    // `instanceof PassengerSpace` — this is the class-identity guard.
    await waitFor(() => expect(svg.querySelectorAll('g.seat')).toHaveLength(8));

    // Unstyled, seat bodies and their labels both compute to solid black —
    // legible only by accident. Both must be painted, and distinguishable.
    const base = getComputedStyle(svg.querySelector('rect.seat__base')!).fill;
    const label = getComputedStyle(svg.querySelector('text.seat__text')!).fill;
    expect(base).not.toBe('rgb(0, 0, 0)');
    expect(base).not.toBe(label);
  },
};

/** Scale sweep — confirms px-per-metre is honoured and nothing clips. */
export const Scales: Story = {
  render: () => (
    <Stack direction="row" spacing={4} alignItems="flex-start">
      {[DECK_SCALE / 2, DECK_SCALE, DECK_SCALE * 2].map(s => (
        <Framed key={s} label={`scale ${s}`} xml={SAMPLE_XML} vertical scale={s} />
      ))}
    </Stack>
  ),
};

/**
 * Wait for the custom element to upgrade and paint, then hand back the SVG
 * from inside its shadow root.
 */
async function waitForSvg(root: HTMLElement): Promise<SVGSVGElement> {
  let svg: SVGSVGElement | null = null;
  await waitFor(() => {
    const el = root.querySelector('deck-rendering');
    svg = el?.shadowRoot?.querySelector('svg.vehicle-frame') ?? null;
    expect(svg).not.toBeNull();
  });
  return svg!;
}

/**
 * Build a NeTEx document with one 8-seat deck. Inline rather than a fixture
 * file: it exists to exercise the renderer, not to mirror a Sobek response.
 */
function sampleDeckPlanXml(): string {
  const spots = Array.from({ length: 8 }, (_, i) => {
    const row = Math.floor(i / 2),
      side = i % 2;
    const x = 1.2 + row * PITCH,
      y = 1.4 + (side ? AISLE : -AISLE);
    return `
                        <PassengerSpot version="1" id="SAMPLE:PassengerSpot:${i + 1}">
                          <Label>${row + 1}${side ? 'B' : 'A'}</Label>
                          <Orientation>backwards</Orientation>
                          <Centroid><Location><pos>${x} ${y}</pos></Location></Centroid>
                          <Width>0.7</Width>
                          <Length>0.7</Length>
                        </PassengerSpot>`;
  }).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<PublicationDelivery xmlns="http://www.netex.org.uk/netex">
  <dataObjects>
    <CompositeFrame version="1" id="SAMPLE:CompositeFrame:1">
      <frames>
        <ResourceFrame version="1" id="SAMPLE:ResourceFrame:1">
          <deckPlans>
            <DeckPlan version="1" id="SAMPLE:DeckPlan:1">
              <decks>
                <Deck version="1" id="SAMPLE:Deck:1">
                  <deckSpaces>
                    <PassengerSpace version="1" id="SAMPLE:PassengerSpace:1">
                      <passengerSpots>${spots}
                      </passengerSpots>
                    </PassengerSpace>
                  </deckSpaces>
                  <Width>2.825</Width>
                  <Length>6</Length>
                </Deck>
              </decks>
            </DeckPlan>
          </deckPlans>
        </ResourceFrame>
      </frames>
    </CompositeFrame>
  </dataObjects>
</PublicationDelivery>`;
}
