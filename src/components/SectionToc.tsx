/**
 * Table of contents for a sectioned view: one entry per section, the active one
 * marked. Presentational and standalone — it holds no state, observes no
 * scrolling and knows nothing about the form. The host owns `active` and wires
 * it to whatever scrolls (a stacked form's `activeSection` /
 * `onActiveSectionChange`, typically). Two looks, one contract: a vertical
 * `list`, or a `dropdown` for narrow layouts, where pinned above the content its
 * closed value doubles as a "you are here" line. Which one fits is the host's
 * call — it knows the space it gives the TOC; this component measures nothing.
 */
import type { FC } from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  MenuItem,
  Skeleton,
  TextField,
} from '@mui/material';
import type { SxProps, Theme } from '@mui/material';
import { STILL_SKELETONS } from '../utils/motion';

/** Width of the rail marking the active entry; the idle rail is the same width,
 *  so selecting an entry never shifts its text. */
const RAIL_PX = 2;
const DEFAULT_LABEL = 'Sections';
/** Linje's `font-weight-heading`, which its docs TOC gives the active entry. */
const ACTIVE_WEIGHT = 600;

/** `list`: one entry per section, the active one railed. `dropdown`: a select
 *  whose value is the active section. */
export type SectionTocVariant = 'list' | 'dropdown';

export interface SectionTocProps {
  /** Section names, in the order they appear on the page. */
  sections: readonly string[];
  /** The section currently in view. Omitted or unknown → nothing is marked. */
  active?: string;
  /** Fired with the section the reader picked. */
  onSelect: (section: string) => void;
  /** Presentation; default `list`. */
  variant?: SectionTocVariant;
  /** Accessible name of the `<nav>` landmark, and the dropdown's field label
   *  (English default, no i18n runtime). */
  label?: string;
  /** The sections are known (from the layout) but the record is still
   *  loading: each entry is drawn as a skeleton the size of the real one, so
   *  the TOC keeps its shape instead of collapsing; nothing is pickable. */
  loading?: boolean;
  /** Applied to the `<nav>` root, after the defaults. */
  sx?: SxProps<Theme>;
}

const ITEM_SX = {
  py: 0.25,
  borderLeft: `${RAIL_PX}px solid`,
  borderColor: 'divider',
  color: 'text.secondary',
  // Linje docs TOC: the active entry is accent-coloured and bold, not only railed.
  '&.Mui-selected': {
    borderColor: 'primary.main',
    color: 'primary.main',
    backgroundColor: 'transparent',
  },
  // On the text: body2 sets its own weight, so the button's would not reach it.
  '&.Mui-selected .MuiListItemText-primary': { fontWeight: ACTIVE_WEIGHT },
  '&.Mui-selected:hover': { backgroundColor: 'action.hover' },
} as const;

/**
 * Render a list of sections as in-page navigation.
 *
 * @param props.sections section names, in page order
 * @param props.active the section currently in view
 * @param props.onSelect called with the picked section
 * @param props.variant `list` (default) or `dropdown`
 * @param props.label accessible name of the landmark; default `'Sections'`
 * @param props.loading draw each entry as a skeleton of itself, unpickable
 * @param props.sx styling for the `<nav>` root
 * @returns the navigation landmark, or `null` when there are no sections
 */
export const SectionToc: FC<SectionTocProps> = ({
  sections,
  active,
  onSelect,
  variant = 'list',
  label = DEFAULT_LABEL,
  loading = false,
  sx,
}) =>
  sections.length === 0 ? null : loading ? (
    <Box
      component="nav"
      aria-label={label}
      aria-busy="true"
      data-nmr-skeleton="toc"
      sx={[STILL_SKELETONS, ...(Array.isArray(sx) ? sx : [sx])]}
    >
      {/* Each skeleton wraps the real control, so it takes that control's size:
          the loaded TOC lands exactly where its placeholder stood. */}
      {variant === 'dropdown' ? (
        <Skeleton variant="rounded" animation="wave" width="100%">
          <TextField size="small" fullWidth label={label} />
        </Skeleton>
      ) : (
        <List dense disablePadding aria-hidden>
          {sections.map(section => (
            <ListItem key={section} disablePadding>
              <ListItemButton
                component="div"
                role="presentation"
                tabIndex={-1}
                disableRipple
                sx={ITEM_SX}
              >
                <ListItemText
                  // In a span: Skeleton hides element children, not bare text.
                  primary={
                    <Skeleton animation="wave">
                      <span>{section}</span>
                    </Skeleton>
                  }
                  slotProps={{ primary: { variant: 'body2', noWrap: true } }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  ) : (
    <Box component="nav" aria-label={label} sx={sx}>
      {variant === 'dropdown' ? (
        <TextField
          select
          fullWidth
          size="small"
          label={label}
          // Unknown or omitted `active` shows an empty field, as the list marks nothing.
          value={active && sections.includes(active) ? active : ''}
          // Reporting goes through each item's onClick, not here: a select fires
          // no change for its current value, and the list reports every pick —
          // the active one included — so the dropdown must too.
          onChange={() => {}}
        >
          {sections.map(section => (
            <MenuItem key={section} value={section} onClick={() => onSelect(section)}>
              {section}
            </MenuItem>
          ))}
        </TextField>
      ) : (
        <List dense disablePadding>
          {sections.map(section => (
            // In an <li>: the <ul> keeps its item count for assistive tech.
            <ListItem key={section} disablePadding>
              <ListItemButton
                selected={section === active}
                // "location", not "page": the entries are places within one view.
                aria-current={section === active ? 'location' : undefined}
                onClick={() => onSelect(section)}
                sx={ITEM_SX}
              >
                <ListItemText
                  primary={section}
                  slotProps={{ primary: { variant: 'body2', noWrap: true } }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
SectionToc.displayName = 'SectionToc';
