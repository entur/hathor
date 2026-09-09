import type { Meta, StoryObj } from '@storybook/react-vite';
import { Box, Typography } from '@mui/material';
import { TRANSPORT_MODES, type TransportMode } from '../../data/netex/transportMode';
import { colorVarFor } from './transportModeIconHelpers';
import TransportModeSprite from './TransportModeSprite';

const DEFAULT_PX = 32,
  CELL_MIN = '7.5rem';

type SpriteArgs = { size: number };

const meta: Meta<SpriteArgs> = {
  title: 'components/icons/TransportModeSprite',
  component: TransportModeSprite,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Raw sprite showcase — every `<symbol id="tm-*">` rendered straight from the sprite, ' +
          'bypassing `TransportModeIcon` (which is locked to 16px). Colour comes from the ' +
          '`--tm-<MODE>` token via `colorVarFor`, applied to `color` and picked up by the ' +
          'paths\' `fill="currentColor"`. Modes without bespoke art alias `#tm-fallback`, so ' +
          'they all render the same generic glyph — visible here as repeated shapes.',
      },
    },
  },
  argTypes: {
    size: {
      control: { type: 'range', min: 16, max: 128, step: 8 },
      description: 'Rendered glyph width/height in px.',
    },
  },
  args: { size: DEFAULT_PX },
};
export default meta;

/**
 * One sprite symbol at an arbitrary size, tinted by its own token.
 * @param mode A `TransportMode`.
 * @param px Width/height in pixels.
 * @returns The `<svg><use/></svg>` pair pointing at `#tm-<mode>`.
 */
const Glyph = ({ mode, px }: { mode: TransportMode; px: number }) => (
  <svg width={px} height={px} role="img" aria-label={mode} style={{ color: colorVarFor(mode) }}>
    <use href={`#tm-${mode}`} />
  </svg>
);

/**
 * Reference grid — all 21 `TransportMode` symbols scaled up, each above its
 * enum id. Use it to spot missing art (duplicate fallback glyphs), check a
 * shape at a size the 16px component can't show, or eyeball token hues
 * against each other.
 */
export const AllSymbols: StoryObj<SpriteArgs> = {
  render: ({ size }) => (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: `repeat(auto-fill, minmax(${CELL_MIN}, 1fr))`,
        gap: 2,
        p: 3,
      }}
    >
      {TRANSPORT_MODES.map(mode => (
        <Box
          key={mode}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: 1,
            p: 1.5,
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1,
          }}
        >
          <Glyph mode={mode} px={size} />
          <Typography
            variant="caption"
            sx={{ fontFamily: 'monospace', textAlign: 'center', wordBreak: 'break-all' }}
          >
            {mode}
          </Typography>
        </Box>
      ))}
    </Box>
  ),
};
