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
const ENCODED_NEW_ID = encodeURIComponent(NEW_ID);

/**
 * Regression coverage for the new-vehicle save → "View in list" flow.
 *
 *   1. `/vehicles/new` saved silently — no success snackbar, just an immediate
 *      `navigate('/vehicles?selected=<newId>')` (the "fast close").
 *
 *   2. The deep-link landed on the "Vehicle not found" body because the
 *      freshly-fetched list didn't include the just-imported id, and
 *      `useVehicleUrlSelection`'s idempotence guard locked the slider on
 *      null.
 *
 * The mock simulates the realistic race: `addCreated` is called from inside
 * the POST handler (mirrors Sobek persisting before responding), and the
 * `lagCalls` arg lets us model read-after-write replica lag where the next N
 * list responses still miss the new id.
 */
test.describe('/vehicles/new save feedback + redirect (no-auth)', () => {
  test.beforeAll(() => {
    fs.copyFileSync(path.join(fixturesDir, 'config-no-auth.json'), targetConfig);
  });

  /** Wires the stateful list + POST + single-vehicle GET. `lag` = list calls
   *  that still return baseline after the import POST resolves. Mirrors real
   *  Sobek behaviour: a POST without `<TransportTypeRef/>` persists but stays
   *  invisible to the GraphQL `vehicles()` resolver (probe 2026-05-19) — so
   *  the mock only flips `addCreated` when the payload carries the ref. */
  const wireCreateFlow = async (page: Page, { lag = 0 } = {}) => {
    if (process.env.E2E_BACKEND === 'true') return null;
    const list = await interceptStatefulVehicleListQuery(page);
    await interceptVehicleNetexGet(page);
    await page.route('**/services/vehicles/netex', async route => {
      if (route.request().method() !== 'POST') return route.continue();
      const body = route.request().postData() ?? '';
      if (/<TransportTypeRef\s+ref="NMR:VehicleType:\d+"/.test(body)) {
        list.addCreated(NEW_ID, lag);
      }
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
    return list;
  };

  /** Shared helper — fills the two required-for-save fields so the existing
   *  feedback/redirect tests stay focused on the snackbar/polling flow rather
   *  than the form-completeness gate. */
  const fillRequiredFields = async (page: Page) => {
    await page.getByLabel('Registration Number').fill('NEW-001');
    await page.getByLabel(/Vehicle Type ID/).fill('2');
  };

  test('save shows success snackbar with a "View in list" action and does not auto-navigate', async ({
    page,
  }) => {
    await wireCreateFlow(page);
    await page.goto('/vehicles/new');
    await page.waitForLoadState('networkidle');

    await fillRequiredFields(page);
    await page.getByRole('button', { name: 'Save' }).click();

    const action = page.getByRole('button', { name: 'View in list' });
    await expect(action).toBeVisible();
    await expect(page).toHaveURL(/\/vehicles\/new$/);
  });

  test('action navigates to the slider on the new id (zero-lag backend)', async ({ page }) => {
    await wireCreateFlow(page, { lag: 0 });
    await page.goto('/vehicles/new');
    await page.waitForLoadState('networkidle');

    await fillRequiredFields(page);
    await page.getByRole('button', { name: 'Save' }).click();
    await page.getByRole('button', { name: 'View in list' }).click();

    await expect.poll(() => page.url()).toContain(`selected=${ENCODED_NEW_ID}`);
    await expect(page.getByTestId('vehicle-details-title')).toBeVisible();
    await expect(page.getByText('Vehicle not found')).toHaveCount(0);
  });

  test('action waits out replica lag, then slider resolves (poll-until-found)', async ({
    page,
  }) => {
    // First THREE post-POST list calls still miss the new id; the polling
    // warm in handleViewInList must keep trying so navigation doesn't fire
    // before the backend has surfaced the row to GraphQL.
    const list = await wireCreateFlow(page, { lag: 3 });
    await page.goto('/vehicles/new');
    await page.waitForLoadState('networkidle');

    await fillRequiredFields(page);
    await page.getByRole('button', { name: 'Save' }).click();
    await page.getByRole('button', { name: 'View in list' }).click();

    await expect
      .poll(() => page.url(), { timeout: 10_000 })
      .toContain(`selected=${ENCODED_NEW_ID}`);
    await expect(page.getByTestId('vehicle-details-title')).toBeVisible();
    await expect(page.getByText('Vehicle not found')).toHaveCount(0);
    // Sanity: more than one list call happened (poll plus mount fetch).
    expect(list?.callCount() ?? 0).toBeGreaterThanOrEqual(2);
  });

  test('lag exceeds polling budget: navigation still happens; slider shows not-found (graceful degradation)', async ({
    page,
  }) => {
    // 99 lag calls means the poll exhausts its attempts and the mount
    // fetch on /vehicles still misses. Per the spec's graceful-degrade
    // contract, we navigate anyway and let the user retry.
    await wireCreateFlow(page, { lag: 99 });
    await page.goto('/vehicles/new');
    await page.waitForLoadState('networkidle');

    await fillRequiredFields(page);
    await page.getByRole('button', { name: 'Save' }).click();
    await page.getByRole('button', { name: 'View in list' }).click();

    await expect
      .poll(() => page.url(), { timeout: 10_000 })
      .toContain(`selected=${ENCODED_NEW_ID}`);
    await expect(page.getByText('Vehicle not found')).toBeVisible();
  });

  test('deep-link to a known id resolves the slider (regression for cross-route nav)', async ({
    page,
  }) => {
    const list = await wireCreateFlow(page, { lag: 0 });
    list?.addCreated(NEW_ID, 0);

    await page.goto(`/vehicles?selected=${ENCODED_NEW_ID}`);
    await page.waitForLoadState('networkidle');

    await expect(page.getByTestId('vehicle-details-title')).toBeVisible();
    await expect(page.getByText('Vehicle not found')).toHaveCount(0);
  });
});
