import type { Meta, StoryObj } from '@storybook/react-vite';
import { Box } from '@mui/material';
import FormLayoutSkeleton from './FormLayoutSkeleton';

const meta: Meta<typeof FormLayoutSkeleton> = {
  title: 'components/FormLayoutSkeleton',
  component: FormLayoutSkeleton,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Wave-animated loading skeleton sharing the shape of `FormLayout` (label+value rows) or `FormStack` (`stacked` sections). Drop it into any sidebar editor that hasn’t loaded yet.',
      },
    },
  },
  argTypes: {
    ariaLabel: { control: 'text' },
    showTitle: { control: 'boolean' },
  },
  decorators: [
    Story => (
      <Box sx={{ maxWidth: '28rem', border: '1px solid', borderColor: 'divider' }}>
        <Story />
      </Box>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof FormLayoutSkeleton>;

export const Default: Story = {
  args: {
    ariaLabel: 'Loading form',
    sections: [{ rowCount: 4 }],
  },
};

export const WithTitle: Story = {
  args: {
    ariaLabel: 'Loading vehicle',
    showTitle: true,
    sections: [{ rowCount: 4 }],
  },
};

/** Read-only context rows above a stack of editable fields, as `/vehicles` loads. */
export const StackedFields: Story = {
  args: {
    ariaLabel: 'Loading vehicle',
    showTitle: true,
    sections: [{ rowCount: 2 }, { rowCount: 5, stacked: true }],
  },
};

export const MultiSection: Story = {
  args: {
    ariaLabel: 'Loading vehicle type',
    showTitle: true,
    sections: [{ rowCount: 3 }, { rowCount: 2 }, { rowCount: 4 }],
  },
};

/**
 * `rowHeight` override on the second section bumps each value cell to 88px,
 * mimicking a multiline text area. The first section keeps the default
 * input-height rows for contrast.
 */
export const TallRows: Story = {
  args: {
    ariaLabel: 'Loading editor with notes',
    showTitle: true,
    sections: [{ rowCount: 2 }, { rowCount: 1, rowHeight: 88 }],
  },
};
