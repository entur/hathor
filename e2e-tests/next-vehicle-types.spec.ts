import { test, expect, type Page } from '@playwright/test';
import {
  interceptGraphQLQuery,
  interceptVehicleTypesQuery,
  interceptVehicleTypesWithSave,
  loadFixture,
} from './autosys-helpers';
import { IS_LIVE, seedAuth, selectFirstOrg } from './live-auth-helpers';
import { interceptVehicleTypesQuery as interceptVehicleTypeRows } from './vehicle-list-helpers';

const LIST = '/next/vehicle-types';
// Fixture row (vehicle-types-mock.json): Type Alpha.
const FIXTURE_ID = 'NMR:VehicleType:1';
const MOBILE_VIEWPORT = { width: 390, height: 844 };
const LANDSCAPE_VIEWPORT = { width: 844, height: 390 };
const ROWS_MIN_PX = 240; // collection.tsx: the rows' floor
// Rows in vehicle-types-mock.json.
const FIXTURE_ROWS = 3;
// Of those, drawn as a bus: BUS and no mode (the RAIL row gets a line of text).
const DRAWN_ROWS = 2;
const SHOT_TIMEOUT_MS = 15_000; // software WebGL shoots slowly
// A full page of rows (the default page size): more than fits between toolbar and pager.
const FULL_PAGE = 25;
// On the first page, below the fold of the grid at the default viewport.
const BELOW_FOLD = 20;

/** The form page's sticky footer Save. */
const footerSave = (page: Page) => page.getByRole('button', { name: 'Save', exact: true });
/** The form page's sticky footer Cancel. */
const footerCancel = (page: Page) => page.getByRole('button', { name: 'Cancel', exact: true });
/** A Menu link off the form page (the rail's Vehicles item). */
const menuVehicles = (page: Page) => page.getByTestId('nav-rail').locator('a[href="/vehicles"]');
/** The form page's table of contents (the list from `lg` up). */
const toc = (page: Page) => page.getByRole('navigation', { name: 'Sections' });

/** Rail types `Type 00` … `Type n-1`, padded so the name sort keeps their order: their cards
 *  get a line of text, no WebGL shot. */
const interceptRailRows = (page: Page, n: number) =>
  interceptVehicleTypeRows(
    page,
    Array.from({ length: n }, (_, i) => ({
      netexId: `NMR:VehicleType:${100 + i}`,
      version: 1,
      name: { value: `Type ${String(i).padStart(2, '0')}` },
      transportMode: 'RAIL',
    }))
  );

/**
 * /next/vehicle-types — the page shell (#253, epic #252) beside the legacy list:
 * PageShell layout route → CollectionShell list · EntityDetailsShell editor page.
 *
 * Workflow:
 *   /next/vehicle-types → collection grid (#271) with an Edit link per row → Edit opens
 *   /next/vehicle-types/<id>, ready to edit → the page's Back returns to the list.
 * Covers:
 *   - the header search is hidden on shell routes (still shown on the legacy list), incl.
 *     browser Back from a legacy list with the mobile search open
 *   - Edit → details page, ready to edit; Back → back on the list
 *   - a deep link to /next/vehicle-types/<id> opens ready to edit, Save and Cancel inert
 *   - `Collections` flag off → /next/* redirects to /
 *   - user test II: <main> + skip link; subtitle names the organisation and the count;
 *     empty list offers one New; New shortens to "New" on a phone; focus moves to the editor's
 *     h1 on open and back to the row's Edit link on close, also a row below the grid's fold
 *     (to New, closing the create page); a new page of cards starts at its first card
 *   - cards draw a bus or coach type as a bus (#276); a type without a height says it is
 *     drawn with the standard height; a rail type gets "Picture not supported" instead; without
 *     WebGL 2 (forced off in its own test) the drawn rows say "Picture unavailable"
 *   - collection frame (#278): the page doesn't scroll; the rows scroll between the toolbar and
 *     the pager, which stay in view, in the grid and in cards, at desktop and phone width; on a
 *     phone held sideways the rows keep a floor and the page scrolls instead
 *   - form page (#280, #282): sections with a table of contents that jumps to one; Save /
 *     Cancel in a sticky footer, Cancel asks before discarding and reverts, still editing;
 *     Deactivate asks first, then freezes the page under a red "Deactivated"
 *   - leaving with unsaved edits (#282): a Menu link or browser Back asks first — the dialog's
 *     Cancel stays, Discard follows; with no edits a Menu link goes straight through; a create's
 *     own redirect to its new id after Save never asks; the dialog's Save saves and stays,
 *     and offers no Save while a save runs (or once it has landed clean), when the fields read
 *     only — as during a Retry read
 *   - a Vehicles chip links to the vehicle's form page (#285)
 *   - create page (internal user test): no Deactivate, no New button, no Vehicles section;
 *     Cancel stays inert until a field changes, then asks and Discard returns to the list
 * Modes:
 *   - mock (E2E_BACKEND unset): interceptVehicleTypesQuery (vehicle-types-mock.json)
 *   - live (E2E_BACKEND=true): seedAuth JWT + org auto-select; runs on the org's real rows
 *   - skip-live: the fixture-id form tests (deep link, Cancel, Deactivate, leaving guard); the empty-list test (mocked empty list);
 *     the two bus-picture tests and the frame test (mocked rows)
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

  test('Edit opens the details page ready to edit; Back returns to the list', async ({ page }) => {
    await page.goto(LIST);
    await selectFirstOrg(page);
    const firstEdit = page.getByRole('link', { name: /^Edit / }).first();
    await firstEdit.click();

    await expect(page).toHaveURL(new RegExp(`${LIST}/[^/]+$`));
    const title = page.getByTestId('vehicle-type-details-title');
    await expect(title).toBeFocused();
    await expect(title).toHaveJSProperty('tagName', 'H1');
    await expect(footerSave(page)).toBeVisible();

    await page.getByTestId('editor-page-back').click();
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

  test('cards draw buses and coaches; a type without a height says so, a train is unsupported', async ({
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
    await page.getByRole('button', { name: 'Cards' }).click();
    await expect(page.getByText('Picture not supported for Rail')).toBeVisible();
    // The pictures need WebGL 2 (three.js), which a GPU-less CI browser may not offer:
    // there the drawn rows say "Picture unavailable" instead.
    const webgl = await page.evaluate(
      () => !!document.createElement('canvas').getContext('webgl2')
    );
    if (webgl) {
      await expect(page.locator('[data-card-media] img')).toHaveCount(DRAWN_ROWS, {
        timeout: SHOT_TIMEOUT_MS,
      });
      await expect(page.getByRole('note')).toHaveText(['Drawn with standard height']);
    } else {
      await expect(page.getByText('Picture unavailable')).toHaveCount(DRAWN_ROWS);
    }
  });

  test('without WebGL 2 a bus says its picture is unavailable', async ({ page }) => {
    test.skip(IS_LIVE, 'mocked rows');
    await page.addInitScript(() => {
      const getContext = HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement, id, ...rest) {
        return id === 'webgl2' ? null : getContext.call(this, id, ...rest);
      } as typeof getContext;
    });
    await page.goto(LIST);
    await page.getByRole('button', { name: 'Cards' }).click();
    await expect(page.getByText('Picture unavailable')).toHaveCount(DRAWN_ROWS);
    await expect(page.getByText('Picture not supported for Rail')).toBeVisible();
    await expect(page.locator('[data-card-media] img')).toHaveCount(0);
  });

  for (const [size, viewport] of [
    ['desktop', null], // the project's own viewport
    ['phone', MOBILE_VIEWPORT],
  ] as const) {
    test(`the rows scroll between a fixed toolbar and pager, not the page (${size})`, async ({
      page,
    }) => {
      test.skip(IS_LIVE, 'a mocked full page');
      await interceptRailRows(page, FULL_PAGE);
      if (viewport) await page.setViewportSize(viewport);
      await page.goto(LIST);
      const view = page.getByRole('group', { name: 'View' });
      const pager = page.getByRole('navigation', { name: 'Pagination' });
      const rows = page.getByTestId('collection-rows');
      const last = rows.getByText(`Type ${FULL_PAGE - 1}`, { exact: true });
      // Every scroller outside the rows box: the page, the app's content, the shell's body.
      const scrolledOutside = () =>
        page.evaluate(
          () =>
            [...document.querySelectorAll('*')].filter(
              el => el.scrollTop > 0 && !el.closest('[data-testid="collection-rows"]')
            ).length
        );

      for (const name of ['Table', 'Cards']) {
        await view.getByRole('button', { name }).click();
        await expect(last).not.toBeInViewport();
        // Its nearest scroller brings it in: the grid's body, or the rows box for cards.
        await last.scrollIntoViewIfNeeded();
        await expect(last).toBeInViewport();
        await expect(view).toBeInViewport();
        await expect(pager).toBeInViewport();
        expect(await scrolledOutside()).toBe(0);
      }
    });
  }

  test('on a phone held sideways the rows keep their floor and the page scrolls to the pager', async ({
    page,
  }) => {
    test.skip(IS_LIVE, 'a mocked full page');
    await interceptRailRows(page, FULL_PAGE);
    await page.setViewportSize(LANDSCAPE_VIEWPORT);
    await page.goto(LIST);
    const rows = page.getByTestId('collection-rows');
    await expect(rows).toBeVisible();
    // Rounded: Firefox measures the floor a sub-pixel short.
    expect(Math.round((await rows.boundingBox())!.height)).toBeGreaterThanOrEqual(ROWS_MIN_PX);
    const pager = page.getByRole('navigation', { name: 'Pagination' });
    await pager.scrollIntoViewIfNeeded();
    await expect(pager).toBeInViewport();
  });

  test('a new page of cards starts at its first card', async ({ page }) => {
    test.skip(IS_LIVE, 'mocked pages');
    await interceptRailRows(page, 2 * FULL_PAGE);
    await page.goto(LIST);
    await page.getByRole('button', { name: 'Cards' }).click();
    const rows = page.getByTestId('collection-rows');
    await rows.getByText(`Type ${FULL_PAGE - 1}`, { exact: true }).scrollIntoViewIfNeeded();
    await page.getByRole('button', { name: 'Go to next page' }).click();
    await expect(rows.getByText(`Type ${FULL_PAGE}`, { exact: true })).toBeInViewport();
    expect(await rows.evaluate(el => el.scrollTop)).toBe(0);
  });

  test('focus returns to the Edit link of a row below the fold', async ({ page }) => {
    test.skip(IS_LIVE, 'a mocked full page');
    await interceptRailRows(page, FULL_PAGE);
    await page.goto(LIST);
    const edit = page.getByRole('link', { name: `Edit Type ${BELOW_FOLD}`, exact: true });
    await edit.click();
    await page.getByTestId('editor-page-back').click();
    await expect(page).toHaveURL(new RegExp(`${LIST}$`));
    await expect(edit).toBeFocused();
  });

  test('Back from the create page returns focus to New', async ({ page }) => {
    await page.goto(LIST);
    await selectFirstOrg(page);
    const newAction = page.getByTestId('create-vehicle-type-fab');
    await newAction.click();
    await expect(footerSave(page)).toBeVisible();
    await page.getByTestId('editor-page-back').click();
    await expect(page).toHaveURL(new RegExp(`${LIST}$`));
    await expect(newAction).toBeFocused();
  });

  test('the create page shows no Deactivate, no New button and no Vehicles section', async ({
    page,
  }) => {
    await page.goto(`${LIST}/new`);
    await selectFirstOrg(page);
    await expect(footerSave(page)).toBeVisible();
    expect(await page.getByTestId('editor-page-deactivate').count()).toBe(0);
    expect(await page.getByTestId('create-vehicle-type-fab').count()).toBe(0);
    await expect(toc(page).getByRole('button', { name: 'Environment' })).toBeVisible();
    expect(await toc(page).getByRole('button', { name: 'Vehicles' }).count()).toBe(0);
  });

  test("the create page's Cancel waits for a change, then asks and returns to the list", async ({
    page,
  }) => {
    await page.goto(LIST);
    await selectFirstOrg(page);
    await page.getByTestId('create-vehicle-type-fab').click();
    await expect(footerCancel(page)).toBeDisabled();
    await page.locator('#vtype-name').fill('Type Omega');
    await footerCancel(page).click();
    await page.getByRole('dialog').getByRole('button', { name: 'Discard' }).click();
    await expect(page).toHaveURL(new RegExp(`${LIST}$`));
  });

  test('a deep link opens the record ready to edit, Save and Cancel inert', async ({ page }) => {
    test.skip(IS_LIVE, 'fixture id');
    await page.goto(`${LIST}/${encodeURIComponent(FIXTURE_ID)}`);
    await expect(page.getByTestId('vehicle-type-details-title')).toHaveText('Type Alpha');
    await expect(page.locator('#vtype-name')).toBeEditable();
    await expect(footerSave(page)).toBeDisabled();
    await expect(footerCancel(page)).toBeDisabled();
  });

  test('the table of contents jumps to a section', async ({ page }) => {
    test.skip(IS_LIVE, 'fixture id');
    await page.goto(`${LIST}/${encodeURIComponent(FIXTURE_ID)}`);
    const capacity = page.getByRole('heading', { name: 'Passenger Capacity' });
    await expect(capacity).not.toBeInViewport();
    await toc(page).getByRole('button', { name: 'Passenger Capacity' }).click();
    await expect(capacity).toBeInViewport();
  });

  test("a Vehicles chip links to the vehicle's own form page", async ({ page }) => {
    test.skip(IS_LIVE, 'fixture id');
    await page.goto(`${LIST}/${encodeURIComponent(FIXTURE_ID)}`);
    // vehicle-types-mock.json: Type Alpha lists NMR:Vehicle:101.
    await expect(page.getByRole('link', { name: /AA-101/ })).toHaveAttribute(
      'href',
      `/next/vehicles/${encodeURIComponent('NMR:Vehicle:101')}`
    );
  });

  test('Cancel asks before discarding and reverts, still editing', async ({ page }) => {
    test.skip(IS_LIVE, 'fixture id');
    await page.goto(`${LIST}/${encodeURIComponent(FIXTURE_ID)}`);
    const name = page.locator('#vtype-name');
    await name.fill('Type Omega');
    await expect(page.getByText('Unsaved changes')).toBeVisible();
    await expect(page.getByTestId('editor-page-deactivate')).toBeDisabled();
    await footerCancel(page).click();
    await page.getByRole('dialog').getByRole('button', { name: 'Discard' }).click();
    await expect(name).toHaveValue('Type Alpha');
    await expect(name).toBeEditable();
    await expect(footerCancel(page)).toBeDisabled();
  });

  test('Deactivate asks first, then freezes the page under a red "Deactivated"', async ({
    page,
  }) => {
    test.skip(IS_LIVE, 'fixture id; deactivates');
    await interceptVehicleTypesWithSave(page);
    await page.goto(`${LIST}/${encodeURIComponent(FIXTURE_ID)}`);
    const deactivate = page.getByTestId('editor-page-deactivate');
    const dialog = page.getByRole('dialog');
    await deactivate.click();
    await dialog.getByRole('button', { name: 'Cancel' }).click();
    await expect(dialog).toBeHidden();
    await expect(page.getByTestId('editor-page-deactivated')).toHaveCount(0);

    await deactivate.click();
    await dialog.getByRole('button', { name: 'Deactivate' }).click();
    await expect(page.getByTestId('editor-page-deactivated')).toHaveText('Deactivated');
    await expect(page.locator('#vtype-name')).not.toBeEditable();
    expect(await deactivate.count()).toBe(0);
    expect(await footerSave(page).count()).toBe(0);
    await page.getByTestId('editor-page-back').click();
    await expect(page).toHaveURL(new RegExp(`${LIST}$`));
  });

  test('a Menu link with unsaved edits asks first: Cancel stays, Discard follows', async ({
    page,
  }) => {
    test.skip(IS_LIVE, 'fixture id');
    await page.goto(`${LIST}/${encodeURIComponent(FIXTURE_ID)}`);
    const name = page.locator('#vtype-name');
    await name.fill('Type Omega');
    const dialog = page.getByRole('dialog');

    await menuVehicles(page).click();
    await dialog.getByRole('button', { name: 'Cancel' }).click(); // keep editing
    await expect(dialog).toBeHidden();
    await expect(page).toHaveURL(new RegExp(`${LIST}/[^/]+$`));
    await expect(name).toHaveValue('Type Omega');

    await menuVehicles(page).click();
    await dialog.getByRole('button', { name: 'Discard' }).click();
    await expect(page).toHaveURL(/\/vehicles$/);
  });

  test("the leave dialog's Save saves and stays; then the Menu link goes through", async ({
    page,
  }) => {
    test.skip(IS_LIVE, 'fixture id; saves');
    await interceptVehicleTypesWithSave(page);
    await page.goto(`${LIST}/${encodeURIComponent(FIXTURE_ID)}`);
    const name = page.locator('#vtype-name');
    await name.fill('Type Omega');
    await menuVehicles(page).click();
    await page.getByRole('dialog').getByRole('button', { name: 'Save' }).click();
    await expect(page.getByText('All changes saved')).toBeVisible();
    await expect(page).toHaveURL(new RegExp(`${LIST}/[^/]+$`));
    await expect(name).toHaveValue('Type Omega');
    await menuVehicles(page).click();
    await expect(page).toHaveURL(/\/vehicles$/);
  });

  test('while a save runs the fields read only and the leave dialog offers no Save', async ({
    page,
  }) => {
    test.skip(IS_LIVE, 'fixture id; holds a save');
    await interceptVehicleTypesWithSave(page);
    let release!: () => void;
    const held = new Promise<void>(r => (release = r));
    // Registered last, so it runs first: holds the write, then hands it to the save mock.
    await page.route('**/graphql', async route => {
      if (route.request().postData()?.includes('createOrUpdateVehicleType')) await held;
      await route.fallback();
    });
    await page.goto(`${LIST}/${encodeURIComponent(FIXTURE_ID)}`);
    const name = page.locator('#vtype-name');
    await name.fill('Type Omega');
    await footerSave(page).click();
    await expect(name).not.toBeEditable();
    await expect(page.getByTestId('editor-page-deactivate')).toBeDisabled();

    await menuVehicles(page).click();
    const dialog = page.getByRole('dialog');
    await expect(dialog.getByRole('button', { name: 'Discard' })).toBeVisible();
    expect(await dialog.getByRole('button', { name: 'Save' }).count()).toBe(0);

    // The save lands with the dialog still open: clean now, so still no Save to send twice.
    release();
    await expect(page.getByText('All changes saved')).toBeVisible();
    expect(await dialog.getByRole('button', { name: 'Save' }).count()).toBe(0);
    await dialog.getByRole('button', { name: 'Cancel' }).click();
    await expect(name).toBeEditable();
  });

  test('a Retry of a failed re-read reads only until the record lands', async ({ page }) => {
    test.skip(IS_LIVE, 'fixture id; fails a read');
    await interceptVehicleTypesWithSave(page);
    let saved = false,
      reads = 0,
      release!: () => void;
    const held = new Promise<void>(r => (release = r));
    // Registered last, so it runs first: fails the post-save by-id read, holds the Retry.
    await page.route('**/graphql', async route => {
      const post = route.request().postDataJSON();
      const query: string = post?.query ?? '';
      if (query.includes('createOrUpdateVehicleType')) saved = true;
      else if (saved && query.includes('vehicleTypes') && post.variables?.filter?.netexIds) {
        if (++reads === 1)
          return route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({ data: null, errors: [{ message: 're-read failed' }] }),
          });
        await held;
      }
      return route.fallback();
    });
    await page.goto(`${LIST}/${encodeURIComponent(FIXTURE_ID)}`);
    await page.locator('#vtype-name').fill('Type Omega');
    await footerSave(page).click();
    await page.getByRole('button', { name: 'Retry' }).click();

    const name = page.locator('#vtype-name');
    await expect(name).toBeVisible();
    await expect(name).not.toBeEditable();
    release();
    await expect(name).toBeEditable();
  });

  test('browser Back with unsaved edits asks first', async ({ page }) => {
    test.skip(IS_LIVE, 'fixture id');
    // In-app from the list: a Back across two page loads would leave the app (the browser's
    // own prompt), not navigate inside it.
    await page.goto(LIST);
    await page.getByRole('link', { name: 'Edit Type Alpha', exact: true }).click();
    await page.locator('#vtype-name').fill('Type Omega');
    await page.goBack();
    const dialog = page.getByRole('dialog');
    await dialog.getByRole('button', { name: 'Discard' }).click();
    await expect(page).toHaveURL(new RegExp(`${LIST}$`));
  });

  test("a create's Save moves to the new id without asking", async ({ page }) => {
    test.skip(IS_LIVE, 'creates a record');
    await interceptVehicleTypesWithSave(page);
    await page.goto(`${LIST}/new`);
    await page.locator('#vtype-name').fill('Type Omega');
    await footerSave(page).click();
    // The mock mints the fixture id; the redirect is a replace, which the guard lets through.
    await expect(page).toHaveURL(`${LIST}/${encodeURIComponent(FIXTURE_ID)}`);
    expect(await page.getByRole('dialog').count()).toBe(0);
    await expect(footerSave(page)).toBeDisabled();
  });

  test('with no unsaved edits a Menu link goes straight through', async ({ page }) => {
    test.skip(IS_LIVE, 'fixture id');
    await page.goto(`${LIST}/${encodeURIComponent(FIXTURE_ID)}`);
    await expect(page.locator('#vtype-name')).toHaveValue('Type Alpha');
    await menuVehicles(page).click();
    await expect(page).toHaveURL(/\/vehicles$/);
    expect(await page.getByRole('dialog').count()).toBe(0);
  });
});

test('Collections flag off redirects /next/* to /', async ({ page, context }) => {
  await seedAuth(context, { sandboxFeatures: {} });
  await page.goto(LIST);
  await expect(page).toHaveURL(/\/$/);
});
