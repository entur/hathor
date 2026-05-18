import { Box, Drawer, useMediaQuery, IconButton, Toolbar } from '@mui/material';
import SidebarContent from './SidebarContent.tsx';
import type { Theme } from '@mui/material/styles';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

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

  if (isMobile) {
    return (
      <Drawer
        anchor={side}
        open={!collapsed}
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
        <SidebarContent />
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
        {!collapsed && <SidebarContent />}
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
