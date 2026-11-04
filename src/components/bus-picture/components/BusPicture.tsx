import { useEffect, useMemo, useState } from 'react';
import { Box, Typography, decomposeColor, useTheme } from '@mui/material';
import WarningAmberRounded from '@mui/icons-material/WarningAmberRounded';
import { useTranslation } from 'react-i18next';
import { transportModeLabelKey, type TransportMode } from '../../../data/netex/transportMode.ts';
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

/** `top` over the `bottom` paper, as one opaque `rgb()` (the stage reads it for its light). */
const onPaper = (top: string, bottom: string): string => {
  const t = decomposeColor(top).values,
    b = decomposeColor(bottom).values;
  const a = t[3] ?? 1;
  return `rgb(${[0, 1, 2].map(i => Math.round(t[i] * a + b[i] * (1 - a))).join(', ')})`;
};

/** The shot, once it is the shot of the current input. */
function useShot(inp: BusInput): string | undefined {
  const { palette } = useTheme();
  // What shows behind the picture: a big card's picture area is `action.hover` on paper.
  const bg = onPaper(palette.action.hover, palette.background.paper);
  const [shot, setShot] = useState<{ inp: BusInput; url: string }>();

  useEffect(() => {
    const { url, release } = holdBusShot(inp, bg);
    let live = true;
    url.then(
      u => live && setShot({ inp, url: u }),
      () => live && setShot(undefined)
    );
    return () => {
      live = false;
      release();
    };
  }, [inp, bg]);

  // A changed input drops the old shot at once: its URL is about to be revoked.
  return shot?.inp === inp ? shot.url : undefined;
}

function DrawnBus({ dims, paint }: Omit<BusPictureProps, 'mode'>) {
  const { t } = useTranslation();
  const { length, width, height } = dims;
  const { inp, fallback } = useMemo(
    () => toBusInput({ length, width, height }, paint),
    [length, width, height, paint]
  );
  const src = useShot(inp);
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
 * A record drawn as a 3D bus, for a big card's picture area: an `<img>` shot on
 * the page's shared stage, and a note over it naming each dim drawn as the
 * standard bus's (shown also when the picture can't be drawn). A mode the
 * package can't draw gets a line of text instead, and the area shrinks to it.
 *
 * @param {BusPictureProps} props dims, paint and mode
 * @returns {JSX.Element} the picture and its note, or the unsupported text
 */
export function BusPicture({ mode, ...bus }: BusPictureProps) {
  const { t } = useTranslation();
  if (mode && !DRAWN_MODES.has(mode))
    return (
      // `data-card-media-compact`: the big card's picture area shrinks to this text.
      <Typography
        data-card-media-compact=""
        variant="body2"
        color="text.secondary"
        sx={{ px: 2, pt: 1.5, display: 'flex', alignItems: 'center', gap: 0.75 }}
      >
        <WarningAmberRounded fontSize="small" sx={{ color: 'warning.main' }} aria-hidden />
        {t('busPicture.unsupported', { mode: t(transportModeLabelKey(mode)) })}
      </Typography>
    );
  return <DrawnBus {...bus} />;
}
