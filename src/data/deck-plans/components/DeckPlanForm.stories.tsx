import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, waitFor } from 'storybook/test';
import { Box } from '@mui/material';
import DeckPlanForm from './DeckPlanForm.tsx';
import { mkSampleDeckPlanXml } from '../utils/sampleDeckPlanXml.ts';
import type { DeckPlan } from '../../vehicle-types/types/vehicleTypeTypes.ts';

/** Sidebar width the editor actually renders at, so the strip's scroll is real. */
const RAIL_W = 460;

/** Two decks — enough that the strip has to lay several columns side by side. */
const TWO_DECKS = mkSampleDeckPlanXml([
  { name: 'Lower', seats: 12 },
  { name: 'Upper', seats: 6 },
]);

/** A plan whose `<decks/>` is empty — what real Sobek data usually returns. */
const NO_DECKS = mkSampleDeckPlanXml([]);

const PLAN: DeckPlan = {
  id: 'NMR:DeckPlan:5',
  version: 2,
  name: { value: 'Plan Alpha' },
  description: { value: 'Alpha lower-deck variant' },
};

/**
 * Story shell — owns the form state so the fields are actually typeable, and
 * constrains the width to the sidebar's so the deck strip overflows the way it
 * does in the app.
 */
function Editor(props: Omit<React.ComponentProps<typeof DeckPlanForm>, 'value' | 'onChange'>) {
  const [value, setValue] = useState<DeckPlan>(PLAN);
  return (
    <Box sx={{ width: RAIL_W, border: 1, borderColor: 'divider', borderRadius: 1, p: 2 }}>
      <DeckPlanForm {...props} value={value} onChange={setValue} />
    </Box>
  );
}

const meta: Meta<typeof DeckPlanForm> = {
  title: 'data/deck-plans/DeckPlanForm',
  component: DeckPlanForm,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'The deck-plan sidebar editor. Tabs stay `Edit | XML`; the per-deck renderings live *inside* the Edit tab, below Name/Description, as a horizontal strip. Decks draw `vertical` — at ~26.4m × 2.8m the native orientation overflows the sidebar for even one deck, where rotated columns sit side by side and read as a vehicle seen from above. Both tabs render from the same fetched body, so they share its loading and fetch-error states; that chrome wraps only the body panes, never the fields.',
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof DeckPlanForm>;

const base = {
  mode: 'edit' as const,
  isCreate: false,
  loading: false,
  fetchError: null,
  onRetry: () => {},
};

/**
 * The default: fields on top, one rendering per Deck below, captioned by name.
 * This is the story the `<deck-rendering>` wiring exists for.
 */
export const EditTab: Story = {
  render: () => <Editor {...base} xml={TWO_DECKS} />,
  play: async ({ canvasElement }) => {
    // The strip appears only once the bundle has loaded and the body parsed,
    // so every lookup has to happen inside the poll.
    await waitFor(() => {
      const els = canvasElement.querySelectorAll('deck-rendering');
      expect(els).toHaveLength(2);
      // One element per Deck, seats drawn inside each element's shadow root.
      expect(els[0].shadowRoot!.querySelectorAll('g.seat')).toHaveLength(12);
      expect(els[1].shadowRoot!.querySelectorAll('g.seat')).toHaveLength(6);
    });

    const strip = canvasElement.querySelector('[data-testid="deck-plan-decks"]');
    expect(strip).not.toBeNull();
    // Captions come from each <Deck><Name>.
    expect(strip!.textContent).toContain('Lower');
    expect(strip!.textContent).toContain('Upper');
    // No SAMPLE chrome when the plan actually carries decks.
    expect(canvasElement.querySelector('[data-testid="deck-plan-decks-sample"]')).toBeNull();
  },
};

/**
 * A plan with an empty `<decks/>` — the common case on real data. One ghost
 * deck is drawn under a SAMPLE heading so the tab is never blank.
 */
export const EditTabSample: Story = {
  render: () => <Editor {...base} xml={NO_DECKS} />,
  play: async ({ canvasElement }) => {
    await waitFor(() =>
      expect(canvasElement.querySelector('[data-testid="deck-plan-decks-sample"]')).not.toBeNull()
    );
    const els = canvasElement.querySelectorAll('deck-rendering');
    expect(els).toHaveLength(1);
    // The ghost is an outline only — no seats.
    expect(els[0].shadowRoot!.querySelectorAll('g.seat')).toHaveLength(0);
  },
};

/** Read-only: inputs disabled, renderings unaffected. */
export const ViewMode: Story = {
  render: () => <Editor {...base} mode="view" xml={TWO_DECKS} />,
};

/**
 * Body fetch in flight. The spinner replaces the strip only — Name and
 * Description stay interactive, so a slow fetch never blocks typing.
 */
export const BodyLoading: Story = {
  render: () => <Editor {...base} loading xml="" />,
  play: async ({ canvasElement }) => {
    expect(canvasElement.querySelector('[data-testid="deck-plan-decks-loading"]')).not.toBeNull();
    expect(canvasElement.querySelector<HTMLInputElement>('#deckPlan-name')!.disabled).toBe(false);
  },
};

/** Body fetch failed — alert plus retry, again scoped to the strip. */
export const BodyFetchError: Story = {
  render: () => <Editor {...base} xml="" fetchError="503 Service Unavailable" />,
};

/** Create flow — no persisted body yet, so no tab strip and no renderings. */
export const Create: Story = {
  render: () => <Editor {...base} isCreate xml="" />,
  play: async ({ canvasElement }) => {
    expect(canvasElement.querySelector('[data-testid="deck-plan-tab-edit"]')).not.toBeNull();
    expect(canvasElement.querySelector('deck-rendering')).toBeNull();
    expect(canvasElement.querySelectorAll('[role="tab"]')).toHaveLength(0);
  },
};
