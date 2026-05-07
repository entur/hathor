# Open questions

These are known design ambiguities in the current code. They're tracked here so future work can decide before committing.

Each entry describes the problem and points to the relevant code; resolutions are intentionally left open.

## Orphan `src/types/`

`src/types/` holds two files: `viewConfigTypes.ts` (the data-view contract) and `paginationTypes.ts` (pagination shape). Most other `*Types.ts` files in the codebase live next to their implementation (`vehicleTypeTypes.ts`, `dataTableTypes.ts`, `searchTypes.ts`, `deckPlanTypes.ts`). The folder's purpose — generic-shared types only? — is not documented. If `viewConfigTypes.ts` belongs with the GenericDataViewPage infrastructure and `paginationTypes.ts` belongs with the GraphQL layer, this folder may not need to exist.

## Partial vertical-folder migration

`src/theme/` and `src/config/` exist as feature folders, but their associated React contexts still live in the horizontal `src/contexts/` directory: `CustomizationContext.tsx` (theme-related) and `configContext.ts` (config-related). The migration that established `theme/` and `config/` was incomplete. `EditingContext.tsx` and `SessionContext.tsx` are similarly horizontal — `SessionContext` is OIDC-related and could belong in `auth/`, while `EditingContext` is data-view-related and might belong with the generic data-view infrastructure (or stay neutral).

## Non-functional filters in `vehicleTypeViewConfig`

`src/data/vehicle-types/vehicleTypeViewConfig.tsx` defines `vehicleTypeFilters` with stop-place-era categories (`parentVehicleType`, `railVehicle`, `metroVehicle`, `tramVehicle`, `busVehicle`, `coachVehicle`, etc.). The filter UI renders these chips, but the underlying `getFilterKey` does not produce values matching them — meaning none of these filters actually filter anything. The question is whether to delete them entirely (no real categorization exists for vehicle types yet) or wire them up to a real domain attribute (transport mode? a tag system?).
