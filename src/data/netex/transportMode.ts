/**
 * TransportMode — Sobek's GraphQL `TransportMode` enum, carried verbatim.
 *
 * Hathor keeps **no curated subset**: the only mode list is the full schema
 * enum (`TRANSPORT_MODES`, 21 members, in lockstep with the SDL). Presentation
 * derives from it — filter chips are data-driven (see {@link transportModeFilters}),
 * icons resolve by identity (`#tm-${mode}`) with a single `tm-fallback` glyph for
 * members without bespoke art. A value that proves useless is dropped from the
 * Sobek schema and surfaces there, not via hathor curation.
 */
import type { FilterDefinition } from '../../components/search/searchTypes.ts';

/**
 * Every `TransportMode` member — verbatim mirror of `enum TransportMode` in
 * `src/graphql/sobek.schema.graphqls`. Keep in lockstep with the SDL.
 */
export const TRANSPORT_MODES = [
  'AIR',
  'ALL',
  'ANY_MODE',
  'BUS',
  'CABLEWAY',
  'COACH',
  'FERRY',
  'FUNICULAR',
  'INTERCITY_RAIL',
  'LIFT',
  'METRO',
  'OTHER',
  'RAIL',
  'SELF_DRIVE',
  'SNOW_AND_ICE',
  'TAXI',
  'TRAM',
  'TROLLEY_BUS',
  'UNKNOWN',
  'URBAN_RAIL',
  'WATER',
] as const;

export type TransportMode = (typeof TRANSPORT_MODES)[number];

/** Sobek's catch-all member; also the projection default for a null mode. */
export const UNKNOWN_TRANSPORT_MODE = 'UNKNOWN' satisfies TransportMode;

/** Synthetic sprite id for any mode without a bespoke `<symbol>`. */
export const FALLBACK_MODE_SPRITE = 'fallback' as const;

const MODE_SET: ReadonlySet<string> = new Set(TRANSPORT_MODES);

/** Runtime guard — narrows a string to a `TransportMode` (one of the 21). */
export const isTransportMode = (s: string | null | undefined): s is TransportMode =>
  typeof s === 'string' && MODE_SET.has(s);

/** Map a `TransportMode` to its i18n key. */
export const transportModeLabelKey = (mode: TransportMode): string => `transportMode.${mode}`;

/** Sort key — the enum id verbatim; `UNKNOWN` sorts at its alphabetical slot. */
export const transportModeSortValue = (mode: TransportMode): string => mode;

/**
 * Data-driven chip set: one filter per distinct mode present in the data,
 * deduped and sorted. No curated subset — chips reflect what the rows carry.
 *
 * @param modes The transport modes present in the loaded rows.
 * @returns One {@link FilterDefinition} per distinct mode.
 */
export const transportModeFilters = (modes: Iterable<TransportMode>): FilterDefinition[] =>
  [...new Set(modes)]
    .sort()
    .map(mode => ({ id: mode, labelKey: transportModeLabelKey(mode), defaultLabel: mode }));
