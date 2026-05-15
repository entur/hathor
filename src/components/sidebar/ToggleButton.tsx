import { Box, IconButton, useTheme } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';

interface ToggleButtonProps {
  collapsed: boolean;
  sidebarWidth: number;
  onClick: () => void;
  side?: 'left' | 'right';
}

export function ToggleButton({
  collapsed,
  sidebarWidth,
  onClick,
  side = 'left',
}: ToggleButtonProps) {
  const theme = useTheme();
  const offset = collapsed ? theme.spacing(0) : `calc(${sidebarWidth}px + ${theme.spacing(0)})`;
  const borderRadius = side === 'left' ? '0 4px 4px 0' : '4px 0 0 4px';
  const collapsedIcon = side === 'left' ? <ChevronRight /> : <ChevronLeft />;
  const expandedIcon = side === 'left' ? <ChevronLeft /> : <ChevronRight />;

  return (
    <Box
      onClick={onClick}
      className="toggle-button"
      sx={{
        top: theme.spacing(0),
        [side]: offset,
        borderRadius,
        zIndex: theme.zIndex.fab,
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[3],
        transition: theme.transitions.create(['transform', 'box-shadow', 'background-color'], {
          duration: theme.transitions.duration.short,
          easing: theme.transitions.easing.easeInOut,
        }),
        '&:hover': {
          transform: 'scale(1.1)',
          boxShadow: theme.shadows[6],
        },
      }}
    >
      <IconButton size="small" aria-label={collapsed ? 'Open sidebar' : 'Close sidebar'}>
        {collapsed ? collapsedIcon : expandedIcon}
      </IconButton>
    </Box>
  );
}
