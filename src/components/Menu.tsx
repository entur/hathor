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
import MenuIcon, { type MenuIconName } from './icons/MenuIcon.tsx';
import { useOrganisations } from '../data/organisations/hooks/useOrganisations.ts';

const APP_HEADER_HEIGHT_PX = 64;
const MOBILE_DRAWER_W = 280;

// textKey values reuse existing i18n keys so labels translate without
// new entries (see feedback_i18n_reuse_keys memory).
// iconKey values map to `#menu-<iconKey>` sprite symbols (see MenuIconSprite).
const menuItems: { textKey: string; path: string; iconKey: MenuIconName; requiresOrg: boolean }[] =
  [
    { textKey: 'home', path: '/', iconKey: 'home', requiresOrg: false },
    {
      textKey: 'home.features.vehicletypes.headline',
      path: '/vehicle-types',
      iconKey: 'vehicleTypes',
      requiresOrg: true,
    },
    { textKey: 'vehicles.title', path: '/vehicles', iconKey: 'vehicles', requiresOrg: true },
    {
      textKey: 'home.features.deckplans.headline',
      path: '/deck-plans',
      iconKey: 'deckPlans',
      requiresOrg: true,
    },
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
  iconKey: MenuIconName;
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
      aria-current={active ? 'page' : undefined}
      // Always left-aligned with a fixed icon gutter: the icon sits centered in
      // the first RAIL_COLLAPSED_W px, so its position is identical whether the
      // rail is collapsed or expanded. As the width animates, the icon never
      // moves — only the trailing label fades/clips. (Centering the icon in the
      // button instead made it snap to the button's mid-point on collapse.)
      sx={{ minHeight: 48, justifyContent: 'flex-start', pl: 0, pr: 2 }}
    >
      <ListItemIcon
        sx={{
          minWidth: RAIL_COLLAPSED_W,
          mr: 0,
          justifyContent: 'center',
          // Inherit-driven colour: glyph fills with currentColor, so the
          // active item recolours to primary while others stay muted.
          color: active ? 'primary.main' : 'text.secondary',
        }}
      >
        <MenuIcon name={iconKey} size={24} />
      </ListItemIcon>
      <ListItemText
        primary={label}
        slotProps={{ primary: { noWrap: true } }}
        // Kept mounted and faded (not unmounted) so the label dissolves in sync
        // with the width transition rather than vanishing before it starts.
        sx={{ my: 0, opacity: expanded ? 1 : 0, transition: 'opacity 0.2s ease' }}
      />
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
  const { expanded, toggleExpanded, mobileOpen, closeMobile } = useNavRail();
  const { currentOrganisation } = useOrganisations();

  // ── Mobile branch — temporary Drawer, anchored left, 280px wide ──
  // Mobile open state is session-only (mobileOpen), NOT the persisted
  // desktop `expanded` flag, so a user who left the desktop rail
  // expanded does not see the mobile drawer auto-open on next visit.
  if (isMobile) {
    return (
      <StyledDrawer
        variant="temporary"
        anchor="left"
        open={mobileOpen}
        onClose={closeMobile}
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
            <NavItem key={item.path} {...item} expanded={true} onNavigate={closeMobile} />
          ))}
        </List>
      </StyledDrawer>
    );
  }

  // ── Desktop branch — persistent left rail at top:64, full height below AppBar ──
  return (
    <Box
      component="nav"
      data-testid="nav-rail"
      aria-label={t('rail.label', 'Main navigation')}
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
      {/* Toggle centered in the same RAIL_COLLAPSED_W gutter as the nav icons,
          so the hamburger shares their vertical centre-line and stays put as
          the rail animates. */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-start', py: 1 }}>
        <Box sx={{ width: RAIL_COLLAPSED_W, display: 'flex', justifyContent: 'center' }}>
          <IconButton
            data-testid="nav-rail-toggle"
            onClick={toggleExpanded}
            aria-label={
              expanded ? t('rail.collapse', 'Collapse menu') : t('rail.expand', 'Expand menu')
            }
            aria-expanded={expanded}
          >
            <MenuIcon name="menu" size={28} />
          </IconButton>
        </Box>
      </Box>
      <Divider />
      <List disablePadding>
        {menuItems
          .filter(item => !item.requiresOrg || currentOrganisation)
          .map(item => (
            <NavItem key={item.path} {...item} expanded={expanded} />
          ))}
      </List>
    </Box>
  );
}
