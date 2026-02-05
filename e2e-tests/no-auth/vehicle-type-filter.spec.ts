import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { fixturesDir, targetConfig } from './autosys-helpers';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** Mock vehicle types loaded from fixture file */
const MOCK_VEHICLE_TYPES = JSON.parse(
  fs.readFileSync(path.join(__dirname, '..', 'fixtures', 'vehicle-types-mock.json'), 'utf-8')
);

/**
 * Intercept the GraphQL vehicleTypes query and return mock data.
 */
async function interceptVehicleTypesQuery(page: import('@playwright/test').Page) {
  await page.route('**/graphql', async route => {
    const request = route.request();
    const postData = request.postDataJSON();

    // Check if this is a vehicleTypes query
    if (postData?.query?.includes('vehicleTypes')) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(MOCK_VEHICLE_TYPES),
      });
    } else {
      // Let other GraphQL queries pass through (or fulfill with empty)
      await route.continue();
    }
  });
}

test.describe('Vehicle type URL filtering', () => {
  test.beforeAll(() => {
    fs.copyFileSync(`${fixturesDir}/config-no-auth.json`, targetConfig);
  });

  test('without filter param shows all vehicle types', async ({ page }) => {
    await interceptVehicleTypesQuery(page);

    await page.goto('/vehicle-type');
    await page.waitForLoadState('networkidle');

    // Wait for table to load
    const table = page.locator('table');
    await expect(table).toBeVisible();

    // Should show total count of 3
    const totalText = page.getByText(/Total entries: 3/i);
    await expect(totalText).toBeVisible();

    // All 3 vehicle type IDs should be visible in the table
    await expect(page.getByText('NMR:VehicleType:1')).toBeVisible();
    await expect(page.getByText('NMR:VehicleType:2')).toBeVisible();
    await expect(page.getByText('NMR:VehicleType:3')).toBeVisible();

    // No filter chip should be visible
    const filterChip = page.getByTestId('url-filter-chip');
    await expect(filterChip).not.toBeVisible();
  });

  test('with single filter param shows only matching vehicle type', async ({ page }) => {
    await interceptVehicleTypesQuery(page);

    await page.goto('/vehicle-type?filter=NMR:VehicleType:2');
    await page.waitForLoadState('networkidle');

    // Wait for table to load
    const table = page.locator('table');
    await expect(table).toBeVisible();

    // Wait for filter chip to appear (indicates filter has been applied)
    const filterChip = page.getByTestId('url-filter-chip');
    await expect(filterChip).toBeVisible({ timeout: 10000 });
    await expect(filterChip).toContainText('1 imported');

    // Should show total count of 1 (filtered)
    const totalText = page.getByText(/Total entries: 1/i);
    await expect(totalText).toBeVisible();

    // Only VehicleType:2 should be visible
    await expect(page.getByText('NMR:VehicleType:2')).toBeVisible();
    await expect(page.getByText('NMR:VehicleType:1')).not.toBeVisible();
    await expect(page.getByText('NMR:VehicleType:3')).not.toBeVisible();
  });

  test('with multiple filter params shows only matching vehicle types', async ({ page }) => {
    await interceptVehicleTypesQuery(page);

    const filterParam = encodeURIComponent('NMR:VehicleType:1,NMR:VehicleType:3');
    await page.goto(`/vehicle-type?filter=${filterParam}`);
    await page.waitForLoadState('networkidle');

    // Wait for table to load
    const table = page.locator('table');
    await expect(table).toBeVisible();

    // Wait for filter chip to appear (indicates filter has been applied)
    const filterChip = page.getByTestId('url-filter-chip');
    await expect(filterChip).toBeVisible({ timeout: 10000 });
    await expect(filterChip).toContainText('2 imported');

    // Should show total count of 2 (filtered)
    const totalText = page.getByText(/Total entries: 2/i);
    await expect(totalText).toBeVisible();

    // VehicleType:1 and VehicleType:3 should be visible
    await expect(page.getByText('NMR:VehicleType:1')).toBeVisible();
    await expect(page.getByText('NMR:VehicleType:3')).toBeVisible();
    // VehicleType:2 should NOT be visible
    await expect(page.getByText('NMR:VehicleType:2')).not.toBeVisible();
  });

  test('clicking filter chip delete button clears filters and URL', async ({ page }) => {
    await interceptVehicleTypesQuery(page);

    await page.goto('/vehicle-type?filter=NMR:VehicleType:1');
    await page.waitForLoadState('networkidle');

    // Wait for filter chip to appear (indicates filter has been applied)
    const filterChip = page.getByTestId('url-filter-chip');
    await expect(filterChip).toBeVisible({ timeout: 10000 });

    // Verify filter is active - only VehicleType:1 should be visible
    await expect(page.getByText('NMR:VehicleType:1')).toBeVisible();
    await expect(page.getByText('NMR:VehicleType:2')).not.toBeVisible();

    // Click the delete button on the chip
    const deleteButton = filterChip.locator('svg').first();
    await deleteButton.click();

    // Wait for the filter to clear
    await expect(filterChip).not.toBeVisible();

    // All vehicle types should now be visible
    await expect(page.getByText('NMR:VehicleType:1')).toBeVisible();
    await expect(page.getByText('NMR:VehicleType:2')).toBeVisible();
    await expect(page.getByText('NMR:VehicleType:3')).toBeVisible();

    // URL should no longer have the filter param
    await expect(page).toHaveURL(/\/vehicle-type$/);
  });

  test('with non-matching filter shows empty table', async ({ page }) => {
    await interceptVehicleTypesQuery(page);

    await page.goto('/vehicle-type?filter=NMR:VehicleType:999');
    await page.waitForLoadState('networkidle');

    // Wait for table to load
    const table = page.locator('table');
    await expect(table).toBeVisible();

    // Wait for filter chip to appear (indicates filter has been applied)
    const filterChip = page.getByTestId('url-filter-chip');
    await expect(filterChip).toBeVisible({ timeout: 10000 });
    await expect(filterChip).toContainText('1 imported');

    // Should show "No data to display" message
    await expect(page.getByText(/no data to display/i)).toBeVisible();
  });
});
