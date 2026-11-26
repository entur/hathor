import type { Meta, StoryObj } from '@storybook/react-vite';
import { Box } from '@mui/material';
import { BusPicture, BusPictureFrame } from './index.ts';

const AREA_W = 360; // a card's width

/** In `BusPictureFrame`: a card's picture area, 16:10, the `<img>` filling it. */
const meta: Meta<typeof BusPicture> = {
  title: 'components/BusPicture',
  component: BusPicture,
  render: args => (
    <Box sx={{ width: AREA_W }}>
      <BusPictureFrame {...args} />
    </Box>
  ),
  args: { paint: 'vehicleType' },
  argTypes: { paint: { control: 'inline-radio', options: ['vehicleType', 'vehicle'] } },
};
export default meta;

type Story = StoryObj<typeof BusPicture>;

/** All three outer dims: drawn as given, no note. */
export const FullDims: Story = { args: { dims: { length: 13.2, width: 2.55, height: 3.3 } } };

/** No dims at all: the standard bus, and a note naming all three. */
export const NoDims: Story = { args: { dims: {} } };

/** One dim missing: only that one is standard. */
export const NoHeight: Story = { args: { dims: { length: 18, width: 2.55 } } };

/** A 74 m train can't be drawn as a bus: standard length, said so. */
export const OutOfRange: Story = { args: { dims: { length: 74, width: 2.9, height: 4.2 } } };

/** A vehicle is red. */
export const Vehicle: Story = {
  args: { paint: 'vehicle', dims: { length: 12, width: 2.55, height: 3.2 } },
};

/** Not a bus or coach: a line of text, and the area shrinks to it. */
export const Unsupported: Story = {
  args: { mode: 'RAIL', dims: { length: 74, width: 2.9, height: 4.2 } },
};
