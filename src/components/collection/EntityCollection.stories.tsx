import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { MemoryRouter, Route, Routes, useParams } from 'react-router-dom';
import { Typography } from '@mui/material';
import TransportModeIcon from '../icons/TransportModeIcon';
import type { PropulsionType, VehicleType } from '../../data/vehicle-types/types/vehicleTypeTypes';
import type { TransportMode } from '../../data/netex/transportMode';
import { createEntityCollection, type EntityCollectionProps, type FieldSpec } from './index';
import { ALL_TOOLS } from './types';

const ROW_COUNT = 120;
const LIST = '/next/vehicle-types';
const NARROW_W = 360; // a phone: the toolbar wraps, the Columns tool trims the grid (U5)
const MODES: TransportMode[] = ['BUS', 'COACH', 'RAIL', 'TRAM', 'WATER'];
const BUS_SHARE = 3; // of every 4 rows a bus, like a bus operator's fleet
const UNNAMED_EVERY = 15; // these rows have no name: the title reads as a dash
const MAKES = ['Volvo', 'Scania', 'Solaris', 'MAN', 'Stadler', 'Bombardier', 'Ærø'];
const MODELS = ['Citea', '8900', 'Urbino', 'Lion', 'Flirt', 'Talent', 'Express'];
const PROPULSION: PropulsionType[] = ['COMBUSTION', 'ELECTRIC', 'HYBRID'];

/** Story-local field mapping; the real one lands with the vehicle-types page (#252 pri 3). */
const vehicleTypeFields = {
  id: { kind: 'text', path: ['id'] },
  name: { kind: 'name', path: ['name'] },
  transportMode: { kind: 'enum', path: ['transportMode'], options: MODES },
  length: { kind: 'number', path: ['length'] },
  lowFloor: { kind: 'switch', path: ['lowFloor'] },
  propulsionTypes: { kind: 'enumMulti', path: ['propulsionTypes'] },
  deckPlanName: { kind: 'name', path: ['deckPlan', 'name'] },
} satisfies Record<string, FieldSpec>;

const VehicleTypeCollection = createEntityCollection(vehicleTypeFields, {
  filterFields: {
    id: { arg: 'netexIds', op: 'anyOf' },
    transportMode: { arg: 'transportModes', op: 'anyOf' },
    name: { arg: 'name', op: 'contains' },
  },
});

/** Varied but the same on every load: values cycle at co-prime strides. */
const ROWS: VehicleType[] = Array.from({ length: ROW_COUNT }, (_, i) => ({
  id: `NMR:VehicleType:${1000 + i}`,
  version: 1 + (i % 3),
  name:
    i % UNNAMED_EVERY === 7
      ? undefined
      : { value: `${MAKES[i % MAKES.length]} ${MODELS[(i * 3) % MODELS.length]}` },
  transportMode: i % (BUS_SHARE + 1) ? 'BUS' : MODES[1 + ((i >> 2) % (MODES.length - 1))],
  length: 8 + ((i * 7) % 180) / 10,
  lowFloor: i % 5 < 3,
  propulsionTypes: [PROPULSION[i % PROPULSION.length]],
  deckPlan: i % 5 === 0 ? { id: `NMR:DeckPlan:${i}`, name: { value: `Deck ${i}` } } : undefined,
}));

type Props = EntityCollectionProps<VehicleType, keyof typeof vehicleTypeFields>;

/** Icon + its text, not the icon alone (user test II, V4). */
const COLUMNS: Props['columns'] = [
  'name',
  'id',
  {
    field: 'transportMode',
    render: r =>
      r.transportMode && <TransportModeIcon mode={r.transportMode} iconPosition="left" />,
  },
  'length',
  'lowFloor',
  'propulsionTypes',
  'deckPlanName',
];
const editHref = (r: VehicleType) => `${LIST}/${encodeURIComponent(r.id)}`;

/** Where an Edit link lands: shows the id it opened. */
function DetailsStandin() {
  return <Typography variant="h5">Details page for {useParams().id}</Typography>;
}

/** The collection under a router, so its Edit links navigate. */
function Demo(props: Props) {
  return (
    <MemoryRouter initialEntries={[LIST]}>
      <Routes>
        <Route path={LIST} element={<VehicleTypeCollection {...props} />} />
        <Route path={`${LIST}/:id`} element={<DetailsStandin />} />
      </Routes>
    </MemoryRouter>
  );
}

const meta: Meta<typeof Demo> = {
  title: 'components/EntityCollection',
  component: Demo,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          "Embedded port of the sandbox `EntityCollection` (#261, epic #252): toolbar (search · filter · sort · columns · density · view), grid / small cards / big cards. Hathor additions: a field's `render` (transport mode as icon + text), an Edit link per record (`editHref`), the id muted. 120 seeded VehicleType rows; the field mapping is story-local.",
      },
    },
  },
  args: {
    rows: ROWS,
    columns: COLUMNS,
    editHref,
    editState: { initialMode: 'edit' },
    tools: [...ALL_TOOLS],
    filterMode: 'client',
    onQueryChange: fn(),
    onViewChange: fn(),
  },
  argTypes: {
    view: { control: 'inline-radio', options: ['grid', 'cards-sm', 'cards-big'] },
    filterMode: { control: 'inline-radio', options: ['client', 'server'] },
    tools: { control: 'check', options: [...ALL_TOOLS] },
    rows: { control: false },
    columns: { control: false },
  },
};
export default meta;

type Story = StoryObj<typeof Demo>;

/** Uncontrolled: starts on the grid; the toolbar's view switch changes it. */
export const Grid: Story = {};

export const SmallCards: Story = { args: { view: 'cards-sm' } };

/** No picture yet (`cardMedia` comes with the bus shot, pri 3): the area stays blank. */
export const BigCards: Story = { args: { view: 'cards-big' } };

export const Empty: Story = { args: { rows: [] } };

/** A phone's width: the toolbar wraps; the Columns tool trims what the grid shows (U5). */
export const Narrow: Story = {
  decorators: [
    Story => (
      <div style={{ width: NARROW_W }}>
        <Story />
      </div>
    ),
  ],
};
