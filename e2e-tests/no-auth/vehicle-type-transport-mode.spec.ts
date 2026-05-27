import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import { fixturesDir, targetConfig, interceptVehicleTypesQuery } from './autosys-helpers';
import { interceptVehicleListQuery } from './vehicle-list-helpers';

/**
 * #23 — TransportMode column on /vehicle-types + transport-mode icons in the
 * header filter dropdown on /vehicles. The two assertions exercise both
 * surfaces of `TransportModeIcon`:
 *   - icon-only (with tooltip / aria-label) — used by the column renderer
 *   - icon + inline label — used by the SearchFilterControl branch
 */
test.describe('#23 — TransportMode column + filter-dropdown icons', () => {
  test.beforeAll(() => {
    fs.copyFileSync(`${fixturesDir}/config-no-auth.json`, targetConfig);
  });

  test('TransportMode column renders an SVG per row on /vehicle-types', async ({ page }) => {
    if (process.env.E2E_BACKEND !== 'true') {
      await interceptVehicleTypesQuery(page);
    }

    await page.goto('/vehicle-types');
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
      // Symbol id must resolve to either a covered mode or the unknown fallback.
      expect(href).toMatch(/^#tm-(bus|coach|rail|tram|metro|water|air|unknown)$/);
    }
  });

  test('Filter dropdown on /vehicles renders an icon next to each transport-mode label', async ({
    page,
  }) => {
    if (process.env.E2E_BACKEND !== 'true') {
      await interceptVehicleListQuery(page);
    }

    await page.goto('/vehicles');
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
});
