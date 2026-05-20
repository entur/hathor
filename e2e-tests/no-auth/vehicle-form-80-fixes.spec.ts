import { test, expect, type Page } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import {
  interceptVehicleListQuery,
  netexName,
  vehiclePublicationDelivery,
} from './vehicle-list-helpers';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fixturesDir = path.join(__dirname, '..', 'fixtures');
const targetConfig = path.join(__dirname, '..', '..', 'public', 'config.json');

const VEHICLE_ID = 'NMR:Vehicle:rail-1';
const SELECTED = `/vehicles?selected=${encodeURIComponent(VEHICLE_ID)}`;

/**
 * Regression coverage for the three remaining bugs in hathor #80:
 *
 *   1. Vehicle Name renders blank — Sobek's exporter wraps the value in a
 *      nested <Text> element (`<Name><Text>Foo</Text></Name>`), a shape
 *      `projectText` did not unwrap, so the value was silently dropped.
 *   2. Build/Registration dates were plain text inputs with no picker.
 *   4. After a successful save the dirty baseline was never advanced (the
 *      single-vehicle XML was not refetched), so closing the slider with
 *      `>>` wrongly raised the discard dialog.
 *
 * Mock-only — the asserted Name/date values are fixture-controlled, so this
 * spec is meaningless against a live backend.
 */
test.describe('/vehicles slider — #80 form bug fixes (no-auth)', () => {
  test.skip(process.env.E2E_BACKEND === 'true', 'mock-only regression spec');

  test.beforeAll(() => {
    fs.copyFileSync(path.join(fixturesDir, 'config-no-auth.json'), targetConfig);
  });

  /** Route the single-vehicle NeTEx GET to a PublicationDelivery whose
   *  `<Vehicle>` body is caller-supplied — lets each test pin the exact
   *  Name/date elements it asserts on. */
  const routeVehicleXml = (page: Page, body: string) =>
    page.route('**/services/vehicles/netex/vehicles/**', async route => {
      if (route.request().method() !== 'GET') return route.continue();
      const id = decodeURIComponent(new URL(route.request().url()).pathname.split('/').pop() ?? '');
      await route.fulfill({
        status: 200,
        contentType: 'application/xml',
        body: vehiclePublicationDelivery(id, body),
      });
    });

  test("Name parsed from Sobek's <Name><Text> shape shows in the title and form field", async ({
    page,
  }) => {
    await interceptVehicleListQuery(page);
    await routeVehicleXml(page, netexName('Oslo Tram 4'));

    await page.goto(SELECTED);
    await page.waitForLoadState('networkidle');

    await expect(page.getByTestId('vehicle-details-title')).toHaveText('Oslo Tram 4');
    await expect(page.locator('#vehicle-name')).toHaveValue('Oslo Tram 4');
  });

  test('Build and Registration dates render as native date inputs bound to the XML value', async ({
    page,
  }) => {
    await interceptVehicleListQuery(page);
    await routeVehicleXml(
      page,
      netexName('Oslo Tram 4') +
        '<BuildDate>2019-04-10</BuildDate>' +
        '<RegistrationDate>2020-08-22</RegistrationDate>'
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
    await interceptVehicleListQuery(page);
    await routeVehicleXml(page, netexName('Oslo Tram 4'));
    await page.route('**/services/vehicles/netex', async route => {
      if (route.request().method() !== 'POST') return route.continue();
      await route.fulfill({
        status: 200,
        contentType: 'application/xml',
        body: vehiclePublicationDelivery(VEHICLE_ID),
      });
    });

    await page.goto(SELECTED);
    await page.waitForLoadState('networkidle');

    await page.getByTestId('editor-rail-edit').click();
    await page.locator('#vehicle-name').fill('Oslo Tram 4 — renamed');
    await page.getByTestId('editor-rail-save').click();

    // Save success → snackbar; the XML refetch must re-baseline the form so
    // the slider is no longer considered dirty.
    await expect(page.getByText('Vehicle saved')).toBeVisible();

    await page.getByTestId('editor-rail-collapse').click();

    await expect(page.getByRole('button', { name: 'Discard' })).toHaveCount(0);
    await expect(page).not.toHaveURL(/selected=/);
  });
});
