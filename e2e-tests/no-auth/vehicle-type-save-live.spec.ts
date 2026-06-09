import { test, expect } from '@playwright/test';
import { IS_LIVE, writeConfig, seedAuth, selectFirstOrg, readNetexIds } from './live-auth-helpers';

/**
 * /vehicle-types sidebar save — LIVE-ONLY real `createOrUpdateVehicleType` round-trip against a running, authenticated Sobek (no GraphQL mock).
 *
 * Workflow:
 *   seedAuth → goto /vehicle-types → selectFirstOrg (AtB) → readNetexIds(1) to derive a real org-owned VehicleType id
 *   → open ?selected=<id> → capture original #vtype-name + sibling #vtype-length → editor-rail-edit → fill name=marker
 *   → editor-rail-save → assert "Vehicle type saved" → full reload of ?selected=<id> → assert details title == marker
 *   (persisted) AND #vtype-length unchanged (sibling survived the full-replace)
 *   → teardown: edit → restore original name → save → assert "Vehicle type saved"
 * Covers:
 *   - Real save path: form → serializeVehicleType (full document) → mutation → persistence, verified across a fresh reload/refetch.
 *   - Non-destructive full-replace, behaviourally: a name-only edit preserves a sibling field — #vtype-length reads back
 *     unchanged after the reload. (The serialiser's full wire shape is unit-tested in serializeVehicleType.test.ts.)
 *   - DB left as found (modulo an unavoidable version bump) via the restore teardown.
 * Modes:
 *   - mock (E2E_SUITE=no-auth): n/a — live-only; the whole describe is skipped when !IS_LIVE.
 *   - live (E2E_BACKEND=true): writeConfig + seedAuth (JWT in session) + selectFirstOrg (AtB) → real Sobek save round-trip.
 *   - skip-live: skipped unless IS_LIVE — "Requires a running, authenticated Sobek backend".
 */
test.describe('VehicleType sidebar save — LIVE Sobek', () => {
  test.skip(() => !IS_LIVE, 'Requires a running, authenticated Sobek backend');

  test.beforeAll(() => writeConfig());
  test.beforeEach(async ({ context }) => seedAuth(context));

  test('edit name → real save → persists across a full reload', async ({ page }) => {
    const marker = `E2E-live-${Date.now()}`;

    // Derive a real org-owned VehicleType id from the live list.
    await page.goto('/vehicle-types');
    await selectFirstOrg(page);
    await page.waitForLoadState('networkidle');
    const [vtId] = await readNetexIds(page, 1);
    expect(vtId, 'expected an org-owned VehicleType to edit').toBeTruthy();
    const selected = `/vehicle-types?selected=${encodeURIComponent(vtId)}`;

    // Capture the original name so we can restore it on teardown.
    await page.goto(selected);
    await selectFirstOrg(page);
    await page.waitForLoadState('networkidle');
    await expect(page.getByTestId('vehicle-type-details-title')).toBeVisible();
    const original = await page.locator('#vtype-name').inputValue();
    // Capture a sibling field to prove the name-only save doesn't wipe it
    // (the behavioural truth of full-document-replace; the serialiser's wire
    // shape is unit-tested in serializeVehicleType.test.ts).
    const originalLength = await page.locator('#vtype-length').inputValue();

    // Edit → save (real mutation) → success.
    await page.getByTestId('editor-rail-edit').click();
    await page.locator('#vtype-name').fill(marker);
    await page.getByTestId('editor-rail-save').click();
    await expect(page.getByText('Vehicle type saved')).toBeVisible();

    // Reload from scratch → fresh fetch from Sobek → the name edit persisted and
    // the untouched sibling field survived the full-document replace.
    await page.goto(selected);
    await selectFirstOrg(page);
    await page.waitForLoadState('networkidle');
    await expect(page.getByTestId('vehicle-type-details-title')).toHaveText(marker);
    await expect(page.locator('#vtype-length')).toHaveValue(originalLength);

    // Teardown: restore the original name with a second real save.
    await page.getByTestId('editor-rail-edit').click();
    await page.locator('#vtype-name').fill(original);
    await page.getByTestId('editor-rail-save').click();
    await expect(page.getByText('Vehicle type saved')).toBeVisible();
  });
});
