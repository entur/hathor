import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { MemoryRouter, Route, Routes, useParams } from 'react-router-dom';
import { Typography } from '@mui/material';
import type { Vehicle } from '../../data/vehicles/types/vehicle';
import type { VehicleField } from '../../data/vehicles/types/vehicleFields';
import { VehicleCollection } from '../../data/vehicles/components/vehicleCollectionConfig';
import { withOrganisations } from '../../contexts/mockOrganisations';
import { stubSobek, withSobekUrl } from '../../contexts/mockSobek';
import type { EntityCollectionProps } from './index';
import { ALL_TOOLS } from './types';

const ROW_COUNT = 40;
const LIST = '/next/vehicles';
const UNNAMED_EVERY = 7; // these rows have no name: Name falls back to the registration number

// Sobek's wire shape, kept in step with the query by the e2e suite. Globbed: the fixture
// sits outside `src`, so the app's TypeScript project can't import it.
const [vehicleTypesMock] = Object.values(
  import.meta.glob('../../../e2e-tests/fixtures/vehicle-types-mock.json', {
    eager: true,
    import: 'default',
  })
);

/** The mock's three types: a bus with full dims, a rail type, one with no mode. */
const TYPES: NonNullable<Vehicle['transportType']>[] = [
  { id: 'NMR:VehicleType:1', name: { value: 'Type Alpha' }, transportMode: 'BUS' },
  { id: 'NMR:VehicleType:2', name: { value: 'Type Beta' }, transportMode: 'RAIL' },
  { id: 'NMR:VehicleType:3', name: { value: 'Type Gamma' } },
];

/** Varied but the same on every load. */
const ROWS: Vehicle[] = Array.from({ length: ROW_COUNT }, (_, i) => ({
  id: `NMR:Vehicle:${2000 + i}`,
  version: 1 + (i % 2),
  name: i % UNNAMED_EVERY === 3 ? { value: '  ' } : { value: `Bus ${4000 + i}` },
  registrationNumber: `EL ${String(10000 + i * 37).slice(-5)}`,
  operationalNumber: String(4000 + i),
  transportType: TYPES[i % TYPES.length],
}));

type Props = EntityCollectionProps<Vehicle, VehicleField>;

/** Where an Edit link lands: shows the id it opened. */
function DetailsStandin() {
  return <Typography variant="h5">Details page for {useParams().id}</Typography>;
}

/** The vehicles page's own collection under a router, so its Edit links navigate. */
function Demo(props: Props) {
  return (
    <MemoryRouter initialEntries={[LIST]}>
      <Routes>
        <Route path={LIST} element={<VehicleCollection {...props} />} />
        <Route path={`${LIST}/:id`} element={<DetailsStandin />} />
      </Routes>
    </MemoryRouter>
  );
}

const meta: Meta<typeof Demo> = {
  title: 'components/EntityCollection/vehicles',
  component: Demo,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          "The vehicles page's own collection (`vehicleFields`, `vehicleCollectionConfig.tsx`, #285) over 40 seeded rows: Name falls back to the registration number, the mode shows as icon + text, cards draw a red bus in the vehicle type's dims (the type list is the e2e mock, answered by `stubSobek`).",
      },
    },
  },
  decorators: [withSobekUrl(), withOrganisations()],
  beforeEach: stubSobek({ vehicleTypes: vehicleTypesMock }),
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

/** Uncontrolled: starts on the grid; unnamed rows read their registration number. */
export const Grid: Story = {};

/** Each vehicle as a red bus in its type's dims; a rail type gets a line of text. */
export const Cards: Story = { args: { view: 'cards' } };
