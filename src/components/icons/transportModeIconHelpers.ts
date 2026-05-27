/**
 * Pure helpers backing `TransportModeIcon`. Extracted so the resolution
 * logic is testable under vitest's `node` environment without dragging in
 * a DOM. See FORK_DECISIONS.md → "Transport-mode icon strategy".
 */
import type { TransportMode } from '../../data/netex/transportMode.ts';

/**
 * The set of modes `TransportModeSprite.tsx` actually draws. Any mode
 * outside this set falls back to the `tm-unknown` placeholder symbol.
 * Keep in lockstep with `TransportModeSprite.tsx`.
 */
export const SPRITE_MODES: ReadonlySet<TransportMode> = new Set<TransportMode>([
  'bus',
  'coach',
  'rail',
  'tram',
  'metro',
  'water',
  'air',
  'unknown',
]);

/**
 * Resolve the `<symbol>` id for a mode. Returns `'unknown'` for any mode
 * not yet drawn by the sprite.
 * @param mode A NeTEx TransportMode (or the synthetic `'unknown'`).
 * @returns The id to pass into `<use href="#tm-…">`.
 */
export const symbolIdFor = (mode: TransportMode): TransportMode =>
  SPRITE_MODES.has(mode) ? mode : 'unknown';

/**
 * CSS color expression for a mode. The two-tier `var()` chain lets a
 * missing `--tm-<mode>` token fall through to `--tm-unknown` without
 * forcing every NeTEx mode to ship its own color.
 * @param mode A NeTEx TransportMode (or the synthetic `'unknown'`).
 * @returns A `var(...)` string suitable for an inline `color:` style.
 */
export const colorVarFor = (mode: TransportMode): string => `var(--tm-${mode}, var(--tm-unknown))`;
