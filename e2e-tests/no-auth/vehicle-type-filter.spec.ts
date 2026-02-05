import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import { fixturesDir, targetConfig, interceptVehicleTypesQuery } from './autosys-helpers';

test.describe('Vehicle type URL filtering', () => {
  test.beforeAll(() => {
    fs.copyFileSync(`${fixturesDir}/config-no-auth.json`, targetConfig);
  });

  test('without filter param shows all vehicle types', async ({ page }) => {
    if (process.env.E2E_BACKEND !== 'true') {
      await interceptVehicleTypesQuery(page);
    }

    await page.goto('/vehicle-type');
    await page.waitForLoadState('networkidle');

    // Wait for table to load
    const table = page.locator('table');
    await expect(table).toBeVisible();

    // Should show total count of 3 via data attribute
    const totalEntries = page.getByTestId('total-entries');
    await expect(totalEntries).toHaveAttribute('data-count', '3');

    // All 3 vehicle type IDs should be visible in the table
    await expect(page.getByText('NMR:VehicleType:1')).toBeVisible();
    await expect(page.getByText('NMR:VehicleType:2')).toBeVisible();
    await expect(page.getByText('NMR:VehicleType:3')).toBeVisible();

    // No filter chip should be visible
    const filterChip = page.getByTestId('url-filter-chip');
    await expect(filterChip).not.toBeVisible();
  });

  test('with single filter param shows only matching vehicle type', async ({ page }) => {
    if (process.env.E2E_BACKEND !== 'true') {
      await interceptVehicleTypesQuery(page);
    }

    await page.goto('/vehicle-type?filter=NMR:VehicleType:2');
    await page.waitForLoadState('networkidle');

    // Wait for table to load
    const table = page.locator('table');
    await expect(table).toBeVisible();

    // Wait for filter chip to appear (indicates filter has been applied)
    const filterChip = page.getByTestId('url-filter-chip');
    await expect(filterChip).toBeVisible({ timeout: 10000 });
    await expect(filterChip).toHaveAttribute('data-filter-count', '1');

    // Should show total count of 1 (filtered) via data attribute
    const totalEntries = page.getByTestId('total-entries');
    await expect(totalEntries).toHaveAttribute('data-count', '1');

    // Only VehicleType:2 should be visible
    await expect(page.getByText('NMR:VehicleType:2')).toBeVisible();
    await expect(page.getByText('NMR:VehicleType:1')).not.toBeVisible();
    await expect(page.getByText('NMR:VehicleType:3')).not.toBeVisible();
  });

  test('with multiple filter params shows only matching vehicle types', async ({ page }) => {
    if (process.env.E2E_BACKEND !== 'true') {
      await interceptVehicleTypesQuery(page);
    }

    const filterParam = encodeURIComponent('NMR:VehicleType:1,NMR:VehicleType:3');
    await page.goto(`/vehicle-type?filter=${filterParam}`);
    await page.waitForLoadState('networkidle');

    // Wait for table to load
    const table = page.locator('table');
    await expect(table).toBeVisible();

    // Wait for filter chip to appear (indicates filter has been applied)
    const filterChip = page.getByTestId('url-filter-chip');
    await expect(filterChip).toBeVisible({ timeout: 10000 });
    await expect(filterChip).toHaveAttribute('data-filter-count', '2');

    // Should show total count of 2 (filtered) via data attribute
    const totalEntries = page.getByTestId('total-entries');
    await expect(totalEntries).toHaveAttribute('data-count', '2');

    // VehicleType:1 and VehicleType:3 should be visible
    await expect(page.getByText('NMR:VehicleType:1')).toBeVisible();
    await expect(page.getByText('NMR:VehicleType:3')).toBeVisible();
    // VehicleType:2 should NOT be visible
    await expect(page.getByText('NMR:VehicleType:2')).not.toBeVisible();
  });

  test('clicking filter chip delete button clears filters and URL', async ({ page }) => {
    if (process.env.E2E_BACKEND !== 'true') {
      await interceptVehicleTypesQuery(page);
    }

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
    if (process.env.E2E_BACKEND !== 'true') {
      await interceptVehicleTypesQuery(page);
    }

    await page.goto('/vehicle-type?filter=NMR:VehicleType:999');
    await page.waitForLoadState('networkidle');

    // Wait for table to load
    const table = page.locator('table');
    await expect(table).toBeVisible();

    // Wait for filter chip to appear (indicates filter has been applied)
    const filterChip = page.getByTestId('url-filter-chip');
    await expect(filterChip).toBeVisible({ timeout: 10000 });
    await expect(filterChip).toHaveAttribute('data-filter-count', '1');

    // Should show "No data to display" row
    const noDataRow = page.getByTestId('no-data-row');
    await expect(noDataRow).toBeVisible();
  });
});
