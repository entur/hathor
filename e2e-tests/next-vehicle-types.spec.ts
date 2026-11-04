import { test, expect, type Page } from '@playwright/test';
import { interceptGraphQLQuery, interceptVehicleTypesQuery, loadFixture } from './autosys-helpers';
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
 *   /next/vehicle-types/<id> in edit mode → the page's Close returns to the list.
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
 *     the pager, which stay in view, in the grid and in cards, at desktop and phone width; on a
 *     phone held sideways the rows keep a floor and the page scrolls instead
 *   - form page (#280): sections with a table of contents that jumps to one; Edit → Save /
 *     Cancel in a sticky footer, Cancel asks before discarding and returns to view mode;
 *     Deactivate asks first
 *   - create page (internal user test): no Edit, no New button, no Vehicles section; Cancel
 *     returns to the list
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
    await expect(footerSave(page)).toBeVisible();

    await page.getByTestId('editor-page-close').click();
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
    await page.getByTestId('editor-page-close').click();
    await expect(page).toHaveURL(new RegExp(`${LIST}$`));
    await expect(edit).toBeFocused();
  });

  test('closing the create page returns focus to New', async ({ page }) => {
    await page.goto(LIST);
    await selectFirstOrg(page);
    const newAction = page.getByTestId('create-vehicle-type-fab');
    await newAction.click();
    await expect(footerSave(page)).toBeVisible();
    await page.getByTestId('editor-page-close').click();
    await expect(page).toHaveURL(new RegExp(`${LIST}$`));
    await expect(newAction).toBeFocused();
  });

  test('the create page shows no Edit, no New button and no Vehicles section', async ({ page }) => {
    await page.goto(`${LIST}/new`);
    await selectFirstOrg(page);
    await expect(footerSave(page)).toBeVisible();
    expect(await page.getByTestId('editor-page-edit').count()).toBe(0);
    expect(await page.getByTestId('create-vehicle-type-fab').count()).toBe(0);
    await expect(toc(page).getByRole('button', { name: 'Environment' })).toBeVisible();
    expect(await toc(page).getByRole('button', { name: 'Vehicles' }).count()).toBe(0);
  });

  test("the create page's Cancel returns to the list", async ({ page }) => {
    await page.goto(LIST);
    await selectFirstOrg(page);
    await page.getByTestId('create-vehicle-type-fab').click();
    await expect(footerSave(page)).toBeVisible();
    await page.getByRole('button', { name: 'Cancel', exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`${LIST}$`));
  });

  test('a deep link opens the record in view mode', async ({ page }) => {
    test.skip(IS_LIVE, 'fixture id');
    await page.goto(`${LIST}/${encodeURIComponent(FIXTURE_ID)}`);
    await expect(page.getByTestId('vehicle-type-details-title')).toHaveText('Type Alpha');
    await expect(page.getByTestId('editor-page-edit')).toBeVisible();
    expect(await footerSave(page).count()).toBe(0);
  });

  test('the table of contents jumps to a section', async ({ page }) => {
    test.skip(IS_LIVE, 'fixture id');
    await page.goto(`${LIST}/${encodeURIComponent(FIXTURE_ID)}`);
    const capacity = page.getByRole('heading', { name: 'Passenger Capacity' });
    await expect(capacity).not.toBeInViewport();
    await toc(page).getByRole('button', { name: 'Passenger Capacity' }).click();
    await expect(capacity).toBeInViewport();
  });

  test('Edit → Cancel asks before discarding and returns to view mode', async ({ page }) => {
    test.skip(IS_LIVE, 'fixture id');
    await page.goto(`${LIST}/${encodeURIComponent(FIXTURE_ID)}`);
    await page.getByTestId('editor-page-edit').click();
    const name = page.locator('#vtype-name');
    await name.fill('Type Omega');
    await expect(page.getByText('Unsaved changes')).toBeVisible();
    await page.getByRole('button', { name: 'Cancel', exact: true }).click();
    await page.getByRole('dialog').getByRole('button', { name: 'Discard' }).click();
    await expect(name).toHaveValue('Type Alpha');
    await expect(page.getByTestId('editor-page-edit')).toBeVisible();
    // Retried: the discard dialog's own Save lingers while it fades out.
    await expect(footerSave(page)).toHaveCount(0);
  });

  test('Deactivate asks first', async ({ page }) => {
    test.skip(IS_LIVE, 'fixture id');
    await page.goto(`${LIST}/${encodeURIComponent(FIXTURE_ID)}`);
    await page.getByTestId('editor-page-deactivate').click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await dialog.getByRole('button', { name: 'Cancel' }).click();
    await expect(dialog).toBeHidden();
    await expect(page.getByTestId('editor-page-deactivate')).toBeVisible();
  });
});

test('Collections flag off redirects /next/* to /', async ({ page, context }) => {
  await seedAuth(context, { sandboxFeatures: {} });
  await page.goto(LIST);
  await expect(page).toHaveURL(/\/$/);
});
