# Open questions

These are known design ambiguities in the current code. They're tracked here so future work can decide before committing.

Each entry describes the problem and points to the relevant code; resolutions are intentionally left open.

## Partial vertical-folder migration

`src/theme/` and `src/config/` exist as feature folders, but their associated React contexts still live in the horizontal `src/contexts/` directory: `CustomizationContext.tsx` (theme-related) and `configContext.ts` (config-related). The migration that established `theme/` and `config/` was incomplete. `EditingContext.tsx` and `SessionContext.tsx` are similarly horizontal — `SessionContext` is OIDC-related and could belong in `auth/`, while `EditingContext` is data-view-related and might belong with the generic data-view infrastructure (or stay neutral).

## Non-functional filters in `vehicleTypeViewConfig`

`src/data/vehicle-types/vehicleTypeViewConfig.tsx` defines `vehicleTypeFilters` with stop-place-era categories (`parentVehicleType`, `railVehicle`, `metroVehicle`, `tramVehicle`, `busVehicle`, `coachVehicle`, etc.). The filter UI renders these chips, but the underlying `getFilterKey` does not produce values matching them — meaning none of these filters actually filter anything. The question is whether to delete them entirely (no real categorization exists for vehicle types yet) or wire them up to a real domain attribute (transport mode? a tag system?).
