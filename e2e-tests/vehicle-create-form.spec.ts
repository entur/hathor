import { test, expect, type Page } from '@playwright/test';
import {
  interceptStatefulVehicleListQuery,
  interceptVehicleByIdQuery,
  interceptVehicleSaveMutation,
  interceptVehicleTypesQuery,
  vehicleRow,
} from './vehicle-list-helpers';
import { IS_LIVE, seedAuth, liveCreateOverrides } from './live-auth-helpers';

const NEW_ID = 'NMR:Vehicle:NEW-1';
const ENCODED_NEW_ID = encodeURIComponent(NEW_ID);
const PICKED_VT_NAME = 'Rail Type';
const EXPECTED_REF = 'NMR:VehicleType:2';
const REF_PATTERN = /^NMR:VehicleType:\d+$/;

/**
 * `/vehicles?selected=new` — sidebar VehicleEditForm save gates + post-create
 * URL advance (PR #121 retired the standalone `/vehicles/new` route; create now
 * lives in the same `?selected=` sidebar editor as edit). Covers the
 * `EditorRail.canSubmit` re-gating (#3), `useSidebarCreateAdvance` (#2/#7), and
 * the #82 VehicleType picker (orphan-option fallback keeps a non-numeric
 * existing ref editable).
 *
 * Workflow:
 *   /vehicles?selected=new → empty form in edit mode → fill Registration Number
 *   (Save disabled) → open Vehicle Type picker + select an option (Save enabled)
 *   → Save → URL advances to ?selected=<newId>, sidebar resolves into the
 *   just-created entity.
 * Covers:
 *   - EditorRail Save stays disabled until both reg + a picked Vehicle Type are
 *     present (the TransportTypeRef gate that prevents create-but-invisible
 *     vehicles)
 *   - transportType ref round-trips as the option's full netex id
 *   - After a successful create, ?selected=new is rewritten to ?selected=<newId>
 *     and the sidebar resolves into the new row
 *   - The list-head New action, absent on the ?selected=new deep-link, returns
 *     once the URL advances (#173)
 *   - An existing non-numeric TransportTypeRef stays selectable via the picker
 *     (orphan-option fallback) AND can be swapped for a known option
 *   - After a create whose list reload fails, Cancel keeps the saved form (and
 *     its new id) instead of blanking it
 * Modes:
 *   - mock (E2E_BACKEND unset): wireCreateFlow intercepts vehicleTypes +
 *     createOrUpdateVehicle + stateful list + by-id; captures mutation input,
 *     asserts transportType.netexId
 *   - live (E2E_BACKEND=true): seedAuth JWT + org auto-select → real create with
 *     unique reg E2E-<ts>; picker is fed by the live `vehicleTypes(` query and
 *     picks whatever option Sobek serves first (requires ≥1 VehicleType seeded);
 *     URL advance proves reg + ref survived Sobek round-trip
 *   - skip-live: 'after a create whose list reload fails, Cancel keeps the saved
 *     form' — fault injection on the post-create list reload
 *   - skip-live: 'sidebar edit: an existing non-numeric TransportTypeRef stays
 *     selectable via picker' — fixture-pinned non-numeric ref the live data
 *     can't reproduce
 */

test.describe('?selected=new sidebar VehicleEditForm gates + URL advance (no-auth)', () => {
  test.beforeEach(async ({ context }) => seedAuth(context));

  /** Captures the most recent `createOrUpdateVehicle` mutation input so specs
   *  can assert on its shape (e.g. the prefixed `transportType.netexId`).
   *  Stateful list adds the created id once the mutation lands so the post-
   *  save list refetch finds the new row and the URL advance resolves it.
   *  Also mocks `vehicleTypes(` so the picker has options to pick from. */
  const wireCreateFlow = async (page: Page) => {
    if (IS_LIVE) return { input: () => null };
    await interceptVehicleTypesQuery(page);
    const list = await interceptStatefulVehicleListQuery(page);
    await interceptVehicleByIdQuery(page, id => (id === NEW_ID ? vehicleRow(id) : null));
    return interceptVehicleSaveMutation(page, NEW_ID, input => {
      const ref = (input.transportType as { netexId?: string } | undefined)?.netexId;
      if (ref && REF_PATTERN.test(ref)) list.addCreated(NEW_ID, 0);
    });
  };

  test('Save disabled until Vehicle Type picked; URL advances to ?selected=<newId>', async ({
    page,
  }) => {
    const fab = page.getByTestId('create-vehicle-fab');

    if (IS_LIVE) {
      const { reg } = await liveCreateOverrides(page);
      await page.goto('/vehicles?selected=new');

      const save = page.getByTestId('editor-rail-save');
      await page.getByLabel('Registration Number').fill(reg);
      // After fill: the form is rendered, so hidden can't pass on the loading screen.
      await expect(fab).toBeHidden();
      await expect(save).toBeDisabled();
      // Picker is fed by the live `vehicleTypes(` query — pick whatever the
      // local Sobek serves first. Requires at least one VehicleType seeded.
      await page.getByRole('combobox', { name: 'Vehicle Type' }).click();
      await page.getByRole('option').first().click();
      await expect(save).toBeEnabled();

      await save.click();

      // After save, useSidebarCreateAdvance rewrites ?selected=new → the
      // assigned id, so the sidebar resolves into the just-created row.
      // `(?!new)` — the pre-save URL already carries selected=new, so a bare
      // `selected=…` match would pass before the save round trip finishes.
      await expect
        .poll(() => page.url(), { timeout: 15_000 })
        .toMatch(/[?&]selected=(?!new(?:&|$))[^&]+/);
      await expect(page.getByTestId('vehicle-details-title')).toBeVisible();
      await expect(page.getByText('Vehicle not found')).toHaveCount(0);
      await expect(fab).toBeVisible();
      return;
    }

    const capture = await wireCreateFlow(page);
    await page.goto('/vehicles?selected=new');

    const save = page.getByTestId('editor-rail-save');
    await page.getByLabel('Registration Number').fill('NEW-001');
    await expect(fab).toBeHidden();
    await expect(save).toBeDisabled();

    await page.getByRole('combobox', { name: 'Vehicle Type' }).click();
    await page.getByRole('option', { name: PICKED_VT_NAME }).click();
    await expect(save).toBeEnabled();

    await save.click();
    await expect
      .poll(() => page.url(), { timeout: 10_000 })
      .toContain(`selected=${ENCODED_NEW_ID}`);
    await expect(fab).toBeVisible();
    const input = capture.input() as { transportType?: { netexId?: string } } | null;
    expect(input?.transportType?.netexId).toBe(EXPECTED_REF);
  });

  // Create commits but the list reload 500s, so the URL stays ?selected=new and
  // there is no record yet. Cancel must restore the saved form (with its new
  // id), not blank it — a blank id would make the next save mint a duplicate.
  test('after a create whose list reload fails, Cancel keeps the saved form', async ({ page }) => {
    test.skip(IS_LIVE, 'fault injection: the list reload must 500 after the create');
    let saved = false;
    await interceptVehicleTypesQuery(page);
    await interceptStatefulVehicleListQuery(page);
    await interceptVehicleByIdQuery(page, id => (id === NEW_ID ? vehicleRow(id) : null));
    interceptVehicleSaveMutation(page, NEW_ID, () => (saved = true));
    // Registered last → first look (LIFO): 500 the list query once the write has landed.
    await page.route('**/graphql', async route => {
      const post = route.request().postDataJSON();
      const isList = post?.query?.includes('vehicles(') && !post?.variables?.filter?.netexIds;
      if (!saved || !isList) return route.fallback();
      return route.fulfill({ status: 500, contentType: 'application/json', body: '{}' });
    });
    await page.goto('/vehicles?selected=new');

    await page.getByLabel('Registration Number').fill('NEW-001');
    await page.getByRole('combobox', { name: 'Vehicle Type' }).click();
    await page.getByRole('option', { name: PICKED_VT_NAME }).click();
    await page.getByTestId('editor-rail-save').click();
    await expect(page.getByText(/list could not refresh/i)).toBeVisible();

    await page.getByTestId('editor-rail-edit').click();
    await page.getByTestId('editor-rail-cancel').click();
    await expect(page.getByLabel('Registration Number')).toHaveValue('NEW-001');
  });

  // An org switch re-mounts the create pane, so a create started under org A
  // that lands after the switch must not advance the URL to A's new id nor flip
  // the fresh B-scoped pane to view.
  test('a create that lands after an org switch leaves the fresh pane on ?selected=new', async ({
    page,
  }) => {
    test.skip(IS_LIVE, 'needs a held mutation + a second mocked org');
    await interceptVehicleTypesQuery(page);
    await interceptStatefulVehicleListQuery(page);
    await interceptVehicleByIdQuery(page, id => (id === NEW_ID ? vehicleRow(id) : null));
    interceptVehicleSaveMutation(page, NEW_ID);
    let release!: () => void;
    const held = new Promise<void>(res => (release = res));
    // Registered last → first look (LIFO): two orgs, and the create held until released.
    await page.route('**/graphql', async route => {
      const query: string = route.request().postDataJSON()?.query ?? '';
      if (query.includes('createOrUpdateVehicle')) {
        await held;
        return route.fallback();
      }
      if (!query.includes('organisations(')) return route.fallback();
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: {
            organisations: {
              content: [
                { netexId: 'NMR:Organisation:1', name: { value: 'First Org' }, type: 'AUTHORITY' },
                { netexId: 'NMR:Organisation:2', name: { value: 'Second Org' }, type: 'OPERATOR' },
              ],
              totalElements: 2,
              page: 0,
              size: 10000,
            },
          },
        }),
      });
    });
    await page.goto('/vehicles?selected=new');

    await page.getByLabel('Registration Number').fill('NEW-001');
    await page.getByRole('combobox', { name: 'Vehicle Type' }).click();
    await page.getByRole('option', { name: PICKED_VT_NAME }).click();
    const save = page.getByTestId('editor-rail-save');
    await save.click();
    await expect(save).toBeDisabled(); // saving

    const orgPicker = page.getByRole('banner').getByRole('combobox').first();
    await orgPicker.click();
    await page.getByRole('option', { name: 'Second Org (OPERATOR)' }).click();
    // The held save leaves the form dirty: the org picker asks first.
    await page.getByRole('dialog').getByRole('button', { name: 'Discard' }).click();
    await expect(orgPicker).toHaveValue('Second Org (OPERATOR)');

    const landed = page.waitForResponse(
      r => !!r.request().postData()?.includes('createOrUpdateVehicle')
    );
    release();
    await landed;
    // A stale run stops at runSave's first live() check, right after the write: no list
    // reload or advance can follow the response.
    expect(page.url()).toContain('selected=new');
    await expect(page.getByLabel('Registration Number')).toHaveValue('');
    await expect(page.getByLabel('Registration Number')).toBeEditable();
  });

  test('sidebar edit: an existing non-numeric TransportTypeRef stays selectable via picker', async ({
    page,
  }) => {
    // The orphan-option fallback in the picker preserves a non-numeric existing
    // ref AND lets the user swap it — that round-trip is the #82 regression.
    // Fixture-pinned ref shape, so mock-only.
    test.skip(IS_LIVE, 'mock-only — fixture-pinned non-numeric ref shape');

    const vehicleId = 'NMR:Vehicle:rail-1';
    const rawRef = 'NMR:VehicleType:rail';
    await interceptVehicleTypesQuery(page);
    await interceptStatefulVehicleListQuery(page);
    await interceptVehicleByIdQuery(page, id =>
      vehicleRow(id, {
        transportType: { netexId: rawRef, version: 1, name: null, transportMode: 'RAIL' },
      })
    );
    const save = interceptVehicleSaveMutation(page, vehicleId);

    await page.goto(`/vehicles?selected=${encodeURIComponent(vehicleId)}`);
    await expect(page.getByTestId('vehicle-details-title')).toBeVisible();

    await page.getByTestId('editor-rail-edit').click();

    // Orphan ref shown as the picker's current value — interactive, not disabled.
    const pickerInput = page.locator('#vehicle-transport-type');
    await expect(pickerInput).toHaveValue(rawRef);
    await expect(pickerInput).toBeEnabled();

    // Picker opens and lists the seeded known types alongside the orphan.
    await pickerInput.click();
    await expect(page.getByRole('option', { name: 'Bus Type' })).toBeVisible();
    await page.getByRole('option', { name: 'Bus Type' }).click();

    await page.getByTestId('editor-rail-save').click();
    await expect(page.getByText('Vehicle saved')).toBeVisible();

    const input = save.input() as { transportType?: { netexId?: string } } | null;
    expect(input?.transportType?.netexId).toBe('NMR:VehicleType:1');
  });
});
