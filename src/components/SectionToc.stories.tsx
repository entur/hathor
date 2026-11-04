import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { SectionToc } from './SectionToc';

/** The VehicleType editor's sections, in full words (user test II, V3). */
const SECTIONS = ['General', 'Dimensions', 'Propulsion', 'Capacity', 'Environment', 'Vehicles'];

const meta: Meta<typeof SectionToc> = {
  title: 'components/SectionToc',
  component: SectionToc,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'In-page navigation for a sectioned form, copied from the sandbox (#265). Stateless: the host owns `active`. Active entry railed, accent-coloured and bold, as Linje’s docs TOC.',
      },
    },
  },
  args: { sections: SECTIONS, active: 'Dimensions', onSelect: fn() },
};
export default meta;

type Story = StoryObj<typeof SectionToc>;

export const List: Story = {};

/** For narrow layouts: pinned above the content, its value is a "you are here" line. */
export const Dropdown: Story = { args: { variant: 'dropdown' } };

/** Sections known, record still loading: each entry keeps its size, nothing pickable. */
export const Loading: Story = { args: { loading: true } };
