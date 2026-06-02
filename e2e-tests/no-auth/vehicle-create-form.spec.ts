import { test, expect, type Page } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import {
  interceptStatefulVehicleListQuery,
  interceptVehicleByIdQuery,
  interceptVehicleSaveMutation,
  vehicleRow,
} from './vehicle-list-helpers';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fixturesDir = path.join(__dirname, '..', 'fixtures');
const targetConfig = path.join(__dirname, '..', '..', 'public', 'config.json');

const NEW_ID = 'NMR:Vehicle:NEW-1';
const VT_ID_INT = '2';
const EXPECTED_REF = `NMR:VehicleType:${VT_ID_INT}`;
const REF_PATTERN = /^NMR:VehicleType:\d+$/;

/**
 * Regression coverage for the coupled VehicleEditForm edits, realigned to the
 * GraphQL save path after #101 retired the NeTEx-XML import POST:
 *   - #82 — TransportType field required + writable
 *   - #81 — Back button on /vehicles/new with dirty-form discard dialog
 *
 * The TransportType field is a TEMP bare numeric input until Sobek's
 * VehicleTypeFilter gains a `name` field. The onChange prefixes
 * `NMR:VehicleType:` before binding to form state — this spec asserts on the
 * full prefixed shape in the `createOrUpdateVehicle` mutation input.
 */
test.describe('/vehicles/new form gates + back nav (no-auth)', () => {
  test.beforeAll(() => {
    fs.copyFileSync(path.join(fixturesDir, 'config-no-auth.json'), targetConfig);
  });

  /** Captures the most recent `createOrUpdateVehicle` mutation input so specs
   *  can assert on its shape (e.g. the prefixed `transportType.netexId`). */
  const wireCreateFlow = async (page: Page) => {
    if (process.env.E2E_BACKEND === 'true') return { input: () => null };
    const list = await interceptStatefulVehicleListQuery(page);
    await interceptVehicleByIdQuery(page, id => (id === NEW_ID ? vehicleRow(id) : null));
    return interceptVehicleSaveMutation(page, NEW_ID, input => {
      // Gate-equivalent: only "persist" when the client included a real ref.
      const ref = (input.transportType as { netexId?: string } | undefined)?.netexId;
      if (ref && REF_PATTERN.test(ref)) list.addCreated(NEW_ID, 0);
    });
  };

  test('Save disabled until Vehicle Type ID entered; mutation input carries prefixed transportType ref', async ({
    page,
  }) => {
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
    await wireCreateFlow(page);
    await page.goto('/vehicles/new');
    await page.waitForLoadState('networkidle');

    await page.getByLabel('Registration Number').fill('NEW-001');
    await page.getByLabel(/Vehicle Type ID/).fill(VT_ID_INT);
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
    // misrepresented as blank nor accidentally overwritten.
    test.skip(process.env.E2E_BACKEND === 'true', 'mock-only — fixture-pinned ref shape');

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
