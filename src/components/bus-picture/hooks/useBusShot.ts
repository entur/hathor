import { useEffect, useState } from 'react';
import { useTheme } from '@mui/material';
import { over } from '../../../utils/colorOver.ts';
import { CARD_SHOT, holdBusShot, type ShotSize } from '../utils/busShots.ts';
import type { BusInput } from '../utils/standardBus.ts';

type ShotState = { inp: BusInput; bg: string; w: number; h: number } & (
  { url: string } | { failed: true }
);

/**
 * What shows behind a bus picture: a card's picture area is `action.hover` on paper.
 *
 * @returns {string} the colour, as opaque `rgb()`
 */
export function usePictureBg(): string {
  const { palette } = useTheme();
  return over(palette.background.paper, palette.action.hover);
}

/**
 * Holds the shot of a bus on the page's shared stage, on the current background.
 *
 * @param {BusInput} inp a valid bus input
 * @param {ShotSize} [size] the picture's size in css px; a card's by default
 * @returns {string | 'failed' | undefined} the PNG's URL, `'failed'` (no WebGL, a failed
 *   shot), or `undefined` while it is queued
 */
export function useBusShot(
  inp: BusInput,
  { w, h }: ShotSize = CARD_SHOT
): string | 'failed' | undefined {
  const bg = usePictureBg();
  const [shot, setShot] = useState<ShotState>();

  useEffect(() => {
    const { url, release } = holdBusShot(inp, bg, { w, h });
    let live = true;
    url.then(
      u => live && setShot({ inp, bg, w, h, url: u }),
      () => live && setShot({ inp, bg, w, h, failed: true })
    );
    return () => {
      live = false;
      release();
    };
  }, [inp, bg, w, h]);

  // A changed input, background or size drops the old shot at once: its URL is about to be revoked.
  if (shot?.inp !== inp || shot.bg !== bg || shot.w !== w || shot.h !== h) return undefined;
  return 'url' in shot ? shot.url : 'failed';
}
