import { test, expect, type Page } from '@playwright/test';
import { interceptGraphQLQuery, interceptVehicleTypesQuery, loadFixture } from './autosys-helpers';
import { IS_LIVE, seedAuth, selectFirstOrg } from './live-auth-helpers';
import { interceptVehicleTypesQuery as interceptVehicleTypeRows } from './vehicle-list-helpers';

const LIST = '/next/vehicle-types';
// Fixture row (vehicle-types-mock.json): Type Alpha.
const FIXTURE_ID = 'NMR:VehicleType:1';
const MOBILE_VIEWPORT = { width: 390, height: 844 };
// Rows in vehicle-types-mock.json.
const FIXTURE_ROWS = 3;
// Of those, drawn as a bus: BUS and no mode (the RAIL row gets a line of text).
const DRAWN_ROWS = 2;
const SHOT_TIMEOUT_MS = 15_000; // software WebGL shoots slowly
// A full page of rows (the default page size): more than fits between toolbar and pager.
const FULL_PAGE = 25;
// On the first page, below the fold of the grid at the default viewport.
const BELOW_FOLD = 20;

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
 *   /next/vehicle-types/<id> in edit mode → editor-rail collapse returns to the list.
 * Covers:
 *   - the header search is hidden on shell routes (still shown on the legacy list), incl.
 *     browser Back from a legacy list with the mobile search open
 *   - Edit → details page in edit mode; collapse → back on the list
 *   - a deep link to /next/vehicle-types/<id> opens in view mode
 *   - `Collections` flag off → /next/* redirects to /
 *   - user test II: <main> + skip link; subtitle names the organisation and the count;
 *     empty list offers one New; New shortens to "New" on a phone; focus moves to the editor's
 *     h1 on open and back to the row's Edit link on close, also a row below the grid's fold
 *     (to New, closing the create page); a new page of cards starts at its first card
 *   - cards draw a bus or coach type as a bus (#276); a type without a height says it is
 *     drawn with the standard height; a rail type gets "Picture not supported" instead; without
 *     WebGL 2 (forced off in its own test) the drawn rows say "Picture unavailable"
 *   - collection frame (#278): the page doesn't scroll; the rows scroll between the toolbar and
 *     the pager, which stay in view, in the grid and in cards, at desktop and phone width
 *   - create page (internal user test): no edit pen, no New button; Vehicles tab hidden and
 *     Cancel returning to where you came from are fixme until the form-page slice of #252
 * Modes:
 *   - mock (E2E_BACKEND unset): interceptVehicleTypesQuery (vehicle-types-mock.json)
 *   - live (E2E_BACKEND=true): seedAuth JWT + org auto-select; runs on the org's real rows
 *   - skip-live: the deep-link test (fixture id); the empty-list test (mocked empty list);
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
      const pageScrolls = () =>
        page.evaluate(() => document.documentElement.scrollHeight > window.innerHeight);

      for (const name of ['Table', 'Cards']) {
        await view.getByRole('button', { name }).click();
        // The grid scrolls its own body under fixed headers (and draws only the rows near the
        // view, so no row can be scrolled to); cards scroll in the rows box.
        const scroller = name === 'Table' ? rows.locator('.MuiDataGrid-virtualScroller') : rows;
        await expect
          .poll(() => scroller.evaluate(el => el.scrollHeight > el.clientHeight))
          .toBe(true);
        await scroller.evaluate(el => el.scrollTo(0, el.scrollHeight));
        await expect(view).toBeInViewport();
        await expect(pager).toBeInViewport();
        expect(await pageScrolls()).toBe(false);
      }
    });
  }

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
    await page.getByTestId('editor-rail-collapse').click();
    await expect(page).toHaveURL(new RegExp(`${LIST}$`));
    await expect(edit).toBeFocused();
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
