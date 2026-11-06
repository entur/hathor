import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Box, Tab } from '@mui/material';
import PillTabs from './PillTabs';

/** Narrow enough that the VehicleType editor's five tabs wrap onto a second row. */
const NARROW_W = 300;

const TABS = ['General', 'Propulsion', 'Capacity', 'Environment', 'Vehicles'];

const Demo = ({ tabs }: { tabs: string[] }) => {
  const [tab, setTab] = useState(tabs[0]);
  return (
    <PillTabs value={tab} onChange={(_e, v: string) => setTab(v)}>
      {tabs.map(label => (
        <Tab key={label} value={label} label={label} />
      ))}
    </PillTabs>
  );
};

const meta: Meta<typeof Demo> = {
  title: 'components/prev/PillTabs',
  component: Demo,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'MUI `Tabs` with the rail-safe pill styling shared by the sidebar editors (#238): no sliding indicator, the active tab is filled, tabs wrap instead of scrolling.',
      },
    },
  },
  args: { tabs: TABS },
};
export default meta;

type Story = StoryObj<typeof Demo>;

export const Default: Story = {};

/** Two tabs, as the deck-plan editor uses (General | XML). */
export const TwoTabs: Story = { args: { tabs: ['General', 'XML'] } };

/** In a narrow rail the strip wraps; the hidden indicator can’t misalign. */
export const WrappedInNarrowRail: Story = {
  decorators: [
    Story => (
      <Box sx={{ width: NARROW_W, border: '1px dashed', borderColor: 'divider', p: 1 }}>
        <Story />
      </Box>
    ),
  ],
};
