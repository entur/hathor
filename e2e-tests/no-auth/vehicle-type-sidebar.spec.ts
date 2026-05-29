import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import { fixturesDir, targetConfig, interceptVehicleTypesQuery } from './autosys-helpers';

/**
 * hathor#105 — editable `?selected=` sidebar for /vehicle-types (replaces the
 * old route-based `/vehicle-types/:id` editor). Whole-row click writes the
 * param; the sidebar hosts a tabbed VehicleTypeForm (Edit · Propulsion &
 * Performance · Passenger Capacity · Environment) hydrated from the resolved
 * list row. EditorRail drives view↔edit; save is mocked (success snackbar, no
 * mutation). The collapse rail drops the param.
 *
 * Fixture (vehicle-types-mock.json), sorted by name asc:
 *   Type Alpha (NMR:VehicleType:1, bus) · Type Beta (…:2, rail) · Type Gamma (…:3, none)
 */
test.describe('/vehicle-types editable sidebar deep-link (no-auth)', () => {
  test.beforeAll(() => {
    fs.copyFileSync(`${fixturesDir}/config-no-auth.json`, targetConfig);
  });

  test.beforeEach(async ({ page }) => {
    if (process.env.E2E_BACKEND !== 'true') {
      await interceptVehicleTypesQuery(page);
    }
  });

  test('row click opens the sidebar and writes ?selected= to the URL', async ({ page }) => {
    await page.goto('/vehicle-types');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('table')).toBeVisible();

    await page.locator('table tr', { hasText: 'Type Alpha' }).click();

    await expect(page).toHaveURL(/selected=NMR%3AVehicleType%3A1/);
    await expect(page.getByTestId('vehicle-type-details-title')).toHaveText('Type Alpha');
    await expect(page.getByTestId('vtype-tab-edit')).toBeVisible();
  });

  test('tabs group the fields; Edit holds name + dimensions, others are reachable', async ({
    page,
  }) => {
    await page.goto('/vehicle-types?selected=NMR:VehicleType:1');
    await page.waitForLoadState('networkidle');

    // Edit tab (default): name hydrated from the row, dimensions collapsed in here.
    await expect(page.locator('#vtype-name')).toHaveValue('Type Alpha');
    await expect(page.locator('#vtype-length')).toHaveValue('10');

    await page.getByRole('tab', { name: 'Propulsion/perf.' }).click();
    await expect(page.getByTestId('vtype-tab-propulsion')).toBeVisible();
    await expect(page.locator('#vtype-euro-class')).toHaveValue('EURO6');

    await page.getByRole('tab', { name: 'Environment' }).click();
    await expect(page.getByTestId('vtype-tab-environment')).toBeVisible();
    await expect(page.locator('#vtype-maximumEngineEffectKW')).toHaveValue('250');

    // Vehicles tab: flowing chips; regNo (opNum) links to the vehicles route.
    await page.getByRole('tab', { name: 'Vehicles' }).click();
    const vehChip = page.getByTestId('vtype-tab-vehicles').getByRole('link', { name: /AA-101/ });
    await expect(vehChip).toContainText('(OP-101)');
    await expect(vehChip).toHaveAttribute('href', '/vehicles?selected=NMR%3AVehicle%3A101');
  });

  test('edit → change name → mock save shows success and returns to view', async ({ page }) => {
    await page.goto('/vehicle-types?selected=NMR:VehicleType:1');
    await page.waitForLoadState('networkidle');

    // View mode: name is read-only until the pen is clicked.
    await expect(page.locator('#vtype-name')).toBeDisabled();
    await page.getByTestId('editor-rail-edit').click();

    const name = page.locator('#vtype-name');
    await expect(name).toBeEnabled();
    await name.fill('Type Alpha X');

    await page.getByTestId('editor-rail-save').click();
    await expect(page.getByText('Vehicle type saved')).toBeVisible();
    // Mock save advances the baseline → back to view, title reflects the edit.
    await expect(page.getByTestId('vehicle-type-details-title')).toHaveText('Type Alpha X');
    await expect(page.locator('#vtype-name')).toBeDisabled();
  });

  test('vehicle chip in the row routes to /vehicles?selected= (not hijacked by row click)', async ({
    page,
  }) => {
    await page.goto('/vehicle-types');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('table')).toBeVisible();

    await page.locator('table').getByRole('link', { name: 'AA-101' }).click();

    await expect(page).toHaveURL(/\/vehicles\?selected=NMR%3AVehicle%3A101/);
    await expect(page).not.toHaveURL(/vehicle-types/);
  });

  test('collapse rail drops ?selected= and hides the sidebar', async ({ page }) => {
    await page.goto('/vehicle-types?selected=NMR:VehicleType:1');
    await page.waitForLoadState('networkidle');
    await expect(page.getByTestId('vehicle-type-details-title')).toBeVisible();

    await page.getByTestId('editor-rail-collapse').click();

    await expect(page).toHaveURL(/\/vehicle-types(\?|$)/);
    await expect(page).not.toHaveURL(/selected=/);
    await expect(page.getByTestId('vehicle-type-details-title')).not.toBeVisible();
  });
});
