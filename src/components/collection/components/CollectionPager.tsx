/**
 * The pager under both views — Linje's `Pagination` (@entur/menu) rebuilt with
 * MUI: its markup (one <nav>: the rows shown with a rows-per-page menu, then the
 * page buttons) and its stylesheet. Colours come from the theme, which is set per
 * installation: on hathor's Entur themes `primary` is Linje's accent (#181c56) and
 * `action.active` its selected fill (#aeb7e2). MUI's `usePagination` lists the
 * pages; its default (one boundary, one sibling) is Linje's ellipsis rule.
 * Source: entur/design-system packages/menu/src/Pagination.*
 */
import { useId, useState } from 'react';
import { Box, Menu, MenuItem, Typography } from '@mui/material';
import usePagination from '@mui/material/usePagination';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { SR_ONLY } from '../../../utils/srOnly.ts';
import { pageSizesFor, type CollectionLabels, type CollectionQuery } from '../types.ts';

// Linje's pager sizes (tokens named on the right).
const PAGE_PX = 32, // --space-extra-large
  ELLIPSIS_FONT_PX = 24, // --font-sizes-extra-large2
  FOCUS_PX = 2, // outlines.focus, outlineOffsets.focus
  FAST_S = 0.1; // timings.fast

const PAGE_SX = {
  appearance: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: PAGE_PX,
  minWidth: PAGE_PX,
  mx: '2px',
  px: '4px',
  border: '1px solid transparent',
  borderRadius: 1,
  bgcolor: 'transparent',
  color: 'primary.main',
  font: 'inherit',
  typography: 'body2',
  cursor: 'pointer',
  userSelect: 'none',
  transition: `background ${FAST_S}s ease-out, border-color ${FAST_S}s ease-out`,
  '&:hover': { bgcolor: 'action.hover' },
  '&:focus-visible': {
    outline: `${FOCUS_PX}px solid`,
    outlineColor: 'primary.main',
    outlineOffset: FOCUS_PX,
  },
  // As Linje: no hover on the current page (it stays focusable by keyboard).
  '&[aria-current="page"]': {
    bgcolor: 'action.active',
    borderColor: 'primary.main',
    pointerEvents: 'none',
  },
  '&[aria-disabled="true"]': { opacity: 0.5, cursor: 'default' },
} as const;

const ELLIPSIS_SX = {
  display: 'flex',
  alignItems: 'baseline',
  justifyContent: 'center',
  width: PAGE_PX,
  height: PAGE_PX,
  mx: '2px',
  color: 'primary.main',
  fontSize: ELLIPSIS_FONT_PX,
  lineHeight: `${PAGE_PX}px`,
  cursor: 'default',
  userSelect: 'none',
} as const;

export interface CollectionPagerProps {
  /** Rows after filter + search, before paging. */
  total: number;
  /** Clamped page index (0-based). */
  page: number;
  pageSize: number;
  onQuery: (patch: Partial<CollectionQuery>) => void;
  labels: CollectionLabels;
}

/**
 * Render the pager; nothing when there are no rows.
 *
 * @param total    rows after filter + search
 * @param page     current page index, 0-based
 * @param pageSize rows per page
 * @param onQuery  receives `{ page }` or `{ pageSize }`
 * @param labels   UI strings
 * @returns the pager <nav>, or `null`
 */
export function CollectionPager({ total, page, pageSize, onQuery, labels }: CollectionPagerProps) {
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const currentId = useId();
  const count = Math.ceil(total / pageSize);
  const { items } = usePagination({
    count,
    page: page + 1,
    onChange: (_e, next) => onQuery({ page: next - 1 }),
  });
  if (total === 0) return null;

  // The arrows' names and icons; a number button is named for its page.
  const arrows = {
    previous: { name: labels.previousPage, icon: <ChevronLeftIcon fontSize="small" aria-hidden /> },
    next: { name: labels.nextPage, icon: <ChevronRightIcon fontSize="small" aria-hidden /> },
  } as const;
  const pageName = (n: number): string =>
    `${labels.goToPage(n)}${n === count ? labels.lastPage : ''}`;

  return (
    <Box
      component="nav"
      aria-label={labels.pagination}
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        rowGap: 1.5,
      }}
    >
      <Box sx={{ display: 'flex', flex: 1, alignItems: 'center', mr: 1, color: 'text.secondary' }}>
        <Typography variant="body2" aria-hidden="true">
          {labels.rowsPerPage}
        </Typography>
        <Box
          component="button"
          type="button"
          aria-label={labels.rowsPerPageMenu(pageSize)}
          aria-haspopup="menu"
          aria-expanded={!!menuAnchor}
          onClick={e => setMenuAnchor(e.currentTarget)}
          sx={{ ...PAGE_SX, mx: 1, px: 1, gap: 1, borderColor: 'divider' }}
        >
          {pageSize}
          <KeyboardArrowDownIcon
            fontSize="small"
            aria-hidden
            sx={{ transform: menuAnchor ? 'rotate(180deg)' : undefined }}
          />
        </Box>
        <Menu anchorEl={menuAnchor} open={!!menuAnchor} onClose={() => setMenuAnchor(null)}>
          {pageSizesFor(pageSize).map(size => (
            <MenuItem
              key={size}
              selected={size === pageSize}
              onClick={() => {
                setMenuAnchor(null);
                // A size change starts over on page 1; the same size keeps the page.
                if (size !== pageSize) onQuery({ pageSize: size });
              }}
            >
              {size}
            </MenuItem>
          ))}
        </Menu>
        <Typography variant="body2">
          {labels.showingRows(page * pageSize + 1, Math.min((page + 1) * pageSize, total), total)}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {items.map(({ type, page: n, selected, disabled, onClick }, i) => {
          if (type.endsWith('ellipsis')) {
            return (
              <Box key={`${type}-${i}`} component="span" aria-hidden="true" sx={ELLIPSIS_SX}>
                …
              </Box>
            );
          }
          const arrow = type === 'previous' || type === 'next' ? arrows[type] : undefined;
          return (
            <Box
              // An arrow keeps one node as its target page moves, so focus stays on it.
              key={arrow ? type : `${type}-${n}`}
              component="button"
              type="button"
              aria-label={arrow ? arrow.name : pageName(n ?? 0)}
              aria-current={selected ? 'page' : undefined}
              aria-describedby={selected ? undefined : currentId}
              // Never `disabled` (unlike Linje): browsers blur a button that turns disabled.
              aria-disabled={disabled || undefined}
              onClick={selected || disabled ? undefined : onClick}
              sx={PAGE_SX}
            >
              {arrow ? arrow.icon : n}
            </Box>
          );
        })}
      </Box>
      <Box component="span" id={currentId} sx={SR_ONLY}>
        {labels.currentPage} {page + 1}
      </Box>
    </Box>
  );
}
