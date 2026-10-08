import { test, expect, type Page } from '@playwright/test';
import {
  interceptDeckPlansQuery,
  interceptVehicleTypesQuery,
  loadXmlFixture,
} from './autosys-helpers';
import {
  interceptVehicleByIdQuery,
  interceptVehicleListQuery,
  interceptVehicleTypesQuery as interceptVehicleTypePicker,
  mockVehicleById,
} from './vehicle-list-helpers';
import { IS_LIVE, openFirstRow, seedAuth, selectFirstOrg } from './live-auth-helpers';

// Below the `sm` breakpoint (600) — the details pane becomes a temporary Drawer.
const MOBILE_VIEWPORT = { width: 500, height: 900 };

interface ListView {
  path: string;
  fab: string;
  title: string;
  /** Mock-mode wiring: the list query plus whatever its details pane fetches. */
  mock: (page: Page) => Promise<unknown>;
}

const VEHICLES: ListView = {
  path: '/vehicles',
  fab: 'create-vehicle-fab',
  title: 'vehicle-details-title',
  mock: async page => {
    await interceptVehicleTypePicker(page);
    await interceptVehicleListQuery(page);
    await interceptVehicleByIdQuery(page, mockVehicleById);
  },
};

const VEHICLE_TYPES: ListView = {
  path: '/vehicle-types',
  fab: 'create-vehicle-type-fab',
  title: 'vehicle-type-details-title',
  mock: interceptVehicleTypesQuery,
};

const DECK_PLANS: ListView = {
  path: '/deck-plans',
  fab: 'create-deck-plan-fab',
  title: 'deck-plan-details-title',
  mock: async page => {
    await interceptDeckPlansQuery(page);
    await page.route(/\/deckplans\/[^/?#]+$/, route =>
      route.fulfill({
        status: 200,
        contentType: 'application/xml',
        body: loadXmlFixture('deck-plan-xml-mock.xml'),
      })
    );
  },
};

const VIEWS = [VEHICLES, VEHICLE_TYPES, DECK_PLANS];

const openList = async (page: Page, view: ListView) => {
  if (!IS_LIVE) await view.mock(page);
  await page.goto(view.path);
  await selectFirstOrg(page);
  await expect(page.locator('table')).toBeVisible();
};

/**
 * List-head `+ New <Entity>` action vs. the `?selected=new` create pane (#173),
 * on all three Generic Data View pages.
 *
 * Workflow:
 *   load the list → New action visible → open the first row (?selected=<id>) →
 *   action still visible → click it (?selected=new) → action gone → editor-rail
 *   collapse drops ?selected= → action back.
 * Covers:
 *   - /vehicles, /vehicle-types, /deck-plans: the New action is removed while the
 *     create pane is open and returns when it closes
 *   - an existing row's pane (view/edit) does NOT remove it — `=new` only
 *   - mobile: closing the create Drawer by its own path (Escape) brings the action
 *     back, even though that path leaves ?selected=new in the URL
 * Not covered here:
 *   - the action returning once a save advances ?selected=new → ?selected=<newId>
 *     (vehicle-create-form.spec.ts, which owns the save round trip)
 * Modes:
 *   - mock (E2E_BACKEND unset): each view's list fixture, plus the by-id / XML body
 *     its details pane fetches for the opened row
 *   - live (E2E_BACKEND=true): seedAuth JWT + pinned org; opens the org's first real
 *     row. Nothing is typed or saved, so no data is mutated.
 */
test.describe('New action vs. the ?selected=new create pane (#173)', () => {
  test.beforeEach(async ({ context }) => seedAuth(context));

  VIEWS.forEach(view =>
    test(`${view.path}: New action is hidden only while the create pane is open`, async ({
      page,
    }) => {
      const fab = page.getByTestId(view.fab);

      await openList(page, view);
      await expect(fab).toBeVisible();

      await openFirstRow(page, view.title);
      await expect(fab).toBeVisible();

      await fab.click();
      await expect(page).toHaveURL(/selected=new/);
      await expect(page.getByTestId('editor-rail')).toBeVisible();
      await expect(fab).toBeHidden();

      await page.getByTestId('editor-rail-collapse').click();
      await expect(page).not.toHaveURL(/selected=/);
      await expect(fab).toBeVisible();
    })
  );

  test('mobile: the Drawer’s own close paths drop ?selected=new, so New works again', async ({
    page,
  }) => {
    await page.setViewportSize(MOBILE_VIEWPORT);
    const fab = page.getByTestId(DECK_PLANS.fab);
    const rail = page.getByTestId('editor-rail');

    await openList(page, DECK_PLANS);
    await fab.click();
    await expect(rail).toBeVisible();
    await expect(fab).toBeHidden();

    // Escape → the Drawer's onClose.
    await page.keyboard.press('Escape');
    await expect(page).not.toHaveURL(/selected=/);
    await expect(rail).toBeHidden();

    // Not a no-op: the URL is free again, so New reopens the pane.
    await fab.click();
    await expect(page).toHaveURL(/selected=new/);
    await expect(rail).toBeVisible();

    // The Drawer toolbar's close button is the other chrome path.
    await page.getByRole('button', { name: 'close sidebar' }).click();
    await expect(page).not.toHaveURL(/selected=/);
    await expect(fab).toBeVisible();
  });

  test('mobile: closing a dirty create Drawer asks before discarding', async ({ page }) => {
    await page.setViewportSize(MOBILE_VIEWPORT);
    const discardPrompt = page.getByRole('dialog', { name: 'Discard unsaved changes?' });

    await openList(page, DECK_PLANS);
    await page.getByTestId(DECK_PLANS.fab).click();
    await page.locator('#deckPlan-name').fill('Unsaved plan');

    await page.keyboard.press('Escape');
    await expect(discardPrompt).toBeVisible();
    await expect(page).toHaveURL(/selected=new/);

    await discardPrompt.getByRole('button', { name: 'Discard' }).click();
    await expect(page).not.toHaveURL(/selected=/);
  });
});
