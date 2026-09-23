import { useState, type ComponentProps } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, spyOn, waitFor } from 'storybook/test';
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
 *
 * Verbatim 2020 documents (`version="1.2.2"`), never touched up: bare `<pos>`
 * outside the GML namespace, `version="1.0"` throughout, no `TimeZone`, a
 * fractional `SequenceFromFront`, deck-level `Width`/`Length`. They parse for
 * the renderer but are not postable to Sobek as-is — story input only.
 */
const WAGONS = [wagon1, wagon2, wagon3, wagon1mod, wagon2mod, wagon3mod];

/** Seats per wagon, in the same order — what the strip should draw. */
const WAGON_SEATS = [80, 46, 72, 80, 46, 72];

/**
 * The row being edited. Every story body carries this same id — the strip
 * selects its plan by it, mirroring what the save patches by.
 */
const PLAN_ID = 'NMR:DeckPlan:5';

/** Six real decks in one plan; more than the rail fits, so the strip scrolls. */
const SIX_DECKS = mkWagonsXml(WAGONS, PLAN_ID);

/**
 * Two samples merged with their native ids left alone — every wagon the editor
 * exports carries `id="Deck/id/1"`, so this is what a plan assembled from more
 * than one export looks like coming back from Sobek.
 */
const COLLIDING_IDS = mkWagonsXml([wagon1, wagon2], PLAN_ID, { keepIds: true });

/**
 * Three decks captioned three ways: the `MultilingualString` form NeTEx types
 * `Deck/Name` as (and Sobek's JAXB therefore writes), the flat form the editor
 * writes, and none at all.
 */
const MIXED_NAMES = withDeckNames(mkWagonsXml([wagon1, wagon2, wagon3], PLAN_ID), [
  { Text: 'Lower' },
  'Upper',
]);

/** Seats in the SAMPLE ghost — see `GHOST_SEATS` in `parseDecks`. */
const GHOST_SEATS = 46;

/** A plan whose `<decks/>` is empty — what real Sobek data usually returns. */
const NO_DECKS = mkSampleDeckPlanXml([], PLAN_ID);

const PLAN: DeckPlan = {
  id: PLAN_ID,
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

/** Duplicate-key warnings React logged while the current story rendered. */
let keyWarnings: string[] = [];

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
    // The heading renders as soon as the decks resolve, but DeckRendering
    // creates its custom element a microtask later inside the mount promise —
    // so the element needs its own wait, not the heading's.
    await waitFor(() => expect(canvasElement.querySelectorAll('deck-rendering')).toHaveLength(1));
    // The ghost is a full carriage, so it draws a populated layout rather than
    // an empty outline — the SAMPLE tab should look like a real deck plan.
    const el = canvasElement.querySelector('deck-rendering')!;
    await waitFor(() =>
      expect(el.shadowRoot!.querySelectorAll('g.seat')).toHaveLength(GHOST_SEATS)
    );
  },
};

/**
 * Decks that share a NeTEx id each get their own React identity.
 *
 * Both still reach the DOM when keyed on the colliding id alone — React draws
 * them and warns — but duplicate keys are explicitly unsupported: identity is
 * not maintained across updates, so a re-render may pair a deck with another
 * deck's `<deck-rendering>`. The console error is the contract violation, so
 * that is what this asserts.
 */
export const EditTabCollidingDeckIds: Story = {
  beforeEach: () => {
    keyWarnings = [];
    const spy = spyOn(console, 'error').mockImplementation((...args: unknown[]) => {
      if (String(args[0]).includes('same key')) keyWarnings.push(String(args[0]));
    });
    return () => spy.mockRestore();
  },
  render: args => <Editor {...base} railWidth={args.railWidth} xml={COLLIDING_IDS} />,
  play: async ({ canvasElement }) => {
    await waitFor(() => {
      const els = canvasElement.querySelectorAll('deck-rendering');
      expect(els).toHaveLength(2);
      const seats = [...els].map(el => el.shadowRoot!.querySelectorAll('g.seat').length);
      expect(seats).toEqual([WAGON_SEATS[0], WAGON_SEATS[1]]);
    });

    expect(keyWarnings).toEqual([]);
  },
};

/**
 * Captions read a deck's name whichever shape the document carried, and fall
 * back to the ordinal when it has none. The renderer bundle stores `Deck.Name`
 * verbatim, so an unwrapped `MultilingualString` reaches the caption as an
 * object — which React refuses to render, blanking the whole editor.
 */
export const EditTabDeckNames: Story = {
  render: args => <Editor {...base} railWidth={args.railWidth} xml={MIXED_NAMES} />,
  play: async ({ canvasElement }) => {
    await waitFor(() => expect(canvasElement.querySelectorAll('deck-rendering')).toHaveLength(3));
    const strip = canvasElement.querySelector('[data-testid="deck-plan-decks"]')!;
    expect(strip.textContent).toContain('Lower');
    expect(strip.textContent).toContain('Upper');
    expect(strip.textContent).toContain('Deck 3');
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
 * `Deck`, and every one of them uses `id="Deck/id/1"`. The ids are rewritten
 * while merging so each deck is distinguishable; `keepIds` leaves the
 * collision in place, which is what a real multi-export plan carries.
 *
 * @param docs Sample NeTEx documents, in the order to draw them.
 * @param id NeTEx id for the merged plan — must match the form's row id.
 * @param opts `keepIds` preserves each sample's own `Deck` id.
 * @returns One document whose single `DeckPlan` carries every sample's deck.
 */
function mkWagonsXml(docs: string[], id: string, opts: { keepIds?: boolean } = {}): string {
  const Deck = docs.flatMap((doc, i) =>
    toArray(findResourceFrame(xmlParser.parse(doc))?.deckPlans?.DeckPlan).flatMap(plan =>
      toArray(plan?.decks?.Deck).map(deck =>
        opts.keepIds ? deck : { ...deck, '@_id': `SAMPLE:Deck:${i + 1}` }
      )
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
                  '@_id': id,
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

/**
 * Caption each `Deck` in a document, in the shape given.
 *
 * The samples ship nameless, and the two valid serializations of a NeTEx
 * `MultilingualString` — `<Name>Upper</Name>` and `<Name><Text>Lower</Text>
 * </Name>` — reach the renderer's `Deck.Name` as a string and an object
 * respectively. Both have to caption.
 *
 * @param xml One NeTEx document.
 * @param names Name per deck, in order; a short array leaves the rest unnamed.
 * @returns The same document with those names written in.
 */
function withDeckNames(xml: string, names: (string | { Text: string })[]): string {
  const doc = xmlParser.parse(xml);
  toArray(findResourceFrame(doc)?.deckPlans?.DeckPlan).forEach(plan =>
    toArray(plan?.decks?.Deck).forEach((deck, i) => {
      if (names[i] !== undefined) deck.Name = names[i];
    })
  );
  return new XMLBuilder({ ignoreAttributes: false, suppressEmptyNode: true }).build(doc);
}
