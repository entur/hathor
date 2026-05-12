/**
 * NeTEx TransportModeEnumeration — shared by all vehicle-domain views.
 *
 * Single source of truth for the chip filter set used on Vehicle, VehicleType,
 * and DeckPlan lists (see GH #24). The id strings here are the verbatim NeTEx
 * enum values, so they can be used both as filter keys *and* as the typed value
 * of `transportMode` fields on domain types.
 */
import type { FilterDefinition } from '../../components/search/searchTypes.ts';

/** NeTEx TransportModeEnumeration — keep in lockstep with the schema. */
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
  | 'snowAndIce';

/**
 * Shared chip-filter set for any list view that filters by TransportMode.
 *
 * Order matches the rough frequency in Norwegian PT data (rail/metro/tram/bus
 * first). i18n keys live under `transportMode.*` in both `en` and `nb`.
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
