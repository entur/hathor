import { useState } from 'react';
import {
  Box,
  Typography,
  Divider,
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import MenuIcon, { type MenuIconName } from '../components/icons/MenuIcon.tsx';

/**
 * Home — the registry dashboard. A flat, left-aligned layout: a typographic
 * hero band, an overview metric strip, and tile grids for browsing and
 * creating. No elevated/bordered Paper, no centered text. Domain glyphs reuse
 * the nav rail's {@link MenuIcon} sprite (`#menu-<name>`) instead of
 * @mui/icons-material so the home view and the side menu render the exact same
 * iconset.
 */

// Layout tunables — bubbled per repo style.
const CONTENT_MAX = 1180; // px; content measure for the whole dashboard
const NAV_ICON = 30; // px; browse-tile glyph
const STAT_ICON = 20; // px; overview-strip glyph
const ACTION_ICON = 22; // px; create-action glyph
const TILE_RADIUS = 2; // theme.spacing units for flat tile corners

// Overview metrics — sample figures; wire to data hooks (useVehicleTypes etc.) later.
const STATS: { labelKey: string; fallback: string; value: string; icon: MenuIconName }[] = [
  {
    labelKey: 'home.stat.vehicleTypes',
    fallback: 'Vehicle types',
    value: '142',
    icon: 'vehicleTypes',
  },
  { labelKey: 'home.stat.vehicles', fallback: 'Vehicles', value: '3 870', icon: 'vehicles' },
  { labelKey: 'home.stat.deckPlans', fallback: 'Deck plans', value: '58', icon: 'deckPlans' },
];

// Browse destinations — paths + glyphs mirror Menu.tsx (the nav rail).
const NAV: {
  titleKey: string;
  titleFallback: string;
  descKey: string;
  descFallback: string;
  path: string;
  icon: MenuIconName;
}[] = [
  {
    titleKey: 'home.features.vehicletypes.headline',
    titleFallback: 'Vehicle Types',
    descKey: 'home.features.vehicletypes.description',
    descFallback: 'A list of vehicle types used in public transport.',
    path: '/vehicle-types',
    icon: 'vehicleTypes',
  },
  {
    titleKey: 'vehicles.title',
    titleFallback: 'Vehicles',
    descKey: 'home.nav.vehicles.desc',
    descFallback: 'Individual vehicles registered in the national registry.',
    path: '/vehicles',
    icon: 'vehicles',
  },
  {
    titleKey: 'home.features.deckplans.headline',
    titleFallback: 'Deck Plans',
    descKey: 'home.features.deckplans.description',
    descFallback: 'A list of deck plans for vehicles used in public transport.',
    path: '/deck-plans',
    icon: 'deckPlans',
  },
];

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

/**
 * Registry dashboard home page.
 * @returns the flat Home dashboard view.
 */
export default function HomePage() {
  const { t } = useTranslation();
  const [comingOpen, setComingOpen] = useState(false);

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100%' }}>
      <Box
        sx={{
          maxWidth: CONTENT_MAX,
          mx: 'auto',
          px: { xs: 2, sm: 3, md: 5 },
          py: { xs: 3, md: 5 },
        }}
      >
        {/* Hero band — left aligned, no card */}
        <Box component="header" sx={{ mb: { xs: 4, md: 6 } }}>
          <Typography
            variant="overline"
            sx={{ color: 'primary.main', letterSpacing: '0.12em', fontWeight: 700 }}
          >
            {t('home.eyebrow', 'National vehicle registry')}
          </Typography>
          <Typography
            variant="h3"
            component="h1"
            sx={{ fontWeight: 800, lineHeight: 1.1, mt: 0.5, mb: 2 }}
          >
            {t('home.welcomeMessage')}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: '64ch' }}>
            {t('home.description')}
          </Typography>
        </Box>

        {/* Overview metric strip — flat tiles separated by gaps, no borders */}
        <Box
          component="section"
          aria-label={t('home.overview', 'Overview')}
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
            gap: 2,
            mb: { xs: 4, md: 6 },
          }}
        >
          {STATS.map(s => (
            <Box
              key={s.labelKey}
              sx={{ p: 2.5, borderRadius: TILE_RADIUS, bgcolor: 'action.hover' }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  mb: 1,
                  color: 'text.secondary',
                }}
              >
                <MenuIcon name={s.icon} size={STAT_ICON} />
                <Typography variant="overline" sx={{ letterSpacing: '0.08em' }}>
                  {t(s.labelKey, s.fallback)}
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 800, lineHeight: 1 }}>
                {s.value}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* Browse section */}
        <Box component="section" sx={{ mb: { xs: 4, md: 6 } }}>
          <Typography variant="h6" component="h2" sx={{ fontWeight: 700, mb: 2 }}>
            {t('home.browse', 'Browse the registry')}
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
                title={t(n.titleKey, n.titleFallback)}
                desc={t(n.descKey, n.descFallback)}
              />
            ))}
          </Box>
        </Box>

        {/* Create section — flat action row */}
        <Box component="section">
          <Typography variant="h6" component="h2" sx={{ fontWeight: 700, mb: 2 }}>
            {t('home.createNew.title', 'Create new')}
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
            <CreateAction
              to="/vehicle-types/new"
              icon="vehicleTypes"
              label={t('home.createNew.vehicleType', 'Vehicle Type')}
            />
            <Divider flexItem orientation="vertical" />
            <CreateAction
              onClick={() => setComingOpen(true)}
              icon="vehicles"
              label={t('home.createNew.train', 'Train')}
            />
            <Divider flexItem orientation="vertical" />
            <CreateAction
              onClick={() => setComingOpen(true)}
              icon="deckPlans"
              label={t('home.createNew.deckPlan', 'Deck Plan')}
            />
          </Box>
        </Box>
      </Box>

      <Dialog open={comingOpen} onClose={() => setComingOpen(false)}>
        <DialogTitle>{t('home.createNew.comingSoon', 'Coming soon')}</DialogTitle>
        <DialogActions>
          <Button onClick={() => setComingOpen(false)}>{t('close', 'Close')}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

/** One create-action cell: link (when `to`) or button (when `onClick`), flat & hover-tinted. */
function CreateAction({
  to,
  onClick,
  icon,
  label,
}: {
  to?: string;
  onClick?: () => void;
  icon: MenuIconName;
  label: string;
}) {
  const linkProps = to
    ? { component: Link, to }
    : { component: 'button' as const, type: 'button' as const, onClick };
  return (
    <Box
      {...linkProps}
      sx={{
        flex: { xs: '1 1 100%', sm: '1 1 0' },
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        p: 2.5,
        border: 0,
        font: 'inherit',
        textAlign: 'left',
        cursor: 'pointer',
        textDecoration: 'none',
        color: 'text.primary',
        bgcolor: 'transparent',
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
