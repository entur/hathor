import { test, expect } from '@playwright/test';
import { interceptVehicleTypesQuery } from './autosys-helpers';
import { IS_LIVE, seedAuth, selectFirstOrg } from './live-auth-helpers';

const LIST = '/next/vehicle-types';
// Fixture row (vehicle-types-mock.json): Type Alpha.
const FIXTURE_ID = 'NMR:VehicleType:1';
const MOBILE_VIEWPORT = { width: 390, height: 844 };

/**
 * /next/vehicle-types — the page shell (#253, epic #252) beside the legacy list:
 * PageShell layout route → CollectionShell list · EntityDetailsShell editor page.
 *
 * Workflow:
 *   /next/vehicle-types → list with an Edit link per row → Edit opens
 *   /next/vehicle-types/<id> in edit mode → editor-rail collapse returns to the list.
 * Covers:
 *   - the header search is hidden on shell routes (still shown on the legacy list)
 *   - Edit → details page in edit mode; collapse → back on the list
 *   - a deep link to /next/vehicle-types/<id> opens in view mode
 *   - `Collections` flag off → /next/* redirects to /
 * Modes:
 *   - mock (E2E_BACKEND unset): interceptVehicleTypesQuery (vehicle-types-mock.json)
 *   - live (E2E_BACKEND=true): seedAuth JWT + org auto-select; runs on the org's real rows
 *   - skip-live: the deep-link test (fixture id)
 */
test.describe('/next/vehicle-types page shell', () => {
  test.beforeEach(async ({ page, context }) => {
    await seedAuth(context);
    if (!IS_LIVE) await interceptVehicleTypesQuery(page);
  });

  test('hides the header search on shell routes only', async ({ page }) => {
    // Mobile: the header's search icon is the part a shell route must drop (desktop
    // renders the filter button only when a legacy list registers filters).
    await page.setViewportSize(MOBILE_VIEWPORT);
    const searchIcon = page.getByRole('banner').getByRole('button', { name: 'search' });
    await page.goto('/vehicle-types');
    await selectFirstOrg(page);
    await expect(searchIcon).toBeVisible();

    await page.goto(LIST);
    await expect(page.getByTestId('collection-list')).toBeVisible();
    expect(await searchIcon.count()).toBe(0);
  });

  test('Edit opens the details page in edit mode; collapse returns to the list', async ({
    page,
  }) => {
    await page.goto(LIST);
    await selectFirstOrg(page);
    await page.getByTestId('collection-edit').first().click();

    await expect(page).toHaveURL(new RegExp(`${LIST}/[^/]+$`));
    await expect(page.getByTestId('vehicle-type-details-title')).toBeVisible();
    await expect(page.getByTestId('editor-rail-save')).toBeVisible();

    await page.getByTestId('editor-rail-collapse').click();
    await expect(page).toHaveURL(new RegExp(`${LIST}$`));
    await expect(page.getByTestId('collection-list')).toBeVisible();
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
