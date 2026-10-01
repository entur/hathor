import { Box, Divider, Skeleton, Typography, type Theme } from '@mui/material';
import { Fragment, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import MenuIcon, { type MenuIconName } from '../icons/MenuIcon.tsx';
import { TYPES, type CountCtx, type SiteType } from './siteTypes.ts';

/**
 * SiteNavCards — the Home dashboard's per-type navigation cards. Two layouts:
 * `combo` ({@link ComboStrip}, default) folds each type's count, browse link and
 * create action into one card; `rows` stacks the overview metric strip
 * ({@link StatStrip}), browse tiles ({@link NavGrid}) and create-new actions
 * ({@link CreateRow}). Both read the single {@link TYPES} list. Each layout is
 * exported on its own so it can be inspected in Storybook without the page hero
 * or the login/organisation gate. Domain glyphs reuse the nav rail's
 * {@link MenuIcon} sprite (`#menu-<name>`) so the cards and the side menu share
 * one iconset.
 */

// Layout tunables — bubbled per repo style.
const NAV_ICON = 30; // px; browse-tile glyph
const STAT_ICON = 20; // px; overview-strip / combo-header glyph
const ACTION_ICON = 22; // px; create-action glyph
const TILE_RADIUS = 2; // ×theme.shape.borderRadius (≈8px at the 4px default) for flat tile corners
const ROW_GAP = { xs: 4, md: 6 }; // vertical gap between rows
const COUNT_SKELETON_W = 96; // px; placeholder width while a count is pending
const CARD_GAP = 2; // ×theme.spacing; combo-strip gutter (also feeds the bus-slice offset)

// Combo backdrop — one pencil-sketch bus sliced across the cards.
const BUS_SRC = '/assets/bus-sketch-alpha.png'; // black ink on transparent (paper keyed out)
const BUS_SCALE = 1.0; // image width ÷ strip width; overflow crops freely
const BUS_Y = '75%'; // vertical anchor — badge · headlight · wheel band
const BUS_OPACITY = 0.1;

/** `?selected=new` opens the list view's sidebar editor in create mode. */
const createPath = (path: string) => `${path}?selected=new`;

type LayoutProps = { ctx: CountCtx; types?: SiteType[] };

/**
 * Overview metric strip — flat tiles separated by gaps, no borders.
 * @param {LayoutProps} props - `ctx` for the count fetchers; `types` defaults to {@link TYPES}.
 * @returns a 3-up (1-up on xs) grid of metric tiles.
 */
export function StatStrip({ ctx, types = TYPES }: LayoutProps) {
  const { t } = useTranslation();
  return (
    <Box
      component="section"
      aria-label={t('home.overview')}
      sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 2 }}
    >
      {types.map(s => (
        <Box key={s.id} sx={{ p: 2.5, borderRadius: TILE_RADIUS, bgcolor: 'action.hover' }}>
          <Box
            sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, color: 'text.secondary' }}
          >
            <MenuIcon name={s.icon} size={STAT_ICON} />
            <Typography variant="overline" sx={{ letterSpacing: '0.08em' }}>
              {t(s.statKey)}
            </Typography>
          </Box>
          <Count fn={s.count} ctx={ctx} />
        </Box>
      ))}
    </Box>
  );
}

/**
 * Browse section — headed grid of {@link NavTile}s into the list views.
 * @param {{ types?: SiteType[] }} props - `types` defaults to {@link TYPES}.
 * @returns the "Browse the registry" section.
 */
export function NavGrid({ types = TYPES }: { types?: SiteType[] }) {
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
        {types.map(n => (
          <NavTile key={n.id} to={n.path} icon={n.icon} title={t(n.titleKey)} desc={t(n.descKey)} />
        ))}
      </Box>
    </Box>
  );
}

/**
 * Create section — flat action row of {@link CreateAction}s, divided on sm+.
 * @param {{ types?: SiteType[] }} props - `types` defaults to {@link TYPES}.
 * @returns the "Create new" section.
 */
export function CreateRow({ types = TYPES }: { types?: SiteType[] }) {
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
        {types.map((c, i) => (
          <Fragment key={c.id}>
            {i > 0 && (
              <Divider
                flexItem
                orientation="vertical"
                sx={{ display: { xs: 'none', sm: 'block' } }}
              />
            )}
            <CreateAction to={createPath(c.path)} icon={c.icon} label={t(c.createKey)} />
          </Fragment>
        ))}
      </Box>
    </Box>
  );
}

/**
 * Combo strip — one {@link ComboCard} per type: count + browse link on top,
 * create action in a divided footer. 1-up below md, 3-up from md.
 * @param {LayoutProps} props - `ctx` for the count fetchers; `types` defaults to {@link TYPES}.
 * @returns the equal-height card grid.
 */
export function ComboStrip({ ctx, types = TYPES }: LayoutProps) {
  const { t } = useTranslation();
  return (
    <Box
      component="section"
      aria-label={t('home.browse')}
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: `repeat(${types.length}, 1fr)` },
        gap: CARD_GAP,
        // Container for the cards' `cqw` bus-slice math.
        containerType: 'inline-size',
      }}
    >
      {types.map((x, i) => (
        <ComboCard key={x.id} type={x} ctx={ctx} idx={i} n={types.length} />
      ))}
    </Box>
  );
}

/**
 * The Home dashboard's org-gated body.
 * @param {LayoutProps & { variant?: 'combo' | 'rows' }} props - `variant` picks the
 *   layout (default `combo`); `ctx` feeds the count fetchers.
 * @returns the combo strip, or the metric strip + browse grid + create row stacked.
 */
export default function SiteNavCards({
  variant = 'combo',
  ...rest
}: LayoutProps & { variant?: 'combo' | 'rows' }) {
  if (variant === 'combo') return <ComboStrip {...rest} />;
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: ROW_GAP }}>
      <StatStrip {...rest} />
      <NavGrid types={rest.types} />
      <CreateRow types={rest.types} />
    </Box>
  );
}

type CountState = { st: 'pending' } | { st: 'ok'; n: number } | { st: 'err' };

/** Runs a count fetcher; re-runs when `fn` or `ctx` changes, ignoring stale results. */
function useCount(fn: SiteType['count'], ctx: CountCtx): CountState {
  const [s, setS] = useState<CountState>({ st: 'pending' });
  useEffect(() => {
    let live = true;
    setS({ st: 'pending' });
    fn(ctx).then(
      n => live && setS({ st: 'ok', n }),
      () => live && setS({ st: 'err' })
    );
    return () => {
      live = false;
    };
  }, [fn, ctx]);
  return s;
}

/** A count in h4 type: Skeleton while pending, locale-formatted number, muted dash on error. */
function Count({ fn, ctx }: { fn: SiteType['count']; ctx: CountCtx }) {
  const { t, i18n } = useTranslation();
  const s = useCount(fn, ctx);
  const sx = { fontWeight: 800, lineHeight: 1 };
  if (s.st === 'pending')
    return (
      <Typography variant="h4" sx={sx} data-testid="site-count-pending">
        <Skeleton width={COUNT_SKELETON_W} />
      </Typography>
    );
  if (s.st === 'err')
    return (
      <Typography
        variant="h4"
        sx={{ ...sx, color: 'text.disabled' }}
        title={t('home.countUnavailable')}
      >
        —
      </Typography>
    );
  return (
    <Typography variant="h4" sx={sx}>
      {new Intl.NumberFormat(i18n.language).format(s.n)}
    </Typography>
  );
}

/**
 * Background-position for card `idx` of `n` so the cards read as windows onto one
 * centred, BUS_SCALE-wide bus: the image's left edge sits at -(scale-1)/2 of the
 * strip, and each column steps left by one card width + gap ((strip + gap) / n).
 */
const busSlicePos = (idx: number, n: number, gap: string) =>
  `calc(${-((BUS_SCALE - 1) / 2) * 100}cqw - ${idx} * (100cqw + ${gap}) / ${n}) ${BUS_Y}`;

/** One combo card: browse link (glyph + title, count, desc) over a divided create footer. */
function ComboCard({
  type: x,
  ctx,
  idx,
  n,
}: {
  type: SiteType;
  ctx: CountCtx;
  idx: number;
  n: number;
}) {
  const { t } = useTranslation();
  const hover = {
    transition: (theme: Theme) => theme.transitions.create('background-color', { duration: 150 }),
    '&:hover': { bgcolor: 'action.selected' },
  };
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        borderRadius: TILE_RADIUS,
        bgcolor: 'action.hover',
        overflow: 'hidden',
        position: 'relative',
        // Bus backdrop. Positioned + earlier in tree order than the (positioned)
        // links/divider, so it paints beneath them.
        '&::before': theme => ({
          content: '""',
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          backgroundImage: `url(${BUS_SRC})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: `${BUS_SCALE * 100}cqw auto`,
          // Stacked (< md): every card shows the same centred band.
          backgroundPosition: `center ${BUS_Y}`,
          [theme.breakpoints.up('md')]: {
            backgroundPosition: busSlicePos(idx, n, theme.spacing(CARD_GAP)),
          },
          opacity: BUS_OPACITY,
        }),
      }}
    >
      <Box
        component={Link}
        to={x.path}
        sx={{
          position: 'relative',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 1.25,
          p: 2.5,
          textDecoration: 'none',
          color: 'text.primary',
          ...hover,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ color: 'primary.main', display: 'flex' }}>
            <MenuIcon name={x.icon} size={STAT_ICON} />
          </Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            {t(x.titleKey)}
          </Typography>
        </Box>
        <Count fn={x.count} ctx={ctx} />
        <Typography variant="body2" color="text.secondary">
          {t(x.descKey)}
        </Typography>
      </Box>
      <Divider sx={{ position: 'relative' }} />
      <Box
        component={Link}
        to={createPath(x.path)}
        sx={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          px: 2.5,
          py: 1.5,
          textDecoration: 'none',
          color: 'primary.main',
          ...hover,
        }}
      >
        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
          + {t(x.createKey)}
        </Typography>
      </Box>
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
