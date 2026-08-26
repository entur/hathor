import type { Meta, StoryObj } from '@storybook/react-vite';
import { Box, Stack, Typography } from '@mui/material';
import NetexId, { type NetexIdSize } from './NetexId';

const SAMPLE_ID = 'NSR:VehicleType:6f3a9e';
const SIZES: NetexIdSize[] = ['xsmall', 'small', 'medium', 'large'];

const meta: Meta<typeof NetexId> = {
  title: 'data/netex/NetexId',
  component: NetexId,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Read-only chip rendering a NeTEx id (`CODESPACE:TYPE:VALUE`). Optional version chip, tri-state copy button (`hide` / `show` / `onHover` / `only`), and four discrete sizes.',
      },
    },
  },
  argTypes: {
    id: { control: 'text' },
    version: { control: 'text' },
    size: { control: 'select', options: SIZES },
    copy: {
      control: 'inline-radio',
      options: ['hide', 'show', 'onHover', 'only'],
      description: 'Copy-button visibility. `only` drops the chip entirely.',
    },
    variant: { control: 'inline-radio', options: ['outlined', 'filled'] },
  },
};
export default meta;

type Story = StoryObj<typeof NetexId>;

export const WithControls: Story = {
  args: { id: SAMPLE_ID, size: 'medium', copy: 'show', variant: 'outlined' },
};

/**
 * `copy: 'onHover'` keeps the chip narrow at rest. The copy button slides in
 * when the chip is hovered or any child element is focused — try
 * tab-navigating to the chip with the keyboard.
 */
export const CopyOnHover: Story = {
  args: { id: SAMPLE_ID, copy: 'onHover' },
};

/**
 * `copy: 'only'` drops the segmented label and renders just the copy
 * button. Use in dense meta rows where the id text would clutter the
 * layout but you still want a one-click copy. The tooltip embeds the
 * full id.
 */
export const CopyOnly: Story = {
  args: { id: SAMPLE_ID, copy: 'only' },
};

export const Versioned: Story = {
  args: { id: SAMPLE_ID, version: 3, copy: 'show' },
};

/**
 * Fewer than 3 segments — leftmost missing parts render as `???`. Useful
 * when surfacing partial / malformed ids from upstream without crashing.
 */
export const MalformedId: Story = {
  args: { id: 'abc-123', copy: 'hide' },
};

/**
 * All four sizes side-by-side. Outer chip, version pill, copy button, and
 * font all scale proportionally.
 */
export const AllSizes: StoryObj = {
  render: () => (
    <Stack spacing={2} sx={{ alignItems: 'flex-start' }}>
      {SIZES.map(size => (
        <Box key={size} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="caption" sx={{ width: 64, fontFamily: 'monospace' }}>
            {size}
          </Typography>
          <NetexId id={SAMPLE_ID} version={3} copy="show" size={size} />
        </Box>
      ))}
    </Stack>
  ),
};
