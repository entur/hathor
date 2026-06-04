import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import { fixturesDir, targetConfig } from './autosys-helpers';

/**
 * LIVE round-trip for the wired-in `createOrUpdateVehicleType` mutation against
 * a running Sobek (no-auth mode). Unlike `vehicle-type-sidebar.spec.ts`, this
 * does **not** mock GraphQL — the save hits real Sobek, exercising the full
 * path: form → `serializeVehicleType` (full document) → mutation → persistence.
 *
 * Gated to `E2E_BACKEND=true` (skipped in CI / mock runs). Dev-only: targets a
 * VehicleType known to exist on the local instance and restores its name on
 * teardown, so the DB is left as found (modulo an unavoidable version bump).
 *
 * Non-destructive: the editor hydrates the full row, so a name-only edit
 * re-sends every other field unchanged (the whole point of the full-document
 * serialise) — euroClass/transportMode/dims/capacity survive the full-replace.
 */
const VT = 'NMR:VehicleType:5';
const SELECTED = `/vehicle-types?selected=${encodeURIComponent(VT)}`;

test.describe('VehicleType sidebar save — LIVE Sobek (no-auth)', () => {
  test.skip(() => process.env.E2E_BACKEND !== 'true', 'Requires a running Sobek backend');

  test.beforeAll(() => {
    fs.copyFileSync(`${fixturesDir}/config-no-auth.json`, targetConfig);
  });

  test('edit name → real save → persists across a full reload', async ({ page }) => {
    const marker = `E2E-live-${Date.now()}`;

    // Capture the original name so we can restore it on teardown.
    await page.goto(SELECTED);
    await page.waitForLoadState('networkidle');
    await expect(page.getByTestId('vehicle-type-details-title')).toBeVisible();
    const original = await page.locator('#vtype-name').inputValue();

    // Edit → save (real mutation) → success.
    await page.getByTestId('editor-rail-edit').click();
    await page.locator('#vtype-name').fill(marker);
    await page.getByTestId('editor-rail-save').click();
    await expect(page.getByText('Vehicle type saved')).toBeVisible();

    // Reload from scratch → fresh fetch from Sobek → the edit persisted.
    await page.goto(SELECTED);
    await page.waitForLoadState('networkidle');
    await expect(page.getByTestId('vehicle-type-details-title')).toHaveText(marker);

    // Teardown: restore the original name with a second real save.
    await page.getByTestId('editor-rail-edit').click();
    await page.locator('#vtype-name').fill(original);
    await page.getByTestId('editor-rail-save').click();
    await expect(page.getByText('Vehicle type saved')).toBeVisible();
  });
});
