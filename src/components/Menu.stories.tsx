import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect } from 'react';
import { MemoryRouter } from 'react-router-dom';
import Menu from './Menu';
import { NavRailProvider, useNavRail } from '../contexts/NavRailContext';

/**
 * Drives the desktop rail to a fixed expanded/collapsed state for a story.
 * NavRailContext exposes only a toggle (state is normally user- and
 * localStorage-driven), so we nudge it once on mount to the wanted value.
 *
 * @param value - target `expanded` state (true = 280px labels, false = 64px).
 */
function ForceExpanded({ value }: { value: boolean }) {
  const { expanded, toggleExpanded } = useNavRail();
  useEffect(() => {
    if (expanded !== value) toggleExpanded();
  }, [expanded, value, toggleExpanded]);
  return null;
}

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
          'Primary navigation. Desktop renders a persistent left rail (M3 mini-variant) — 64px icons-only, toggles to 280px with labels; the active route is highlighted and collapsed icons get right-placed tooltips. Mobile (<600px) renders a 280px left-anchored temporary Drawer instead.',
      },
    },
  },
  decorators: [
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

/** Collapsed desktop rail — icons only, 64px. Hover an icon for its tooltip. */
export const Collapsed: Story = {
  render: () => (
    <>
      <ForceExpanded value={false} />
      <Menu />
    </>
  ),
};

/** Expanded desktop rail — icons + labels, 280px; Vehicle types highlighted. */
export const Expanded: Story = {
  render: () => (
    <>
      <ForceExpanded value={true} />
      <Menu />
    </>
  ),
};

/**
 * Mobile temporary Drawer (280px, left-anchored). Forced open on mount; the
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
