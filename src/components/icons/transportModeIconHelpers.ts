/**
 * Pure helper backing `TransportModeIcon`. Extracted so the colour logic is
 * testable under vitest's `node` environment without a DOM.
 *
 * Icon resolution is **identity** — every `TransportMode` has a `<symbol
 * id="tm-${mode}">` in `TransportModeSprite.tsx` (members without bespoke art
 * alias `#tm-fallback`), so the component references `#tm-${mode}` directly.
 * No subset list. See FORK_DECISIONS.md → "TransportMode carries Sobek's
 * UPPER_CASE enum".
 */
import type { TransportMode } from '../../data/netex/transportMode.ts';

/**
 * CSS colour expression for a mode. The two-tier `var()` chain lets a missing
 * `--tm-<mode>` token fall through to the generic `--tm-fallback` without
 * forcing every enum member to ship its own colour.
 * @param mode A `TransportMode`.
 * @returns A `var(...)` string suitable for an inline `color:` style.
 */
export const colorVarFor = (mode: TransportMode): string => `var(--tm-${mode}, var(--tm-fallback))`;
