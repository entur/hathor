import { useState, type ComponentProps } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, waitFor } from 'storybook/test';
import { XMLBuilder } from 'fast-xml-parser';
import { Box } from '@mui/material';
import DeckPlanForm from './DeckPlanForm.tsx';
import { mkSampleDeckPlanXml } from '../utils/sampleDeckPlanXml.ts';
import { findResourceFrame, toArray, xmlParser } from '../../netex/xmlUtils.ts';
import type { DeckPlan } from '../../vehicle-types/types/vehicleTypeTypes.ts';
import wagon1 from '../../../../story-fixtures/deck-plans/Wagon_1.xml?raw';
import wagon2 from '../../../../story-fixtures/deck-plans/Wagon_2.xml?raw';
import wagon3 from '../../../../story-fixtures/deck-plans/Wagon_3.xml?raw';
import wagon1mod from '../../../../story-fixtures/deck-plans/Wagon_1_modified.xml?raw';
import wagon2mod from '../../../../story-fixtures/deck-plans/Wagon_2_modified.xml?raw';
import wagon3mod from '../../../../story-fixtures/deck-plans/Wagon_3_modified.xml?raw';

/** Default sidebar width the editor renders at; `railWidth` overrides it. */
const RAIL_W = 460;

/** Slider bounds for `railWidth`, in px — a collapsed rail up to a wide one. */
const RAIL_MIN = 280,
  RAIL_MAX = 1200,
  RAIL_STEP = 20;

/** Story args: the form's own props plus the wrapper width control. */
type FormArgs = ComponentProps<typeof DeckPlanForm> & { railWidth: number };

/**
 * The editor package's six wagon samples, in file order.
 *
 * Copied from `NeTEx-Deckplan-Editor/deckplan-samples/` into `story-fixtures/`
 * at the repo root rather than under `src/` — they are story input, never app
 * input, and keeping them outside the source tree makes that structural. They
 * are copied rather than imported across the repo boundary so
 * `npm run test:stories` works in CI and without the sibling checkout.
 */
const WAGONS = [wagon1, wagon2, wagon3, wagon1mod, wagon2mod, wagon3mod];

/** Seats per wagon, in the same order — what the strip should draw. */
const WAGON_SEATS = [80, 46, 72, 80, 46, 72];

/** Six real decks in one plan; more than the rail fits, so the strip scrolls. */
const SIX_DECKS = mkWagonsXml(WAGONS);

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
 * constrains the wrapper to `railWidth` so the deck strip overflows (or does
 * not) the way it would at that sidebar width in the app.
 */
function Editor({
  railWidth = RAIL_W,
  ...props
}: Omit<FormArgs, 'value' | 'onChange'> & { railWidth?: number }) {
  const [value, setValue] = useState<DeckPlan>(PLAN);
  return (
    <Box
      sx={{
        width: railWidth,
        maxWidth: '100%',
        border: 1,
        borderColor: 'divider',
        borderRadius: 1,
        p: 2,
      }}
    >
      <DeckPlanForm {...props} value={value} onChange={setValue} />
    </Box>
  );
}

const meta: Meta<FormArgs> = {
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
  args: { railWidth: RAIL_W },
  argTypes: {
    railWidth: {
      name: 'rail width (px)',
      description: 'Width of the wrapper standing in for the resizable sidebar.',
      control: { type: 'range', min: RAIL_MIN, max: RAIL_MAX, step: RAIL_STEP },
    },
  },
};
export default meta;

type Story = StoryObj<FormArgs>;

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
  render: args => <Editor {...base} railWidth={args.railWidth} xml={SIX_DECKS} />,
  play: async ({ canvasElement }) => {
    // The strip appears only once the bundle has loaded and the body parsed,
    // so every lookup has to happen inside the poll.
    await waitFor(() => {
      const els = canvasElement.querySelectorAll('deck-rendering');
      expect(els).toHaveLength(WAGONS.length);
      // One element per Deck, seats drawn inside each element's shadow root.
      const seats = [...els].map(el => el.shadowRoot!.querySelectorAll('g.seat').length);
      expect(seats).toEqual(WAGON_SEATS);
    });

    const strip = canvasElement.querySelector('[data-testid="deck-plan-decks"]')!;
    // The samples carry no <Deck><Name>, so captions use the ordinal fallback.
    expect(strip.textContent).toContain('Deck 1');
    expect(strip.textContent).toContain('Deck 6');
    // No SAMPLE chrome when the plan actually carries decks.
    expect(canvasElement.querySelector('[data-testid="deck-plan-decks-sample"]')).toBeNull();
  },
};

/**
 * A plan with an empty `<decks/>` — the common case on real data. One ghost
 * deck is drawn under a SAMPLE heading so the tab is never blank.
 */
export const EditTabSample: Story = {
  render: args => <Editor {...base} railWidth={args.railWidth} xml={NO_DECKS} />,
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
  render: args => <Editor {...base} railWidth={args.railWidth} mode="view" xml={SIX_DECKS} />,
};

/**
 * Body fetch in flight. The spinner replaces the strip only — Name and
 * Description stay interactive, so a slow fetch never blocks typing.
 */
export const BodyLoading: Story = {
  render: args => <Editor {...base} railWidth={args.railWidth} loading xml="" />,
  play: async ({ canvasElement }) => {
    expect(canvasElement.querySelector('[data-testid="deck-plan-decks-loading"]')).not.toBeNull();
    expect(canvasElement.querySelector<HTMLInputElement>('#deckPlan-name')!.disabled).toBe(false);
  },
};

/** Body fetch failed — alert plus retry, again scoped to the strip. */
export const BodyFetchError: Story = {
  render: args => (
    <Editor {...base} railWidth={args.railWidth} xml="" fetchError="503 Service Unavailable" />
  ),
};

/** Create flow — no persisted body yet, so no tab strip and no renderings. */
export const Create: Story = {
  render: args => <Editor {...base} railWidth={args.railWidth} isCreate xml="" />,
  play: async ({ canvasElement }) => {
    expect(canvasElement.querySelector('[data-testid="deck-plan-tab-edit"]')).not.toBeNull();
    expect(canvasElement.querySelector('deck-rendering')).toBeNull();
    expect(canvasElement.querySelectorAll('[role="tab"]')).toHaveLength(0);
  },
};

/**
 * Merge the wagon samples into one deck plan so a single Edit tab shows all
 * six decks.
 *
 * Each sample is its own `PublicationDelivery` with one `DeckPlan` holding one
 * `Deck`, and every one of them uses `id="Deck/id/1"` — so the ids are
 * rewritten while merging, or the strip would render six children under the
 * same React key.
 *
 * @param docs Sample NeTEx documents, in the order to draw them.
 * @returns One document whose single `DeckPlan` carries every sample's deck.
 */
function mkWagonsXml(docs: string[]): string {
  const Deck = docs.flatMap((doc, i) =>
    toArray(findResourceFrame(xmlParser.parse(doc))?.deckPlans?.DeckPlan).flatMap(plan =>
      toArray(plan?.decks?.Deck).map(deck => ({ ...deck, '@_id': `SAMPLE:Deck:${i + 1}` }))
    )
  );

  return new XMLBuilder({ ignoreAttributes: false, suppressEmptyNode: true }).build({
    PublicationDelivery: {
      '@_xmlns': 'http://www.netex.org.uk/netex',
      dataObjects: {
        CompositeFrame: {
          '@_version': '1',
          '@_id': 'SAMPLE:CompositeFrame:1',
          frames: {
            ResourceFrame: {
              '@_version': '1',
              '@_id': 'SAMPLE:ResourceFrame:1',
              deckPlans: {
                DeckPlan: {
                  '@_version': '1',
                  '@_id': 'SAMPLE:DeckPlan:wagons',
                  decks: { Deck },
                },
              },
            },
          },
        },
      },
    },
  });
}
