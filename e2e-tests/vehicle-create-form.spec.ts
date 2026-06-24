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
 *   - An existing non-numeric TransportTypeRef stays selectable via the picker
 *     (orphan-option fallback) AND can be swapped for a known option
 * Modes:
 *   - mock (E2E_BACKEND unset): wireCreateFlow intercepts vehicleTypes +
 *     createOrUpdateVehicle + stateful list + by-id; captures mutation input,
 *     asserts transportType.netexId
 *   - live (E2E_BACKEND=true): seedAuth JWT + org auto-select → real create with
 *     unique reg E2E-<ts>; picker is fed by the live `vehicleTypes(` query and
 *     picks whatever option Sobek serves first (requires ≥1 VehicleType seeded);
 *     URL advance proves reg + ref survived Sobek round-trip
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
    if (IS_LIVE) {
      const { reg } = await liveCreateOverrides(page);
      await page.goto('/vehicles?selected=new');
      await page.waitForLoadState('networkidle');

      const save = page.getByTestId('editor-rail-save');
      await page.getByLabel('Registration Number').fill(reg);
      await expect(save).toBeDisabled();
      // Picker is fed by the live `vehicleTypes(` query — pick whatever the
      // local Sobek serves first. Requires at least one VehicleType seeded.
      await page.getByRole('combobox', { name: 'Vehicle Type' }).click();
      await page.getByRole('option').first().click();
      await expect(save).toBeEnabled();

      await save.click();

      // After save, useSidebarCreateAdvance rewrites ?selected=new → the
      // assigned id, so the sidebar resolves into the just-created row.
      await expect.poll(() => page.url(), { timeout: 15_000 }).toMatch(/[?&]selected=[^&]+/);
      expect(page.url()).not.toContain('selected=new');
      await expect(page.getByTestId('vehicle-details-title')).toBeVisible();
      await expect(page.getByText('Vehicle not found')).toHaveCount(0);
      return;
    }

    const capture = await wireCreateFlow(page);
    await page.goto('/vehicles?selected=new');
    await page.waitForLoadState('networkidle');

    const save = page.getByTestId('editor-rail-save');

    await page.getByLabel('Registration Number').fill('NEW-001');
    await expect(save).toBeDisabled();

    await page.getByRole('combobox', { name: 'Vehicle Type' }).click();
    await page.getByRole('option', { name: PICKED_VT_NAME }).click();
    await expect(save).toBeEnabled();

    await save.click();
    await expect
      .poll(() => page.url(), { timeout: 10_000 })
      .toContain(`selected=${ENCODED_NEW_ID}`);
    const input = capture.input() as { transportType?: { netexId?: string } } | null;
    expect(input?.transportType?.netexId).toBe(EXPECTED_REF);
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
    await page.waitForLoadState('networkidle');
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
