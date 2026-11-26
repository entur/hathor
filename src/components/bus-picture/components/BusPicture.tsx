import { useMemo } from 'react';
import { Typography } from '@mui/material';
import WarningAmberRounded from '@mui/icons-material/WarningAmberRounded';
import { useTranslation } from 'react-i18next';
import { transportModeLabelKey, type TransportMode } from '../../../data/netex/transportMode.ts';
import { useBusShot } from '../hooks/useBusShot.ts';
import { DRAWN_MODES, toBusInput, type BusDims, type BusPaint } from '../utils/standardBus.ts';
import { StandardNote } from './StandardNote.tsx';

const NOTE_INSET_PX = 8; // the note's gap to the picture's edges

export interface BusPictureProps {
  /** Outer dims in metres; what is missing or can't be drawn comes from the standard bus. */
  dims: BusDims;
  paint: BusPaint;
  /** Anything but a bus, a coach, a trolleybus or no mode gets a line of text, no picture. */
  mode?: TransportMode | null;
}

/** A line of text in place of the picture; `data-card-media-compact` shrinks a card's
 *  picture area to it. */
export const CompactLine = ({ children }: { children: string }) => (
  <Typography
    data-card-media-compact=""
    variant="body2"
    sx={{
      color: 'text.secondary',
      px: 2,
      pb: 1.5,
      display: 'flex',
      alignItems: 'center',
      gap: 0.75,
    }}
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
  const src = useBusShot(inp);
  // Nothing drawn (no WebGL, a failed shot): say so, not which dims a drawing would have used.
  if (src === 'failed') return <CompactLine>{t('busPicture.unavailable')}</CompactLine>;

  return (
    <>
      {src && <img src={src} alt="" />}
      <StandardNote
        fallback={fallback}
        sx={{
          position: 'absolute',
          // In the part that shows: a card's reserved height cuts the picture's top.
          top: `calc(100% - 100cqh + ${NOTE_INSET_PX}px)`,
          insetInlineStart: NOTE_INSET_PX,
          maxWidth: `calc(100% - ${2 * NOTE_INSET_PX}px)`,
        }}
      />
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
