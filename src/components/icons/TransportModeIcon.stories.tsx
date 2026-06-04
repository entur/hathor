import type { Meta, StoryObj } from '@storybook/react-vite';
import { Box, Typography } from '@mui/material';
import TransportModeIcon from './TransportModeIcon';
import { TRANSPORT_MODES, type TransportMode } from '../../data/netex/transportMode';

const ALL_MODES: readonly TransportMode[] = TRANSPORT_MODES;

const meta: Meta<typeof TransportModeIcon> = {
  title: 'components/icons/TransportModeIcon',
  component: TransportModeIcon,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'NeTEx TransportMode glyph backed by the inline SVG sprite. Icon-only renders with tooltip + aria-label; `iconPosition` shows a localized inline label on either side.',
      },
    },
  },
  argTypes: {
    mode: {
      control: 'select',
      options: ALL_MODES,
      description: 'NeTEx TransportMode (plus synthetic `unknown`).',
    },
    iconPosition: {
      control: 'inline-radio',
      options: [undefined, 'left', 'right'],
      description: 'Omit for icon-only (tooltip). `left` / `right` show inline label.',
    },
  },
};
export default meta;

type Story = StoryObj<typeof TransportModeIcon>;

export const WithControls: Story = {
  args: { mode: 'RAIL' },
};

export const LabelLeft: Story = {
  args: { mode: 'BUS', iconPosition: 'left' },
};

export const LabelRight: Story = {
  args: { mode: 'WATER', iconPosition: 'right' },
};

/**
 * Reference grid — every TransportMode rendered icon-only (hover for the
 * localized label) plus its enum id. Useful when picking glyphs or
 * confirming sprite coverage.
 */
export const AllModes: StoryObj = {
  render: () => (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(8rem, 1fr))',
        gap: 2,
        p: 2,
      }}
    >
      {ALL_MODES.map(mode => (
        <Box
          key={mode}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            p: 1,
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1,
          }}
        >
          <TransportModeIcon mode={mode} />
          <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
            {mode}
          </Typography>
        </Box>
      ))}
    </Box>
  ),
};
