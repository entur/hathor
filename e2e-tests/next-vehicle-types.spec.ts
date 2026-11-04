import { test, expect } from '@playwright/test';
import { interceptGraphQLQuery, interceptVehicleTypesQuery, loadFixture } from './autosys-helpers';
import { IS_LIVE, seedAuth, selectFirstOrg } from './live-auth-helpers';

const LIST = '/next/vehicle-types';
// Fixture row (vehicle-types-mock.json): Type Alpha.
const FIXTURE_ID = 'NMR:VehicleType:1';
const MOBILE_VIEWPORT = { width: 390, height: 844 };
// Rows in vehicle-types-mock.json.
const FIXTURE_ROWS = 3;
// Of those, drawn as a bus: BUS and no mode (the RAIL row gets a line of text).
const DRAWN_ROWS = 2;
const SHOT_TIMEOUT_MS = 15_000; // software WebGL shoots slowly

/**
 * /next/vehicle-types — the page shell (#253, epic #252) beside the legacy list:
 * PageShell layout route → CollectionShell list · EntityDetailsShell editor page.
 *
 * Workflow:
 *   /next/vehicle-types → collection grid (#271) with an Edit link per row → Edit opens
 *   /next/vehicle-types/<id> in edit mode → editor-rail collapse returns to the list.
 * Covers:
 *   - the header search is hidden on shell routes (still shown on the legacy list), incl.
 *     browser Back from a legacy list with the mobile search open
 *   - Edit → details page in edit mode; collapse → back on the list
 *   - a deep link to /next/vehicle-types/<id> opens in view mode
 *   - `Collections` flag off → /next/* redirects to /
 *   - user test II: <main> + skip link; subtitle names the organisation and the count;
 *     empty list offers one New; New shortens to "New" on a phone; focus moves to the editor's
 *     h1 on open and back to the row's Edit link on close (to New, closing the create page)
 *   - large cards draw a bus or coach type as a bus (#276); a type without a height says it is
 *     drawn with the standard height; a rail type gets "Picture not supported" instead
 *   - create page (internal user test): no edit pen, no New button; Vehicles tab hidden and
 *     Cancel returning to where you came from are fixme until the form-page slice of #252
 * Modes:
 *   - mock (E2E_BACKEND unset): interceptVehicleTypesQuery (vehicle-types-mock.json)
 *   - live (E2E_BACKEND=true): seedAuth JWT + org auto-select; runs on the org's real rows
 *   - skip-live: the deep-link test (fixture id); the empty-list test (mocked empty list);
 *     the bus-picture test (mocked row without a height)
 */
test.describe('/next/vehicle-types page shell', () => {
  test.beforeEach(async ({ page, context }) => {
    await seedAuth(context);
    if (!IS_LIVE) await interceptVehicleTypesQuery(page);
  });

  test('hides the header search on shell routes, also after Back from an open mobile search', async ({
    page,
  }) => {
    // Mobile: the header's search icon is the part a shell route must drop (desktop
    // renders the filter button only when a legacy list registers filters).
    await page.setViewportSize(MOBILE_VIEWPORT);
    const banner = page.getByRole('banner');
    const searchIcon = banner.getByRole('button', { name: 'search', exact: true });
    // Header actions marker: hidden while the mobile search bar is open.
    const settings = banner.getByRole('button', { name: 'settings', exact: true });
    await page.goto(LIST);
    await selectFirstOrg(page);
    await expect(page.getByRole('grid')).toBeVisible();
    expect(await searchIcon.count()).toBe(0);
    // innerText skips the hidden long label (textContent would include both).
    await expect.poll(() => page.getByTestId('create-vehicle-type-fab').innerText()).toBe('New');

    // In-app to the legacy list (header state survives), open the search, then Back.
    await banner.getByRole('button', { name: 'Expand menu' }).click();
    await page.getByRole('link', { name: 'Vehicle Types' }).click();
    await expect(page).toHaveURL(/\/vehicle-types$/);
    await searchIcon.click();
    await expect(settings).toBeHidden(); // the open search bar replaces the header actions
    await page.goBack();
    await expect(page.getByRole('grid')).toBeVisible();
    await expect(settings).toBeVisible();
    expect(await searchIcon.count()).toBe(0);
  });

  test('Edit opens the details page in edit mode; collapse returns to the list', async ({
    page,
  }) => {
    await page.goto(LIST);
    await selectFirstOrg(page);
    const firstEdit = page.getByRole('link', { name: /^Edit / }).first();
    await firstEdit.click();

    await expect(page).toHaveURL(new RegExp(`${LIST}/[^/]+$`));
    const title = page.getByTestId('vehicle-type-details-title');
    await expect(title).toBeFocused();
    await expect(title).toHaveJSProperty('tagName', 'H1');
    await expect(page.getByTestId('editor-rail-save')).toBeVisible();

    await page.getByTestId('editor-rail-collapse').click();
    await expect(page).toHaveURL(new RegExp(`${LIST}$`));
    await expect(firstEdit).toBeFocused();
  });

  test('skip link jumps to <main>; the subtitle names the organisation and the count', async ({
    page,
  }) => {
    await page.goto(LIST);
    await selectFirstOrg(page);
    await expect(page.getByTestId('collection-subtitle')).toHaveText(
      IS_LIVE ? /· Total entries: \d+$/ : `Mock Org · Total entries: ${FIXTURE_ROWS}`
    );
    await page.keyboard.press('Tab');
    await expect(page.getByTestId('skip-to-content')).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.getByRole('main')).toBeFocused();
  });

  test('an empty list says so and offers New', async ({ page }) => {
    test.skip(IS_LIVE, 'mocked empty list');
    await page.route('**/graphql', route =>
      route.request().postDataJSON()?.query?.includes('vehicleTypes')
        ? route.fulfill({
            json: { data: { vehicleTypes: { content: [], totalElements: 0, page: 0, size: 0 } } },
          })
        : route.fallback()
    );
    await page.goto(LIST);
    const empty = page.getByTestId('collection-empty');
    await expect(empty).toContainText('No vehicle types for Mock Org yet');
    await expect(empty.getByTestId('create-vehicle-type-fab')).toBeVisible();
    await expect(page.getByTestId('create-vehicle-type-fab')).toHaveCount(1);
  });

  test('large cards draw buses and coaches; a type without a height says so, a train is unsupported', async ({
    page,
  }) => {
    test.skip(IS_LIVE, 'mocked row without a height');
    // A fresh read: editing it leaves the shared fixture alone.
    const body = loadFixture('vehicle-types-mock.json') as {
      data: { vehicleTypes: { content: { height?: number }[] } };
    };
    delete body.data.vehicleTypes.content[0].height;
    await interceptGraphQLQuery(page, 'vehicleTypes', body);
    await page.goto(LIST);
    await page.getByRole('button', { name: 'Large cards' }).click();
    await expect(page.getByRole('note')).toHaveText(['Drawn with standard height']);
    await expect(page.getByText('Picture not supported for Rail')).toBeVisible();
    // The pictures need WebGL, which a GPU-less CI browser may not offer: the text above doesn't.
    const webgl = await page.evaluate(() => !!document.createElement('canvas').getContext('webgl'));
    if (webgl)
      await expect(page.locator('[data-card-media] img')).toHaveCount(DRAWN_ROWS, {
        timeout: SHOT_TIMEOUT_MS,
      });
  });

  test('closing the create page returns focus to New', async ({ page }) => {
    await page.goto(LIST);
    await selectFirstOrg(page);
    const newAction = page.getByTestId('create-vehicle-type-fab');
    await newAction.click();
    await expect(page.getByTestId('editor-rail-save')).toBeVisible();
    await page.getByTestId('editor-rail-collapse').click();
    await expect(page).toHaveURL(new RegExp(`${LIST}$`));
    await expect(newAction).toBeFocused();
  });

  test('the create page shows no edit pen and no New button', async ({ page }) => {
    await page.goto(`${LIST}/new`);
    await selectFirstOrg(page);
    await expect(page.getByTestId('editor-rail-save')).toBeVisible();
    expect(await page.getByTestId('editor-rail-edit').count()).toBe(0);
    expect(await page.getByTestId('create-vehicle-type-fab').count()).toBe(0);
  });

  test.fixme('the create page hides the Vehicles tab; Cancel returns to where you came from', async ({
    page,
  }) => {
    // Internal user test, create mode: fixed in the form-page slice of #252.
    await page.goto(LIST);
    await selectFirstOrg(page);
    await page.getByTestId('create-vehicle-type-fab').click();
    await expect(page.getByTestId('editor-rail-save')).toBeVisible();
    expect(await page.getByRole('tab', { name: 'Vehicles' }).count()).toBe(0);
    await page.getByTestId('editor-rail-cancel').click();
    await expect(page).toHaveURL(new RegExp(`${LIST}$`));
  });

  test('a deep link opens the record in view mode', async ({ page }) => {
    test.skip(IS_LIVE, 'fixture id');
    await page.goto(`${LIST}/${encodeURIComponent(FIXTURE_ID)}`);
    await expect(page.getByTestId('vehicle-type-details-title')).toHaveText('Type Alpha');
    await expect(page.getByTestId('editor-rail-edit')).toBeVisible();
  });
});

test('Collections flag off redirects /next/* to /', async ({ page, context }) => {
  await seedAuth(context, { sandboxFeatures: {} });
  await page.goto(LIST);
  await expect(page).toHaveURL(/\/$/);
});
