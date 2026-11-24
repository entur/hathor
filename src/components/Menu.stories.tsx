import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect } from 'react';
import { MemoryRouter } from 'react-router-dom';
import Menu from './Menu';
import { NavRailProvider, useNavRail } from '../contexts/NavRailContext';
import { withOrganisations } from '../contexts/mockOrganisations.tsx';

/** Opens the mobile temporary Drawer on mount (its default state is closed). */
function ForceMobileOpen() {
  const { mobileOpen, toggleMobile } = useNavRail();
  useEffect(() => {
    if (!mobileOpen) toggleMobile();
  }, [mobileOpen, toggleMobile]);
  return null;
}

const meta: Meta<typeof Menu> = {
  title: 'components/Menu',
  component: Menu,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Primary navigation as Linje SideNavigation (#418). Desktop renders it always open, 336px, fixed below the header; the active route gets the accent bar. Mobile (<600px) renders the same items in a left-anchored temporary Drawer, opened by the header menu button.',
      },
    },
  },
  decorators: [
    // Menu reads currentOrganisation; the real provider needs config/OIDC/fetch.
    withOrganisations(),
    // initialEntries seeds an active route so one item renders `selected`.
    Story => (
      <MemoryRouter initialEntries={['/vehicle-types']}>
        <NavRailProvider>
          <Story />
        </NavRailProvider>
      </MemoryRouter>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof Menu>;

/** Desktop side navigation, always open; Vehicle types is the active route. */
export const Desktop: Story = {};

/**
 * Mobile temporary Drawer (336px, left-anchored). Forced open on mount; the
 * `mobile1` viewport flips Menu's `useMediaQuery` mobile branch on.
 */
export const MobileDrawer: Story = {
  globals: { viewport: { value: 'mobile1', isRotated: false } },
  render: () => (
    <>
      <ForceMobileOpen />
      <Menu />
    </>
  ),
};
