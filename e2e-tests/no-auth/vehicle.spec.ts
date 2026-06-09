import { test, expect } from '@playwright/test';
import {
  interceptVehicleListQuery,
  interceptVehicleByIdQuery,
  mockVehicleById,
} from './vehicle-list-helpers';
import { IS_LIVE, writeConfig, seedAuth, selectFirstOrg, rowCount } from './live-auth-helpers';

/** Open the first data row's sidebar and return its `?selected=` netexId. */
async function openFirstRow(page: import('@playwright/test').Page): Promise<string> {
  await page.locator('table tbody tr').first().click();
  await expect(page).toHaveURL(/selected=/);
  await expect(page.getByTestId('vehicle-details-title')).toBeVisible();
  return decodeURIComponent(new URL(page.url()).searchParams.get('selected') ?? '');
}

/**
 * /vehicles — list rendering, TransportMode column, chip filter, sidebar deep-link.
 *
 * Workflow:
 *   load /vehicles → select org → assert table → read TransportMode icons →
 *   open Rail chip filter → assert narrowed list → click row → assert ?selected=
 *   sidebar opens → toggle Edit (read-only context persists) → Close drops
 *   ?selected= → deep-link ?selected=<id> auto-paginates to the row's page
 * Covers:
 *   - list renders rows with `#tm-*` TransportMode glyphs in the column
 *   - Rail chip filter narrows rows to rail-mode only
 *   - whole-row click opens sidebar and writes ?selected=<netexId> to URL
 *   - TransportMode read-only context panel persists across view→edit (#69)
 *   - Close button (editor-rail-collapse) drops ?selected= and hides the sidebar
 *   - deep-link auto-paginates to the page holding the selected row
 * Modes:
 *   - mock (E2E_SUITE=no-auth): intercepts `vehicles` list + `vehicleById`
 *     queries with the 15-row fixture (12 rail + 2 bus + 1 unknown); asserts
 *     exact counts (15, filtered 12, page-0 2 BUS + 8 RAIL) and fixture ids
 *     (BUS-001, RAIL-001, NMR:Vehicle:bus-1/rail-9)
 *   - live (E2E_BACKEND=true): seeds JWT, auto-selects org "AtB"; asserts
 *     relative counts (>0, filter never grows the set) and derives the target
 *     row from real data via openFirstRow — never fixture ids
 *   - skip-live: "deep-link auto-paginates…" — pagination math is
 *     fixture-deterministic; no stable known-page-2 row in live AtB data
 */
test.describe('/vehicles list, sidebar, deep-link, chip filter (no-auth)', () => {
  test.beforeAll(() => writeConfig());

  test.beforeEach(async ({ page, context }) => {
    await seedAuth(context);
    if (!IS_LIVE) {
      await interceptVehicleListQuery(page);
      // The slider's `useVehicle` fires `vehicles(filter:{netexIds})`; resolve
      // it from the same fixture so a `?selected=` deep-link hydrates from the
      // *requested* row, not the list's `content[0]`.
      await interceptVehicleByIdQuery(page, mockVehicleById);
    }
  });

  test('list renders rows with TransportMode icons in the column', async ({ page }) => {
    await page.goto('/vehicles');
    await selectFirstOrg(page);
    await page.waitForLoadState('networkidle');

    const table = page.locator('table');
    await expect(table).toBeVisible();

    if (IS_LIVE) {
      // Live AtB data: count varies, but EVERY data row must render a
      // TransportMode glyph (the mock's all-rows-have-an-icon contract). A
      // partial-render regression (some rows blank) → glyph count < row count → red.
      expect(await rowCount(page)).toBeGreaterThan(0);
      const tbody = table.locator('tbody');
      const rows = await tbody.locator('tr').count();
      expect(rows).toBeGreaterThan(0);
      await expect(tbody.locator('use[href^="#tm-"]')).toHaveCount(rows);
      return;
    }

    // 15 total = 12 rail + 2 bus + 1 unknown.
    await expect(page.getByTestId('total-entries')).toHaveAttribute('data-count', '15');

    // Default sort = registrationNumber asc → page 0 contains BUS-001/002 + RAIL-001..008.
    await expect(table.getByText('BUS-001')).toBeVisible();
    await expect(table.getByText('RAIL-001')).toBeVisible();

    // TransportMode column renders an icon (no visible label — tooltip carries
    // the localized text). Page 0 (asc by registrationNumber, rowsPerPage=10)
    // = 2 bus + 8 rail rows.
    const tbody = table.locator('tbody');
    await expect(tbody.locator('use[href="#tm-BUS"]')).toHaveCount(2);
    await expect(tbody.locator('use[href="#tm-RAIL"]')).toHaveCount(8);
  });

  test('Rail chip filter narrows rows to rail-mode only', async ({ page }) => {
    await page.goto('/vehicles');
    await selectFirstOrg(page);
    await page.waitForLoadState('networkidle');
    await expect(page.locator('table')).toBeVisible();

    const before = await rowCount(page);
    await page.getByTestId('search-filter-button').click();
    await page.getByRole('checkbox', { name: 'Rail' }).check();

    if (IS_LIVE) {
      // Rail filter must narrow to rail-mode rows ONLY: no non-RAIL glyph may
      // survive on the page (a broken filter that left BUS/other rows → red).
      // The not-RAIL count auto-retries, so it also waits out the post-filter
      // refetch (fixing the read-before-settle race). Set is non-empty (AtB has
      // rail vehicles) and not larger than before.
      const tbody = page.locator('table tbody');
      await expect(tbody.locator('use[href^="#tm-"]:not([href="#tm-RAIL"])')).toHaveCount(0);
      await expect(tbody.locator('use[href="#tm-RAIL"]').first()).toBeVisible();
      const after = await rowCount(page);
      expect(after).toBeGreaterThan(0);
      expect(after).toBeLessThanOrEqual(before);
      return;
    }

    await expect(page.getByTestId('total-entries')).toHaveAttribute('data-count', '12');
    await expect(page.locator('table').getByText('BUS-001')).not.toBeVisible();
  });

  test('row click opens sidebar and writes ?selected= to URL', async ({ page }) => {
    await page.goto('/vehicles');
    await selectFirstOrg(page);
    await page.waitForLoadState('networkidle');
    await expect(page.locator('table')).toBeVisible();

    if (IS_LIVE) {
      await openFirstRow(page);
      return;
    }

    // Whole-row click navigates via `useVehicleRowClick` (vehicleViewConfig).
    await page.locator('table tr', { hasText: 'BUS-001' }).click();
    await expect(page).toHaveURL(/selected=NMR%3AVehicle%3Abus-1/);
    await expect(page.getByTestId('vehicle-details-title')).toBeVisible();
  });

  test('TransportMode renders localised in read-only context, in view and edit', async ({
    page,
  }) => {
    // Post phase-2 refactor (issue #69): the sidebar splits VehicleRow
    // enrichment (id, version, parent VehicleType name, TransportMode) into a
    // read-only context panel; TransportMode is no longer editable. This pins
    // the contract: the context panel persists across view→edit.
    if (IS_LIVE) {
      await page.goto('/vehicles');
      await selectFirstOrg(page);
      await page.waitForLoadState('networkidle');
      await expect(page.locator('table')).toBeVisible();
      await openFirstRow(page);
      const context = page.getByTestId('vehicle-context');
      await expect(context).toBeVisible();
      await page.getByRole('button', { name: 'Edit' }).click();
      await expect(context).toBeVisible();
      return;
    }

    await page.goto('/vehicles?selected=NMR:Vehicle:bus-1');
    await page.waitForLoadState('networkidle');
    await expect(page.getByTestId('vehicle-details-title')).toBeVisible();

    const context = page.getByTestId('vehicle-context');
    await expect(context).toContainText('Bus');

    await page.getByRole('button', { name: 'Edit' }).click();
    await expect(context).toContainText('Bus');
  });

  test('Close button drops ?selected= and collapses the sidebar', async ({ page }) => {
    if (IS_LIVE) {
      await page.goto('/vehicles');
      await selectFirstOrg(page);
      await page.waitForLoadState('networkidle');
      await expect(page.locator('table')).toBeVisible();
      await openFirstRow(page);
    } else {
      await page.goto('/vehicles?selected=NMR:Vehicle:bus-1');
      await page.waitForLoadState('networkidle');
      await expect(page.getByTestId('vehicle-details-title')).toBeVisible();
    }

    await page.getByTestId('editor-rail-collapse').click();

    await expect(page).toHaveURL(/\/vehicles(\?|$)/);
    await expect(page).not.toHaveURL(/selected=/);
    await expect(page.getByTestId('vehicle-details-title')).not.toBeVisible();
  });

  test('deep-link auto-paginates to the page containing the selected row', async ({ page }) => {
    // Deterministic pagination math is fixture-bound (RAIL-009 is index 10 in the
    // sorted 15-row set → page 1 at rowsPerPage=10). Live AtB data has no stable
    // known-page-2 row, so this mechanics check stays mock-only.
    test.skip(IS_LIVE, 'pagination math is fixture-deterministic; no stable live target row');

    await page.goto('/vehicles?selected=NMR:Vehicle:rail-9');
    await page.waitForLoadState('networkidle');

    await expect(page.getByTestId('vehicle-details-title')).toBeVisible();
    // Pagination text should now read "11–15 of 15" (page 1).
    await expect(page.getByTestId('pagination-displayed-rows')).toContainText('11');
    await expect(page.locator('table').getByText('RAIL-009')).toBeVisible();
  });
});
