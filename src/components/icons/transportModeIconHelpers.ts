/**
 * Pure helpers backing `TransportModeIcon`. Extracted so the resolution
 * logic is testable under vitest's `node` environment without dragging in
 * a DOM. See FORK_DECISIONS.md → "Transport-mode icon strategy".
 */
import type { TransportMode } from '../../data/netex/transportMode.ts';

/**
 * The set of modes `TransportModeSprite.tsx` has a dedicated `<symbol>`
 * for. Aliased modes (see `SYMBOL_ALIASES`) are NOT in this set even if
 * they render — they resolve through their alias. Any mode outside both
 * structures falls back to `tm-unknown`. Keep in lockstep with
 * `TransportModeSprite.tsx`.
 */
export const SPRITE_MODES: ReadonlySet<TransportMode> = new Set<TransportMode>([
  'bus',
  'coach',
  'taxi',
  'trolleyBus',
  'rail',
  'tram',
  'metro',
  'cableway',
  'funicular',
  'water',
  'air',
  'snowAndIce',
  'unknown',
]);

/**
 * Modes that share another mode's `<symbol>` rather than ship their own
 * artwork. The shared symbol carries the silhouette; color
 * differentiation comes from each mode's own `--tm-*` token via
 * {@link colorVarFor}. Keep in lockstep with `TransportModeSprite.tsx`.
 *
 * - `lift` → `cableway`: both are cable+cabin in NeTEx semantics
 *   (chair lifts and gondolas). Visually close enough at 16×16 that a
 *   shared silhouette is preferable to a near-duplicate symbol.
 */
const SYMBOL_ALIASES: Partial<Record<TransportMode, TransportMode>> = {
  lift: 'cableway',
};

/**
 * Resolve the `<symbol>` id for a mode. Honors {@link SYMBOL_ALIASES}
 * first (so aliased modes pick up the borrowed silhouette), then checks
 * {@link SPRITE_MODES}, then falls back to `'unknown'`.
 * @param mode A NeTEx TransportMode (or the synthetic `'unknown'`).
 * @returns The id to pass into `<use href="#tm-…">`.
 */
export const symbolIdFor = (mode: TransportMode): TransportMode => {
  const alias = SYMBOL_ALIASES[mode];
  if (alias) return alias;
  return SPRITE_MODES.has(mode) ? mode : 'unknown';
};

/**
 * CSS color expression for a mode. The two-tier `var()` chain lets a
 * missing `--tm-<mode>` token fall through to `--tm-unknown` without
 * forcing every NeTEx mode to ship its own color.
 * @param mode A NeTEx TransportMode (or the synthetic `'unknown'`).
 * @returns A `var(...)` string suitable for an inline `color:` style.
 */
export const colorVarFor = (mode: TransportMode): string => `var(--tm-${mode}, var(--tm-unknown))`;
