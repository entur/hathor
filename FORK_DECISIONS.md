# Fork decisions

A log of significant design decisions made on this Hathor fork — both at fork time and during ongoing development. Each entry captures the **decision**, the **alternatives considered**, and the **rationale**, so future contributors can understand *why* the code looks the way it does without spelunking commit history.

Companion to [OPEN_QUESTIONS.md](./OPEN_QUESTIONS.md): that file holds *unresolved* design ambiguities; this file holds *resolved* ones.

> **Retroactive entries.** Several decisions predate this file. Where a section is marked _(retroactive)_, the decision was made earlier and is being archived after the fact.

---

## Vehicle deep-link via `?selected=` query param _(retroactive, captured 2026-05-12)_

### Context

The `/vehicle` route (added under GH #26 / umbrella #24) was shipped as a single-route list with a sidebar editor (`VehicleDetails`) opened only via in-row clicks. The slider state lived entirely in `EditingContext`; the URL never changed.

This blocked two things:

1. The `Vehicles` column on `/vehicle-type` (`src/data/vehicle-types/cells/VehicleListCell.tsx`) renders one chip per vehicle, but the chips were inert — there was no bookmarkable destination to navigate to.
2. Bookmarking or sharing "the slider open for vehicle X" was impossible.

Sibling routes (`/vehicle-type/:id`, `/deck-plan/:id`) use full-page `GenericDetailsPage` views, so the obvious move would be a matching `/vehicle/:id` page. We deliberately rejected that — see below.

### Decision

The slider state for `/vehicle` is driven by a query param: `/vehicle?selected=<full-NeTEx-id>` (URL-encoded). The URL is the **single source of truth**; `EditingContext.editingItem` is derived from it.

Concrete contract:

- **Route:** stays `/vehicle` (no `:id` route added).
- **Param:** `?selected=NMR%3AVehicle%3Aabc-123` (full NeTEx id, URL-encoded).
- **Resolver:** `VehicleView` runs an effect on `searchParams.selected` change. After `useVehicles().loading` flips false, it does `allData.find(v => v.id === selected)`:
  - **Found:** opens slider via `setEditingItem(...)` and pages the table to the row's index in the currently-sorted+filtered dataset (`setPage(Math.floor(idx / rowsPerPage))`). If the row is filtered out, slider opens but pagination stays put.
  - **Not found:** opens slider with a not-found body using existing translation key `vehicles.notFound`. `VehicleDetails` accepts `vehicle: VehicleRow | null`.
- **Writers:** `RowClickCell` and the `/vehicle-type` chips both `navigate('/vehicle?selected=...')` (push). The `Close` button in `VehicleDetails` calls `setSearchParams({}, { replace: true })`.
- **History:** push-on-open / replace-on-close. Switching between vehicles via row click also pushes (back-button walks the chain). Closing is a dismissal, not navigation, so it doesn't pollute history.
- **Cleanup:** `VehicleView` unmount returns `setEditingItem(null)` so slider state doesn't leak across routes (`EditingProvider` is global per `src/App.tsx`).
- **Chips on `/vehicle-type`:** `<Chip component={Link} to={...} clickable size="small" variant="outlined">`, mirroring the existing VehicleType ID chip pattern at `vehicleTypeViewConfig.tsx:30-37`.

### Alternatives considered

| Option | Why rejected |
|---|---|
| **Path param `/vehicle/:id`** (matches `/vehicle-type/:id`, `/deck-plan/:id`) | Sibling routes are *full-page* details views, not deep-linked sliders. Reusing the path-param shape for a different UX would be misleading. The sibling pages also re-fetch a single resource; for vehicles there is no `/netex/vehicles/{id}` endpoint (see memory note `project_vehicle_details_route_hathor.md`), so a single-vehicle resolver doesn't exist. |
| **Hash fragment `/vehicle#…`** | Not used elsewhere in this codebase. |
| **Suffix-only id (`?selected=abc-123`, drop the `NMR:Vehicle:` prefix)** | Requires reattaching the prefix on the consumer side. Brittle if the prefix ever shifts. The `%3A`-encoded URL is not pretty but symmetric with `VehicleRow.id` — no mapping helpers needed in either producer or consumer. |
| **`EditingContext` is source of truth, URL mirrors it** | Two writers to URL+context risk getting out of sync. Back/forward navigation would need explicit `replace`/`push` choices on every mutation. Bookmarking on first load needs an extra "seed from URL" effect. Net: more code, more bug surface. |
| **Hybrid (URL drives initial deep-link only)** | Bookmark works on first load, but subsequent slider opens don't update URL → can't share "what I'm looking at right now". Half-pregnant. |
| **Auto-page-jump that resets sort+filters** | Destroys user context (especially once filter/sort state itself becomes URL-encoded). |
| **Snackbar for not-found** | No snackbar infrastructure for this pattern in the codebase yet. The slider-with-message variant is honest and free. |

### Consequences

- This URL↔state model is **local to `VehicleView`**. Other pages (`vehicle-types`, `deck-plans`) keep their direct `setEditingItem` writes. If we want to retrofit them later, the wiring can be lifted into `GenericDataViewPage` — the contract here was kept page-local on purpose to avoid forcing a redesign on every consumer.
- `VehicleDetails`'s prop becomes `vehicle: VehicleRow | null`, gaining a not-found branch.
- `RowClickCell` no longer touches `EditingContext`; it only navigates.
- `useVehicles()` still single-fetches the entire list. Per memory note `project_vehicle_details_route_hathor.md`, a Sobek `/netex/vehicles/{id}` endpoint is the prerequisite for ever switching to a per-id fetch — until that exists, "deep link" still means "wait for the list, then look up".

### Out of scope

- Scroll-into-view + temporary highlight on the page-jumped row.
- Encoding sort/filter state in the URL alongside `?selected=`.
- Generalizing `?selected=` to `/vehicle-type` and `/deck-plan`.
- Refactoring sibling routes to share the deep-link slider model.

---

## Collapse unused `GenericDataEditPage` scaffold _(2026-05-15)_

### Context

Inanna's initial scaffold shipped two near-twin list-chrome pages: `src/pages/GenericDataViewPage.tsx` and `src/pages/GenericDataEditPage.tsx`. The latter exposes `addRow`/`updateRow` callbacks for an inline-cell editing mode but has never been imported anywhere in this fork's git history. Carrying it forward forced any chrome-level change to be applied twice and bled noise into bubbled-up tunables (e.g. `DETAILS_PANE_INIT_WIDTH` had to live in both files).

### Decision

Delete `src/pages/GenericDataEditPage.tsx`. If inline-cell editing is ever wanted, reintroduce it as a deliberate feature on top of `GenericDataViewPage`, not as a parallel page. Follows the inanna-fork skill's "collapse duplicates" precedent — see `OPEN_QUESTIONS.md` Q7 for the analogous `src/map/` ↔ `src/components/map/` split.

### Consequences

`GenericDataViewPage` becomes the single chrome page for list+sidebar workflows. Future layout or tunable changes (e.g. the right-side details pane introduced in the next commit) touch one file, not two.
