# Open questions

These are known design ambiguities in the current code. They're tracked here so future work can decide before committing.

Each entry describes the problem and points to the relevant code; resolutions are intentionally left open.

## Partial vertical-folder migration

`src/theme/` and `src/config/` exist as feature folders, but their associated React contexts still live in the horizontal `src/contexts/` directory: `CustomizationContext.tsx` (theme-related) and `configContext.ts` (config-related). The migration that established `theme/` and `config/` was incomplete. `EditingContext.tsx` and `SessionContext.tsx` are similarly horizontal — `SessionContext` is OIDC-related and could belong in `auth/`, while `EditingContext` is data-view-related and might belong with the generic data-view infrastructure (or stay neutral).

The same drain-to-feature principle applies to any `src/types/` directory: such a folder accumulates orphan junk and should be drained into the relevant feature folders. Cross-feature NeTEx-shaped types belong in `src/data/netex/`; other shared constants belong at the lowest common ancestor as a flat file (precedent: `src/data/graphqlErrMsg.ts`). Hathor does not currently have a `src/types/` dir — keep it that way.

## Non-functional filters in `vehicleTypeViewConfig`

`src/data/vehicle-types/vehicleTypeViewConfig.tsx` defines `vehicleTypeFilters` with stop-place-era categories (`parentVehicleType`, `railVehicle`, `metroVehicle`, `tramVehicle`, `busVehicle`, `coachVehicle`, etc.). The filter UI renders these chips, but the underlying `getFilterKey` does not produce values matching them — meaning none of these filters actually filter anything. Same stub bug also affects `src/data/deck-plans/deckPlanViewConfig.ts`.

Tracked in **#24** — wires shared NeTEx `TransportMode` chips across VehicleType, DeckPlan, and a new Vehicle list (`src/data/netex/transportMode.ts`).

## `EditingContext` editor slot vs. selection ownership

`EditingContext` is a thin "what fills the sidebar slot" mechanism: `EditingItem` is `{ id, EditorComponent }` and its contract `EditorComponent: ComponentType<{ itemId: string }>` (`src/contexts/EditingContext.tsx:10-13`) says an editor is rendered with nothing but an id (`src/components/sidebar/SidebarContent.tsx:8`). The vehicle-types path honours that contract — `src/data/vehicle-types/cells/EditActionCell.tsx:19` commits the **stable** `VehicleTypeEditor` component reference.

`useVehicleUrlSelection` does not. `VehicleDetails` needs the GQL row object and the list `refetch`, neither of which `itemId` carries, so the hook smuggles them through a **fresh closure** `() => <VehicleDetails vehicle={row} onSaved={refetch} />` on every commit (`src/data/vehicles/projection/useVehicleUrlSelection.tsx:74-81`). A new closure is a new component type, so each commit risks remounting `VehicleDetails` and wiping its view/edit `mode` and in-flight save snackbar. The `lastCommittedIdRef` / `lastCommittedRowRef` / `resolvedFromMissing` guard and its ~9-line rationale comment (`useVehicleUrlSelection.tsx:18-36,49-50,72-81`) exist solely to fence off that self-inflicted hazard — the comment's verbosity is a symptom of the accidental complexity, not documentation of essential complexity.

Compounding this: "which vehicle is selected" has no single owner. It is reconstructed from the `?selected=` URL param by this hook on every render, the URL is written separately by the ViewConfig's `useRowClick` (`src/data/vehicles/projection/vehicleViewConfig.tsx:81-82`), and the sidebar open/collapse lives in yet another effect (`src/pages/GenericDataViewPage.tsx:124-132`). Candidate directions, left open: (a) make `VehicleDetails` take only `itemId` and resolve its own row + `refetch`, so it can be a stable component like `VehicleTypeEditor` and the guard collapses to an id check; or (b) introduce a dedicated URL-backed `selection` concept that owns id↔sidebar while `EditingContext` stays a thin slot. Explicitly *not* recommended: widening `EditingContext` to carry entity data + callbacks — that couples a generic slot to entity specifics and forces an untyped `data` field without removing the closure.
