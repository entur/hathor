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

| Entity | Create | Edit | Save mutation | Notes |
|---|---|---|---|---|
| **Vehicles** | route `/vehicles/new`, button `create-vehicle-fab` | row-click → `?selected=<netexId>` sidebar; `editor-rail-edit` → fields → `editor-rail-save` | `createOrUpdateVehicle` | the only true UI create |
| **Vehicle-types** | **no create form** — Autosys import dialog `import-vehicle-multi-button` | `?selected=<netexId>` sidebar; tabs `vtype-tab-*`; `editor-rail-edit/save` | `createOrUpdateVehicleType` (full-document replace) | "create" == import |
| **Deck-plans** | **none** | row "Edit" → route `/deck-plans/:id` (not a sidebar) | n/a in specs | edit-only; read-only list |

So the canonical "create → edit-verify → edit" is literal only for vehicles; for vehicle-types it's
import → edit-verify; for deck-plans it's edit-only. Don't force a uniform create.

## testid inventory

Editor rail (`src/components/sidebar/EditorRail.tsx`): `editor-rail`, `editor-rail-collapse`,
`editor-rail-edit`, `editor-rail-cancel`, `editor-rail-save`.

Lists (`src/components/data/DataPageContent.tsx`): `total-entries` (+ `data-count`),
`url-filter-chip` (+ `data-filter-count`), `no-data-row`, `table-pagination`,
`pagination-displayed-rows`, `breadcrumbs-nav`.

Vehicles: `create-vehicle-fab`, `vehicle-details-title`, `vehicle-context`; form fields
`#vehicle-name`, `#vehicle-transport-type`, `#vehicle-build-date`, `#vehicle-registration-date`;
create feedback = "Vehicle saved" snackbar + "View in list" action.

Vehicle-types: `vehicle-type-details-title`; tabs `vtype-tab-edit` / `-propulsion` / `-capacity` /
`-environment` / `-vehicles`; fields `#vtype-name` (required), `#vtype-length`, `#vtype-euro-class`,
`#vtype-maximumEngineEffectKW`, `#vtype-low-floor`.

Autosys import: `import-vehicle-multi-button`, `multi-import-file-input`, `multi-import-dropzone`,
`multi-import-add-input`, `multi-import-add-button`, `multi-import-tags`,
`column-mapper-reg-number`, `column-mapper-operational-ref`.

Org / header: `organisation-select`, `auth-disabled-label`. NeTEx id chip: `netex-id`,
`netex-id-copy`, `netex-id-version`.

## Hardcoded counts (must become relative under live)

These pin a fixture count and will fail against a live DB — rewrite as `>= n` or delta-after-create:
- `vehicle.spec.ts` — `data-count='15'` (all), `'12'` (rail-filtered).
- `vehicle-type-filter.spec.ts` — `'3'` (all), `'1'`, `'2'` (filtered).
- `deck-plan-name-sort.spec.ts` — `'10'`.

## Fixture NeTEx ids (full `Codespace:Type:Number` form — never bare row ids)

`NMR:VehicleType:1..3`, `NMR:DeckPlan:1..10`, `NMR:Vehicle:rail-1 … unknown-1`,
Autosys import → `AUTOSYS:Vehicle:A-1`, `AUTOSYS:VehicleType:0`, `AUTOSYS:DeckPlan:0`.
