# Fork decisions — Architecture Decision Records (ADR)

This file **is** the ADR log for the Hathor fork. Each section is one Architecture Decision Record capturing the **context**, **decision**, **alternatives considered**, and **consequences** of a design choice, so future contributors can understand *why* the code looks the way it does without spelunking commit history.

This is the **single home for design rationale.** `CLAUDE.md` describes *what* the patterns are (how to use ViewConfig, where state lives, etc.) and intentionally does not restate the *why* — that lives here. When adding a non-obvious design call, write a new ADR section in this file rather than expanding CLAUDE.md.

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
- **Writers:** whole-row click on `/vehicle` (wired via `vehicleViewConfig.useRowClick`) and the `/vehicle-type` chips both `navigate('/vehicle?selected=...')` (push). The `Close` button in `VehicleDetails` calls `setSearchParams({}, { replace: true })`.
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

- This URL↔state model is **local to `VehicleView`**. Other pages (`vehicle-types`, `deck-plans`) kept their direct `setEditingItem` writes at capture time. **Superseded 2026-05-22:** the per-row `EditActionCell` edit-button convention has since been retired — `vehicle-types` and `deck-plans` navigate to full-page details routes (`/vehicle-types/:id`, `/deck-plans/:id`) and make no `setEditingItem` calls. See [Retire the `EditActionCell` per-row edit-button convention](#retire-the-editactioncell-per-row-edit-button-convention-retroactive-captured-2026-05-22).
- `VehicleDetails`'s prop becomes `vehicle: VehicleRow | null`, gaining a not-found branch.
- The row-trigger affordance is generic: `GenericDataViewPage` accepts a `useRowClick` hook on `ViewConfig` that returns a `(item) => void` handler, plumbed to `DataTableRow`'s `onClick` in non-compact mode. Vehicles wires it to `navigate(vehicleSelectedHref(item.id))`; other pages can opt in for whole-row click without re-implementing the chain. Compact (mobile) mode keeps its tap-to-expand behaviour and ignores `onRowClick`.
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

---

## Horizontal form rows via CSS Grid + `<FieldRow>` _(2026-05-15)_

### Context

`VehicleEditForm.tsx` originally stacked 12 `<TextField>`s with floating labels — each row burned ~56px vertical and the sidebar pane scrolled. We wanted label-on-left / input-on-right to reclaim vertical space without giving up i18n-safe label widths, MUI theming, or accessibility wiring.

### Decision

Switch the form to a single CSS-Grid container with two columns (`minmax(8rem, 12rem) 1fr`) and introduce a tiny `<FieldRow id label alignTop?>` helper that uses `display: contents` so its `<InputLabel>` and `<TextField>` become direct grid items of the parent. Bubbled-up consts (`LABEL_COL_MIN`, `LABEL_COL_MAX`, `COL_GAP`, `ROW_GAP`) keep the layout tunable from one place. `size="small"` on every TextField drops row height ~56→40px. Section dividers/headers span both columns via `sx={{ gridColumn: '1 / -1' }}`.

### Alternatives considered

| Option | Why rejected |
|---|---|
| **`<Stack direction="row">` + `<Typography>` label** | Typography isn't a `<label>` — a11y wiring is manual. Each row is its own flex container, so label widths drift across rows under i18n. |
| **MUI Grid v2 two-column** | ~2× the JSX per row (explicit `<Grid size={...}>` cells), and the Grid items don't share a single grid context across rows — same alignment drift as Stack. CSS Grid gives the cross-row alignment for free. |
| **`<FormControlLabel labelPlacement="start">`** | Designed for Switch/Radio/Checkbox; label widths still drift across rows; future readers will assume a checkbox. |

### Consequences

- `<FieldRow>` lives inline in `VehicleEditForm.tsx` for now; extract to `src/components/form/FieldRow.tsx` when a second form needs it.
- A11y is native: `<InputLabel htmlFor={id}>` paired with `<TextField id={id}>` — screen readers announce the label on focus, clicking the label focuses the input. Each field needs a stable `id`.
- Responsive fallback: `gridTemplateColumns: { xs: '1fr', sm: '...' }` collapses to single-column at the `xs` breakpoint. The sidebar pane default (~480 px on FHD) stays in 2-col; the fallback only kicks in for the mobile drawer mode.
- Dirty/error indicators have two clean placement options: the TextField's own `error`/`helperText` props (render inside the field, don't disturb grid alignment), or a third grid column for a per-row status dot.

---

## `<NetexId>` chip component for read-only NeTEx ids _(2026-05-15)_

### Context

NeTEx ids appear in multiple read-only surfaces in the vehicle details pane: the vehicle's own id at the top, and now the parent VehicleType's ref alongside its name. Rendering them as plain text strings buried the structure of the id (`CODESPACE:TYPE:VALUE`) and required ad-hoc label/version pairs at every consumer.

### Decision

Introduce `src/data/netex/NetexId.tsx` — a small chip component that:

- Parses the id via a local `partsFor(id)` helper into `{ code, type, value }`.
- Renders `code:type:`**`value`** with the VALUE segment bold (`<strong>`) so the actual identifier stands out from the structural prefix.
- Substitutes `???` for any missing or empty CODESPACE / TYPE segment so malformed ids stay legible. The rightmost segment is always treated as VALUE (e.g. `abc-123` → `???:???:abc-123`); colons inside VALUE are preserved.
- Surfaces an optional `version` as a nested small filled chip inside the outer outlined chip, labelled `vN`. Absent version → no nested chip.
- Uses a monospace font family on both chips for ID-shaped legibility.

### Consequences

- `VehicleDetails` no longer carries a separate ID + Version `ContextRow` pair; one chip conveys both.
- The "Vehicle Type" read-only row now shows the parent name *and* a `<NetexId>` chip of `parentVehicleTypeId`, so users see the canonical NeTEx ref without an extra labelled row. The duplicate `TransportTypeRef` edit field was removed from `VehicleEditForm`.
- Reusable across other NeTEx-id surfaces (e.g. deck-plan refs, transport-type chips) when those views need the same treatment.

---

## Composite `EditorRail` for sidebar-edge controls _(2026-05-16)_

### Context

`VehicleDetails` originally carried four scattered controls for managing the slider: an in-header `View/Edit` chip, an in-form `Save` button, an in-form `Close` button, and — on the page chrome — a separate `ToggleButton` (the `<` chevron used to expand a collapsed sidebar). Each was its own component, each had its own placement, and the relationships between them ("Save closes; Close discards when dirty; toggling out of Edit doesn't discard") were implicit and easy to misread. Adding a NeTEx-id chip + horizontal field grid (see [Horizontal form rows](#horizontal-form-rows-via-css-grid--fieldrow-2026-05-15)) made the header cramped and the trailing button row felt detached from the content above it.

### Decision

Introduce `src/components/sidebar/EditorRail.tsx` — a vertical, segmented rail anchored at the sidebar's content-facing edge that consolidates the slider's control surface into one place.

Concrete contract:

- **Position**: `position: fixed`, anchored via `--sidebar-width` and `--app-header-height` CSS variables set by `GenericDataViewPage` (so the chrome owns the geometry; the rail is layout-agnostic to its host).
- **Segments by mode**:
  - **View:** collapse `«`, edit-pen `✏`.
  - **Edit:** collapse `«`, cancel `⊗`, save `💾`.
- **Color highlights**: pen is always `primary.main` (the only call-to-action in view mode); cancel and save fill `primary.main` when `isDirty`, neutral otherwise. Icons fill — no background swatches. Save also stays disabled (gray) when `!isDirty || saving`.
- **Discard flow**: collapse-or-cancel while dirty opens a single reusable confirm dialog (Cancel / Discard / Save). Internal state tracks `confirming: 'collapse' | 'cancel' | null` so Discard knows whether to revert-and-go-to-view (cancel) or close the pane (collapse).
- **Side awareness**: a `side?: 'left' | 'right'` prop drives chevron direction, border-radius, and shadow casting. Box-shadow is directional — for `side='right'` the rail casts only leftward and downward (into the content area), never onto the sidebar surface, so the rail reads as part of the details panel rather than a floating chip.

Two enabling chrome changes shipped alongside the rail:

- **`Sidebar.tsx` z-index 20 → 30.** The sidebar Box and the resizer Box were both at `zIndex: 20` since Inanna's initial scaffold (see memory note `project_sidebar_zindex_inanna.md`). Equal z-indices made the DOM-later resizer paint atop the sidebar's stacking context — which now contains the position:fixed rail at `theme.zIndex.fab`. Bumping the sidebar one tier lifts its whole stacking context (rail included) above the resizer. Latent bug, exposed by the rail.
- **Inner-edge divider line removed.** `Sidebar.tsx` previously rendered `1px solid theme.palette.divider` on the content-facing edge. With the rail flush against that edge, the 1 px gray seam ran straight through the rail's right side, breaking the "rail is part of details" illusion. Removed — the rail's paper bg now flows seamlessly into the sidebar's.

`ToggleButton.tsx` is deleted. With selection-driven slider state already in place (row click → `editingItem` → chrome's effect at `GenericDataViewPage.tsx:118` calls `toggleSidebar()`), the manual expand affordance is redundant. The rail handles close-while-open; selection handles open-when-closed.

### Alternatives considered

| Option | Why rejected |
|---|---|
| **Single FAB-style action button** (one icon, opens a popover with Save / Cancel / View toggle) | Two-click for the primary action (save). Discoverability worse — users have to open the popover to learn what's available. Loses the "icons reflect mode" affordance. |
| **Keep `ToggleButton` + add the rail** (two collapse mechanisms) | Redundant: selection always opens the sidebar, so the manual chevron is never the only path. Adding the rail's `«` alongside ToggleButton's `<` doubled the surface area for the same job. |
| **Render rail via `React.createPortal` to `<body>`** (bypass the sidebar's stacking context entirely) | Loses CSS variable inheritance — `--sidebar-width` lives on the chrome Box and propagates by DOM ancestry. Portaling to body forces either prop-drilling or a Context provider just for layout values. The z-index bump on the existing parent is cheaper. |
| **MUI `theme.shadows[3]` symmetric shadow** | Bleeds shadow onto the sidebar's paper surface, making the rail look like a detached floating chip rather than an extension of the details panel. Directional shadow fixes this. |
| **Eye icon for the view-mode toggle** (shipped in the rail's first iteration) | `View` doesn't imply `discard`, but switching from edit-mode → view-mode while dirty would orphan unsaved edits with no visible warning. Replaced by an explicit cancel (`⊗`) that reverts the form via `hydrateFromRow(vehicle)` and confirms when dirty. |
| **Per-feature inline trio (status quo)** | The original layout. The trio took permanent space in the form, fought the new horizontal field grid for header room, and forced every feature using the slider to re-implement the same close/save/discard wiring. |

### Consequences

- Sidebar collapse/expand is now **selection-driven across all pages**. The empty sidebar is unreachable — there is no manual "toggle sidebar" affordance once `ToggleButton` is gone. This is fine for current consumers (every page opens the sidebar via row click), but a future feature that needs a hand-toggled empty sidebar will need to bring its own affordance.
- The discard dialog lives **inside the rail** rather than the host feature. `VehicleDetails` no longer renders any Dialog — it just supplies `onCollapse`, `onEnterEdit`, `onCancelEdit`, `onSave`, `isDirty`, `saving`, and `mode`.
- `EditorRail` is presently consumed only by `VehicleDetails`. Other data views (`vehicle-types`, `deck-plans`) keep their existing `WorkAreaContent`-style trio. Lifting the rail to other consumers is a deliberate follow-up — see below.
- `theme.zIndex.fab` (1050) is the rail's z-index. Modals/dialogs at z-1300+ still paint above it, so the discard dialog renders correctly even though it's rendered from inside the rail.
- The directional shadow is hand-rolled (`'-3px 3px 6px ... , -1px 1px 2px ...'`); if MUI ever ships a directional `theme.shadows` API, swap to that.

### Out of scope

- Per-segment keyboard shortcuts (e.g. `Esc` → collapse, `Cmd+S` → save).
- Adapting `vehicle-types` and `deck-plans` to render `EditorRail` instead of their current trios.
- Showing a drag-handle hint inside the rail to compensate for the resizer being hidden behind the rail in their vertical overlap.
- Animating segment additions/removals when mode flips between view and edit.

---

## Split `src/data/vehicles/` into `projection/` + `xml/` _(2026-05-16)_

### Context

When Sobek's dedicated `vehicles(...)` GraphQL query landed (entur/sobek#123) and Hathor cut over from the `fetchVehicleTypes` flatten (issue #72), two genuinely different shapes of a "vehicle" coexisted in the same directory:

- **GQL read shape** — camelCase, joined `transportType` sub-object, optional nullable fields, consumed by the list view (sort, filter, cells, URL effects).
- **NeTEx write shape** — PascalCase, `Ref<'TransportType'>` foreign keys, generated by netex-ts-gen, consumed by the XML import path (`buildVehiclePairXml`, `Vehicle-mapping`, `parseVehicleImportResponse`).

The flat `src/data/vehicles/` mixed both, and the local types file was misleadingly named `vehicleTypes.ts` — readable as "VehicleType the entity" rather than "types local to the vehicles/ feature, plural". A new contributor opening the directory had no way to tell at a glance which file served which role.

### Decision

Carve `src/data/vehicles/` into role-aligned subdirs:

- **`projection/`** — GQL-read side: row type, fetcher + test, data hook, sort, view config, URL effect, cells.
- **`xml/`** — NeTEx-write side: generated types (`Vehicle.ts`, `VehicleModel.ts`), mapping helpers (`*-mapping.ts`), builder (`buildVehiclePairXml.ts`), parser, save hook.
- **root** — bridges + page entry + generic UI: `VehicleView` (page), `VehicleDetails` / `VehicleEditForm` / `vehicleFormDefaults` / `NewVehicleFab` (form bridges that consume both shapes), `useDirtyFormBlock` + `SaveErrorSnackbar` (pure utilities with no NeTEx coupling).

Companion rename in the same commit: `vehicleTypes.ts` → `projection/vehicleGqlShaped.ts`, and the row interface `VehicleRow` → `VehicleGQLShaped`. The new type name is honest about origin (GQL projection) and distinct from the NeTEx-shaped `Vehicle` in `xml/`. ESLint config's netex-ts-gen exemption paths follow the moves.

### Usage rule

**Projection types are read-side only.** `VehicleGQLShaped` (and any future sibling in `projection/`) exists to power **search, list, filter, sort, and other page-level view affordances**. It is a deliberately lossy GQL camelCase projection — joined display fields like `transportType.name` ride along, but most of the NeTEx body is absent by design.

**Detail / edit / post workflows must use the NeTEx shape.** Anything that hydrates a sidebar form, mutates Vehicle/VehicleModel state, or POSTs to `/import` round-trips through `xml/Vehicle.ts` + `xml/VehicleModel.ts` (the netex-ts-gen output). Concretely:

- The form's value type is `VehicleEditFormValue = { vehicle: Vehicle; model: VehicleModel }` — NeTEx types, not projection types.
- The form is hydrated from `useVehicle(id)` → fetched NeTEx XML → parsed via `xml/Vehicle-parser`. **Never** from the GQL row's projection.
- Save goes the other way: form → `xml/Vehicle-mapping` → `buildPublicationDeliveryXml` → `/import`. **Never** a GQL mutation off the projection shape.

This boundary is what makes the round-trip honest. A projection row carries display-flattened data the import path doesn't recognise and is missing fields the import path requires; using it as a write source loses information silently.

### Alternatives considered

| Option | Why rejected |
|---|---|
| **Keep flat, just rename the types file** | Fixes the worst confusion (the `vehicleTypes.ts` collision) but leaves the read/write boundary buried. The next contributor still has to read every file to know which is which. |
| **Drop `VehicleGQLShaped` entirely; use the NeTEx `Vehicle` type as the row type** | Considered explicitly during the planning grill. The NeTEx type has `TransportTypeRef: Ref<'TransportType'>` (a bare string FK), which throws away the joined display data (`name`, `transportMode`) the chip filter and list cells need on the row directly. The whole point of the new `vehicles(...)` query is that the join is server-side; recovering it client-side defeats the cutover. Two shapes serving two roles is honest. |
| **Compose: `VehicleRow = Pick<Vehicle, ...> & { transportType?: ... }`** | Forces the GQL projection in `fetchVehicles.ts` to rename camelCase → PascalCase (eight extra lines), and the `$version: string` (NeTEx) vs `transportType.version: number` (GQL) collides consistency-wise. Pure cost, no clarity gain. |
| **Three subdirs (`projection/`, `xml/`, `bridge/` or `ui/`)** | The bridge files are six in total — small enough to fit at root. A third subdir name (`form/`? `ui/`? `details/`?) is hard to choose without forcing the question now, and phase-2 save work on #69 will probably re-cluster these files anyway. Defer the third bucket until there's evidence one is needed. |
| **Carve later, in a follow-up PR after the GQL cutover** | Considered as the conservative option. Rejected because the type-rename was already in scope (`VehicleRow` → `VehicleGQLShaped`), every file that imports the types was already changing, and `git mv` rename-detection makes the diff cheap. Doing the split second would re-touch the same import paths for zero added review signal. |

### Consequences

- The `projection/` ↔ `xml/` boundary is enforced by directory layout, not lint rules. A bridge file at root may import from either subdir; a `projection/` file should not import from `xml/` and vice versa. Today this holds by inspection; if drift becomes a concern, an ESLint `no-restricted-imports` rule can codify it.
- The `vehicleGqlShaped.ts` filename advertises the shape's *origin* (GQL camelCase projection) rather than its *role* (display row). When the row carries more than the GQL alone supplies (e.g. derived/computed fields, columns from a second query), the name could grow misleading again. Rename then.
- `Vehicle.ts` and `VehicleModel.ts` are the **XML truth**, not "the truth". The list view's truth lives in `projection/vehicleGqlShaped.ts`. Documenting this in their adjacent files (rather than only in this DR) is worth doing the next time those files are touched.
- The split exposes a latent question about the bridge files — `VehicleDetails`, `VehicleEditForm`, `vehicleFormDefaults` straddle both worlds by design. Phase-2 form work (#69) is the right moment to decide whether they earn their own subdir or stay at root.

### Out of scope

- An ESLint rule enforcing the cross-subdir import direction.
- Moving the bridge files into a third bucket.
- Carving any other data feature (`vehicle-types/`, `deck-plans/`) the same way — they don't yet have a write-side worth separating.

---

## Retire the `EditActionCell` per-row edit-button convention _(retroactive, captured 2026-05-22)_

### Context

Inanna's scaffold shipped a single convention for "edit a row": every data table carried an `actions` column whose cell was an `EditActionCell` — a pencil `IconButton` that called `setEditingItem({ id, EditorComponent })`, opening a standalone editor component in the sidebar slot (`EditingContext` → `SidebarContent.tsx:7-8` renders `EditorComponent` with `itemId`). The old `DEV_GUIDE.md` "Adding a New Data Table Page" tutorial taught it as Step 3 (write a `<Feature>Editor.tsx` taking only `itemId`) + Step 4 (write a `cells/EditActionCell.tsx` wiring the row to it).

Over the vehicle-feature work this convention was abandoned page by page, but never as a recorded decision. The fallout: `src/data/vehicle-types/cells/EditActionCell.tsx` and `src/data/vehicle-types/VehicleTypeEditor.tsx` sat as dead, unimported code, and the [`?selected=` ADR](#vehicle-deep-link-via-selected-query-param-retroactive-captured-2026-05-12)'s Consequences still asserted `vehicle-types`/`deck-plans` do direct `setEditingItem` writes — no longer true.

### Decision

The per-row `EditActionCell` → standalone `itemId`-editor convention is retired. A row's "open the editor" affordance is no longer one uniform cell type; each page picks the affordance matching its detail UX:

- **`/vehicle-types`** — the **ID column** renders `<Chip component={Link} to={/vehicle-types/:id}>` (`vehicleTypeViewConfig.tsx:24-39`). Navigates to the full-page `VehicleTypeDetails` route.
- **`/deck-plans`** — a dedicated **`edit` column** renders `<Button variant="text">Edit</Button>` whose `onClick` does `navigate('/deck-plans/:id')` (`deckPlanViewConfig.ts:33-44`). Navigates to the full-page `DeckPlanDetailsView` route.
- **`/vehicles`** — **whole-row click** via `vehicleViewConfig.useRowClick` (`vehicleViewConfig.tsx:82`) → `navigate('/vehicles?selected=<id>')`. The param is reconciled into `EditingContext` by `useVehicleUrlSelection.tsx:75-77`, opening `VehicleDetails` in the sidebar slider — see the [`?selected=` ADR](#vehicle-deep-link-via-selected-query-param-retroactive-captured-2026-05-12).

`EditActionCell.tsx` and `VehicleTypeEditor.tsx` are deleted as dead code (branch `cleanup/unused-removal`).

`EditingContext` itself is **not** retired. It still backs the `/vehicles` slider — but its sole writer is now `useVehicleUrlSelection`, and the editor it commits is an inline closure `() => <VehicleDetails vehicle={row} onSaved={refetch} />`, not a standalone `itemId`-only component. The gap between that closure and the `EditorComponent: ComponentType<{ itemId: string }>` contract (`EditingContext.tsx:12`) is the live design question tracked in `OPEN_QUESTIONS.md`.

### Alternatives considered

| Option | Why rejected |
|---|---|
| **Keep `EditActionCell` as the one uniform convention** | A pencil-button-to-sidebar works for a quick inline edit, but `vehicle-types` and `deck-plans` grew full-page details routes (`/vehicle-types/:id`, `/deck-plans/:id`) holding more than a slider can. Layering a pencil button onto a route the page already owns is two affordances for one job. |
| **Make every page use whole-row click** | Fits `/vehicles` (slider, no route). For a page with a full details *route*, an explicit chip/button keeps the row's other interactions (text selection, the ID chip's own link target) unambiguous. Left per-page. |
| **One details affordance shared by all three pages** | Would mean either dragging `/vehicles` onto a `/vehicles/:id` route (rejected in the `?selected=` ADR — no per-id endpoint) or dropping the deep-link slider. Not worth re-litigating a settled decision for cell-level uniformity. |
| **Silently delete the dead files, no ADR** | The convention drop is exactly the non-obvious call this log exists for. Without it, a contributor reading the old tutorial pattern — or the stale `?selected=` consequence — has no signal it was deliberate. |

### Consequences

- `EditActionCell.tsx` and `VehicleTypeEditor.tsx` are removed; `cells/` under `vehicle-types/` keeps only `VehicleListCell.tsx`.
- The `DEV_GUIDE.md` tutorial that taught the editor-component + `EditActionCell` steps is gone — `DEV_GUIDE.md` is now a stub pointing at the global `inanna-fork` skill, the maintained source for the data-table pattern.
- **In-cell affordances are inconsistent by page:** `vehicle-types` puts a `<Link>` on the *ID* chip, `deck-plans` adds a separate *Edit* button column. Same destination shape (a `/<entity>/:id` route), two cell idioms. Converging them is a deliberate follow-up, not done here.
- The [`?selected=` ADR](#vehicle-deep-link-via-selected-query-param-retroactive-captured-2026-05-12)'s line-56 Consequences bullet is corrected to mark this supersession.
- `OPEN_QUESTIONS.md`'s entry that cited `EditActionCell.tsx:19` as the `{ id, EditorComponent }` contract exemplar has been reworded to drop the dead-file reference and describe the convention in the past tense; its underlying question — who owns slider selection — remains open.

### Out of scope

- Converging the `vehicle-types` ID-chip link and the `deck-plans` Edit-button column into one shared in-cell "go to details" affordance.
- Resolving the `EditorComponent` closure-vs-`itemId` contract mismatch for `/vehicles` (tracked in `OPEN_QUESTIONS.md`).

---

## Relocate Autosys import UI into `data/vehicle-imports/components/` _(2026-05-22)_

### Context

`README.md`'s "Where new files go" rule splits `src/` into vertical feature folders
(`data/<feature>/`, entity-specific) and horizontal file-kind folders (`components/`,
generic/shared UI). An audit of `src/components/` on branch `cleanup/unused-removal`
found one folder that sat on the wrong side of that line:

- `components/external-inputs/autosys/` held the entire UI for the **vehicle-imports**
  feature — a `MultiImport` stepper plus four step sub-components, and a dead
  `SingleImport` workflow. Every file imported from `data/vehicle-imports/`, which
  itself contained only the data/service layer (fetchers, parsers, assemblers, and
  `__tests__/`) — a feature whose code lived in two places, split by file-kind rather
  than feature.
- `components/dialogs/AutosysImportFloatingMenu.tsx` — the FAB that launches the
  `MultiImport` dialog — sat in the *generic* `dialogs/` sub-area despite being
  import-specific and consumed by exactly one page (`VehicleTypeView`).

`external-inputs/` was the only `components/` sub-area dedicated to a single feature's
UI; the rest (`data/`, `search/`, `header/`, `sidebar/`, `dialogs/`, `common/`, `auth/`)
are genuinely cross-feature.

### Decision

Move the `MultiImport` stepper (5 files) and the launcher FAB into a new
`src/data/vehicle-imports/components/` subdir, so the feature owns its UI alongside its
data layer. Delete the dead `SingleImport`/`SingleImportQuery`/`SingleImportConfirm`
trio — `SingleImport` was deactivated (it posts raw Autosys XML without injecting
`OperationalNumber`) and had no importers. Drop `external-inputs/` from the
`components/` sub-area list in `README.md`.

The UI lands in a `components/` *subdir* of the feature folder rather than at the
feature root: `data/vehicle-imports/` already carried 9 data-layer files plus
`__tests__/`, and a `components/` subdir keeps UI separate from service code. This is
the bulletproof-react feature-folder convention (an explicit `components/` dir for
feature-scoped components) and reads consistently with the existing `cells/` subdir
under `vehicle-types/`.

### Alternatives considered

| Option | Why rejected |
|---|---|
| **Keep `external-inputs/` as a `components/` sub-area** | It only ever held one feature's UI. The README rule sends entity-specific files to `data/<feature>/`; honouring it removes a sub-area that never generalised. |
| **Move the UI flat to the `data/vehicle-imports/` root** | Would interleave 6 UI files with 9 data-layer files + `__tests__/` in one directory, with no signal which serves which role — the same readability problem the `vehicles/` `projection/`+`xml/` split solved. |
| **Name the subdir `ui/` instead of `components/`** | `components/` is the bulletproof-react convention and reads as the natural sibling of the existing `cells/` subdir. `ui/` invents a third term for "feature-scoped components". |
| **Keep the FAB in `components/dialogs/`, move only the stepper** | Splits one feature's UI across two trees again. The FAB is the import flow's entry point and contains zero vehicle-type logic — it belongs with the flow it launches. |
| **Delete only the dead files, leave the rest** | Addresses the `cleanup/unused-removal` branch theme but leaves the larger misfile (a feature's UI in a horizontal folder) in place. |

### Consequences

- `data/vehicle-imports/` now owns its UI; the feature is no longer split across
  `data/` and `components/`.
- `components/` no longer has an `external-inputs/` sub-area — every remaining sub-area
  is cross-feature.
- Introduces a third within-feature subdir idiom — `components/` — alongside
  `vehicles/`'s `projection/`+`xml/` and `vehicle-types/`'s `cells/`. A feature folder
  may now hold a `components/` subdir for its feature-scoped UI.
- `VehicleTypeView` imports the FAB from `../vehicle-imports/components/` — a deliberate
  cross-feature import: the vehicle-types page hosts the launcher for an import flow
  that produces vehicle types.

### Out of scope

- `components/Menu.tsx`, which sits loose at the `components/` root rather than in a
  sub-area — left as-is.
- Renaming `AutosysImportFloatingMenu.tsx` or the `MultiImport*` files.
- Carving any other `components/` sub-area; the rest is genuinely generic.

---

## Transport-mode icon strategy: inline SVG sprite over file-per-icon _(2026-05-26)_

> **Superseded in part (2026-06-04)** by _"TransportMode carries Sobek's UPPER_CASE enum; UNKNOWN de-specialized"_ at the end of this file. The sprite-over-file-per-icon decision stands. What changed: the `var(--tm-${mode}, var(--tm-unknown))` colour fallback and the "any mode not in the sprite → `#tm-unknown`" symbol fallback are replaced by a dedicated `tm-fallback` glyph; `UNKNOWN` and `OTHER` become ordinary modes with no special branch; mode ids are UPPER_CASE; all hand-curated subsets are removed (chips are data-driven, icons resolve by identity) — the only mode list is the 21-member schema enum.

### Context

VehicleType list (#23) and Vehicle list (#24, partially shipped via #26) both need
to render a `TransportMode` cell. Two infrastructures were on the table:

1. Hathor's existing two-tier icon resolver (`src/utils/iconLoaderUtils.ts`), which
   serves menu/settings/home icons from `defaultIcons/` with optional
   `customIcons/` override.
2. The inline SVG sprite developed in `concept-sandbox/claude-design.html` on the
   `ui-sandboxing` branch, with `<symbol id="tm-…">` defs and per-mode
   `--tm-<mode>` CSS color tokens.

The 2026-05-11 brainstorming on #23 picked option 1. That decision was never
codified here; it lived only in the issue body. As of 2026-05-26, with the sprite
POC visually settled and the per-mode color dimension confirmed as a UX
requirement, we are landing the sprite choice formally and recording
file-per-icon as the considered alternative.

### Decision

Transport-mode icons render via a single inline SVG sprite, mounted once at app
root. The sprite is the **only** rendering primitive for transport-mode icons;
they do not go through `getIconUrl()`.

Concrete contract:

- `src/components/icons/TransportModeSprite.tsx` mounts a hidden
  `<svg style="display:none"><defs><symbol id="tm-…"></defs></svg>` block at app
  root.
- `src/components/icons/TransportModeIcon.tsx` is the rendering primitive:
  `<svg><use href={`#tm-${mode}`}/></svg>` with
  `color: var(--tm-${mode}, var(--tm-unknown))`. Symbol-level fallback maps any
  mode not in the sprite to `#tm-unknown`. The component exposes a single
  optional prop `iconPosition: 'left' | 'right'` that, when set, renders the
  localized label inline.
- Per-mode color tokens (`--tm-bus`, `--tm-tram`, …) live in
  `src/theme/transportModeTokens.css`, imported once. Future move into the
  theme JSON loader is out of scope.
- Norway-specific glyph variants (T-banen, etc.) are modelled as alternate
  symbol ids (`tm-metro-nb`), toggled in the same component by the existing
  `useCustomFeatures` flag. They are NOT served via `customIcons/`.
- `iconLoaderUtils.ts` and the `defaultIcons/` + `customIcons/` two-tier remain
  untouched and continue to serve every other icon class (menu, settings, home,
  etc.).

### Alternatives considered

| Option | Why rejected |
|---|---|
| **File-per-icon via `getIconUrl`** (the original 2026-05-11 pick) | Forces hand-tinted SVGs for the 15 NeTEx modes (no `currentColor` route), 15× the asset work for the same visual result. The `customIcons/` two-tier was attractive as a Norway-variant mechanism, but alternate `<symbol>` ids do the same job without runtime FS access. |
| **MUI `<DirectionsBus />` etc. inline** | Bypasses the asset pipeline entirely but loses fine control over visual weight and per-mode color tokens. Couples the cell shape to MUI's icon-naming taxonomy. |
| **Lift sprite AND keep `customIcons/<mode>.svg` override** | Double mechanism. The cell would need to choose between sprite and resolver per mode, doubling surface area for no current consumer. YAGNI. |

### Consequences

- Hathor's `iconLoaderUtils.ts` remains byte-identical to Inanna's. The
  divergence is purely additive: a new component class that Inanna doesn't yet
  have.
- Inanna issue #5's `getIconKey` resolver-prop refactor still applies to every
  other icon class; transport modes are simply outside its scope.
- Adding a new transport-mode glyph is a single PR that adds a `<symbol>` block
  to `TransportModeSprite.tsx` plus a `--tm-<mode>` token. No file drop into
  `defaultIcons/`, no resolver change.
- The `concept-sandbox/claude-design.html` POC is now the canonical source for
  the lifted symbol shapes. The sandbox itself is unchanged; only its sprite
  block is mirrored into `src/components/icons/`. `concept-sandbox/README.md`
  cross-links the two sides.
- Future filter chips (#24) reuse `TransportModeIcon` directly, so the icon
  dimension on `/vehicles` can be added later without changing the cell layer.

### Out of scope

- Theme integration of `--tm-*`.
- Norway-variant `<symbol>` blocks.
- Reuse on the existing `/vehicles` `TransportModeChip` cell.

---

## Drop `projection/` + `xml/` subdirs; adopt bulletproof-react segmentation _(2026-05-28)_

### Context

The 2026-05-16 split carved `src/data/vehicles/` into role-aligned subdirs (`projection/` for the GQL-read side, `xml/` for the NeTEx-write side). The read/write boundary it captured is real, but as a *naming convention for every feature* it's an ad-hoc one — and the project has since converged on bulletproof-react's per-feature segmentation as the house style.

### Decision

Every `src/data/<feature>/` follows bulletproof-react's sub-areas:

```
src/data/<feature>/
  api/         — fetchers, mutations, GQL/REST adapters, NeTEx XML builders/parsers
  assets/      — images/icons local to the feature
  components/  — feature-only React components
  hooks/       — feature-only hooks
  stores/      — feature-only state (context/reducer)
  types/       — feature-local types (incl. generated NeTEx + GQL projections)
  utils/       — feature-only helpers
```

Omit any sub-area that's empty. The read/write semantics that motivated `projection/` and `xml/` are preserved by file/type naming (`*GqlShaped`, `Vehicle.ts` for NeTEx) and by JSDoc on the relevant `types/` files — not by directory name.

### Supersedes

- _Split `src/data/vehicles/` into `projection/` + `xml/`_ (2026-05-16). `projection/` collapses into `api/` + `types/`; `xml/` collapses into `api/` + `types/`.

### Consequences

- `vehicles/projection/*` → `vehicles/api/` (fetcher, hook) + `vehicles/types/` (`vehicleGqlShaped.ts`).
- `vehicles/xml/*` → `vehicles/api/` (builder, save hook, parser) + `vehicles/types/` (generated `Vehicle.ts`, `VehicleModel.ts`, `*-mapping.ts`).
- Bridge components at `vehicles/` root (`VehicleDetails`, `VehicleEditForm`, cells, etc.) move into `vehicles/components/`.
- Cross-feature UI keeps living under `src/components/` (e.g. `src/components/FormLayout.tsx`) — bulletproof-react's segmentation is per-feature, not global.
- Migration is incremental: rename when a feature is being touched anyway. No big-bang move; the ESLint netex-ts-gen exemption paths update with each carve.

### Out of scope

- An ESLint `no-restricted-imports` rule enforcing direction of cross-area imports inside a feature.
- Renaming the existing `vehicle-types/`, `deck-plans/`, `vehicle-imports/` features pre-emptively — they get reshaped the next time they're touched.

---

## Replace right-anchored Menu Drawer with persistent left Nav Rail _(2026-05-29)_

### Context

Inanna's stock `Menu.tsx` was a right-anchored persistent Drawer that rendered its own primary-colored Toolbar (logo + chevron close) covering the AppBar's rightmost ~280px. Two visible flaws on desktop: the brand appeared twice (`HeaderBranding` at top-left, Drawer Toolbar at top-right), and the Drawer's own Toolbar visually clashed with the AppBar instead of sitting beneath it. On mobile the Drawer went full-width, masking the AppBar entirely.

GH #65's original addendum proposed flipping the Drawer to the left and relocating the hamburger to the AppBar start. That solved anchor consistency but left the underlying logo-dup and AppBar-overlap pain untouched.

### Decision

Replace the Drawer entirely with a Material 3 Navigation Rail (MUI Mini-Variant Drawer pattern):

- **Desktop:** persistent rail at `top: 64px, left: 0, bottom: 0`. Width toggles between `RAIL_COLLAPSED_W = 64` (icons only) and `RAIL_EXPANDED_W = 280` (icons + labels). In-rail top-slot toggle using the same `getIconUrl('menu')` custom-icon-set asset as the rest of the chrome (no icon-flip on state). Active route highlighted via MUI native `<ListItemButton selected>`. Collapsed-state disambiguation via `<Tooltip placement="right">` with empty-title-disables idiom.
- **Mobile:** temporary Drawer anchored left, 280px wide (`MOBILE_DRAWER_W`), no internal Toolbar header. AppBar stays visible above the drawer, so `HeaderBranding` is the sole brand surface.
- **State:** new `NavRailContext` exposes `{ expanded, toggle }`. Persisted to `localStorage` under `hathor:navRailExpanded`, default collapsed.
- **Reflow contract:** `--nav-rail-width` CSS var set on `.app-root` via a small `AppShell` helper that reads the context (gates to `0` on mobile so the content area carries no phantom gutter under the temporary drawer). Consumed by `.app-content` via `margin-left` + `0.2s` ease transition. Mirrors `GenericDataViewPage`'s `--sidebar-width` / `--app-header-height` pattern so the codebase has one consistent CSS-var reflow contract.
- **`HeaderActions` threading collapse is partial:** `onMenuIconClick` prop kept, but the trailing menu IconButton is wrapped in `{isMobile && …}`. Desktop has no AppBar trigger — the rail's in-rail toggle is the only entry point. Mobile keeps the IconButton as the drawer opener. (Full threading collapse — moving the trigger into `Header.tsx` itself — was rejected to keep file touch lower.)
- **Menu items get distinct icons:** `product` (Vehicle Types), `train` (Vehicles), `map` (Deck Plans) — disambiguation is the point of an icon rail; the previous all-`'data'` keys defeated it.

### Alternatives considered

| Option | Why rejected |
|---|---|
| #65 addendum's "flip Drawer to left + move hamburger to AppBar start" | Cheaper diff (~30 lines) but preserved both the logo-duplication and the AppBar/Drawer-Toolbar collision. |
| **Bottom navigation on mobile** (MUI `<BottomNavigation>`) | Familiar mobile pattern but introduces a divergent mental model from the desktop rail. Rejected for consistency. |
| **Always-visible 64px rail on mobile** | Mobile real estate is too tight; the rail would steal a constant 18% of a 360px phone viewport. |
| **Full-height rail with AppBar shifted right (L2)** | Visually stronger but cascades into logo-position-on-toggle shifts and a more invasive AppBar rewrite. The L1 (AppBar full-width on top, rail below) trade-off keeps `HeaderBranding` immovable. |
| **MUI `<Slide>` for the rail, drop `useResizableSidebar`** (per #65 main body) | The 200ms width transition gives the same UX as Slide; the resize handle didn't exist for the Drawer either way; nothing was lost by skipping. |
| **In-rail logo, drop `HeaderBranding`** | The rail's first slot is the toggle (per M3); pushing the logo down a slot would orphan it visually and require more AppBar surgery. |

### Consequences

- New `src/contexts/NavRailContext.tsx` (provider + hook + exported width consts). Parallels the existing one-context-per-concern pattern (`EditingContext`, `SearchContext`, `ConfigContext`).
- `Menu.tsx` keeps its filename (filenames after Inanna stay stable for `git blame` continuity) but is fully rewritten; the surviving `git mv`-free rewrite shows in diff as full file replacement, which is honest about the scope of the change.
- `Header.tsx` shrinks: local `drawerOpen` state gone, `useNavRail()` provides the toggle.
- Every page reflows. `.app-content` gains a transitioning `margin-left`. Pages that previously assumed full-viewport width no longer have it; none do today, but new full-bleed views must apply `margin-left: 0` explicitly to escape.
- Nav state persisted across reloads under `localStorage` key `hathor:navRailExpanded`. Recognize during any future localStorage-clearing migration.
- One e2e smoke test added in `e2e-tests/auth-modes.spec.ts`: clears the localStorage key, asserts rail visible, toggles via `aria-expanded` round-trip. Width assertions skipped because Playwright timing during 200ms transitions is flaky — `aria-expanded` is the stable signal.
- Closes hathor#65; supersedes that issue's addendum (which proposed the simpler Drawer-flip approach).

---

## TransportMode carries Sobek's UPPER_CASE enum; UNKNOWN de-specialized _(2026-06-04)_

Supersedes part of _"Transport-mode icon strategy"_ (2026-05-26) — the fallback/colour contract and the synthetic `'unknown'` member. The sprite-rendering decision itself is unchanged.

### Context

Hathor canonicalized transport modes to a **camelCase** vocabulary and ran a tolerant normalization engine (`toTransportMode` → `normalizeKey` + `NORMALIZED_TO_CANONICAL`) to fold every backend casing variant onto it. That engine existed only because hathor once ingested two representations — NeTEx XML (camelCase) and the GraphQL enum (UPPER_CASE). Today every vehicle / vehicle-type field arrives via GraphQL typed as the `TransportMode` enum, so the casing-fold is dead weight — and it masked a fixture bug (Playwright fixtures carried `"bus"`, not the real wire value `"BUS"`). Raised by Gunnar on PR #114 (`fetchVehicleTypes.ts`): _"Why not just go UPPER CASE?"_

Confirmed against the Sobek source: the backend (`AllPublicTransportModesEnumeration`, from netex-java-model) treats all 21 enum members uniformly — no curation, no validation, no defaulting; `transportMode` is nullable and passed through verbatim. The "13 real modes" is therefore a **hathor presentation choice only**, not a backend contract.

### Decision

- **The GraphQL enum's UPPER_CASE string values are hathor's canonical `TransportMode`** — a string-literal union of all 21 members. The model field stores exactly what Sobek sends; projection is `transportMode: vt.transportMode ?? 'UNKNOWN'` (null coalesced — Sobek does not default, so null genuinely arrives). The casing-normalization layer is deleted.
- **Both directions collapse to passthrough.** The casing-fold was bidirectional on PR #114: read used `canonTransportMode(toTransportMode(…))`, write used `toSobekTransportMode(…)` in `serializeVehicleType`. With the model holding the Sobek enum verbatim, the read projection is a passthrough and `toSobekTransportMode` becomes identity — deleted. The `?? vt.transportMode` raw-value fallback added on PR #114 to round-trip undrawn modes (FERRY, INTERCITY_RAIL) is also obsolete: the raw value *is* the canonical value.
- **`UNKNOWN` is an ordinary mode, not a special case.** It owns the `tm-unknown` glyph + `--tm-unknown` token, matched only by itself — like `BUS` matches `tm-bus`. No sort branch, no universal-fallback role, no "omitted from filters" carve-out.
- **No curated subset anywhere — icon resolution is identity.** Every one of the 21 enum members has a `<symbol id="tm-MODE">`; the ones without bespoke art are one-line aliases `<use href="#tm-fallback"/>` to a single generic glyph. The icon component references `#tm-${mode}` **directly** — no `symbolIdFor`, no `SPRITE_MODES` set. `colorVarFor(mode) = var(--tm-${mode}, var(--tm-fallback))` lets CSS fall back per-token without a list.
- **Filter chips are data-driven, not a hand-curated list.** `transportModeFilters` becomes a one-liner over the modes actually present in the loaded rows: `[...new Set(modes)].sort().map(m => ({ id: m, labelKey: transportModeLabelKey(m), defaultLabel: m }))`. The chip bar reflects the data, never a maintained subset. **Rationale (the user's call):** hathor must not decide which enum values "matter" — a useless value is removed from the Sobek schema and surfaces *there*, not via hathor curation. The only mode list in hathor is the 21-member `TRANSPORT_MODES` enum, in lockstep with the SDL (`isTransportMode` has a regression test asserting all 21).

### Consequences

- **~140 fewer LOC net** (vs ~100 in the earlier subset draft): beyond the casing engine it also deletes `toSobekTransportMode`, `symbolIdFor`, `SPRITE_MODES`, the `KNOWN_/ALL_/NORMALIZED_` sets, and collapses the 15-line `transportModeFilters` array to a one-liner. `transportMode.ts` 141→~56, `transportModeIconHelpers.ts` 46→~8. Partly offset by ~+45 lines of additive sprite-alias markup + 7 new i18n keys per locale (chips now span all 21). Exact figure from the impl `git diff --stat`.
- Playwright fixtures flip camelCase → UPPER_CASE to mirror the real Sobek wire shape (the normalizer had hidden the mismatch).
- `WATER` (general water transport) stays drawn; `FERRY` (distinct NeTEx ferry-specific mode) rides `tm-fallback` until it earns a glyph — flagged follow-up, not a `WATER` alias.
