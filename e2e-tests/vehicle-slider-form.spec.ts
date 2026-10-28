import { test, expect } from '@playwright/test';
import {
  interceptVehicleListQuery,
  interceptStatefulVehicleListQuery,
  interceptVehicleByIdQuery,
  interceptVehicleSaveMutation,
  interceptVehicleTypesQuery,
  vehicleRow,
} from './vehicle-list-helpers';
import { seedAuth } from './live-auth-helpers';

const VEHICLE_ID = 'NMR:Vehicle:rail-1';
const SELECTED = `/vehicles?selected=${encodeURIComponent(VEHICLE_ID)}`;

/**
 * Hold the unfiltered `vehicles(` list query made after a `createOrUpdateVehicle`
 * (the post-save list refresh) until `release()`. Register after the other
 * interceptors so it runs first and falls back to them.
 *
 * @param {Page} page Playwright Page.
 * @returns {{ reached: Promise<void>, release: () => void }} `reached` resolves once the held request arrives.
 */
async function holdPostSaveListRefresh(page: import('@playwright/test').Page) {
  let saved = false;
  let release!: () => void;
  let arrive!: () => void;
  const gate = new Promise<void>(r => (release = r));
  const reached = new Promise<void>(r => (arrive = r));
  await page.route('**/graphql', async route => {
    const post = route.request().postDataJSON();
    const query: string = post?.query ?? '';
    if (query.includes('createOrUpdateVehicle')) saved = true;
    else if (saved && query.includes('vehicles(') && !post?.variables?.filter?.netexIds) {
      arrive();
      await gate;
    }
    await route.fallback();
  });
  return { reached, release };
}

/**
 * /vehicles slider form — fetched Name/dates hydrate the editor and a successful save re-baselines dirty state (hathor #80, GraphQL read/save path post-#101). Also covers #82 — swapping a vehicle's VehicleType via the inline Autocomplete picker round-trips on save.
 *
 * Workflow:
 *   1. copy config-no-auth → per test, intercept vehicleTypes(`(picker options)`) + list `vehicles(` + by-id `vehicles(filter:{netexIds})` → goto /vehicles?selected=<id>.
 *   2. Name: by-id returns name.value "Oslo Tram 4" → vehicle-details-title text = "Oslo Tram 4" and #vehicle-name input = "Oslo Tram 4".
 *   3. Dates: by-id returns buildDate/registrationDate → #vehicle-build-date and #vehicle-registration-date are type=date inputs bound to the fetched values.
 *   4. Post-save: stateful list + save mutation → editor-rail-edit → rename #vehicle-name → editor-rail-save → "Vehicle saved" snackbar → editor-rail-collapse → no Discard dialog, URL drops selected= (post-save single-vehicle refetch advanced the dirty baseline).
 *   5. VehicleType swap (#82): editor-rail-edit → open picker (label "Vehicle Type") → pick a different option → editor-rail-save → captured mutation input carries the picked option's netexId in `transportType.netexId`.
 * Covers:
 *   - Name sourced from vehicles(filter:{netexIds}) name.value shows in title + form field.
 *   - Build/Registration dates render as native date pickers bound to fetched value.
 *   - Closing the slider after a successful save does not wrongly raise the discard dialog.
 *   - Edit is withheld while the post-save list refresh is pending (#217) — the re-hydrate
 *     after it would wipe what the user typed.
 *   - VehicleType field is an interactive Autocomplete; picking a different option round-trips as the option's full netex id in the save mutation input.
 * Modes:
 *   - mock (E2E_BACKEND unset): intercepts vehicleTypes, list, by-id, and save mutation; Name/date/type values are fixture-controlled.
 *   - live (E2E_BACKEND=true): no live path — the whole describe skips.
 *   - skip-live: entire describe ("/vehicles slider form — fetch + post-save dirty baseline") — mock-only regression spec; asserted Name/date/type values are fixture-controlled, meaningless against live data.
 */
test.describe('/vehicles slider form — fetch + post-save dirty baseline (no-auth)', () => {
  test.skip(process.env.E2E_BACKEND === 'true', 'mock-only regression spec');

  test.beforeEach(async ({ context }) => seedAuth(context));

  test('Name from the vehicles() fetch shows in the title and form field', async ({ page }) => {
    await interceptVehicleTypesQuery(page);
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
    await interceptVehicleTypesQuery(page);
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
    await interceptVehicleTypesQuery(page);
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

  // #217: Edit is withheld for the whole post-save continuation. The list
  // refresh runs before the by-id re-fetch, and `record.loading` is false
  // during it — hold the LIST route, not the by-id one.
  test('Edit is unavailable while the post-save list refresh is pending', async ({ page }) => {
    await interceptVehicleTypesQuery(page);
    await interceptStatefulVehicleListQuery(page);
    await interceptVehicleByIdQuery(page, id => vehicleRow(id, { name: { value: 'Oslo Tram 4' } }));
    interceptVehicleSaveMutation(page, VEHICLE_ID);
    const held = await holdPostSaveListRefresh(page);

    await page.goto(SELECTED);
    await page.waitForLoadState('networkidle');

    await page.getByTestId('editor-rail-edit').click();
    await page.locator('#vehicle-name').fill('Oslo Tram 4 — renamed');
    await page.getByTestId('editor-rail-save').click();
    await held.reached;

    await expect(page.locator('#vehicle-name')).toBeDisabled();
    await expect(page.getByTestId('editor-rail-edit')).toHaveCount(0);

    held.release();
    await expect(page.getByText('Vehicle saved')).toBeVisible();
    await expect(page.getByTestId('editor-rail-edit')).toBeVisible();
  });

  test("editing a vehicle's type via the picker round-trips the new ref on save (#82)", async ({
    page,
  }) => {
    await interceptVehicleTypesQuery(page);
    await interceptStatefulVehicleListQuery(page);
    // Existing row carries the rail type; the test swaps it to Bus.
    await interceptVehicleByIdQuery(page, id =>
      vehicleRow(id, {
        name: { value: 'Oslo Tram 4' },
        transportType: {
          netexId: 'NMR:VehicleType:2',
          version: 1,
          name: { value: 'Rail Type' },
          transportMode: 'rail',
        },
      })
    );
    const save = interceptVehicleSaveMutation(page, VEHICLE_ID);

    await page.goto(SELECTED);
    await page.waitForLoadState('networkidle');

    await page.getByTestId('editor-rail-edit').click();

    const pickerInput = page.locator('#vehicle-transport-type');
    await expect(pickerInput).toHaveValue('Rail Type');

    await pickerInput.click();
    await page.getByRole('option', { name: 'Bus Type' }).click();
    await expect(pickerInput).toHaveValue('Bus Type');

    await page.getByTestId('editor-rail-save').click();
    await expect(page.getByText('Vehicle saved')).toBeVisible();

    const input = save.input() as { transportType?: { netexId?: string } } | null;
    expect(input?.transportType?.netexId).toBe('NMR:VehicleType:1');
  });
});
