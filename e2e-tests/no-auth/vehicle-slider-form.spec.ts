import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import {
  interceptVehicleListQuery,
  interceptStatefulVehicleListQuery,
  interceptVehicleByIdQuery,
  interceptVehicleSaveMutation,
  vehicleRow,
} from './vehicle-list-helpers';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fixturesDir = path.join(__dirname, '..', 'fixtures');
const targetConfig = path.join(__dirname, '..', '..', 'public', 'config.json');

const VEHICLE_ID = 'NMR:Vehicle:rail-1';
const SELECTED = `/vehicles?selected=${encodeURIComponent(VEHICLE_ID)}`;

/**
 * Regression coverage for the remaining bugs in hathor #80, realigned to the
 * GraphQL read/save paths after #101 retired the NeTEx-XML single-vehicle
 * fetch:
 *
 *   1. Vehicle Name renders in title + form field — now sourced from the
 *      `vehicles(filter:{netexIds})` `name.value`, the shape `useVehicle`
 *      consumes via `fetchVehicle`.
 *   2. Build/Registration dates render as native date pickers bound to the
 *      fetched value.
 *   4. After a successful save the dirty baseline advances (the single-vehicle
 *      refetch re-hydrates the form), so closing the slider with `>>` does not
 *      wrongly raise the discard dialog.
 *
 * Mock-only — the asserted Name/date values are fixture-controlled, so this
 * spec is meaningless against a live backend.
 */
test.describe('/vehicles slider form — fetch + post-save dirty baseline (no-auth)', () => {
  test.skip(process.env.E2E_BACKEND === 'true', 'mock-only regression spec');

  test.beforeAll(() => {
    fs.copyFileSync(path.join(fixturesDir, 'config-no-auth.json'), targetConfig);
  });

  test('Name from the vehicles() fetch shows in the title and form field', async ({ page }) => {
    await interceptVehicleListQuery(page);
    await interceptVehicleByIdQuery(page, id => vehicleRow(id, { name: { value: 'Oslo Tram 4' } }));

    await page.goto(SELECTED);
    await page.waitForLoadState('networkidle');

    await expect(page.getByTestId('vehicle-details-title')).toHaveText('Oslo Tram 4');
    await expect(page.locator('#vehicle-name')).toHaveValue('Oslo Tram 4');
  });

  test('Build and Registration dates render as native date inputs bound to the fetched value', async ({
    page,
  }) => {
    await interceptVehicleListQuery(page);
    await interceptVehicleByIdQuery(page, id =>
      vehicleRow(id, {
        name: { value: 'Oslo Tram 4' },
        buildDate: '2019-04-10',
        registrationDate: '2020-08-22',
      })
    );

    await page.goto(SELECTED);
    await page.waitForLoadState('networkidle');

    const build = page.locator('#vehicle-build-date');
    const reg = page.locator('#vehicle-registration-date');

    await expect(build).toHaveAttribute('type', 'date');
    await expect(build).toHaveValue('2019-04-10');
    await expect(reg).toHaveAttribute('type', 'date');
    await expect(reg).toHaveValue('2020-08-22');
  });

  test('closing the slider after a successful save does not raise the discard dialog', async ({
    page,
  }) => {
    // The save mutation resolves the vehicle id; the post-save single-vehicle
    // refetch re-hydrates the form to the persisted value, advancing the dirty
    // baseline so the slider is no longer considered dirty.
    await interceptStatefulVehicleListQuery(page);
    await interceptVehicleByIdQuery(page, id => vehicleRow(id, { name: { value: 'Oslo Tram 4' } }));
    interceptVehicleSaveMutation(page, VEHICLE_ID);

    await page.goto(SELECTED);
    await page.waitForLoadState('networkidle');

    await page.getByTestId('editor-rail-edit').click();
    await page.locator('#vehicle-name').fill('Oslo Tram 4 — renamed');
    await page.getByTestId('editor-rail-save').click();

    // Save success → snackbar; the refetch must re-baseline the form so the
    // slider is no longer considered dirty.
    await expect(page.getByText('Vehicle saved')).toBeVisible();

    await page.getByTestId('editor-rail-collapse').click();

    await expect(page.getByRole('button', { name: 'Discard' })).toHaveCount(0);
    await expect(page).not.toHaveURL(/selected=/);
  });
});
