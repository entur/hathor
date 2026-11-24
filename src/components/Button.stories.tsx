import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button, Stack } from '@mui/material';

const SIZES = ['small', 'medium', 'large'] as const;
const KINDS = [
  { name: 'Primary', props: { variant: 'contained' } },
  { name: 'Secondary', props: { variant: 'outlined' } },
  { name: 'Negative', props: { variant: 'outlined', color: 'error' } },
] as const;

const meta: Meta<typeof Button> = {
  title: 'components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          "MUI's Button themed as Linje's Primary (contained), Secondary (outlined) and Negative (outlined error): 32 / 48 / 64 px, body-s / body-m / body-xl text 14 / 18 / 26 px from the edge.",
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof Button>;

export const Sizes: Story = {
  render: () => (
    <Stack spacing={2}>
      {KINDS.map(({ name, props }) => (
        <Stack key={name} direction="row" spacing={2} sx={{ alignItems: 'center' }}>
          {SIZES.map(size => (
            <Button key={size} {...props} size={size} data-testid={`${name}-${size}`}>
              {name}
            </Button>
          ))}
          <Button {...props} disabled>
            Disabled
          </Button>
        </Stack>
      ))}
    </Stack>
  ),
};
