import { test, expect, type Page } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import {
  interceptStatefulVehicleListQuery,
  interceptVehicleNetexGet,
} from './vehicle-list-helpers';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fixturesDir = path.join(__dirname, '..', 'fixtures');
const targetConfig = path.join(__dirname, '..', '..', 'public', 'config.json');

const NEW_ID = 'NMR:Vehicle:NEW-1';
const VT_ID_INT = '2';
const EXPECTED_REF = `NMR:VehicleType:${VT_ID_INT}`;
const TRANSPORT_REF_PATTERN = /<TransportTypeRef\s+ref="NMR:VehicleType:\d+"/;

/**
 * Regression coverage for the three coupled VehicleEditForm edits:
 *   - #80 sect3 — Manufacturer ghost text (no [missing] literal in payload)
 *   - #82 — TransportType field required + writable
 *   - #81 — Back button on /vehicles/new with dirty-form discard dialog
 *
 * The TransportType field is a TEMP bare numeric input until Sobek's
 * VehicleTypeFilter gains a `name` field. The onChange prefixes
 * `NMR:VehicleType:` before binding to form state — this spec asserts on the
 * full prefixed shape in the POST body.
 */
test.describe('/vehicles/new form gates + back nav (no-auth)', () => {
  test.beforeAll(() => {
    fs.copyFileSync(path.join(fixturesDir, 'config-no-auth.json'), targetConfig);
  });

  /** Captures the most recent NeTEx-import POST body so specs can assert
   *  on its shape (e.g. presence/absence of <TransportTypeRef>, <Manufacturer>). */
  const wireCreateFlow = async (page: Page) => {
    if (process.env.E2E_BACKEND === 'true') return { postBody: () => '' };
    const list = await interceptStatefulVehicleListQuery(page);
    await interceptVehicleNetexGet(page);
    let lastPostBody = '';
    await page.route('**/services/vehicles/netex', async route => {
      if (route.request().method() !== 'POST') return route.continue();
      lastPostBody = route.request().postData() ?? '';
      // Gate-equivalent: only "persist" when the client included a real ref.
      if (TRANSPORT_REF_PATTERN.test(lastPostBody)) list.addCreated(NEW_ID, 0);
      await route.fulfill({
        status: 200,
        contentType: 'application/xml',
        body: `<?xml version="1.0" encoding="UTF-8"?>
<PublicationDelivery xmlns="http://www.netex.org.uk/netex">
  <dataObjects><ResourceFrame><vehicles>
    <Vehicle id="${NEW_ID}" version="1"/>
  </vehicles></ResourceFrame></dataObjects>
</PublicationDelivery>`,
      });
    });
    return { postBody: () => lastPostBody };
  };

  test('Save disabled until Vehicle Type ID entered; POST body carries prefixed TransportTypeRef', async ({
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
    expect(capture.postBody()).toContain(`<TransportTypeRef ref="${EXPECTED_REF}"`);
    expect(capture.postBody()).toMatch(TRANSPORT_REF_PATTERN);
  });

  test('Manufacturer field: value empty, placeholder [missing] (no payload literal)', async ({
    page,
  }) => {
    // Open existing vehicle slider so MISSING_MODEL applies (Sobek single-vehicle
    // export emits no Model — the form's model slot defaults to MISSING_MODEL).
    await wireCreateFlow(page);
    await page.goto(`/vehicles?selected=${encodeURIComponent('NMR:Vehicle:bus-1')}`);
    await page.waitForLoadState('networkidle');
    await expect(page.getByTestId('vehicle-details-title')).toBeVisible();

    await page.getByTestId('editor-rail-edit').click();

    const manufacturer = page.getByLabel('Manufacturer');
    await expect(manufacturer).toHaveValue('');
    await expect(manufacturer).toHaveAttribute('placeholder', '[missing]');
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
});
