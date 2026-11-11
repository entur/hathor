import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { MemoryRouter, Route, Routes, useParams } from 'react-router-dom';
import { Typography } from '@mui/material';
import type { PropulsionType, VehicleType } from '../../data/vehicle-types/types/vehicleTypeTypes';
import type { VehicleTypeField } from '../../data/vehicle-types/types/vehicleTypeFields';
import type { TransportMode } from '../../data/netex/transportMode';
import { VehicleTypeCollection } from '../../data/vehicle-types/components/vehicleTypeCollectionConfig';
import type { EntityCollectionProps } from './index';
import { ALL_TOOLS } from './types';

const ROW_COUNT = 120;
const LIST = '/vehicle-types';
const NARROW_W = 360; // a phone: the toolbar wraps, the Columns tool trims the grid (U5)
const FRAME_H = 560; // a page-shell height: the toolbar and pager stay, the rows scroll (#278)
const MODES: TransportMode[] = ['BUS', 'COACH', 'RAIL', 'TRAM', 'WATER'];
const BUS_SHARE = 3; // of every 4 rows a bus, like a bus operator's fleet
const UNNAMED_EVERY = 15; // these rows have no name: the title reads as a dash
const MAKES = ['Volvo', 'Scania', 'Solaris', 'MAN', 'Stadler', 'Bombardier', 'Ærø'];
const MODELS = ['Citea', '8900', 'Urbino', 'Lion', 'Flirt', 'Talent', 'Express'];
const PROPULSION: PropulsionType[] = ['COMBUSTION', 'ELECTRIC', 'HYBRID'];
const CAPACITY_MIN = 40,
  CAPACITY_SPAN = 110; // a midibus to an articulated bus
const NO_DIMS_EVERY = 4; // these rows have a length only: their bus says width and height are standard
const WIDTH_MIN = 2.45,
  WIDTH_STEP = 0.1, // 2.45–2.65 m
  HEIGHT_MIN = 2.9,
  HEIGHT_STEP = 0.2; // 2.9–3.5 m

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
  ...(i % NO_DIMS_EVERY !== NO_DIMS_EVERY - 1 && {
    width: WIDTH_MIN + (i % 3) * WIDTH_STEP,
    height: HEIGHT_MIN + (i % 4) * HEIGHT_STEP,
  }),
  lowFloor: i % 5 < 3,
  propulsionTypes: [PROPULSION[i % PROPULSION.length]],
  passengerCapacity: { totalCapacity: CAPACITY_MIN + ((i * 37) % CAPACITY_SPAN) },
  deckPlan: i % 5 === 0 ? { id: `NMR:DeckPlan:${i}`, name: { value: `Deck ${i}` } } : undefined,
}));

type Props = EntityCollectionProps<VehicleType, VehicleTypeField>;

/** Where an Edit link lands: shows the id it opened. */
function DetailsStandin() {
  return <Typography variant="h5">Details page for {useParams().id}</Typography>;
}

/** The vehicle-types page's own collection under a router, so its Edit links navigate. */
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
  title: 'components/EntityCollection/vehicle-types',
  component: Demo,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          "Embedded port of the sandbox `EntityCollection` (#261, epic #252): toolbar (search · filter · sort · columns · density · view), grid / cards. Hathor additions: a field's `render` (transport mode as icon + text), an Edit link per record (`editHref`), the id muted. Drawn with the vehicle-types page's own collection config (`vehicleTypeFields`, `vehicleTypeCollectionConfig.tsx`, #271) over 120 seeded rows.",
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
    filterMode: { control: 'inline-radio', options: ['client', 'server'] },
    tools: { control: 'check', options: [...ALL_TOOLS] },
    rows: { control: false },
  },
};
export default meta;

type Story = StoryObj<typeof Demo>;

/** Uncontrolled: starts on the grid; the toolbar's view switch changes it. */
export const Grid: Story = {};

/** Each type drawn as a bus; one row in four has no width or height and says so. */
export const Cards: Story = { args: { view: 'cards' } };

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

/** In a frame of set height, as the page shell gives it: the toolbar and the pager stay put
 *  and the rows scroll between them — the grid under its fixed headers (#278). */
export const Framed: Story = {
  decorators: [
    Story => (
      <div style={{ height: FRAME_H, display: 'flex', flexDirection: 'column' }}>
        <Story />
      </div>
    ),
  ],
};
