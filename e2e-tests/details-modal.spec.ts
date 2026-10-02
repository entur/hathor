import { test, expect, type Page } from '@playwright/test';
import {
  interceptVehicleListQuery,
  interceptVehicleByIdQuery,
  mockVehicleById,
} from './vehicle-list-helpers';
import { IS_LIVE, seedAuth, selectFirstOrg, openFirstRow } from './live-auth-helpers';

const RATIO_KEY = 'hathor:detailsPaneRatio',
  DRAG_PX = 200,
  WIDTH_TOL_PX = 4;

/**
 * Details pane is a modal Drawer (#173 modal variant) — generic
 * GenericDataViewPage chrome, exercised once on /vehicles.
 *
 * Workflow:
 *   load /vehicles → select org → open first row → scrim + inert list →
 *   close via Escape / backdrop (clean closes, dirty prompts) →
 *   drag the pane's inner edge → reload → width restored
 * Covers:
 *   - open editor: MUI backdrop visible, app root `aria-hidden`; a click
 *     aimed at a sort header lands on the scrim and closes the pane
 *     instead of sorting
 *   - clean editor: Escape drops ?selected=
 *   - dirty editor: Escape and backdrop click raise the Discard dialog;
 *     Cancel keeps the pane, Discard closes it
 *   - resize persists as a viewport ratio under `hathor:detailsPaneRatio`
 * Modes:
 *   - mock (E2E_BACKEND unset): `vehicles` list + `vehicleById` intercepted
 *   - live (E2E_BACKEND=true): same flow on the first real row; nothing is
 *     saved (dirty edits are discarded)
 */
test.describe('details pane is a modal Drawer (no-auth)', () => {
  test.beforeEach(async ({ page, context }) => {
    await seedAuth(context);
    if (!IS_LIVE) {
      await interceptVehicleListQuery(page);
      await interceptVehicleByIdQuery(page, mockVehicleById);
    }
  });

  const open = async (page: Page) => {
    await page.goto('/vehicles');
    await selectFirstOrg(page);
    await expect(page.locator('table')).toBeVisible();
    await openFirstRow(page, 'vehicle-details-title');
  };

  const dirty = async (page: Page) => {
    await page.getByTestId('editor-rail-edit').click();
    await page.locator('#vehicle-name').fill(`modal-dirty-${Date.now()}`);
  };

  // Scoped: a fading DiscardDialog backdrop can coexist briefly.
  const backdrop = (page: Page) => page.locator('.MuiDrawer-root > .MuiBackdrop-root');
  const discard = (page: Page) => page.getByText('Discard unsaved changes?');

  test('open editor scrims the list; a click on a sort header hits the scrim', async ({ page }) => {
    await page.goto('/vehicles');
    await selectFirstOrg(page);
    const head = page
      .locator('table thead th', { has: page.locator('.MuiTableSortLabel-root') })
      .first();
    const box = await head.boundingBox();
    expect(box).not.toBeNull();

    await openFirstRow(page, 'vehicle-details-title');
    await expect(backdrop(page)).toBeVisible();
    await expect(page.locator('#root')).toHaveAttribute('aria-hidden', 'true');

    const sortBefore = await head.getAttribute('aria-sort');
    await page.mouse.click(box!.x + box!.width / 2, box!.y + box!.height / 2);
    await expect(page).not.toHaveURL(/selected=/);
    // Header never saw the click: sort state unchanged.
    expect(await head.getAttribute('aria-sort')).toBe(sortBefore);
    await expect(page.getByTestId('details-drawer')).toBeHidden();
  });

  test('clean editor: Escape closes and drops ?selected=', async ({ page }) => {
    await open(page);
    await page.keyboard.press('Escape');
    await expect(page).not.toHaveURL(/selected=/);
    await expect(page.getByTestId('vehicle-details-title')).toBeHidden();
  });

  test('dirty editor: Escape and backdrop both prompt; Cancel keeps, Discard closes', async ({
    page,
  }) => {
    await open(page);
    await dirty(page);

    await page.keyboard.press('Escape');
    await expect(discard(page)).toBeVisible();
    await page.getByRole('button', { name: 'Cancel' }).click();
    await expect(page).toHaveURL(/selected=/);
    await expect(page.getByTestId('vehicle-details-title')).toBeVisible();

    // Click the scrim well clear of the right-anchored paper.
    await backdrop(page).click({ position: { x: 10, y: 10 } });
    await expect(discard(page)).toBeVisible();
    await page.getByRole('button', { name: 'Discard' }).click();
    await expect(page).not.toHaveURL(/selected=/);
  });

  test('dragging the inner edge resizes the pane; the width survives a reload', async ({
    page,
  }) => {
    await open(page);
    const paper = page.getByTestId('details-drawer');
    const handle = page.getByTestId('details-drawer-resizer');
    const before = (await paper.boundingBox())!.width;
    const hb = (await handle.boundingBox())!;

    await page.mouse.move(hb.x + hb.width / 2, hb.y + hb.height / 2);
    await page.mouse.down();
    await page.mouse.move(hb.x + hb.width / 2 - DRAG_PX, hb.y + hb.height / 2, { steps: 5 });
    await page.mouse.up();

    const after = (await paper.boundingBox())!.width;
    expect(after).toBeGreaterThan(before + DRAG_PX - WIDTH_TOL_PX * 5);
    expect(await page.evaluate(k => localStorage.getItem(k), RATIO_KEY)).not.toBeNull();

    await page.reload();
    await expect(page.getByTestId('vehicle-details-title')).toBeVisible();
    await expect
      .poll(async () => (await paper.boundingBox())?.width ?? 0)
      .toBeGreaterThan(after - WIDTH_TOL_PX);
  });
});
