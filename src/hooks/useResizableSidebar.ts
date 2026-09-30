import { useState, useEffect, useCallback, useRef } from 'react';
import type { Side } from '../components/sidebar/Sidebar.tsx';

export const MIN_W = 100,
  MAX_RATIO = 0.8,
  DEF_RATIO = 0.4;
/** Persisted pane width, as a fraction of viewport width (#173 modal variant). */
export const RATIO_KEY = 'hathor:detailsPaneRatio';

/**
 * Clamp a width ratio to `[MIN_W / vw, MAX_RATIO]`.
 *
 * @param {number} r - Candidate ratio.
 * @param {number} vw - Viewport width in px.
 * @returns {number} Ratio inside the allowed band.
 */
export const clampRatio = (r: number, vw: number): number =>
  Math.min(MAX_RATIO, Math.max(MIN_W / vw, r));

/**
 * Read the persisted ratio; `DEF_RATIO` when absent, unparsable, or storage throws.
 *
 * @param {Storage | undefined} store - Storage to read (e.g. `localStorage`).
 * @param {number} vw - Viewport width in px, for clamping.
 * @returns {number} Clamped ratio.
 */
export function readRatio(store: Storage | undefined, vw: number): number {
  let raw: string | null = null;
  try {
    raw = store?.getItem(RATIO_KEY) ?? null;
  } catch {
    /* blocked storage → default */
  }
  const r = raw === null ? NaN : Number(raw);
  return clampRatio(Number.isFinite(r) && r > 0 ? r : DEF_RATIO, vw);
}

/**
 * Persist the ratio; storage failures are swallowed (width then resets next mount).
 *
 * @param {Storage | undefined} store - Storage to write.
 * @param {number} r - Ratio to persist.
 */
export function writeRatio(store: Storage | undefined, r: number): void {
  try {
    store?.setItem(RATIO_KEY, String(r));
  } catch {
    /* ignore */
  }
}

const storage = (): Storage | undefined =>
  typeof window === 'undefined' ? undefined : window.localStorage;

/**
 * Drag-resizable details-pane width, held as a viewport ratio and persisted
 * to `localStorage` on mouseup. Open/closed is not tracked here — the modal
 * Drawer derives it from the editing selection.
 *
 * @param {Side} [side='left'] - Edge the pane is anchored to (drag math flips).
 * @returns {{ ratio: number, isResizing: boolean, setIsResizing: (b: boolean) => void }}
 */
export function useResizableSidebar(side: Side = 'left') {
  const [ratio, setRatio] = useState<number>(() => readRatio(storage(), window.innerWidth));
  const [isResizing, setIsResizing] = useState<boolean>(false);
  const ratioRef = useRef(ratio);
  ratioRef.current = ratio;

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      const vw = window.innerWidth;
      const px = side === 'left' ? e.clientX : vw - e.clientX;
      setRatio(clampRatio(px / vw, vw));
    },
    [side]
  );

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
    writeRatio(storage(), ratioRef.current);
  }, []);

  useEffect(() => {
    if (!isResizing) return;
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, handleMouseMove, handleMouseUp]);

  return { ratio, isResizing, setIsResizing };
}
