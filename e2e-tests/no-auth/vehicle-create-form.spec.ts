import { test, expect, type Page } from '@playwright/test';
import {
  interceptStatefulVehicleListQuery,
  interceptVehicleByIdQuery,
  interceptVehicleSaveMutation,
  vehicleRow,
} from './vehicle-list-helpers';
import { IS_LIVE, writeConfig, seedAuth, liveCreateOverrides } from './live-auth-helpers';

const NEW_ID = 'NMR:Vehicle:NEW-1';
const ENCODED_NEW_ID = encodeURIComponent(NEW_ID);
const VT_ID_INT = '2';
const EXPECTED_REF = `NMR:VehicleType:${VT_ID_INT}`;
const REF_PATTERN = /^NMR:VehicleType:\d+$/;

/**
 * `/vehicles?selected=new` — sidebar VehicleEditForm save gates + post-create
 * URL advance (PR #121 retired the standalone `/vehicles/new` route; create now
 * lives in the same `?selected=` sidebar editor as edit). Covers the
 * `EditorRail.canSubmit` re-gating (#3) and `useSidebarCreateAdvance` (#2/#7).
 *
 * Workflow:
 *   /vehicles?selected=new → empty form in edit mode → fill Registration Number
 *   (Save disabled) → fill Vehicle Type ID (Save enabled) → Save → URL advances
 *   to ?selected=<newId>, sidebar resolves into the just-created entity.
 * Covers:
 *   - EditorRail Save stays disabled until both reg + Vehicle Type ID are filled
 *     (the TransportTypeRef gate that prevents create-but-invisible vehicles)
 *   - transportType ref round-trips as prefixed NMR:VehicleType:<int>
 *   - After a successful create, ?selected=new is rewritten to ?selected=<newId>
 *     and the sidebar resolves into the new row
 *   - An existing non-numeric TransportTypeRef shows raw + read-only
 *     (TEMP numeric input fallback)
 * Modes:
 *   - mock (E2E_SUITE=no-auth): wireCreateFlow intercepts createOrUpdateVehicle +
 *     stateful list + by-id; captures mutation input, asserts transportType.netexId
 *   - live (E2E_BACKEND=true): seedAuth JWT + org auto-select → real create with
 *     unique reg E2E-<ts> + real VehicleType int via liveVehicleTypeInt → URL
 *     advance proves reg + ref survived Sobek round-trip
 *   - skip-live: 'sidebar edit: an existing non-numeric TransportTypeRef shows raw
 *     + read-only' — fixture-pinned non-numeric ref shape the live data can't reproduce
 */

test.describe('?selected=new sidebar VehicleEditForm gates + URL advance (no-auth)', () => {
  test.beforeAll(() => writeConfig());
  test.beforeEach(async ({ context }) => seedAuth(context));

  /** Captures the most recent `createOrUpdateVehicle` mutation input so specs
   *  can assert on its shape (e.g. the prefixed `transportType.netexId`).
   *  Stateful list adds the created id once the mutation lands so the post-
   *  save list refetch finds the new row and the URL advance resolves it. */
  const wireCreateFlow = async (page: Page) => {
    if (IS_LIVE) return { input: () => null };
    const list = await interceptStatefulVehicleListQuery(page);
    await interceptVehicleByIdQuery(page, id => (id === NEW_ID ? vehicleRow(id) : null));
    return interceptVehicleSaveMutation(page, NEW_ID, input => {
      const ref = (input.transportType as { netexId?: string } | undefined)?.netexId;
      if (ref && REF_PATTERN.test(ref)) list.addCreated(NEW_ID, 0);
    });
  };

  test('Save disabled until Vehicle Type ID entered; URL advances to ?selected=<newId>', async ({
    page,
  }) => {
    if (IS_LIVE) {
      const { reg, vtInt } = await liveCreateOverrides(page);
      await page.goto('/vehicles?selected=new');
      await page.waitForLoadState('networkidle');

      const save = page.getByTestId('editor-rail-save');
      await page.getByLabel('Registration Number').fill(reg);
      await expect(save).toBeDisabled();
      await page.getByLabel(/Vehicle Type ID/).fill(vtInt);
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

    await page.getByLabel(/Vehicle Type ID/).fill(VT_ID_INT);
    await expect(save).toBeEnabled();

    await save.click();
    await expect
      .poll(() => page.url(), { timeout: 10_000 })
      .toContain(`selected=${ENCODED_NEW_ID}`);
    const input = capture.input() as { transportType?: { netexId?: string } } | null;
    expect(input?.transportType?.netexId).toBe(EXPECTED_REF);
  });

  test('sidebar edit: an existing non-numeric TransportTypeRef shows raw + read-only', async ({
    page,
  }) => {
    // The TEMP numeric input cannot represent a non-numeric ref — the form
    // must fall back to a disabled raw display so the value is neither
    // misrepresented as blank nor accidentally overwritten. Fixture-pinned ref
    // shape, so mock-only.
    test.skip(IS_LIVE, 'mock-only — fixture-pinned non-numeric ref shape');

    const vehicleId = 'NMR:Vehicle:rail-1';
    const rawRef = 'NMR:VehicleType:rail';
    await interceptStatefulVehicleListQuery(page);
    await interceptVehicleByIdQuery(page, id =>
      vehicleRow(id, {
        transportType: { netexId: rawRef, version: 1, name: null, transportMode: 'rail' },
      })
    );

    await page.goto(`/vehicles?selected=${encodeURIComponent(vehicleId)}`);
    await page.waitForLoadState('networkidle');
    await expect(page.getByTestId('vehicle-details-title')).toBeVisible();

    await page.getByTestId('editor-rail-edit').click();

    const field = page.locator('#vehicle-transport-type');
    await expect(field).toHaveValue(rawRef);
    await expect(field).toBeDisabled();
  });
});
