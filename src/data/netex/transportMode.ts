/**
 * NeTEx TransportModeEnumeration — shared by all vehicle-domain views.
 *
 * Single source of truth for the chip filter set used on Vehicle, VehicleType,
 * and DeckPlan lists (see GH #24). The id strings are the verbatim NeTEx enum
 * values plus a synthetic `'unknown'` member that absorbs any value the
 * backend may emit that doesn't match the NeTEx vocabulary. Surfacing
 * `'unknown'` rather than `undefined` keeps the typed surface total and lets
 * downstream code drop optional-handling cruft.
 */
import type { FilterDefinition } from '../../components/search/searchTypes.ts';

/**
 * NeTEx TransportModeEnumeration + synthetic `'unknown'`. Keep in lockstep
 * with the schema; `'unknown'` is the catch-all for missing or unrecognised
 * values from the backend.
 */
export const UNKNOWN_TRANSPORT_MODE = 'unknown' as const;

export type TransportMode =
  | 'bus'
  | 'tram'
  | 'rail'
  | 'metro'
  | 'water'
  | 'air'
  | 'coach'
  | 'taxi'
  | 'cableway'
  | 'funicular'
  | 'lift'
  | 'trolleyBus'
  | 'snowAndIce'
  | typeof UNKNOWN_TRANSPORT_MODE;

/**
 * Shared chip-filter set for any list view that filters by TransportMode.
 *
 * `'unknown'` is intentionally omitted here — chip filters are for
 * specific known modes; rows with `'unknown'` simply don't match any chip
 * and are hidden when any chip is active (which is the desired UX). i18n
 * keys live under `transportMode.*` in both `en` and `nb`.
 */
export const transportModeFilters: FilterDefinition[] = [
  { id: 'rail', labelKey: 'transportMode.rail', defaultLabel: 'Rail' },
  { id: 'metro', labelKey: 'transportMode.metro', defaultLabel: 'Metro' },
  { id: 'tram', labelKey: 'transportMode.tram', defaultLabel: 'Tram' },
  { id: 'bus', labelKey: 'transportMode.bus', defaultLabel: 'Bus' },
  { id: 'coach', labelKey: 'transportMode.coach', defaultLabel: 'Coach' },
  { id: 'trolleyBus', labelKey: 'transportMode.trolleyBus', defaultLabel: 'Trolley bus' },
  { id: 'water', labelKey: 'transportMode.water', defaultLabel: 'Water' },
  { id: 'air', labelKey: 'transportMode.air', defaultLabel: 'Air' },
  { id: 'taxi', labelKey: 'transportMode.taxi', defaultLabel: 'Taxi' },
  { id: 'cableway', labelKey: 'transportMode.cableway', defaultLabel: 'Cableway' },
  { id: 'funicular', labelKey: 'transportMode.funicular', defaultLabel: 'Funicular' },
  { id: 'lift', labelKey: 'transportMode.lift', defaultLabel: 'Lift' },
  { id: 'snowAndIce', labelKey: 'transportMode.snowAndIce', defaultLabel: 'Snow & ice' },
];

const KNOWN_TRANSPORT_MODES: ReadonlySet<TransportMode> = new Set(
  transportModeFilters.map(f => f.id as TransportMode)
);

const ALL_TRANSPORT_MODES: ReadonlySet<TransportMode> = new Set<TransportMode>([
  ...KNOWN_TRANSPORT_MODES,
  UNKNOWN_TRANSPORT_MODE,
]);

/**
 * Runtime guard — narrows an unknown string to a NeTEx `TransportMode`
 * (including the synthetic `'unknown'`). Use when you need a typed *or
 * nothing* result; prefer {@link toTransportMode} when you want a total
 * mapping.
 */
export const isTransportMode = (s: string | null | undefined): s is TransportMode =>
  typeof s === 'string' && ALL_TRANSPORT_MODES.has(s as TransportMode);

/**
 * Normalised lookup key — strips underscores and lowercases. Lets a
 * GraphQL-style `'TROLLEY_BUS'` enum, a NeTEx-canonical `'trolleyBus'`, and
 * an aggressively-uppercased `'TROLLEYBUS'` all resolve to the same mode.
 */
const normalizeKey = (s: string): string => s.replace(/_/g, '').toLowerCase();

/**
 * Map of normalised-key → canonical `TransportMode`. Built once at module
 * init from {@link KNOWN_TRANSPORT_MODES} so backend value variants
 * (`'bus'`, `'BUS'`, …) collapse to the canonical camelCase form used
 * everywhere else in the codebase (i18n keys, sprite symbol ids, etc.).
 */
const NORMALIZED_TO_CANONICAL: ReadonlyMap<string, TransportMode> = new Map(
  Array.from(KNOWN_TRANSPORT_MODES, m => [normalizeKey(m), m])
);

/**
 * Total mapping from an arbitrary backend value to a canonical
 * `TransportMode`. Case-insensitive and underscore-tolerant so:
 *
 * - `'bus'` (NeTEx XML) → `'bus'`
 * - `'BUS'` (GraphQL enum) → `'bus'`
 * - `'trolleyBus'` → `'trolleyBus'`
 * - `'TROLLEY_BUS'` (GraphQL enum, snake-cased) → `'trolleyBus'`
 * - `'TROLLEYBUS'` (aggressively uppercased) → `'trolleyBus'`
 *
 * Unknown / missing / null and anything outside the NeTEx enum become
 * `'unknown'` rather than `undefined`, so callers can treat the result as
 * a non-optional union member.
 */
export const toTransportMode = (s: string | null | undefined): TransportMode => {
  if (typeof s !== 'string' || s.length === 0) return UNKNOWN_TRANSPORT_MODE;
  return NORMALIZED_TO_CANONICAL.get(normalizeKey(s)) ?? UNKNOWN_TRANSPORT_MODE;
};

/**
 * Inverse of {@link toTransportMode} for write paths: canonical camelCase
 * `TransportMode` → Sobek's GraphQL `TransportMode` enum value
 * (SCREAMING_SNAKE), e.g. `'bus' → 'BUS'`, `'trolleyBus' → 'TROLLEY_BUS'`,
 * `'snowAndIce' → 'SNOW_AND_ICE'`. `'unknown'`, `null`, and `undefined` map to
 * `null` — the backend enum has no slot for them, so a mutation must omit the
 * value rather than send an invalid name. Mirrors the SDL `TransportMode` enum.
 *
 * @param mode Canonical mode held by the editor form.
 * @returns The Sobek enum name, or `null` when unmapped/absent.
 */
export const toSobekTransportMode = (
  mode: TransportMode | string | null | undefined
): string | null => {
  if (!mode || mode === UNKNOWN_TRANSPORT_MODE) return null;
  return mode.replace(/([a-z0-9])([A-Z])/g, '$1_$2').toUpperCase();
};

/** Map a `TransportMode` to its i18n key. */
export const transportModeLabelKey = (mode: TransportMode): string => `transportMode.${mode}`;

/**
 * Sort key for a `TransportMode`. `'unknown'` returns `''` so it sinks to
 * the end via {@link compareWithEmptyLast}; others sort alphabetically by
 * their enum id.
 */
export const transportModeSortValue = (mode: TransportMode): string =>
  mode === UNKNOWN_TRANSPORT_MODE ? '' : mode;
