import type { Meta, StoryObj } from '@storybook/react-vite';
import { Stack } from '@mui/material';
import { Add } from '@mui/icons-material';
import { MemoryRouter } from 'react-router-dom';
import SquareButton from './SquareButton';

const meta: Meta<typeof SquareButton> = {
  title: 'components/SquareButton',
  component: SquareButton,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          "Linje's secondary SquareButton: an icon in a bordered square, its label beside it. New above a collection, create on the Home cards.",
      },
    },
  },
  decorators: [
    Story => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof SquareButton>;

export const Sizes: Story = {
  render: () => (
    <Stack spacing={2} sx={{ alignItems: 'flex-start' }}>
      <SquareButton icon={<Add />}>New vehicle type</SquareButton>
      <SquareButton icon={<Add fontSize="small" />} size="small">
        New vehicle type
      </SquareButton>
    </Stack>
  ),
};

export const AsLink: Story = {
  render: () => (
    <SquareButton icon={<Add />} to="/vehicle-types/new">
      Vehicle type
    </SquareButton>
  ),
};
