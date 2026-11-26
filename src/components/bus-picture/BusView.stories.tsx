import type { Meta, StoryObj } from '@storybook/react-vite';
import { Box } from '@mui/material';
import { BusView, type BusSpec } from './index.ts';
import type { BusViewProps } from './components/BusView.tsx';

const COLUMN_H = 480; // about a form page's picture column; the width follows
const STD = { length: 12, width: 2.55, height: 3.2 }; // metres
const DIM = { control: { type: 'number', step: 0.05 } } as const;
// `standard` = the fact left out; `none` = told there are no doors; `2+3` can't be drawn.
// Every rule reachable: up to 3 doors on a rigid bus, 5 on an articulated one; a door of 3 leaves.
const DOORS = [
  'standard',
  'none',
  '1',
  '2',
  '1+2',
  '2+1',
  '2+2',
  '2+2+2',
  '2+2+2+2',
  '2+2+2+2+2',
  '1+1+1+1+1+1',
  '2+3',
];

/** Every input as its own control: the outer dims and the spec's facts, flattened (so no
 *  `component`, whose docgen would add `dims` and `spec` back as JSON editors). */
type Args = Omit<BusViewProps, 'dims' | 'spec' | 'shotSize'> &
  BusViewProps['dims'] &
  BusSpec & { shotW?: number; shotH?: number };

/** The form page's picture with a Bitmap | 3D switch. 3D flies one short ∞, then orbits. */
const meta: Meta<Args> = {
  title: 'components/BusView',
  render: ({
    length,
    width,
    height,
    axles,
    doors,
    decks,
    articulated,
    lowFloor,
    shotW,
    shotH,
    ...rest
  }) => (
    <Box sx={{ height: COLUMN_H }}>
      <BusView
        {...rest}
        dims={{ length, width, height }}
        spec={{ axles, doors, decks, articulated, lowFloor }}
        shotSize={shotW && shotH ? { w: shotW, h: shotH } : undefined}
      />
    </Box>
  ),
  // The picture area at COLUMN_H: 720 × 432 (the toolbar takes 48).
  args: { paint: 'vehicleType', shotW: 720, shotH: 432 },
  argTypes: {
    paint: { control: 'inline-radio', options: ['vehicleType', 'vehicle'] },
    mode: { control: 'select', options: [undefined, 'BUS', 'COACH', 'RAIL'] },
    placeholder: { control: 'text' },
    length: DIM,
    width: DIM,
    height: DIM,
    axles: { control: 'inline-radio', options: [undefined, 2, 3, 4, 5] },
    doors: { control: 'select', options: DOORS, mapping: { standard: undefined, none: '' } },
    decks: { control: 'inline-radio', options: [undefined, 'single', 'double'] },
    articulated: { control: 'boolean' },
    lowFloor: { control: 'boolean' },
    shotW: { control: { type: 'number', step: 10 } },
    shotH: { control: { type: 'number', step: 10 } },
  },
};
export default meta;

type Story = StoryObj<Args>;

/** All three outer dims, no facts: the standard shape at the record's size. */
export const FullDims: Story = { args: { length: 13.2, width: 2.55, height: 3.3 } };

/** No dims at all: the standard bus, and a note naming all three. */
export const NoDims: Story = {};

/** One dim missing: only that one is standard. */
export const NoHeight: Story = { args: { length: 18, width: 2.55 } };

/** A 74 m train can't be drawn as a bus: standard length, said so. */
export const OutOfRange: Story = { args: { length: 74, width: 2.9, height: 4.2 } };

/** A vehicle is red. */
export const Vehicle: Story = {
  args: {
    ...STD,
    length: 18,
    paint: 'vehicle',
    articulated: true,
    decks: 'single',
    doors: '2+2+2',
    axles: 3,
  },
};

/** An 18 m articulated bus: two sections behind bellows, three axles, doors 2+2+2. */
export const Articulated: Story = {
  args: { ...STD, length: 18, articulated: true, doors: '2+2+2', lowFloor: true },
};

/** A rigid three-axle coach with a tag axle. */
export const ThreeAxles: Story = {
  args: { length: 14.95, width: 2.55, height: 3.7, axles: 3, doors: '2+1' },
};

/** Two decks: an upper window band. */
export const DoubleDecker: Story = {
  args: { length: 13, width: 2.55, height: 4.2, decks: 'double', axles: 3 },
};

/** Facts that can't be drawn (an articulated double-decker): the standard shape, said so. */
export const BadSpec: Story = {
  args: { ...STD, length: 18, height: 4.2, articulated: true, decks: 'double' },
};

/** Not a bus or coach: a line of text, no switch. */
export const Unsupported: Story = { args: { ...STD, mode: 'RAIL' } };

/** Nothing to draw yet: the placeholder, no switch. */
export const Placeholder: Story = { args: { ...STD, placeholder: 'Select type' } };
