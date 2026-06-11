import { test, expect } from '@playwright/test';
import { interceptVehicleTypesQuery } from './autosys-helpers';
import { interceptVehicleListQuery } from './vehicle-list-helpers';
import { IS_LIVE, writeConfig, seedAuth, selectFirstOrg } from './live-auth-helpers';

/**
 * /vehicle-types + /vehicles — TransportMode icons in the column and filter dropdown (#23).
 *
 * Workflow:
 *   load list → select org → assert table → per-row assert `svg[role="img"]`
 *   TransportModeIcon (column) → open search-filter dropdown → assert an icon
 *   sits beside each FormControlLabel (dropdown)
 * Covers:
 *   - /vehicle-types column: every data row owns a TransportModeIcon whose
 *     `use[href]` matches `#tm-[A-Z_]+` (full schema enum, no curated subset)
 *   - /vehicles filter dropdown: each transport-mode FormControlLabel has an icon
 *   - /vehicle-types filter dropdown: icons present AND legacy stop-place labels
 *     ("Parent Vehicle Type", "Harbour") are gone (regression after filter swap)
 * Modes:
 *   - mock (E2E_SUITE=no-auth): intercepts `vehicleTypes` / `vehicles` fixtures;
 *     assertions are shape-only (icon presence, href pattern, count > 0)
 *   - live (E2E_BACKEND=true): seeds JWT, auto-selects org "AtB"; same shape-only
 *     assertions run unchanged against real org-scoped data (no fixture counts)
 */
test.describe('#23 — TransportMode column + filter-dropdown icons', () => {
  test.beforeAll(() => writeConfig());
  test.beforeEach(async ({ context }) => seedAuth(context));

  test('TransportMode column renders an SVG per row on /vehicle-types', async ({ page }) => {
    if (!IS_LIVE) {
      await interceptVehicleTypesQuery(page);
    }

    await page.goto('/vehicle-types');
    await selectFirstOrg(page);
    await page.waitForLoadState('networkidle');

    const table = page.locator('table');
    await expect(table).toBeVisible();

    // Each data row owns at least one <svg role="img"> — the TransportModeIcon.
    const rows = page.locator('tbody tr');
    const rowCount = await rows.count();
    expect(rowCount).toBeGreaterThan(0);

    for (let i = 0; i < rowCount; i++) {
      const icon = rows.nth(i).locator('svg[role="img"]').first();
      await expect(icon).toBeVisible();
      const href = await icon.locator('use').getAttribute('href');
      // Symbol id is the Sobek TransportMode enum value verbatim (UPPER_CASE).
      // Assert the *shape* rather than an enum subset — hathor mirrors the full
      // schema enum (BUS, RAIL, LIFT, CABLEWAY, FUNICULAR, …) and must not
      // curate a subset here.
      expect(href).toMatch(/^#tm-[A-Z_]+$/);
    }
  });

  test('Filter dropdown on /vehicles renders an icon next to each transport-mode label', async ({
    page,
  }) => {
    if (!IS_LIVE) {
      await interceptVehicleListQuery(page);
    }

    await page.goto('/vehicles');
    await selectFirstOrg(page);
    await page.waitForLoadState('networkidle');

    await page.getByTestId('search-filter-button').click();

    // The dropdown is a MUI Popover; once it opens, each FormControlLabel
    // contains an <svg role="img"> sitting next to the localized label text.
    const labels = page.locator('label.MuiFormControlLabel-root');
    await expect(labels.first()).toBeVisible();

    const labelCount = await labels.count();
    expect(labelCount).toBeGreaterThan(0);

    for (let i = 0; i < labelCount; i++) {
      const svg = labels.nth(i).locator('svg[role="img"]');
      await expect(svg).toBeVisible();
    }
  });

  test('Filter dropdown on /vehicle-types also shows transport-mode icons (regression: stop-place legacy filters retired)', async ({
    page,
  }) => {
    if (!IS_LIVE) {
      await interceptVehicleTypesQuery(page);
    }

    await page.goto('/vehicle-types');
    await selectFirstOrg(page);
    await page.waitForLoadState('networkidle');

    await page.getByTestId('search-filter-button').click();

    const labels = page.locator('label.MuiFormControlLabel-root');
    await expect(labels.first()).toBeVisible();

    // Each row should be a TransportMode filter — icon present, no stop-place
    // legacy labels (Parent Vehicle Type, Harbour, …) survive the swap.
    const labelCount = await labels.count();
    expect(labelCount).toBeGreaterThan(0);
    for (let i = 0; i < labelCount; i++) {
      await expect(labels.nth(i).locator('svg[role="img"]')).toBeVisible();
    }
    await expect(page.getByText('Parent Vehicle Type')).not.toBeVisible();
    await expect(page.getByText('Harbour')).not.toBeVisible();
  });
});
