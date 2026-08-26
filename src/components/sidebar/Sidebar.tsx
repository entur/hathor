import { Box, Drawer, useMediaQuery, IconButton, Toolbar } from '@mui/material';
import type { Theme } from '@mui/material/styles';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useEditingItem } from '../../contexts/EditingContext.tsx';

export type Side = 'left' | 'right';

interface SidebarProps {
  width: number;
  collapsed: boolean;
  onMouseDownResize: () => void;
  theme: Theme;
  toggleCollapse: () => void;
  side?: Side;
}

export function Sidebar({
  width,
  collapsed,
  onMouseDownResize,
  theme,
  toggleCollapse,
  side = 'left',
}: SidebarProps) {
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const closeIcon = side === 'left' ? <ChevronLeftIcon /> : <ChevronRightIcon />;
  const { editingItem } = useEditingItem();

  if (isMobile) {
    return (
      <Drawer
        anchor={side}
        // Gate `open` on both `!collapsed` AND a present editingItem so
        // the Drawer doesn't surface a blank pane during the frame
        // between editingItem clearing and the chrome effect collapsing.
        open={!collapsed && !!editingItem}
        onClose={toggleCollapse}
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
            },
          },
        }}
      >
        <Toolbar
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
          }}
        >
          <IconButton onClick={toggleCollapse} color="inherit" aria-label="close sidebar">
            {closeIcon}
          </IconButton>
        </Toolbar>
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
