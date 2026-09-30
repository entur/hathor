import { Box, Drawer, useMediaQuery } from '@mui/material';
import type { Theme } from '@mui/material/styles';
import { useEditingItem, useEditorClose } from '../../contexts/EditingContext.tsx';
import { RAIL_W } from './EditorRail.tsx';

export type Side = 'left' | 'right';

interface SidebarProps {
  width: number;
  collapsed: boolean;
  onMouseDownResize: () => void;
  theme: Theme;
  side?: Side;
}

export function Sidebar({
  width,
  collapsed,
  onMouseDownResize,
  theme,
  side = 'left',
}: SidebarProps) {
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { editingItem } = useEditingItem();
  const { requestClose } = useEditorClose();

  if (isMobile) {
    return (
      <Drawer
        anchor={side}
        // URL selection is the only open-state source on mobile: the Drawer
        // has no collapsed-but-selected state to strand (#179 review).
        open={!!editingItem}
        // Backdrop / Escape run the editor's own guarded collapse.
        onClose={requestClose}
        variant="temporary"
        ModalProps={{
          keepMounted: true,
        }}
        slotProps={{
          paper: {
            sx: {
              width: '100%',
              boxSizing: 'border-box',
              backgroundColor: theme.palette.background.paper,
              // Portaled out of the page, so the page's rail vars don't reach
              // here: pin the EditorRail to the paper's top edge and gutter
              // the editor past it. The rail is the Drawer's close control.
              '--app-header-height': '0px',
              '--sidebar-width': '0px',
              [side === 'right' ? 'pr' : 'pl']: `${RAIL_W}px`,
            },
          },
        }}
      >
        {editingItem && <editingItem.EditorComponent itemId={editingItem.id} />}
      </Drawer>
    );
  }

  return (
    <>
      <Box
        className="sidebar-desktop"
        sx={{
          position: 'absolute',
          top: 0,
          [side]: 0,
          bottom: 0,
          width: collapsed ? 0 : width,
          minWidth: collapsed ? 0 : 100,
          backgroundColor: theme.palette.background.paper,
          zIndex: 30,
          overflow: 'hidden',
        }}
      >
        {!collapsed && editingItem && <editingItem.EditorComponent itemId={editingItem.id} />}
      </Box>

      {!collapsed && (
        <Box
          onMouseDown={onMouseDownResize}
          className="resizer-desktop"
          sx={{
            position: 'absolute',
            top: 0,
            [side]: width,
            bottom: 0,
            width: '3px',
            cursor: 'ew-resize',
            backgroundColor: theme.palette.divider,
            zIndex: 20,
          }}
        />
      )}
    </>
  );
}
