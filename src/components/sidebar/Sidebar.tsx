import { Box, Drawer, useMediaQuery } from '@mui/material';
import type { Theme } from '@mui/material/styles';
import { useEditingItem, useEditorClose } from '../../contexts/EditingContext.tsx';
import { RAIL_W } from './EditorRail.tsx';
import { MIN_W, MAX_RATIO } from '../../hooks/useResizableSidebar.ts';

export type Side = 'left' | 'right';

const RESIZER_W = 3,
  RESIZER_HIT_W = 8;

interface SidebarProps {
  /** Desktop pane width as a fraction of viewport width. */
  ratio: number;
  onMouseDownResize: () => void;
  theme: Theme;
  side?: Side;
}

/**
 * Details pane as a modal Drawer (#173 modal variant): while an editor is
 * open the list behind is scrimmed and inert (MUI Modal → backdrop, focus
 * trap, `aria-hidden` siblings). Desktop and mobile share this one path;
 * mobile is full-width with no resize handle.
 *
 * @param {SidebarProps} props
 * @returns {JSX.Element}
 */
export function Sidebar({ ratio, onMouseDownResize, theme, side = 'left' }: SidebarProps) {
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { editingItem } = useEditingItem();
  const { requestClose } = useEditorClose();
  const inner = side === 'right' ? 'left' : 'right';

  return (
    <Drawer
      anchor={side}
      // URL selection is the only open-state source: no collapsed-but-selected
      // state to strand (#179 review).
      open={!!editingItem}
      // Backdrop / Escape run the editor's own guarded collapse.
      onClose={requestClose}
      variant="temporary"
      slotProps={{
        paper: {
          'data-testid': 'details-drawer',
          sx: {
            width: isMobile ? '100%' : `${ratio * 100}vw`,
            minWidth: isMobile ? undefined : MIN_W,
            maxWidth: isMobile ? undefined : `${MAX_RATIO * 100}vw`,
            boxSizing: 'border-box',
            backgroundColor: theme.palette.background.paper,
            // Portaled out of the page, so the page's rail vars don't reach
            // here: pin the EditorRail to the paper's top edge and gutter
            // the editor past it. The rail is the Drawer's close control.
            '--app-header-height': '0px',
            '--sidebar-width': '0px',
            [side === 'right' ? 'pr' : 'pl']: `${RAIL_W}px`,
          },
          // Slot typing rejects `data-*` keys in an object literal.
        } as object,
      }}
    >
      {!isMobile && (
        <Box
          onMouseDown={onMouseDownResize}
          data-testid="details-drawer-resizer"
          sx={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            [inner]: 0,
            width: RESIZER_HIT_W,
            cursor: 'ew-resize',
            zIndex: 1,
            // Visible hairline on the inner edge; the rest is hit area.
            [`border${inner === 'left' ? 'Left' : 'Right'}`]: `${RESIZER_W}px solid ${theme.palette.divider}`,
          }}
        />
      )}
      {editingItem && <editingItem.EditorComponent itemId={editingItem.id} />}
    </Drawer>
  );
}
