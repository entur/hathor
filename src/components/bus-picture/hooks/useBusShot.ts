import { useEffect, useMemo, useState } from 'react';
import { useTheme } from '@mui/material';
import { over } from '../../../utils/colorOver.ts';
import { CARD_SHOT, holdBusShot, type ShotSize } from '../utils/busShots.ts';
import { stageColours, type StageColours } from '../utils/stageTheme.ts';
import type { BusInput } from '../utils/standardBus.ts';

type ShotState = { inp: BusInput; bg: string; ground?: string; w: number; h: number } & (
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
 * A bus stage's colours from the theme: sky, ground, road and scenery.
 *
 * @returns {StageColours} the colours; the same object while the theme is
 */
export function useStageColours(): StageColours {
  const { palette } = useTheme();
  return useMemo(() => stageColours(palette), [palette]);
}

/**
 * Holds the shot of a bus on the page's shared stage, on the current background.
 *
 * @param {BusInput} inp a valid bus input
 * @param {ShotSize} [size] the picture's size in css px; a card's by default
 * @param {string} [ground] the ground's colour; the package's own by default
 * @returns {string | 'failed' | undefined} the PNG's URL, `'failed'` (no WebGL, a failed
 *   shot), or `undefined` while it is queued
 */
export function useBusShot(
  inp: BusInput,
  { w, h }: ShotSize = CARD_SHOT,
  ground?: string
): string | 'failed' | undefined {
  const bg = usePictureBg();
  const [shot, setShot] = useState<ShotState>();

  useEffect(() => {
    const { url, release } = holdBusShot(inp, bg, { w, h }, ground);
    let live = true;
    url.then(
      u => live && setShot({ inp, bg, ground, w, h, url: u }),
      () => live && setShot({ inp, bg, ground, w, h, failed: true })
    );
    return () => {
      live = false;
      release();
    };
  }, [inp, bg, ground, w, h]);

  // A changed input, colour or size drops the old shot at once: its URL is about to be revoked.
  const stale =
    shot?.inp !== inp || shot.bg !== bg || shot.ground !== ground || shot.w !== w || shot.h !== h;
  if (stale) return undefined;
  return 'url' in shot ? shot.url : 'failed';
}
