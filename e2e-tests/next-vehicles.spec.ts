import { test, expect, type Page } from '@playwright/test';
import { interceptVehicleTypesQuery } from './autosys-helpers';
import { IS_LIVE, seedAuth, selectFirstOrg } from './live-auth-helpers';
import {
  interceptVehicleByIdQuery,
  interceptVehicleListQuery,
  mockVehicleById,
} from './vehicle-list-helpers';

const LIST = '/next/vehicles';
// vehicles-list-mock.json: a rail vehicle, its type not in vehicle-types-mock.json.
const FIXTURE_REG = 'RAIL-003';
// vehicle-types-mock.json: a bus type with all three dims.
const BUS_TYPE = 'Type Alpha';

/** The form page's sticky footer Save. */
const footerSave = (page: Page) => page.getByRole('button', { name: 'Save', exact: true });
/** The first row's Edit link, live or mocked. */
const firstEdit = (page: Page) => page.getByRole('link', { name: /^Edit / }).first();

/**
 * /next/vehicles — the vehicle pair (#285, epic #252): CollectionShell list ·
 * EntityDetailsShell form page, as /next/vehicle-types.
 *
 * Workflow:
 *   /next/vehicles → collection grid with an Edit link per row → /next/vehicles/<id>, ready
 *   to edit → Back returns to the list.
 * Covers:
 *   - Edit → form page (h1 focused, Save inert); Back → focus back on the row's Edit link
 *   - search narrows the rows by registration number (U1)
 *   - the vehicle type picked links to its own form page (U2/F8)
 *   - create: the picture box says "Select type" until a type is picked, then draws the
 *     type; Save, and the leave dialog's Save, stay locked without a type (Sobek hides a
 *     vehicle with none)
 * Modes:
 *   - mock (E2E_BACKEND unset): vehicles-list-mock.json, by-id from the same fixture,
 *     vehicle-types-mock.json for the type picker
 *   - live (E2E_BACKEND=true): seedAuth JWT + org auto-select; the first row
 *   - skip-live: the search (a fixture registration number) and the create test (fixture
 *     type names)
 */
test.describe('/next/vehicles', () => {
  test.beforeEach(async ({ page, context }) => {
    await seedAuth(context);
    if (!IS_LIVE) {
      await interceptVehicleTypesQuery(page);
      await interceptVehicleListQuery(page);
      await interceptVehicleByIdQuery(page, mockVehicleById);
    }
  });

  test('Edit opens the form page ready to edit; Back returns to the row', async ({ page }) => {
    await page.goto(LIST);
    await selectFirstOrg(page);
    const edit = firstEdit(page);
    await edit.click();

    await expect(page).toHaveURL(new RegExp(`${LIST}/[^/]+$`));
    const title = page.getByTestId('vehicle-details-title');
    await expect(title).toBeFocused();
    await expect(title).toHaveJSProperty('tagName', 'H1');
    await expect(page.locator('#vehicle-name')).toBeEditable();
    await expect(footerSave(page)).toBeDisabled();

    await page.getByTestId('editor-page-back').click();
    await expect(page).toHaveURL(new RegExp(`${LIST}$`));
    await expect(edit).toBeFocused();
  });

  test('search narrows the rows by registration number', async ({ page }) => {
    test.skip(IS_LIVE, 'fixture registration number');
    await page.goto(LIST);
    await page.getByPlaceholder('Search these rows').fill(FIXTURE_REG);
    await expect(page.getByRole('link', { name: /^Edit / })).toHaveCount(1);
    await expect(page.getByText(FIXTURE_REG, { exact: true })).toBeVisible();
  });

  test("the vehicle's type links to its own form page", async ({ page }) => {
    await page.goto(LIST);
    await selectFirstOrg(page);
    await firstEdit(page).click();
    const open = page.getByRole('link', { name: 'Open vehicle type' });
    await expect(open).toHaveAttribute('href', /^\/next\/vehicle-types\/[^/]+$/);
  });

  test('create: "Select type" until a type is picked; no Save of any kind without one', async ({
    page,
  }) => {
    test.skip(IS_LIVE, 'fixture type names');
    await page.goto(`${LIST}/new`);
    const placeholder = page.getByTestId('bus-picture-placeholder');
    await expect(placeholder).toHaveText('Select type');

    await page.locator('#vehicle-name').fill('Bus 1');
    await expect(footerSave(page)).toBeDisabled();
    await page.getByTestId('editor-page-back').click();
    const dialog = page.getByRole('dialog');
    await expect(dialog.getByRole('button', { name: 'Discard' })).toBeVisible();
    expect(await dialog.getByRole('button', { name: 'Save' }).count()).toBe(0);
    await dialog.getByRole('button', { name: 'Cancel' }).click();

    await page.locator('#vehicle-transport-type').click();
    await page.getByRole('option', { name: BUS_TYPE }).click();
    await expect(placeholder).toHaveCount(0);
    await expect(footerSave(page)).toBeEnabled();
  });
});
