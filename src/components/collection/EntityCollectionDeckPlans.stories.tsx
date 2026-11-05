import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { MemoryRouter, Route, Routes, useParams } from 'react-router-dom';
import { Typography } from '@mui/material';
import type { DeckPlan } from '../../data/deck-plans/types/deckPlanTypes';
import type { DeckPlanField } from '../../data/deck-plans/types/deckPlanFields';
import { DeckPlanCollection } from '../../data/deck-plans/components/deckPlanCollectionConfig';
import type { EntityCollectionProps } from './index';
import { ALL_TOOLS } from './types';

const ROW_COUNT = 25;
const LIST = '/next/deck-plans';
const UNNAMED_EVERY = 6; // these rows have no name: Name falls back to the id

/** Varied but the same on every load. */
const ROWS: DeckPlan[] = Array.from({ length: ROW_COUNT }, (_, i) => ({
  id: `NMR:DeckPlan:${300 + i}`,
  version: 1 + (i % 3),
  // Sobek's empty name is whitespace.
  name: i % UNNAMED_EVERY === 2 ? { value: '  ' } : { value: `Wagon ${i + 1}` },
  description: i % 2 ? { value: `${1 + (i % 2)} decks, ${40 + i} seats` } : undefined,
}));

type Props = EntityCollectionProps<DeckPlan, DeckPlanField>;

/** Where an Edit link lands: shows the id it opened. */
function DetailsStandin() {
  return <Typography variant="h5">Details page for {useParams().id}</Typography>;
}

/** The deck-plans page's own collection under a router, so its Edit links navigate. */
function Demo(props: Props) {
  return (
    <MemoryRouter initialEntries={[LIST]}>
      <Routes>
        <Route path={LIST} element={<DeckPlanCollection {...props} />} />
        <Route path={`${LIST}/:id`} element={<DetailsStandin />} />
      </Routes>
    </MemoryRouter>
  );
}

const meta: Meta<typeof Demo> = {
  title: 'components/EntityCollection/deck-plans',
  component: Demo,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          "The deck-plans page's own collection (`deckPlanFields`, `deckPlanCollectionConfig.tsx`, #287) over 25 seeded rows: Name falls back to the id; cards are text only (drawing decks needs one XML read per plan).",
      },
    },
  },
  args: {
    rows: ROWS,
    tools: [...ALL_TOOLS],
    filterMode: 'client',
    onQueryChange: fn(),
    onViewChange: fn(),
  },
  argTypes: {
    view: { control: 'inline-radio', options: ['grid', 'cards'] },
    tools: { control: 'check', options: [...ALL_TOOLS] },
    rows: { control: false },
  },
};
export default meta;

type Story = StoryObj<typeof Demo>;

/** Uncontrolled: starts on the grid; unnamed rows read their id. */
export const Grid: Story = {};

/** Each plan as a text card. */
export const Cards: Story = { args: { view: 'cards' } };
