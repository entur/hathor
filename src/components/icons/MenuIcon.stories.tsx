import type { Meta, StoryObj } from '@storybook/react-vite';
import { Box, Typography } from '@mui/material';
import MenuIcon, { type MenuIconName } from './MenuIcon';

const ALL_NAMES: MenuIconName[] = ['home', 'vehicleTypes', 'vehicles', 'deckPlans', 'menu'];

const meta: Meta<typeof MenuIcon> = {
  title: 'components/icons/MenuIcon',
  component: MenuIcon,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Navigation-rail glyph backed by the inline `MenuIconSprite` (`<use href="#menu-…">`). Paths are sourced from `@mui/icons-material` (Apache-2.0). Fills with `currentColor` — set `color` on a parent to recolour. `vehicleTypes` (outline) is the wireframe abstraction of solid `vehicles`.',
      },
    },
  },
  argTypes: {
    name: { control: 'select', options: ALL_NAMES, description: 'Sprite symbol to render.' },
    size: { control: { type: 'number' }, description: 'Square px size (default 24).' },
  },
};
export default meta;

type Story = StoryObj<typeof MenuIcon>;

export const WithControls: Story = {
  args: { name: 'vehicles', size: 64 },
};

/**
 * Reference grid — every menu glyph at preview size plus the actual rail sizes
 * (24px nav icon, 28px toggle). The last cell sits on a tinted surface to show
 * `currentColor` recolouring (the active-item behaviour in `Menu.tsx`).
 */
export const AllIcons: StoryObj = {
  render: () => (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(9rem, 1fr))',
        gap: 2,
        p: 2,
      }}
    >
      {ALL_NAMES.map(name => (
        <Box
          key={name}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 1,
            p: 1.5,
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1,
          }}
        >
          <MenuIcon name={name} size={56} />
          <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
            {name}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <MenuIcon name={name} size={24} />
            <MenuIcon name={name} size={28} />
          </Box>
        </Box>
      ))}
      {/* currentColor demo: tinted box drives the glyph colour. */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 1,
          p: 1.5,
          borderRadius: 1,
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
        }}
      >
        <MenuIcon name="vehicles" size={56} />
        <Typography variant="caption">currentColor</Typography>
      </Box>
    </Box>
  ),
};
