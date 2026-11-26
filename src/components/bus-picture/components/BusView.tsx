import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Box, ToggleButton, ToggleButtonGroup, Tooltip } from '@mui/material';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import LocationCityOutlinedIcon from '@mui/icons-material/LocationCityOutlined';
import ViewInArIcon from '@mui/icons-material/ViewInAr';
import { useTranslation } from 'react-i18next';
import type { Stage } from '@entur/iteru-3dbus';
import type { Group } from 'three';
import { REDUCED_MOTION_QUERY } from '../../../utils/motion.ts';
import { useBusShot, useStageColours } from '../hooks/useBusShot.ts';
import { mkMotion } from '../utils/busMotion.ts';
import { themeStage, type StageColours } from '../utils/stageTheme.ts';
import { CLOSER, VIEW, centredBus, type Lib, type ShotSize } from '../utils/busShots.ts';
import type { BusSpec } from '../utils/busSpec.ts';
import { DRAWN_MODES, toBusInput, type BusInput } from '../utils/standardBus.ts';
import { CompactLine, type BusPictureProps } from './BusPicture.tsx';
import { BusPictureFrame } from './BusPictureFrame.tsx';
import { StandardNote } from './StandardNote.tsx';

/** `bitmap` = the shot on the page's shared stage; `3d` = a live, orbitable canvas. */
type BusViewMode = 'bitmap' | '3d';

// The paper's shape, toolbar included: its height is the column's, its width follows.
const PAPER_ASPECT = '3 / 2';
// The switch, in its order: picture, then 3D.
const MODE_ICONS: Record<BusViewMode, ReactNode> = {
  bitmap: <ImageOutlinedIcon fontSize="small" />,
  '3d': <ViewInArIcon fontSize="small" />,
};
const MODES = Object.keys(MODE_ICONS) as BusViewMode[];
const SCENERY = 'scenery'; // the street toggle's one value

export interface BusViewProps extends BusPictureProps {
  /** Shape facts beyond the outer dims; what is missing is the standard bus's. */
  spec?: BusSpec;
  /** Stands in the full-size box instead of the bus, e.g. "Select type" (#285). */
  placeholder?: string;
  /** The bitmap's capture size in css px; a card's 400×250 by default. Drawn to cover the
   *  picture area, so match its shape and size to avoid a crop or a blur. */
  shotSize?: ShotSize;
  /** Whether the 3D bus starts on a street (a road, houses and flats); the reader can
   *  switch it. Default on. */
  scenery?: boolean;
}

/** One live stage for the canvas's life; the bus swapped per input, framed only the first time. */
function Live({
  inp,
  colours,
  scenery,
}: {
  inp: BusInput;
  colours: StageColours;
  scenery: boolean;
}) {
  const { t } = useTranslation();
  const box = useRef<HTMLDivElement>(null);
  const [lib, setLib] = useState<Lib>();
  const [failed, setFailed] = useState(false);
  const scene = useRef<{
    stage: Stage;
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
    const el = box.current;
    if (!lib || !el) return;
    let stage: Stage;
    try {
      stage = lib.mkStage(el);
    } catch {
      setFailed(true);
      return;
    }
    const s: NonNullable<typeof scene.current> = {
      stage,
      go: lib.mkViews(stage, () => s.cur ?? { group: null, len: 0 }),
      // One short ∞, then the camera rests: the reader's to orbit.
      motion: mkMotion(stage, { onLoop: () => s.motion.set('orbit') }),
      cur: null,
    };
    scene.current = s;
    return () => {
      s.motion.dispose();
      // `dispose` frees all but a bus still on stage: drop it first.
      if (s.cur) stage.drop(s.cur.group);
      // shortcut: `mkStage`'s dispose leaves its WebGL context for the GC (`mkStageShot`'s
      // forces the loss), and a browser keeps only ~16; lose it here until upstream does.
      const canvas = el.querySelector('canvas');
      const gl = canvas?.getContext('webgl2') ?? canvas?.getContext('webgl');
      stage.dispose();
      gl?.getExtension('WEBGL_lose_context')?.loseContext();
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
    // An edit keeps whatever view the reader orbited to.
    if (!first) return;
    s.go(VIEW, true);
    // As close as the bitmap, so the switch doesn't jump the bus's size.
    s.stage.cam.position.lerp(s.stage.ctl.target, CLOSER);
    if (!matchMedia(REDUCED_MOTION_QUERY).matches) s.motion.set('animate');
  }, [lib, inp]);

  // The scene is a bus's parent once added: recoloured then, and on a theme switch.
  useEffect(() => {
    const scene3d = scene.current?.cur?.group.parent;
    if (scene3d) themeStage(scene3d, colours);
  }, [lib, inp, colours]);

  // The street, built on the colours of the moment; loaded only when first shown.
  useEffect(() => {
    const s = scene.current;
    if (!lib || !s || !scenery) return;
    let street: Group | undefined;
    let live = true;
    import('../utils/scenery.ts').then(({ mkScenery }) => {
      if (!live) return;
      street = mkScenery(colours);
      s.stage.add(street);
    });
    return () => {
      live = false;
      // A stage already disposed (unmount) freed the street with it.
      if (street && scene.current === s) s.stage.drop(street);
    };
  }, [lib, scenery, colours]);

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
function Drawn({
  dims,
  paint,
  spec,
  mode,
  shotSize,
  scenery: sceneryAtStart = true,
}: BusViewProps) {
  const { t } = useTranslation();
  const colours = useStageColours();
  const [scenery, setScenery] = useState(sceneryAtStart);
  const [view, setView] = useState<BusViewMode>('bitmap');
  const { length, width, height } = dims;
  // Story controls and form pages hand a fresh `spec` object each render: key on its content.
  const specKey = JSON.stringify(spec ?? null);
  const { inp, fallback, broken } = useMemo(
    () => toBusInput({ length, width, height }, paint, spec),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `spec` is read through specKey
    [length, width, height, paint, specKey]
  );
  const shot = useBusShot(inp, shotSize, colours.ground);

  // As text: the frame's own picture would shoot again, and without the record's facts.
  if (shot === 'failed')
    return (
      <BusPictureFrame
        dims={dims}
        paint={paint}
        mode={mode}
        placeholder={t('busPicture.unavailable')}
      />
    );

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
      <Box sx={{ display: 'flex', p: 1 }}>
        {/* One white panel, full width: the note (when there is one) left, the switches right. */}
        <Box
          sx={{
            flex: 1,
            minWidth: 0,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            p: 0.5,
            borderRadius: 1,
            bgcolor: 'background.paper',
          }}
        >
          <StandardNote fallback={fallback} broken={broken} sx={{ minWidth: 0 }} />
          <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
            {view === '3d' && (
              <ToggleButtonGroup
                size="small"
                value={scenery ? [SCENERY] : []}
                onChange={(_e, v: string[]) => setScenery(v.includes(SCENERY))}
                aria-label={t('busView.scenery')}
              >
                <Tooltip title={t('busView.scenery')}>
                  <ToggleButton value={SCENERY} aria-label={t('busView.scenery')}>
                    <LocationCityOutlinedIcon fontSize="small" />
                  </ToggleButton>
                </Tooltip>
              </ToggleButtonGroup>
            )}
            <ToggleButtonGroup
              exclusive
              size="small"
              value={view}
              onChange={(_e, v: BusViewMode | null) => v && setView(v)}
              aria-label={t('busView.label')}
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
        </Box>
      </Box>
      <Box sx={{ position: 'relative', flex: 1, minHeight: 0 }}>
        {view === '3d' ? (
          <Live inp={inp} colours={colours} scenery={scenery} />
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
