# Open questions

These are known design ambiguities in the current code. They're tracked here so future work can decide before committing.

Each entry describes the problem and points to the relevant code; resolutions are intentionally left open.

## Partial vertical-folder migration

`src/theme/` and `src/config/` exist as feature folders, but their associated React contexts still live in the horizontal `src/contexts/` directory: `CustomizationContext.tsx` (theme-related) and `configContext.ts` (config-related). The migration that established `theme/` and `config/` was incomplete. `EditingContext.tsx` and `SessionContext.tsx` are similarly horizontal — `SessionContext` is OIDC-related and could belong in `auth/`, while `EditingContext` is data-view-related and might belong with the generic data-view infrastructure (or stay neutral).

The same drain-to-feature principle applies to any `src/types/` directory: such a folder accumulates orphan junk and should be drained into the relevant feature folders. Cross-feature NeTEx-shaped types belong in `src/data/netex/`; other shared constants belong at the lowest common ancestor as a flat file (precedent: `src/data/graphqlErrMsg.ts`). Hathor does not currently have a `src/types/` dir — keep it that way.

## Non-functional filters in `vehicleTypeViewConfig`

`src/data/vehicle-types/vehicleTypeViewConfig.tsx` defines `vehicleTypeFilters` with stop-place-era categories (`parentVehicleType`, `railVehicle`, `metroVehicle`, `tramVehicle`, `busVehicle`, `coachVehicle`, etc.). The filter UI renders these chips, but the underlying `getFilterKey` does not produce values matching them — meaning none of these filters actually filter anything. Same stub bug also affects `src/data/deck-plans/deckPlanViewConfig.ts`.

Tracked in **#24** — wires shared NeTEx `TransportMode` chips across VehicleType, DeckPlan, and a new Vehicle list (`src/data/netex/transportMode.ts`).
