import { Box, Divider, Typography } from '@mui/material';
import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import MenuIcon, { type MenuIconName } from '../icons/MenuIcon.tsx';

/**
 * SiteNavCards — the Home dashboard's three card rows: an overview metric
 * strip ({@link StatStrip}), browse tiles into the list views ({@link NavGrid})
 * and create-new actions ({@link CreateRow}). Each row is exported on its own so
 * it can be inspected in Storybook without the page hero or the
 * login/organisation gate. Domain glyphs reuse the nav rail's {@link MenuIcon}
 * sprite (`#menu-<name>`) so the cards and the side menu share one iconset.
 */

// Layout tunables — bubbled per repo style.
const NAV_ICON = 30; // px; browse-tile glyph
const STAT_ICON = 20; // px; overview-strip glyph
const ACTION_ICON = 22; // px; create-action glyph
const TILE_RADIUS = 2; // ×theme.shape.borderRadius (≈8px at the 4px default) for flat tile corners
const ROW_GAP = { xs: 4, md: 6 }; // vertical gap between rows

// Overview metrics — sample figures; wire to data hooks (useVehicleTypes etc.) later.
const STATS: { labelKey: string; value: string; icon: MenuIconName }[] = [
  { labelKey: 'home.stat.vehicleTypes', value: '142', icon: 'vehicleTypes' },
  { labelKey: 'home.stat.vehicles', value: '3 870', icon: 'vehicles' },
  { labelKey: 'home.stat.deckPlans', value: '58', icon: 'deckPlans' },
];

// Browse destinations — paths + glyphs mirror Menu.tsx (the nav rail).
const NAV: { titleKey: string; descKey: string; path: string; icon: MenuIconName }[] = [
  {
    titleKey: 'home.features.vehicletypes.headline',
    descKey: 'home.features.vehicletypes.description',
    path: '/vehicle-types',
    icon: 'vehicleTypes',
  },
  {
    titleKey: 'vehicles.title',
    descKey: 'home.nav.vehicles.desc',
    path: '/vehicles',
    icon: 'vehicles',
  },
  {
    titleKey: 'home.features.deckplans.headline',
    descKey: 'home.features.deckplans.description',
    path: '/deck-plans',
    icon: 'deckPlans',
  },
];

// Create actions — `?selected=new` opens each list view's sidebar editor in create mode.
const CREATE: { labelKey: string; path: string; icon: MenuIconName }[] = [
  {
    labelKey: 'home.createNew.vehicleType',
    path: '/vehicle-types?selected=new',
    icon: 'vehicleTypes',
  },
  { labelKey: 'home.createNew.vehicle', path: '/vehicles?selected=new', icon: 'vehicles' },
  { labelKey: 'home.createNew.deckPlan', path: '/deck-plans?selected=new', icon: 'deckPlans' },
];

/**
 * Overview metric strip — flat tiles separated by gaps, no borders.
 * @returns a 3-up (1-up on xs) grid of metric tiles.
 */
export function StatStrip() {
  const { t } = useTranslation();
  return (
    <Box
      component="section"
      aria-label={t('home.overview')}
      sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 2 }}
    >
      {STATS.map(s => (
        <Box key={s.labelKey} sx={{ p: 2.5, borderRadius: TILE_RADIUS, bgcolor: 'action.hover' }}>
          <Box
            sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, color: 'text.secondary' }}
          >
            <MenuIcon name={s.icon} size={STAT_ICON} />
            <Typography variant="overline" sx={{ letterSpacing: '0.08em' }}>
              {t(s.labelKey)}
            </Typography>
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 800, lineHeight: 1 }}>
            {s.value}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}

/**
 * Browse section — headed grid of {@link NavTile}s into the list views.
 * @returns the "Browse the registry" section.
 */
export function NavGrid() {
  const { t } = useTranslation();
  return (
    <Box component="section">
      <Typography variant="h6" component="h2" sx={{ fontWeight: 700, mb: 2 }}>
        {t('home.browse')}
      </Typography>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
          gap: 2,
        }}
      >
        {NAV.map(n => (
          <NavTile
            key={n.path}
            to={n.path}
            icon={n.icon}
            title={t(n.titleKey)}
            desc={t(n.descKey)}
          />
        ))}
      </Box>
    </Box>
  );
}

/**
 * Create section — flat action row of {@link CreateAction}s, divided on sm+.
 * @returns the "Create new" section.
 */
export function CreateRow() {
  const { t } = useTranslation();
  return (
    <Box component="section">
      <Typography variant="h6" component="h2" sx={{ fontWeight: 700, mb: 2 }}>
        {t('home.createNew.title')}
      </Typography>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'stretch',
          borderRadius: TILE_RADIUS,
          bgcolor: 'action.hover',
          overflow: 'hidden',
        }}
      >
        {CREATE.map((c, i) => (
          <Fragment key={c.path}>
            {i > 0 && (
              <Divider
                flexItem
                orientation="vertical"
                sx={{ display: { xs: 'none', sm: 'block' } }}
              />
            )}
            <CreateAction to={c.path} icon={c.icon} label={t(c.labelKey)} />
          </Fragment>
        ))}
      </Box>
    </Box>
  );
}

/**
 * All three rows stacked — the Home dashboard's org-gated body.
 * @returns the metric strip, browse grid and create row in a column.
 */
export default function SiteNavCards() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: ROW_GAP }}>
      <StatStrip />
      <NavGrid />
      <CreateRow />
    </Box>
  );
}

/** One flat browse tile: sprite glyph + title + caption, hover-tinted, links to a view. */
function NavTile({
  to,
  icon,
  title,
  desc,
}: {
  to: string;
  icon: MenuIconName;
  title: string;
  desc: string;
}) {
  return (
    <Box
      component={Link}
      to={to}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 1.25,
        p: 2.5,
        borderRadius: TILE_RADIUS,
        textDecoration: 'none',
        color: 'text.primary',
        bgcolor: 'action.hover',
        transition: theme =>
          theme.transitions.create(['background-color', 'transform'], { duration: 150 }),
        '&:hover': { bgcolor: 'action.selected', transform: 'translateY(-2px)' },
      }}
    >
      <Box sx={{ color: 'primary.main', display: 'flex' }}>
        <MenuIcon name={icon} size={NAV_ICON} />
      </Box>
      <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {desc}
      </Typography>
    </Box>
  );
}

/** One create-action cell: flat, hover-tinted link. */
function CreateAction({ to, icon, label }: { to: string; icon: MenuIconName; label: string }) {
  return (
    <Box
      component={Link}
      to={to}
      sx={{
        flex: { xs: '1 1 100%', sm: '1 1 0' },
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        p: 2.5,
        textDecoration: 'none',
        color: 'text.primary',
        transition: theme => theme.transitions.create('background-color', { duration: 150 }),
        '&:hover': { bgcolor: 'action.selected' },
      }}
    >
      <Box sx={{ color: 'primary.main', display: 'flex' }}>
        <MenuIcon name={icon} size={ACTION_ICON} />
      </Box>
      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
        {label}
      </Typography>
    </Box>
  );
}
