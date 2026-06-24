import { test, expect } from '@playwright/test';
import { interceptVehicleTypesQuery } from './autosys-helpers';
import { IS_LIVE, seedAuth, selectFirstOrg, rowCount, readNetexIds } from './live-auth-helpers';

/** Load the unfiltered list (live: select org first) and return the table. */
async function openList(page: import('@playwright/test').Page) {
  await page.goto('/vehicle-types');
  await selectFirstOrg(page);
  await page.waitForLoadState('networkidle');
  const table = page.locator('table');
  await expect(table).toBeVisible();
  return table;
}

/**
 * /vehicle-types?filter= — URL-driven vehicle-type filtering via the filter chip.
 *
 * Workflow:
 *   load /vehicle-types → select org → assert full list (no chip) →
 *   navigate with ?filter=<id[,id]> → assert url-filter-chip [data-filter-count]
 *   + narrowed total-entries → delete chip → assert URL cleared + full list
 *   restored; non-matching id → empty table (no-data-row)
 * Covers:
 *   - no filter param shows all rows, no url-filter-chip
 *   - single filter param narrows to 1 matching row (chip count 1)
 *   - multiple comma-joined params narrow to 2 rows (chip count 2)
 *   - deleting the chip clears the filter + URL and restores the full list
 *   - a guaranteed-absent id yields an empty table (no-data-row), chip count 1
 * Modes:
 *   - mock (E2E_BACKEND unset): intercepts `vehicleTypes` with the 3-row fixture
 *     (NMR:VehicleType:1..3); asserts exact counts (3/1/2) and which fixture ids
 *     are visible vs hidden
 *   - live (E2E_BACKEND=true): seeds JWT, auto-selects org "AtB"; derives real
 *     ids from the org-scoped list via readNetexIds(n) and filters on those;
 *     asserts relative counts (>0, restored == captured rowCount)
 */
test.describe('Vehicle type URL filtering', () => {
  test.beforeEach(async ({ page, context }) => {
    await seedAuth(context);
    if (!IS_LIVE) await interceptVehicleTypesQuery(page);
  });

  test('without filter param shows all vehicle types', async ({ page }) => {
    await openList(page);

    if (IS_LIVE) {
      // Org-scoped list populated; no filter chip on a clean load.
      expect(await rowCount(page)).toBeGreaterThan(0);
      await expect(page.getByTestId('url-filter-chip')).not.toBeVisible();
      return;
    }

    await expect(page.getByTestId('total-entries')).toHaveAttribute('data-count', '3');
    await expect(page.getByText('NMR:VehicleType:1')).toBeVisible();
    await expect(page.getByText('NMR:VehicleType:2')).toBeVisible();
    await expect(page.getByText('NMR:VehicleType:3')).toBeVisible();
    await expect(page.getByTestId('url-filter-chip')).not.toBeVisible();
  });

  test('with single filter param shows only matching vehicle type', async ({ page }) => {
    if (IS_LIVE) {
      await openList(page);
      const [id] = await readNetexIds(page, 1);
      expect(id, 'expected at least one vehicle-type row to derive an id from').toBeTruthy();

      await page.goto(`/vehicle-types?filter=${encodeURIComponent(id)}`);
      await selectFirstOrg(page);
      await page.waitForLoadState('networkidle');

      const filterChip = page.getByTestId('url-filter-chip');
      await expect(filterChip).toBeVisible({ timeout: 10000 });
      await expect(filterChip).toHaveAttribute('data-filter-count', '1');
      await expect(page.getByTestId('total-entries')).toHaveAttribute('data-count', '1');
      await expect(page.getByText(id, { exact: false })).toBeVisible();
      return;
    }

    await page.goto('/vehicle-types?filter=NMR:VehicleType:2');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('table')).toBeVisible();

    const filterChip = page.getByTestId('url-filter-chip');
    await expect(filterChip).toBeVisible({ timeout: 10000 });
    await expect(filterChip).toHaveAttribute('data-filter-count', '1');
    await expect(page.getByTestId('total-entries')).toHaveAttribute('data-count', '1');
    await expect(page.getByText('NMR:VehicleType:2')).toBeVisible();
    await expect(page.getByText('NMR:VehicleType:1')).not.toBeVisible();
    await expect(page.getByText('NMR:VehicleType:3')).not.toBeVisible();
  });

  test('with multiple filter params shows only matching vehicle types', async ({ page }) => {
    if (IS_LIVE) {
      await openList(page);
      const ids = await readNetexIds(page, 2);
      expect(ids.length, 'expected at least two vehicle-type rows').toBe(2);

      const param = encodeURIComponent(ids.join(','));
      await page.goto(`/vehicle-types?filter=${param}`);
      await selectFirstOrg(page);
      await page.waitForLoadState('networkidle');

      const filterChip = page.getByTestId('url-filter-chip');
      await expect(filterChip).toBeVisible({ timeout: 10000 });
      await expect(filterChip).toHaveAttribute('data-filter-count', '2');
      await expect(page.getByTestId('total-entries')).toHaveAttribute('data-count', '2');
      return;
    }

    const filterParam = encodeURIComponent('NMR:VehicleType:1,NMR:VehicleType:3');
    await page.goto(`/vehicle-types?filter=${filterParam}`);
    await page.waitForLoadState('networkidle');
    await expect(page.locator('table')).toBeVisible();

    const filterChip = page.getByTestId('url-filter-chip');
    await expect(filterChip).toBeVisible({ timeout: 10000 });
    await expect(filterChip).toHaveAttribute('data-filter-count', '2');
    await expect(page.getByTestId('total-entries')).toHaveAttribute('data-count', '2');
    await expect(page.getByText('NMR:VehicleType:1')).toBeVisible();
    await expect(page.getByText('NMR:VehicleType:3')).toBeVisible();
    await expect(page.getByText('NMR:VehicleType:2')).not.toBeVisible();
  });

  test('clicking filter chip delete button clears filters and URL', async ({ page }) => {
    let restoredCount = 3;
    if (IS_LIVE) {
      await openList(page);
      restoredCount = await rowCount(page);
      const [id] = await readNetexIds(page, 1);
      expect(id).toBeTruthy();
      await page.goto(`/vehicle-types?filter=${encodeURIComponent(id)}`);
      await selectFirstOrg(page);
      await page.waitForLoadState('networkidle');
    } else {
      await page.goto('/vehicle-types?filter=NMR:VehicleType:1');
      await page.waitForLoadState('networkidle');
    }

    const filterChip = page.getByTestId('url-filter-chip');
    await expect(filterChip).toBeVisible({ timeout: 10000 });
    await expect(page.getByTestId('total-entries')).toHaveAttribute('data-count', '1');

    // Click the delete button on the chip.
    await filterChip.press('Delete');
    await expect(filterChip).not.toBeVisible();
    await expect(page).toHaveURL(/\/vehicle-types$/);

    if (IS_LIVE) {
      // Removing the filter restores the full org-scoped list.
      await expect(page.getByTestId('total-entries')).toHaveAttribute(
        'data-count',
        String(restoredCount)
      );
      return;
    }

    await expect(page.getByText('NMR:VehicleType:1')).toBeVisible();
    await expect(page.getByText('NMR:VehicleType:2')).toBeVisible();
    await expect(page.getByText('NMR:VehicleType:3')).toBeVisible();
  });

  test('with non-matching filter shows empty table', async ({ page }) => {
    // A guaranteed-absent id must yield an empty result in both modes.
    const absentId = 'NMR:VehicleType:999999999';
    await page.goto(`/vehicle-types?filter=${encodeURIComponent(absentId)}`);
    await selectFirstOrg(page);
    await page.waitForLoadState('networkidle');
    await expect(page.locator('table')).toBeVisible();

    const filterChip = page.getByTestId('url-filter-chip');
    await expect(filterChip).toBeVisible({ timeout: 10000 });
    await expect(filterChip).toHaveAttribute('data-filter-count', '1');
    await expect(page.getByTestId('no-data-row')).toBeVisible();
  });
});
