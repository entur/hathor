import { useRef, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Box, Paper, Typography, useMediaQuery, useTheme } from '@mui/material';
import { SectionToc } from './SectionToc';

/** The VehicleType editor's sections, in full words (user test II, V3). */
const SECTIONS = ['General', 'Dimensions', 'Propulsion', 'Capacity', 'Environment', 'Vehicles'];
// Linje docs TOC: `max-width: 15rem`, sticky clear of the header with a 2rem gap.
const TOC_WIDTH = '15rem',
  TOC_TOP = '2rem';
const MENU_W = 72; // the collapsed nav rail
const SECTION_MIN_H = 320; // tall enough that the form scrolls past the TOC

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

/** Picking scrolls to the section; marking the section in view on scroll is the host's (#252 pri 3). */
const InPageDemo = () => {
  const [active, setActive] = useState(SECTIONS[0]);
  const refs = useRef<Record<string, HTMLElement | null>>({});
  const wide = useMediaQuery(useTheme().breakpoints.up('lg'));
  const select = (section: string) => {
    setActive(section);
    refs.current[section]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  const toc = (
    <SectionToc
      sections={SECTIONS}
      active={active}
      onSelect={select}
      variant={wide ? 'list' : 'dropdown'}
      sx={{
        position: 'sticky',
        top: wide ? TOC_TOP : 0,
        pt: wide ? 0 : 1, // room for the dropdown's floating label
        zIndex: 1,
        bgcolor: 'background.default',
      }}
    />
  );
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: wide ? `${MENU_W}px minmax(0, 1fr) ${TOC_WIDTH}` : `${MENU_W}px 1fr`,
        gap: 3,
        alignItems: 'start',
      }}
    >
      <Paper variant="outlined" sx={{ position: 'sticky', top: 0, height: '100vh' }}>
        <Typography variant="caption" sx={{ p: 1, display: 'block' }}>
          Menu
        </Typography>
      </Paper>
      <Box>
        {!wide && toc}
        {SECTIONS.map(section => (
          <Box
            key={section}
            component="section"
            ref={(el: HTMLElement | null) => {
              refs.current[section] = el;
            }}
            sx={{ minHeight: SECTION_MIN_H, py: 2, scrollMarginTop: TOC_TOP }}
          >
            <Typography variant="h2" sx={{ typography: 'h5' }}>
              {section}
            </Typography>
          </Box>
        ))}
      </Box>
      {wide && toc}
    </Box>
  );
};

/** Third column, as Linje's own docs: menu | form | toc. Below `lg` the TOC turns
 *  into the dropdown above the form (Linje's inline disclosure). */
export const InPage: Story = { render: () => <InPageDemo />, parameters: { layout: 'fullscreen' } };
