# Vehicle save feedback + new-vehicle redirect — Design

**Date:** 2026-05-18
**Branch target:** `fix/vehicle-save-feedback` (new)
**Scope:** Hathor only (frontend). No Sobek changes.

## Problems

### P1. No user feedback on save success in the create flow

`src/pages/VehicleCreatePage.tsx:20-26`

```ts
const handleSave = async () => {
  const result = await save(form);
  if (result.error) return;
  navigate(result.newId ? `/vehicles?selected=${encodeURIComponent(result.newId)}` : '/vehicles');
};
```

The page navigates immediately on save success. Only `SaveErrorSnackbar` is mounted — there is no success affordance. The user perceives a "fast close" with no confirmation that the save actually succeeded.

The slider edit flow (`src/data/vehicles/VehicleDetails.tsx:71-77`) does mount `SaveSuccessSnackbar`, but bottom-center on a right-anchored slider is easy to miss, and `setMode('view')` snaps the form into read-only mode at the same moment, reinforcing the "fast close" feeling.

### P2. `/vehicles?selected=<newId>` lands on the "not found" body after create

After `VehicleCreatePage` navigates to `/vehicles?selected=<newId>`, the list is fetched fresh by `useVehicles`. The new id is **not yet** in the response because the create-time list cache is gone and the new fetch arrived before — or independent of — the new row being indexed for the GraphQL response.

`src/data/vehicles/projection/useVehicleUrlSelection.tsx:48-73` then commits `vehicle=null` and the idempotence guard at line 62 (`lastCommittedIdRef.current !== selected`) locks the slider on the not-found body even if a later refetch surfaces the row.

The doc comment at lines 23-30 already warns about this exact class of bug for cross-page nav from `/vehicle-types`. The create flow is the same shape: deep-link into `/vehicles?selected=<id>` when `<id>` is not in the next list response.

## Solution

### S1. Action snackbar in `VehicleCreatePage`

On save success, **stay on `/vehicles/new`**. Show `SaveSuccessSnackbar` with an action button labelled "View in list" (`vehicles.saveSuccess.viewInList`). Clicking the action triggers the navigation to `/vehicles?selected=<newId>`.

Rationale: smallest UX change that makes success unmissable. Also sidesteps the redirect race because navigation is user-initiated and we can do the list refetch + await in the action handler before the URL changes.

Component changes:
- Extend `SaveSuccessSnackbar` to optionally accept `action?: { label: string; onClick: () => void }`. Default render is unchanged when `action` is omitted.
- `VehicleCreatePage` mounts the snackbar, sets `savedNewId` on success, passes an action that calls `navigate(...)` when clicked.

### S2. Poll the `/vehicles` list until the new id appears (F2)

A naive one-shot warm of the list is useless — `useVehicles` doesn't share its cache with the create page, so it re-fetches on mount regardless. Worse, real backends have read-after-write replica lag, so a single `fetchVehicles` call right after import may still miss the new id.

`src/data/vehicles/waitForVehicleInList.ts` polls `fetchVehicles` until the id appears or attempts (default 5) are exhausted, with a small delay between attempts (default 250ms). The handler awaits this before navigating, so when `/vehicles` mounts and fires its own fetch the backend has demonstrably surfaced the row.

If polling exhausts its budget the handler still navigates — the slider's not-found body is the honest fallback and the F1 guard below recovers if a later refetch resolves the row.

### S3. Re-commit on row-content change (F1)

In `useVehicleUrlSelection.tsx`, broaden the commit trigger from id-only to id-or-row-content. Two reference cells: `lastCommittedIdRef` and `lastCommittedRowRef`. Re-commit when:
- `selected` differs from the committed id (new deep-link), OR
- the resolved row's *content* differs from the committed row (null → found after a refetch, or fields updated).

Content equality uses `JSON.stringify(row)` rather than reference equality, because `allData[idx]` is a fresh object on every sort-memo recomputation — reference equality would re-commit on every render and wipe the editor's `mode` state (the original bug the idempotence guard was added to fix).

Independent of S2; both reinforce each other. F1 alone catches the deep-link-with-stale-list case; F2's poll keeps F1 from being load-bearing in the happy path.

## Out of scope

- Slider-edit "fast close" feel — `SaveSuccessSnackbar` already mounts; leave as-is for now. If the user later wants the snackbar repositioned (e.g. top of slider), file separately.
- Auto-toast that survives navigation (rejected approach B) — would require a global toast context.
- Modal confirmation popup (rejected approach C) — heavy for happy path.
- Sobek-side read-after-write consistency. We're solving this client-side.

## TDD — Playwright `no-auth` specs (write first, fail, then make pass)

New file: `e2e-tests/no-auth/vehicle-create-feedback.spec.ts`

### Mock contract

- POST `**/import` → 200, response body is NeTEx XML containing `<Vehicle id="NMR:Vehicle:NEW-1" version="1">…</Vehicle>` so `parseVehicleImportResponse` returns `"NMR:Vehicle:NEW-1"`.
- GraphQL `vehicles(...)` query → first call returns the baseline mock from `e2e-tests/fixtures/vehicles-list-mock.json`; **subsequent calls** return that list **plus** an extra row with `id: "NMR:Vehicle:NEW-1"`.
- GET single-vehicle NeTEx XML for `NMR:Vehicle:NEW-1` → returns a minimal but valid Vehicle XML so `useVehicle` resolves to a parsed Vehicle.

Mocks live alongside the helpers in `e2e-tests/no-auth/vehicle-list-helpers.ts` (extend, do not duplicate).

### Specs

1. **`create → success snackbar visible with action`**
   - `goto('/vehicles/new')`
   - Fill the minimum required form fields (registrationNumber, transportTypeRef — whatever the validator enforces; if none, just click save).
   - Click `editor-rail-save` (or whatever the create page's save trigger is — `GenericDetailsPage`'s save button).
   - Expect a visible `SaveSuccessSnackbar` containing the action button labelled "View in list".
   - Expect the URL is still `/vehicles/new` (no auto-navigation).

2. **`action button → navigates to slider on new id, NOT not-found`**
   - From the state of spec 1, click the action button.
   - Expect URL becomes `/vehicles?selected=NMR%3AVehicle%3ANEW-1`.
   - Expect `data-testid="vehicle-details-title"` to be visible.
   - Expect the "Vehicle not found" body to **not** be present.

3. **`cross-page deep-link with stale list also resolves (regression for F1)`**
   - Mock list to return baseline (no `NMR:Vehicle:NEW-1`) on first call, then the extended list on second call.
   - `goto('/vehicles?selected=NMR%3AVehicle%3ANEW-1')` directly.
   - Trigger a refetch (e.g. wait for poll, or fire a manual reload of the page).
   - Expect the slider eventually shows the resolved vehicle, not the locked "not found" body.

(Spec 3 may need refinement once we see how to actually re-fire list fetches in the test harness — it might need a manual nav-away-and-back if no refetch trigger is exposed. We'll resolve during implementation.)

## Implementation order (after specs are written and red)

1. Extend `SaveSuccessSnackbar` to accept an optional `action`.
2. Wire `VehicleCreatePage` to mount the snackbar with the "View in list" action; remove the immediate `navigate` from `handleSave`.
3. Action handler: `await fetchVehicles(...)`; then `navigate('/vehicles?selected=...')`.
4. Patch `useVehicleUrlSelection` so null commits don't lock the ref.
5. Translation keys in `src/locales/en/translation.json` and `src/locales/nb/translation.json`: `vehicles.saveSuccess.viewInList`.

Each step should make one or more specs go green.

## File-touch summary

- `e2e-tests/no-auth/vehicle-create-feedback.spec.ts` — new
- `e2e-tests/no-auth/vehicle-list-helpers.ts` — extend with create-flow mocks
- `src/data/vehicles/SaveSuccessSnackbar.tsx` — add optional `action`
- `src/pages/VehicleCreatePage.tsx` — mount snackbar, drop immediate nav
- `src/data/vehicles/projection/useVehicleUrlSelection.tsx` — only lock guard on `row !== null`
- `src/locales/en/translation.json`, `src/locales/nb/translation.json` — new key

No Sobek changes. No new dependencies.
