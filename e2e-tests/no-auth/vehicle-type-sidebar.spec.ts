import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import {
  fixturesDir,
  targetConfig,
  interceptVehicleTypesQuery,
  interceptVehicleTypesWithSave,
} from './autosys-helpers';

/**
 * hathor#105 — editable `?selected=` sidebar for /vehicle-types (replaces the
 * old route-based `/vehicle-types/:id` editor). Whole-row click writes the
 * param; the sidebar hosts a tabbed VehicleTypeForm (Edit · Propulsion &
 * Performance · Passenger Capacity · Environment) hydrated from the resolved
 * list row. EditorRail drives view↔edit. The collapse rail drops the param.
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

/**
 * hathor#109/#15 — VehicleType sidebar SAVE now fires the
 * `createOrUpdateVehicleType` mutation (not a mock). The editor serialises the
 * full document (`serializeVehicleType`) so Sobek's full-document-replace does
 * not null untouched fields; on success the list refetch re-resolves the row
 * and re-hydrates the form (advancing the dirty baseline).
 *
 * Mocked path only: assertions read the captured mutation input + a stateful
 * fixture, and a real save would mutate the dev DB. (The Sobek `@Transactional`
 * bug that previously blocked real UPDATEs is fixed in PR #145.) So these skip
 * under `E2E_BACKEND=true`.
 */
test.describe('/vehicle-types sidebar save (no-auth)', () => {
  test.beforeAll(() => {
    fs.copyFileSync(`${fixturesDir}/config-no-auth.json`, targetConfig);
  });

  test.beforeEach(() => {
    test.skip(
      process.env.E2E_BACKEND === 'true',
      'Mocked mutation path — assertions are mock-bound; a real save would mutate dev data'
    );
  });

  test('edit name → save fires the mutation, shows success, returns to view', async ({ page }) => {
    await interceptVehicleTypesWithSave(page);
    await page.goto('/vehicle-types?selected=NMR:VehicleType:1');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('#vtype-name')).toBeDisabled();
    await page.getByTestId('editor-rail-edit').click();
    await page.locator('#vtype-name').fill('Type Alpha X');

    await page.getByTestId('editor-rail-save').click();

    await expect(page.getByText('Vehicle type saved')).toBeVisible();
    // Refetch re-resolves the row → re-hydrate → back to read-only view.
    await expect(page.getByTestId('vehicle-type-details-title')).toHaveText('Type Alpha X');
    await expect(page.locator('#vtype-name')).toBeDisabled();
  });

  test('save payload is the full document — untouched fields are not dropped', async ({ page }) => {
    const { lastInput } = await interceptVehicleTypesWithSave(page);
    await page.goto('/vehicle-types?selected=NMR:VehicleType:1');
    await page.waitForLoadState('networkidle');

    await page.getByTestId('editor-rail-edit').click();
    await page.locator('#vtype-name').fill('Type Alpha X');
    await page.getByTestId('editor-rail-save').click();
    await expect(page.getByText('Vehicle type saved')).toBeVisible();

    const input = lastInput();
    expect(input?.netexId).toBe('NMR:VehicleType:1');
    expect(input?.name).toEqual({ value: 'Type Alpha X' });
    // Fields the user never touched must survive the full-replace serialise.
    expect(input?.euroClass).toBe('EURO6');
    expect(input?.maximumEngineEffectKW).toBe(250);
    expect((input?.passengerCapacity as { totalCapacity?: number })?.totalCapacity).toBe(90);
    // Server-managed fields must NOT be in the input contract.
    expect('version' in (input ?? {})).toBe(false);
    expect('vehicles' in (input ?? {})).toBe(false);
  });

  test('after save the form re-baselines — collapse raises no discard dialog', async ({ page }) => {
    await interceptVehicleTypesWithSave(page);
    await page.goto('/vehicle-types?selected=NMR:VehicleType:1');
    await page.waitForLoadState('networkidle');

    await page.getByTestId('editor-rail-edit').click();
    await page.locator('#vtype-name').fill('Type Alpha X');
    await page.getByTestId('editor-rail-save').click();
    await expect(page.getByText('Vehicle type saved')).toBeVisible();

    await page.getByTestId('editor-rail-collapse').click();
    await expect(page.getByRole('button', { name: 'Discard' })).toHaveCount(0);
    await expect(page).not.toHaveURL(/selected=/);
  });

  test('save error surfaces in a snackbar and stays in edit mode', async ({ page }) => {
    await interceptVehicleTypesWithSave(page, { saveError: 'boom' });
    await page.goto('/vehicle-types?selected=NMR:VehicleType:1');
    await page.waitForLoadState('networkidle');

    await page.getByTestId('editor-rail-edit').click();
    await page.locator('#vtype-name').fill('Type Alpha X');
    await page.getByTestId('editor-rail-save').click();

    await expect(page.getByRole('alert')).toContainText('boom');
    // No success, and the editor stays editable (still dirty in edit mode).
    await expect(page.getByText('Vehicle type saved')).toHaveCount(0);
    await expect(page.locator('#vtype-name')).toBeEnabled();
  });
});
