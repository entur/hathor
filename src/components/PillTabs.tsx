import { Tabs, type TabsProps } from '@mui/material';

/**
 * Pill/segmented tabs: the sliding underline indicator misaligns once the tabs
 * wrap onto a second line in a narrow rail, so it is hidden and the active tab
 * gets a filled background. Tabs still wrap (no scroll chevrons).
 */
const PILL_SX = {
  mb: 1.5,
  minHeight: 0,
  '& .MuiTabs-indicator': { display: 'none' },
  '& .MuiTabs-flexContainer': { flexWrap: 'wrap', gap: 0.75 },
  '& .MuiTab-root': {
    minHeight: 30,
    px: 1.25,
    py: 0.25,
    borderRadius: 1,
    textTransform: 'none',
    bgcolor: 'action.hover',
    color: 'text.secondary',
  },
  '& .MuiTab-root.Mui-selected': { bgcolor: 'primary.main', color: 'primary.contrastText' },
};

/**
 * MUI `Tabs` with the rail-safe pill styling shared by the sidebar editors.
 *
 * @param {Omit<TabsProps, 'sx'>} props MUI tab props; pass `<Tab>` children as usual.
 * @returns {JSX.Element} The styled tab strip.
 */
export default function PillTabs(props: Omit<TabsProps, 'sx'>) {
  return <Tabs {...props} sx={PILL_SX} />;
}
