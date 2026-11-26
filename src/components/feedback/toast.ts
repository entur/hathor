import { Slide } from '@mui/material';

/** The save toasts' shared look (#435): slides up from the bottom, taller than MUI's alert. */
export const TOAST_SLOTS = { transition: Slide } as const;
export const TOAST_SLOT_PROPS = { transition: { direction: 'up' } } as const;
export const TOAST_ALERT_SX = { py: 1.5 } as const;

/**
 * Centres a bottom toast on `centerX` (viewport px), e.g. the form column's middle, clear of
 * the footer's Cancel and Save at its right. From `sm` only: below it the toast spans the screen.
 *
 * @param {number | undefined} centerX the centre line; undefined → MUI's, the viewport's
 * @returns {object | undefined} the Snackbar's `sx`
 */
export const toastSx = (centerX?: number) =>
  centerX === undefined ? undefined : { left: { sm: `${centerX}px` } };
