import type { Meta, StoryObj } from '@storybook/react-vite';
import { MemoryRouter } from 'react-router-dom';
import HomePage from './Home';
import { withOrganisations } from '../contexts/mockOrganisations.tsx';
import { withAuth } from '../auth/mockAuth.tsx';

/**
 * Stories for the Home dashboard. A MemoryRouter decorator supplies the routing
 * context the page's <Link>s need; `withOrganisations` and `withAuth` stand in
 * for the real OrganisationsProvider and OIDC provider (config/fetch-driven, so
 * unavailable here) that gate the org sections and the logged-out band —
 * together they put the page in its signed-in, org-selected state.
 * `fullscreen` layout lets the flat, full-width
 * dashboard breathe without Storybook's default padding. Domain glyphs come from
 * the nav-rail MenuIcon sprite, mounted globally in `.storybook/preview.tsx`.
 */
const meta: Meta<typeof HomePage> = {
  title: 'pages/Home',
  component: HomePage,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          "Flat, left-aligned registry dashboard: hero band + overview metric strip + browse/create tile grids; no elevated or bordered cards. Domain glyphs reuse the nav rail's MenuIcon sprite, so the home view and side menu render the same iconset.",
      },
    },
  },
  decorators: [
    withAuth(),
    withOrganisations(),
    Story => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof HomePage>;

/** Default dashboard at full width. */
export const Default: Story = {};

/**
 * Mobile layout: the `mobile1` viewport narrows the canvas below the `sm`
 * breakpoint, so the metric strip and browse/create grids collapse to a single
 * column.
 */
export const Mobile: Story = {
  globals: { viewport: { value: 'mobile1', isRotated: false } },
};
