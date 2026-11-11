import { useEffect, useMemo, useState } from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import WarningAmberRounded from '@mui/icons-material/WarningAmberRounded';
import { useTranslation } from 'react-i18next';
import { transportModeLabelKey, type TransportMode } from '../../../data/netex/transportMode.ts';
import { over } from '../../../utils/colorOver.ts';
import { holdBusShot } from '../utils/busShots.ts';
import { toBusInput, type BusDims, type BusInput, type BusPaint } from '../utils/standardBus.ts';

const NOTE_INSET_PX = 8; // the note's gap to the picture's edges

/** Modes the package can draw. No mode (or `UNKNOWN`) is drawn as the standard bus too. */
const DRAWN_MODES: ReadonlySet<TransportMode> = new Set(['BUS', 'COACH', 'TROLLEY_BUS', 'UNKNOWN']);

export interface BusPictureProps {
  /** Outer dims in metres; what is missing or can't be drawn comes from the standard bus. */
  dims: BusDims;
  paint: BusPaint;
  /** Anything but a bus, a coach, a trolleybus or no mode gets a line of text, no picture. */
  mode?: TransportMode | null;
}

type ShotState = { inp: BusInput; bg: string } & ({ url: string } | { failed: true });

/** The shot of the current input on the current background: its URL, `'failed'`, or
 *  `undefined` while it is queued. */
function useShot(inp: BusInput): string | 'failed' | undefined {
  const { palette } = useTheme();
  // What shows behind the picture: a card's picture area is `action.hover` on paper.
  const bg = over(palette.background.paper, palette.action.hover);
  const [shot, setShot] = useState<ShotState>();

  useEffect(() => {
    const { url, release } = holdBusShot(inp, bg);
    let live = true;
    url.then(
      u => live && setShot({ inp, bg, url: u }),
      () => live && setShot({ inp, bg, failed: true })
    );
    return () => {
      live = false;
      release();
    };
  }, [inp, bg]);

  // A changed input or background drops the old shot at once: its URL is about to be revoked.
  if (shot?.inp !== inp || shot.bg !== bg) return undefined;
  return 'url' in shot ? shot.url : 'failed';
}

/** A line of text in place of the picture; `data-card-media-compact` shrinks a card's
 *  picture area to it. */
const CompactLine = ({ children }: { children: string }) => (
  <Typography
    data-card-media-compact=""
    variant="body2"
    color="text.secondary"
    sx={{ px: 2, pb: 1.5, display: 'flex', alignItems: 'center', gap: 0.75 }}
  >
    <WarningAmberRounded fontSize="small" sx={{ color: 'warning.main' }} aria-hidden />
    {children}
  </Typography>
);

function DrawnBus({ dims, paint }: Omit<BusPictureProps, 'mode'>) {
  const { t } = useTranslation();
  const { length, width, height } = dims;
  const { inp, fallback } = useMemo(
    () => toBusInput({ length, width, height }, paint),
    [length, width, height, paint]
  );
  const src = useShot(inp);
  // Nothing drawn (no WebGL, a failed shot): say so, not which dims a drawing would have used.
  if (src === 'failed') return <CompactLine>{t('busPicture.unavailable')}</CompactLine>;
  const note =
    fallback.length > 0 &&
    t('busPicture.standard', {
      dims: fallback.map(d => t(`busPicture.dim.${d}`)).join(', '),
    });

  return (
    <>
      {src && <img src={src} alt="" />}
      {note && (
        <Box
          role="note"
          sx={{
            position: 'absolute',
            // In the part that shows: a card's reserved height cuts the picture's top.
            top: `calc(100% - 100cqh + ${NOTE_INSET_PX}px)`,
            insetInlineStart: NOTE_INSET_PX,
            maxWidth: `calc(100% - ${2 * NOTE_INSET_PX}px)`,
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            px: 1,
            py: 0.25,
            borderRadius: 1,
            bgcolor: 'background.paper',
            color: 'text.primary',
            typography: 'caption',
          }}
        >
          <WarningAmberRounded fontSize="inherit" sx={{ color: 'warning.main' }} aria-hidden />
          {note}
        </Box>
      )}
    </>
  );
}

/**
 * A record drawn as a 3D bus, for a card's picture area: an `<img>` shot on
 * the page's shared stage, and a note over it naming each dim drawn as the
 * standard bus's. A mode the package can't draw, or a picture that can't be
 * shot (no WebGL), gets a line of text instead, and the area shrinks to it.
 *
 * @param {BusPictureProps} props dims, paint and mode
 * @returns {JSX.Element} the picture and its note, or the unsupported text
 */
export function BusPicture({ mode, ...bus }: BusPictureProps) {
  const { t } = useTranslation();
  if (mode && !DRAWN_MODES.has(mode))
    return (
      <CompactLine>
        {t('busPicture.unsupported', { mode: t(transportModeLabelKey(mode)) })}
      </CompactLine>
    );
  return <DrawnBus {...bus} />;
}
