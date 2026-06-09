import { test, expect, type Page } from '@playwright/test';
import {
  interceptStatefulVehicleListQuery,
  interceptVehicleByIdQuery,
  interceptVehicleSaveMutation,
  vehicleRow,
} from './vehicle-list-helpers';
import { IS_LIVE, writeConfig, seedAuth, liveVehicleTypeInt } from './live-auth-helpers';

const NEW_ID = 'NMR:Vehicle:NEW-1';
const VT_ID_INT = '2';
const EXPECTED_REF = `NMR:VehicleType:${VT_ID_INT}`;
const REF_PATTERN = /^NMR:VehicleType:\d+$/;

/**
 * /vehicles/new — VehicleEditForm save gates + dirty-form back-nav (GraphQL save
 * path after #101 retired the NeTEx-XML import POST; #82 transportType required,
 * #81 back-button discard dialog).
 *
 * Workflow:
 *   /vehicles/new → fill Registration Number (Save disabled) → fill Vehicle Type ID
 *   (Save enabled) → Save → "View in list" → ?selected= slider resolves → editor-rail
 *   Edit → read back reg + bare transport-type int.
 * Covers:
 *   - Save stays disabled until both reg + Vehicle Type ID are filled
 *   - transportType ref round-trips as prefixed NMR:VehicleType:<int>
 *   - Back on a clean form navigates straight to /vehicles
 *   - Back on a dirty form opens the discard dialog (Cancel stays, Discard navigates)
 *   - Back after a successful save re-baselines → no discard dialog
 *   - A non-numeric existing TransportTypeRef shows raw + read-only (TEMP numeric input fallback)
 * Modes:
 *   - mock (E2E_SUITE=no-auth): wireCreateFlow intercepts createOrUpdateVehicle +
 *     stateful list + by-id; captures mutation input, asserts transportType.netexId === EXPECTED_REF
 *   - live (E2E_BACKEND=true): seedAuth JWT + org auto-select (AtB) → real create with
 *     unique reg E2E-<ts> + real VehicleType int via liveVehicleTypeInt → read-back through
 *     the slider proves reg + ref survived Sobek round-trip
 *   - skip-live: 'slider edit: an existing non-numeric TransportTypeRef shows raw + read-only'
 *     — fixture-pinned non-numeric ref shape the live data can't reproduce
 */

test.describe('/vehicles/new form gates + back nav (no-auth)', () => {
  test.beforeAll(() => writeConfig());
  test.beforeEach(async ({ context }) => seedAuth(context));

  /** Captures the most recent `createOrUpdateVehicle` mutation input so specs
   *  can assert on its shape (e.g. the prefixed `transportType.netexId`). No-op
   *  under live (requests hit Sobek). */
  const wireCreateFlow = async (page: Page) => {
    if (IS_LIVE) return { input: () => null };
    const list = await interceptStatefulVehicleListQuery(page);
    await interceptVehicleByIdQuery(page, id => (id === NEW_ID ? vehicleRow(id) : null));
    return interceptVehicleSaveMutation(page, NEW_ID, input => {
      // Gate-equivalent: only "persist" when the client included a real ref.
      const ref = (input.transportType as { netexId?: string } | undefined)?.netexId;
      if (ref && REF_PATTERN.test(ref)) list.addCreated(NEW_ID, 0);
    });
  };

  test('Save disabled until Vehicle Type ID entered; transportType ref round-trips prefixed', async ({
    page,
  }) => {
    if (IS_LIVE) {
      const vtInt = await liveVehicleTypeInt(page);
      const reg = `E2E-${Date.now()}`;
      await page.goto('/vehicles/new');
      await page.waitForLoadState('networkidle');

      const save = page.getByRole('button', { name: 'Save' });
      await page.getByLabel('Registration Number').fill(reg);
      await expect(save).toBeDisabled();
      await page.getByLabel(/Vehicle Type ID/).fill(vtInt);
      await expect(save).toBeEnabled();

      await save.click();
      await page.getByRole('button', { name: 'View in list' }).click();

      // Read-back through the slider: the created vehicle resolves and its
      // persisted fields prove the prefixed ref + reg survived the round-trip.
      await expect.poll(() => page.url(), { timeout: 15_000 }).toMatch(/[?&]selected=/);
      await expect(page.getByTestId('vehicle-details-title')).toBeVisible();
      await expect(page.getByText('Vehicle not found')).toHaveCount(0);
      await page.getByTestId('editor-rail-edit').click();
      await expect(page.locator('#vehicle-registration-number')).toHaveValue(reg);
      // The TEMP numeric TransportType input renders the bare int (the
      // `NMR:VehicleType:` prefix is added on change, stripped for display), so
      // the round-trip is proven by the int coming back linked to the vehicle.
      await expect(page.locator('#vehicle-transport-type')).toHaveValue(vtInt);
      return;
    }

    const capture = await wireCreateFlow(page);
    await page.goto('/vehicles/new');
    await page.waitForLoadState('networkidle');

    const save = page.getByRole('button', { name: 'Save' });

    await page.getByLabel('Registration Number').fill('NEW-001');
    await expect(save).toBeDisabled();

    await page.getByLabel(/Vehicle Type ID/).fill(VT_ID_INT);
    await expect(save).toBeEnabled();

    await save.click();
    await expect(page.getByRole('button', { name: 'View in list' })).toBeVisible();
    const input = capture.input() as { transportType?: { netexId?: string } } | null;
    expect(input?.transportType?.netexId).toBe(EXPECTED_REF);
  });

  test('Back button: clean form navigates immediately to /vehicles', async ({ page }) => {
    await wireCreateFlow(page);
    await page.goto('/vehicles/new');
    await page.waitForLoadState('networkidle');

    await page.getByRole('button', { name: /Back/i }).click();

    await expect(page).toHaveURL(/\/vehicles(\?|$)/);
    await expect(page).not.toHaveURL(/\/vehicles\/new/);
  });

  test('Back button: dirty form opens discard dialog; Discard navigates, Cancel stays', async ({
    page,
  }) => {
    await wireCreateFlow(page);
    await page.goto('/vehicles/new');
    await page.waitForLoadState('networkidle');

    await page.getByLabel('Registration Number').fill('TYPING');

    // First click → dialog appears, no nav
    await page.getByRole('button', { name: /Back/i }).click();
    const cancelBtn = page.getByRole('button', { name: 'Cancel' });
    await expect(cancelBtn).toBeVisible();
    await cancelBtn.click();
    await expect(page).toHaveURL(/\/vehicles\/new$/);

    // Second click → Discard navigates
    await page.getByRole('button', { name: /Back/i }).click();
    await page.getByRole('button', { name: 'Discard' }).click();
    await expect(page).toHaveURL(/\/vehicles(\?|$)/);
  });

  test('Back button after a successful save navigates without a discard dialog', async ({
    page,
  }) => {
    const reg = IS_LIVE ? `E2E-${Date.now()}` : 'NEW-001';
    const vtInt = IS_LIVE ? await liveVehicleTypeInt(page) : VT_ID_INT;

    await wireCreateFlow(page);
    await page.goto('/vehicles/new');
    await page.waitForLoadState('networkidle');

    await page.getByLabel('Registration Number').fill(reg);
    await page.getByLabel(/Vehicle Type ID/).fill(vtInt);
    await page.getByRole('button', { name: 'Save' }).click();
    await expect(page.getByRole('button', { name: 'View in list' })).toBeVisible();

    // Save re-baselines the form to clean — Back must navigate straight out
    // with no discard dialog even though the fields are still filled.
    await page.getByRole('button', { name: /Back/i }).click();
    await expect(page.getByRole('button', { name: 'Discard' })).toHaveCount(0);
    await expect(page).toHaveURL(/\/vehicles(\?|$)/);
    await expect(page).not.toHaveURL(/\/vehicles\/new/);
  });

  test('slider edit: an existing non-numeric TransportTypeRef shows raw + read-only', async ({
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
