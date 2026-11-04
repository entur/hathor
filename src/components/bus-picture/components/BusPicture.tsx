import { useEffect, useMemo, useState } from 'react';
import { Box, useTheme } from '@mui/material';
import WarningAmberRounded from '@mui/icons-material/WarningAmberRounded';
import { useTranslation } from 'react-i18next';
import { holdBusShot } from '../utils/busShots.ts';
import { toBusInput, type BusDims, type BusPaint } from '../utils/standardBus.ts';

export interface BusPictureProps {
  /** Outer dims in metres; what is missing or can't be drawn comes from the standard bus. */
  dims: BusDims;
  paint: BusPaint;
}

/**
 * A record drawn as a 3D bus, for a big card's picture area: an `<img>` shot on
 * the page's shared stage, and a note over it naming each dim drawn as the
 * standard bus's. The note shows also when the picture can't be drawn.
 *
 * @param {BusPictureProps} props dims and paint
 * @returns {JSX.Element} the picture and, when a dim is the default, the note
 */
export function BusPicture({ dims, paint }: BusPictureProps) {
  const { t } = useTranslation();
  const bg = useTheme().palette.background.paper;
  const { length, width, height } = dims;
  const { inp, fallback } = useMemo(
    () => toBusInput({ length, width, height }, paint),
    [length, width, height, paint]
  );
  const [src, setSrc] = useState<string>();

  useEffect(() => {
    const { url, release } = holdBusShot(inp, bg);
    let live = true;
    url.then(
      u => live && setSrc(u),
      () => live && setSrc(undefined)
    );
    return () => {
      live = false;
      release();
    };
  }, [inp, bg]);

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
            top: 'calc(100% - 100cqh + 8px)',
            insetInlineStart: 8,
            maxWidth: 'calc(100% - 16px)',
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
