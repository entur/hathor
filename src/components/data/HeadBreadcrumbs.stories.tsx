import type { Meta, StoryObj } from '@storybook/react-vite';
import { MemoryRouter } from 'react-router-dom';
import HeadBreadcrumbs from './HeadBreadcrumbs';

const meta: Meta<typeof HeadBreadcrumbs> = {
  title: 'components/data/HeadBreadcrumbs',
  component: HeadBreadcrumbs,
  parameters: {
    docs: {
      description: {
        component:
          'List-head breadcrumb trail (`Home / <title>`) shared by every Generic data view page. Home links back to `/`; the leaf is the current page label. The Home label comes from i18n (`breadcrumbs.home`); the leaf is passed in already-resolved via the `title` prop.',
      },
    },
  },
  // RouterLink needs a router in context; MemoryRouter seeds a current location.
  decorators: [
    Story => (
      <MemoryRouter initialEntries={['/vehicle-types']}>
        <Story />
      </MemoryRouter>
    ),
  ],
  args: { title: 'Vehicle types' },
  argTypes: {
    title: { control: 'text', description: 'Resolved label for the current (leaf) page.' },
  },
};
export default meta;

type Story = StoryObj<typeof HeadBreadcrumbs>;

/** Default trail: `Home / Vehicle types`. Edit the `title` control to retitle the leaf. */
export const Default: Story = {};

/** Vehicles list head. */
export const Vehicles: Story = { args: { title: 'Vehicles' } };

/** Deck plans list head. */
export const DeckPlans: Story = { args: { title: 'Deck plans' } };
