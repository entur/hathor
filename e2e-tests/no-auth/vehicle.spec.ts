import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { interceptVehicleListQuery } from './vehicle-list-helpers';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fixturesDir = path.join(__dirname, '..', 'fixtures');
const targetConfig = path.join(__dirname, '..', '..', 'public', 'config.json');

// `no-auth.spec.ts` runs serial because it mutates config.json across describe
// blocks; this suite mutates only in `beforeAll`, so tests are independent and
// a failure in one shouldn't mask coverage of the others. The no-auth project
// still uses `workers: 1` for shared dev-server safety.

test.describe('/vehicle list, sidebar, deep-link, chip filter (no-auth)', () => {
  test.beforeAll(() => {
    fs.copyFileSync(path.join(fixturesDir, 'config-no-auth.json'), targetConfig);
  });

  test.beforeEach(async ({ page }) => {
    if (process.env.E2E_BACKEND !== 'true') {
      await interceptVehicleListQuery(page);
    }
  });

  test('list renders 15 rows with localised TransportMode chips', async ({ page }) => {
    await page.goto('/vehicle');
    await page.waitForLoadState('networkidle');

    const table = page.locator('table');
    await expect(table).toBeVisible();

    // 15 total = 12 rail + 2 bus + 1 unknown.
    await expect(page.getByTestId('total-entries')).toHaveAttribute('data-count', '15');

    // Default sort = registrationNumber asc → page 0 contains BUS-001/002 + RAIL-001..008.
    await expect(table.getByText('BUS-001')).toBeVisible();
    await expect(table.getByText('RAIL-001')).toBeVisible();

    // TransportMode column renders the localised label, not the raw enum.
    // Page 0 (asc by registrationNumber, rowsPerPage=10) = 2 bus + 8 rail rows.
    await expect(table.getByText('Bus', { exact: true })).toHaveCount(2);
    await expect(table.getByText('Rail', { exact: true })).toHaveCount(8);
  });

  test('Rail chip filter narrows rows to rail-mode only', async ({ page }) => {
    await page.goto('/vehicle');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('table')).toBeVisible();

    await page.getByTestId('search-filter-button').click();
    await page.getByRole('checkbox', { name: 'Rail' }).check();

    await expect(page.getByTestId('total-entries')).toHaveAttribute('data-count', '12');
    await expect(page.locator('table').getByText('BUS-001')).not.toBeVisible();
  });

  test('row action opens sidebar and writes ?selected= to URL', async ({ page }) => {
    await page.goto('/vehicle');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('table')).toBeVisible();

    // Click the only action button on the BUS-001 row — MUI Tooltip doesn't
    // wire its title as an accessible name, so locate by row + role=button.
    const row = page.locator('table tr', { hasText: 'BUS-001' });
    await row.getByRole('button').click();

    await expect(page).toHaveURL(/selected=NMR%3AVehicle%3Abus-1/);
    await expect(page.getByTestId('vehicle-details-title')).toBeVisible();
  });

  test('TransportMode renders localised in read-only context, regardless of mode', async ({
    page,
  }) => {
    // Post phase-2 refactor (issue #69): the sidebar splits VehicleRow
    // enrichment (id, version, parent VehicleType name, TransportMode)
    // into a read-only context panel, while editable Vehicle/VehicleModel
    // fields move into the shared VehicleEditForm. TransportMode is no
    // longer editable, so the previous regression (raw enum surfacing in
    // edit-mode TextField) no longer applies. This test pins the new
    // contract: localised label, present in both view and edit modes.
    await page.goto('/vehicle?selected=NMR:Vehicle:bus-1');
    await page.waitForLoadState('networkidle');
    await expect(page.getByTestId('vehicle-details-title')).toBeVisible();

    const context = page.getByTestId('vehicle-context');
    await expect(context).toContainText('Bus');

    await page.getByRole('button', { name: 'Edit' }).click();
    await expect(context).toContainText('Bus');
  });

  test('Close button drops ?selected= and collapses the sidebar', async ({ page }) => {
    await page.goto('/vehicle?selected=NMR:Vehicle:bus-1');
    await page.waitForLoadState('networkidle');
    await expect(page.getByTestId('vehicle-details-title')).toBeVisible();

    await page.getByTestId('editor-rail-collapse').click();

    await expect(page).toHaveURL(/\/vehicle(\?|$)/);
    await expect(page).not.toHaveURL(/selected=/);
    await expect(page.getByTestId('vehicle-details-title')).not.toBeVisible();
  });

  test('deep-link auto-paginates to the page containing the selected row', async ({ page }) => {
    // RAIL-009 is index 10 in the sorted set (BUS-001, BUS-002, RAIL-001..012, UNK-001),
    // so it lives on page 1 (0-based) at the default rowsPerPage=10.
    await page.goto('/vehicle?selected=NMR:Vehicle:rail-9');
    await page.waitForLoadState('networkidle');

    await expect(page.getByTestId('vehicle-details-title')).toBeVisible();
    // Pagination text should now read "11–15 of 15" (page 1).
    await expect(page.getByTestId('pagination-displayed-rows')).toContainText('11');
    await expect(page.locator('table').getByText('RAIL-009')).toBeVisible();
  });
});
