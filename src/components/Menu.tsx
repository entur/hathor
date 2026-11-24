import { Link, useLocation } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  useTheme,
  useMediaQuery,
  styled,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavRail, RAIL_W } from '../contexts/NavRailContext.tsx';
import MenuIcon, { type MenuIconName } from './icons/MenuIcon.tsx';
import { useOrganisationsContext } from '../contexts/useOrganisationsContext.ts';
import { useIsFeatureOn, type FeatureFlag } from '../config/featureFlags.ts';

export const APP_HEADER_HEIGHT_PX = 64;
// Linje SideNavigation (`menu/src/SideNavigation.scss`, `--components-menu-sidenavigation-standard-*`,
// #418): tint background, subdued hover, neutral divider under each item, 4 px accent bar on the
// active one. Item padding 16 / 40, icon 16 px (1em of the 16 px label) with a 16 px gap.
const RAIL_BG = '#f2f5f7', // Fill/Background/Tint/Neutral
  ITEM_HOVER = '#d9dae8', // Fill/Background/Subdued/Light
  ITEM_DIVIDE = '#e3e6e8'; // Stroke/Neutral
// The drawer leaves the scrim this wide to tap on a narrow phone.
const DRAWER_SCRIM_PX = 56;
const ACTIVE_BAR_PX = 4,
  ITEM_PAD_Y_PX = 16,
  ITEM_PAD_X_PX = 40,
  NAV_ICON_PX = 16,
  ICON_GAP_PX = 16;

// textKey values reuse existing i18n keys so labels translate without
// new entries (see feedback_i18n_reuse_keys memory).
// iconKey values map to `#menu-<iconKey>` sprite symbols (see MenuIconSprite).
// flag hides the item unless that sandboxFeatures key is on in config.json.
type MenuItem = {
  textKey: string;
  path: string;
  iconKey: MenuIconName;
  requiresOrg: boolean;
  flag?: FeatureFlag;
};

const menuItems: MenuItem[] = [
  { textKey: 'home', path: '/', iconKey: 'home', requiresOrg: false },
  {
    textKey: 'contractualVehicleTypes.menu',
    path: '/contractual-vehicle-types',
    iconKey: 'contractualVehicleTypes',
    requiresOrg: true,
  },
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
    flag: 'DeckPlans',
  },
];

const StyledDrawer = styled(Drawer)({
  '& .MuiDrawer-paper': { boxSizing: 'border-box', backgroundColor: RAIL_BG },
});

function isActive(pathname: string, path: string): boolean {
  if (path === '/') return pathname === '/';
  return pathname === path || pathname.startsWith(path + '/');
}

interface NavItemProps {
  textKey: string;
  path: string;
  iconKey: MenuIconName;
  onNavigate?: () => void;
}

function NavItem({ textKey, path, iconKey, onNavigate }: NavItemProps) {
  const { t } = useTranslation();
  const location = useLocation();
  const active = isActive(location.pathname, path);

  return (
    <ListItem disablePadding>
      <ListItemButton
        component={Link}
        to={path}
        onClick={onNavigate}
        selected={active}
        aria-current={active ? 'page' : undefined}
        sx={{
          py: `${ITEM_PAD_Y_PX}px`,
          px: `${ITEM_PAD_X_PX}px`,
          color: 'primary.main',
          borderBottom: `1px solid ${ITEM_DIVIDE}`,
          '&:hover, &.Mui-selected:hover': { backgroundColor: ITEM_HOVER },
          '&.Mui-selected': {
            backgroundColor: 'transparent',
            boxShadow: theme => `inset ${ACTIVE_BAR_PX}px 0 0 ${theme.palette.primary.main}`,
          },
        }}
      >
        <ListItemIcon sx={{ minWidth: NAV_ICON_PX + ICON_GAP_PX, color: 'primary.main' }}>
          <MenuIcon name={iconKey} size={NAV_ICON_PX} />
        </ListItemIcon>
        <ListItemText
          primary={t(textKey)}
          sx={{ my: 0 }}
          slotProps={{
            primary: { noWrap: true, sx: { fontWeight: active ? 'fontWeightBold' : undefined } },
          }}
        />
      </ListItemButton>
    </ListItem>
  );
}

export default function Menu() {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { mobileOpen, closeMobile } = useNavRail();
  const { currentOrganisation } = useOrganisationsContext();
  const isFeatureOn = useIsFeatureOn();
  const items = menuItems.filter(item => isFeatureOn(item.flag));

  // Mobile: a temporary Drawer, opened by the header's menu button.
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
              width: RAIL_W,
              maxWidth: `calc(100% - ${DRAWER_SCRIM_PX}px)`,
              borderRight: 'none',
            },
          },
        }}
      >
        <List disablePadding>
          {items.map(item => (
            <NavItem key={item.path} {...item} onNavigate={closeMobile} />
          ))}
        </List>
      </StyledDrawer>
    );
  }

  // Desktop: Linje's SideNavigation, always open, fixed below the AppBar.
  return (
    <Box
      component="nav"
      data-testid="nav-rail"
      aria-label={t('rail.label')}
      sx={{
        position: 'fixed',
        top: APP_HEADER_HEIGHT_PX,
        left: 0,
        bottom: 0,
        width: RAIL_W,
        backgroundColor: RAIL_BG,
        overflowY: 'auto',
        zIndex: theme.zIndex.appBar - 1,
      }}
    >
      <List disablePadding>
        {items
          .filter(item => !item.requiresOrg || currentOrganisation)
          .map(item => (
            <NavItem key={item.path} {...item} />
          ))}
      </List>
    </Box>
  );
}
