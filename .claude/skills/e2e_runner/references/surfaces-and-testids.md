# Surfaces & testids

Per-entity create/edit surfaces, the `data-testid` inventory, and which assertions are hardcoded.
Use this when writing or auditing a spec. Line numbers drift — grep to confirm.

## Org gating (the precondition for every list)

All three list hooks early-return until an org is chosen:
- `src/data/vehicles/hooks/useVehicles.ts` — `if (!applicationBaseUrl || !currentOrganisation?.id) return;`
- `src/data/vehicle-types/hooks/useVehicleTypes.ts` — same guard (~L32-33)
- `src/data/deck-plans/useDeckPlans.ts` — same guard (~L33-34)

`useOrganisations` (`src/data/organisations/hooks/useOrganisations.ts`) auto-selects
`organisations[0]` once fetched, but only fetches when `isAuthenticated` — so in no-auth/mock mode
nothing selects an org and the list **stalls on "Loading data…"** unless the spec provides one.
The dropdown is `SelectOrganisation.tsx` (testid `organisation-select`), mounted in
`HeaderActions.tsx`, rendered only when `isAuthenticated && data !== undefined`.

**Implication for specs:** a conformant spec must guarantee a selected org before asserting on a
list — by mocking the `organisations` query + selecting (mock mode) or via the live login token
carrying role assignments (live mode). No current spec does this; it's the top conformance gap.

## Per-entity surfaces

All three create on their form page: a `NewEntityFab` on the collection page → `/<entity>/new`;
Save replaces the URL with `/<entity>/<newId>`. The old `?selected=<id>` link redirects to
`/<entity>/<id>` (#252 cut-over, 2026-11-11).

| Entity | Create | Edit | Save mutation | Notes |
|---|---|---|---|---|
| **Vehicles** | `create-vehicle-fab` → `/vehicles/new` | Edit link (`Edit <reg no / name>`) → `/vehicles/<id>`, ready to edit; footer Save | `createOrUpdateVehicle` | create needs a type (Save says what is missing) |
| **Vehicle-types** | `create-vehicle-type-fab` → `/vehicle-types/new`; **bulk** also via the Autosys import dialog on Home (`home-bulk-import-svv`) → `/vehicle-types?filter=<ids>` | Edit link → `/vehicle-types/<id>`; sections + table of contents; footer Save | `createOrUpdateVehicleType` (full-document replace) | import is a second create path |
| **Deck-plans** | `create-deck-plan-fab` → `/deck-plans/new` | Edit link → `/deck-plans/<id>`; decks in column 3, `deck-plan-show-xml` | create: `createOrUpdateDeckPlan`; edit: XML patch POST | |

The canonical "create → edit-verify → edit" maps cleanly to every entity through the form page —
but backend *persistence* can still differ per entity, so verify the read-back rather than
assuming parity from the shared surface.

## testid inventory

Collection page (`src/pages/shell/`, `src/components/collection/`): `collection-subtitle`
(organisation · count), `collection-empty`, `collection-rows`; rows are found by role —
`getByRole('link', { name: /^Edit / })`; filter chips are buttons named `…, remove filter`.

Form page (`src/components/sidebar/EditorFrame.tsx`): `<entity>-details-title` (the `h1`, focused
on open), `editor-page-back`, `editor-page-deactivate`, `editor-page-deactivated`; footer
`Save` / `Cancel` by role name; leave / discard via the `DiscardDialog` (role `dialog`).

Vehicles: `create-vehicle-fab`, `vehicle-details-title`, `bus-picture-placeholder`; fields
`#vehicle-name`, `#vehicle-transport-type`, `#vehicle-build-date`, `#vehicle-registration-date`.

Vehicle-types: `create-vehicle-type-fab`, `vehicle-type-details-title`; fields `#vtype-name`
(required), `#vtype-length`, `#vtype-euro-class`, `#vtype-maximumEngineEffectKW`, `#vtype-low-floor`.

Deck-plans: `create-deck-plan-fab`, `deck-plan-details-title`, `deck-plan-decks`,
`deck-plan-decks-placeholder`, `deck-plan-show-xml`.

Autosys import (launcher on Home `/`, needs a selected org): `home-bulk-import-svv`, `multi-import-file-input`, `multi-import-dropzone`,
`multi-import-add-input`, `multi-import-add-button`, `multi-import-tags`,
`column-mapper-reg-number`, `column-mapper-operational-ref`.

Org / header: `organisation-select` (an Autocomplete — select it as the banner's combobox), `auth-disabled-label`. NeTEx id chip: `netex-id`,
`netex-id-copy`, `netex-id-version`.

## Hardcoded counts (must become relative under live)

A fixture count (e.g. `FIXTURE_ROWS` in `vehicle-types.spec.ts`) fails against a live DB: keep it
behind `test.skip(IS_LIVE, …)` or rewrite it as `>= n` / delta-after-create. The old-list specs
that pinned `data-count` (`vehicle.spec`, `vehicle-type-filter`, `deck-plan-name-sort`) went with
the #252 cut-over.

## Fixture NeTEx ids (full `Codespace:Type:Number` form — never bare row ids)

`NMR:VehicleType:1..3`, `NMR:DeckPlan:1..10`, `NMR:Vehicle:rail-1 … unknown-1`,
Autosys import → `AUTOSYS:Vehicle:A-1`, `AUTOSYS:VehicleType:0`, `AUTOSYS:DeckPlan:0`.
