import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Box, ToggleButton, ToggleButtonGroup, Tooltip } from '@mui/material';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import ViewInArIcon from '@mui/icons-material/ViewInAr';
import { useTranslation } from 'react-i18next';
import { useBusShot, usePictureBg } from '../hooks/useBusShot.ts';
import { mkMotion } from '../utils/busMotion.ts';
import { themeStage } from '../utils/stageTheme.ts';
import { CLOSER, centredBus, type Lib, type ShotSize } from '../utils/busShots.ts';
import type { BusSpec } from '../utils/busSpec.ts';
import { DRAWN_MODES, toBusInput, type BusInput } from '../utils/standardBus.ts';
import type { BusPictureProps } from './BusPicture.tsx';
import { CompactLine } from './BusPicture.tsx';
import { BusPictureFrame } from './BusPictureFrame.tsx';
import { StandardNote } from './StandardNote.tsx';

/** `bitmap` = the shot on the page's shared stage; `3d` = a live, orbitable canvas. */
type BusViewMode = 'bitmap' | '3d';

const VIEW = 'quarter'; // the pose the live canvas opens on, as the shot's
// The paper's shape, toolbar included: its height is the column's, its width follows.
const PAPER_ASPECT = '3 / 2';
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';
// The switch, in its order: picture, then 3D.
const MODE_ICONS: Record<BusViewMode, ReactNode> = {
  bitmap: <ImageOutlinedIcon fontSize="small" />,
  '3d': <ViewInArIcon fontSize="small" />,
};
const MODES = Object.keys(MODE_ICONS) as BusViewMode[];

export interface BusViewProps extends BusPictureProps {
  /** Shape facts beyond the outer dims; what is missing is the standard bus's. */
  spec?: BusSpec;
  /** Stands in the full-size box instead of the bus, e.g. "Select type" (#285). */
  placeholder?: string;
  /** The bitmap's capture size in css px; a card's 400×250 by default. Drawn to cover the
   *  picture area, so match its shape and size to avoid a crop or a blur. */
  shotSize?: ShotSize;
}

/** One live stage for the canvas's life; the bus swapped per input, framed only the first time. */
function Live({ inp }: { inp: BusInput }) {
  const { t } = useTranslation();
  const bg = usePictureBg();
  const box = useRef<HTMLDivElement>(null);
  const [lib, setLib] = useState<Lib>();
  const [failed, setFailed] = useState(false);
  const scene = useRef<{
    stage: ReturnType<Lib['mkStage']>;
    go: ReturnType<Lib['mkViews']>;
    motion: ReturnType<typeof mkMotion>;
    cur: ReturnType<typeof centredBus> | null;
  }>(null);

  useEffect(() => {
    let live = true;
    import('@entur/iteru-3dbus').then(
      l => live && setLib(l),
      () => live && setFailed(true)
    );
    return () => {
      live = false;
    };
  }, []);

  useEffect(() => {
    if (!lib || !box.current) return;
    let stage: ReturnType<Lib['mkStage']>;
    try {
      stage = lib.mkStage(box.current);
    } catch {
      setFailed(true);
      return;
    }
    const s: NonNullable<typeof scene.current> = {
      stage,
      go: lib.mkViews(stage, () => s.cur ?? { group: null, len: 0 }),
      // One short ∞, then the camera rests: the reader's to orbit.
      motion: mkMotion(stage, { onTakeOver: () => undefined, onLoop: () => s.motion.set('orbit') }),
      cur: null,
    };
    scene.current = s;
    return () => {
      s.motion.dispose();
      // `dispose` frees all but a bus still on stage: drop it first.
      if (s.cur) stage.drop(s.cur.group);
      stage.dispose();
      scene.current = null;
    };
  }, [lib]);

  useEffect(() => {
    const s = scene.current;
    if (!lib || !s) return;
    const first = !s.cur;
    if (s.cur) s.stage.drop(s.cur.group);
    s.cur = centredBus(lib, inp);
    s.stage.add(s.cur.group);
    // The scene is the bus's parent once added; a theme switch re-runs this.
    if (s.cur.group.parent) themeStage(s.cur.group.parent, bg);
    // An edit keeps whatever view the reader orbited to.
    if (!first) return;
    s.go(VIEW, true);
    // As close as the bitmap, so the switch doesn't jump the bus's size.
    s.stage.cam.position.lerp(s.stage.ctl.target, CLOSER);
    if (!matchMedia(REDUCED_MOTION_QUERY).matches) s.motion.set('animate');
  }, [lib, inp, bg]);

  if (failed) return <CompactLine>{t('busView.unavailable')}</CompactLine>;
  return (
    <Box
      ref={box}
      data-bus-view="3d"
      sx={{ position: 'absolute', inset: 0, '& > canvas': { display: 'block' } }}
    />
  );
}

/**
 * A record drawn as a bus with a Bitmap | 3D switch above it, for a form page's picture
 * column. Bitmap is the shot `BusPicture` shows; 3D a live canvas that flies one short ∞
 * and is then the reader's to orbit (a grab ends the flight at once). A placeholder, a
 * mode the package can't draw, or a shot that can't be made (no WebGL) gets
 * `BusPictureFrame`'s text instead, with no switch.
 *
 * @param {BusViewProps} props dims, paint and spec, as `toBusInput`; mode and placeholder,
 *   as `BusPictureFrame`; shotSize, the bitmap's
 * @returns {JSX.Element} the switch and the bus, or the text
 */
export function BusView(props: BusViewProps) {
  const { dims, paint, mode, placeholder } = props;
  if (placeholder || (mode && !DRAWN_MODES.has(mode)))
    return <BusPictureFrame dims={dims} paint={paint} mode={mode} placeholder={placeholder} />;
  return <Drawn {...props} />;
}

/** The switch and the bus: mounted only for a view that is drawn, so no other takes a shot. */
function Drawn({ dims, paint, spec, mode, shotSize }: BusViewProps) {
  const { t } = useTranslation();
  const [view, setView] = useState<BusViewMode>('bitmap');
  const { length, width, height } = dims;
  // Story controls and form pages hand a fresh `spec` object each render: key on its content.
  const specKey = JSON.stringify(spec ?? null);
  const { inp, fallback, broken } = useMemo(
    () => toBusInput({ length, width, height }, paint, spec),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `spec` is read through specKey
    [length, width, height, paint, specKey]
  );
  const shot = useBusShot(inp, shotSize);

  if (shot === 'failed') return <BusPictureFrame dims={dims} paint={paint} mode={mode} />;

  return (
    <Box
      data-testid="bus-view"
      sx={{
        // The column's height, when it has one; else its width, and the height follows.
        height: '100%',
        maxWidth: '100%',
        aspectRatio: PAPER_ASPECT,
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 1,
        overflow: 'hidden',
        // Opaque, as BusPictureFrame: the shot is lit for `action.hover` on paper.
        background: th =>
          `linear-gradient(${th.palette.action.hover}, ${th.palette.action.hover}) ${th.palette.background.paper}`,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1 }}>
        <StandardNote fallback={fallback} broken={broken} sx={{ minWidth: 0 }} />
        <ToggleButtonGroup
          exclusive
          size="small"
          value={view}
          onChange={(_e, v: BusViewMode | null) => v && setView(v)}
          aria-label={t('busView.label')}
          sx={{ ml: 'auto' }}
        >
          {MODES.map(m => (
            <Tooltip key={m} title={t(`busView.${m}`)}>
              <ToggleButton value={m} aria-label={t(`busView.${m}`)}>
                {MODE_ICONS[m]}
              </ToggleButton>
            </Tooltip>
          ))}
        </ToggleButtonGroup>
      </Box>
      <Box sx={{ position: 'relative', flex: 1, minHeight: 0 }}>
        {view === '3d' ? (
          <Live inp={inp} />
        ) : (
          shot && (
            <Box
              component="img"
              src={shot}
              alt=""
              data-bus-view="bitmap"
              sx={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover' }}
            />
          )
        )}
      </Box>
    </Box>
  );
}
