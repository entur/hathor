import { Link, useLocation } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Tooltip,
  useTheme,
  useMediaQuery,
  IconButton,
  Divider,
  styled,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavRail, RAIL_COLLAPSED_W, RAIL_EXPANDED_W } from '../contexts/NavRailContext.tsx';
import { getIconUrl } from '../utils/iconLoaderUtils.ts';

const APP_HEADER_HEIGHT_PX = 64;
const MOBILE_DRAWER_W = 280;

const menuItems = [
  { textKey: 'home', path: '/', iconKey: 'home' },
  { textKey: 'Vehicle Types', path: '/vehicle-types', iconKey: 'product' },
  { textKey: 'Vehicles', path: '/vehicles', iconKey: 'train' },
  { textKey: 'Deck Plans', path: '/deck-plans', iconKey: 'map' },
];

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    boxSizing: 'border-box',
    backgroundColor: theme.palette.background.paper,
    transition: theme.transitions.create(['width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
}));

function isActive(pathname: string, path: string): boolean {
  if (path === '/') return pathname === '/';
  return pathname === path || pathname.startsWith(path + '/');
}

interface NavItemProps {
  textKey: string;
  path: string;
  iconKey: string;
  expanded: boolean;
  onNavigate?: () => void;
}

function NavItem({ textKey, path, iconKey, expanded, onNavigate }: NavItemProps) {
  const { t } = useTranslation();
  const location = useLocation();
  const active = isActive(location.pathname, path);
  const label = t(textKey);

  const button = (
    <ListItemButton
      component={Link}
      to={path}
      onClick={onNavigate}
      selected={active}
      sx={{ minHeight: 48, justifyContent: expanded ? 'flex-start' : 'center' }}
    >
      <ListItemIcon sx={{ minWidth: 0, mr: expanded ? 2 : 0, justifyContent: 'center' }}>
        <Box component="img" src={getIconUrl(iconKey)} alt={label} sx={{ width: 24, height: 24 }} />
      </ListItemIcon>
      {expanded && <ListItemText primary={label} />}
    </ListItemButton>
  );

  return (
    <Tooltip title={expanded ? '' : label} placement="right">
      <ListItem disablePadding>{button}</ListItem>
    </Tooltip>
  );
}

export default function Menu() {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { expanded, toggle } = useNavRail();

  // ── Mobile branch — temporary Drawer, anchored left, 280px wide ──
  if (isMobile) {
    return (
      <StyledDrawer
        variant="temporary"
        anchor="left"
        open={expanded}
        onClose={toggle}
        ModalProps={{ keepMounted: true }}
        slotProps={{
          paper: {
            sx: {
              width: MOBILE_DRAWER_W,
              borderRight: 'none',
            },
          },
        }}
      >
        <List disablePadding>
          {menuItems.map(item => (
            <NavItem key={item.path} {...item} expanded={true} onNavigate={toggle} />
          ))}
        </List>
      </StyledDrawer>
    );
  }

  // ── Desktop branch — persistent left rail at top:64, full height below AppBar ──
  return (
    <Box
      component="aside"
      data-testid="nav-rail"
      sx={{
        position: 'fixed',
        top: APP_HEADER_HEIGHT_PX,
        left: 0,
        bottom: 0,
        width: expanded ? RAIL_EXPANDED_W : RAIL_COLLAPSED_W,
        backgroundColor: theme.palette.background.paper,
        borderRight: `1px solid ${theme.palette.divider}`,
        transition: 'width 0.2s ease',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        zIndex: theme.zIndex.appBar - 1,
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 1 }}>
        <IconButton
          data-testid="nav-rail-toggle"
          onClick={toggle}
          aria-label={t('header.actions.menu', 'menu')}
          aria-expanded={expanded}
        >
          <Box
            component="img"
            src={getIconUrl('menu')}
            alt={t('header.actions.menuIconAlt', 'menu icon')}
            sx={{ width: 28, height: 28 }}
          />
        </IconButton>
      </Box>
      <Divider />
      <List disablePadding>
        {menuItems.map(item => (
          <NavItem key={item.path} {...item} expanded={expanded} />
        ))}
      </List>
    </Box>
  );
}
