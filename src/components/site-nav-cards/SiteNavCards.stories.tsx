import type { Meta, StoryObj } from '@storybook/react-vite';
import { Box } from '@mui/material';
import { MemoryRouter } from 'react-router-dom';
import SiteNavCards, { CreateRow, NavGrid, StatStrip } from './SiteNavCards';

/**
 * Stories for the Home dashboard's card rows, free of the page hero and the
 * login/organisation gate. A MemoryRouter decorator supplies the routing
 * context the tiles' <Link>s need; no auth/org mocks are required since the
 * rows read neither. The padded frame mirrors Home's content gutter. Domain
 * glyphs come from the nav-rail MenuIcon sprite, mounted globally in
 * `.storybook/preview.tsx`.
 */
const meta: Meta<typeof SiteNavCards> = {
  title: 'components/SiteNavCards',
  component: SiteNavCards,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'The three Home dashboard rows — overview metric strip, browse tiles and create-new actions. Each row is exported separately (`StatStrip`, `NavGrid`, `CreateRow`); the default export stacks all three.',
      },
    },
  },
  decorators: [
    Story => (
      <MemoryRouter>
        <Box sx={{ p: { xs: 2, sm: 3, md: 5 } }}>
          <Story />
        </Box>
      </MemoryRouter>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof SiteNavCards>;

/** All three rows stacked, as on Home. */
export const Default: Story = {};

/** Overview metric strip only (sample figures). */
export const Stats: Story = { render: () => <StatStrip /> };

/** Browse tiles only — links to the three list views. */
export const Browse: Story = { render: () => <NavGrid /> };

/** Create-new action row only — `?selected=new` deep links. */
export const Create: Story = { render: () => <CreateRow /> };

/**
 * Mobile layout: the `mobile1` viewport narrows the canvas below the `sm`
 * breakpoint, so every row collapses to a single column.
 */
export const Mobile: Story = {
  globals: { viewport: { value: 'mobile1', isRotated: false } },
};
