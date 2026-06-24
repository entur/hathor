import { test, expect } from '@playwright/test';
import { interceptVehicleTypesQuery, interceptVehicleTypesWithSave } from './autosys-helpers';
import { IS_LIVE, seedAuth, selectFirstOrg, openFirstRow } from './live-auth-helpers';

/** Open the org's first VehicleType row sidebar; returns its `?selected=` id. */
async function openFirstVtype(page: import('@playwright/test').Page): Promise<string> {
  await page.goto('/vehicle-types');
  await selectFirstOrg(page);
  await page.waitForLoadState('networkidle');
  await expect(page.locator('table')).toBeVisible();
  return openFirstRow(page, 'vehicle-type-details-title');
}

/**
 * /vehicle-types — editable ?selected= sidebar deep-link (#105) + sidebar save
 * (#109/#15). Two describes in this file.
 *
 * Workflow (describe 1 — deep-link sidebar):
 *   /vehicle-types → row click writes ?selected=<vtId> → tabbed VehicleTypeForm
 *   (Edit · Propulsion/perf. · Environment · Vehicles) hydrates from the resolved row →
 *   navigate tabs → editor-rail collapse drops ?selected= and hides the sidebar.
 * Workflow (describe 2 — sidebar save):
 *   ?selected=<vtId> → editor-rail Edit → edit name → editor-rail Save fires
 *   createOrUpdateVehicleType (full-document serialize) → success snackbar →
 *   list refetch re-resolves + re-hydrates row → back to read-only view (re-baselined).
 * Covers:
 *   - describe 1: row click writes ?selected=; tabs group fields + are reachable; in-row
 *     vehicle chip routes to /vehicles?selected= (not hijacked by row click); collapse drops
 *     the param; toggling a null-baseline Low Floor switch on/off must not dirty the form
 *   - describe 2: save fires the mutation + success + returns to view; re-baseline
 *     after save → no discard on collapse; save error stays in edit mode; editing name text
 *     preserves the existing lang tag; failed post-save list refresh surfaces a stale-list
 *     warning (guards the #117 doFetch return — a failed refetch must reject, not resolve early).
 *     (Full-document WIRE SHAPE is unit-tested in serializeVehicleType.test.ts, not spied here.)
 * Modes:
 *   - mock (E2E_BACKEND unset): interceptVehicleTypesQuery / interceptVehicleTypesWithSave;
 *     describe 2 drives a stateful fixture for behavioural read-back + fault injection
 *     (the only remaining input-capture is the lang-tag wire check; full-document shape
 *     is unit-tested in serializeVehicleType.test.ts).
 *     Fixture (vehicle-types-mock.json), sorted by name asc:
 *       Type Alpha (NMR:VehicleType:1, bus) · Type Beta (…:2, rail, name lang 'nb') · Type Gamma (…:3, lowFloor null)
 *   - live (E2E_BACKEND=true): seedAuth JWT + org auto-select (AtB); describe 1 runs the
 *     structural tests (row click → ?selected=, tab navigation, collapse) against the org's
 *     real first row (data-agnostic). Describe 2 is entirely skip-live (the real live vtype save
 *     round-trip lives in vehicle-type-save-live.spec.ts).
 *   - skip-live:
 *       describe 1: 'vehicle chip in the row routes to /vehicles?selected=…' — asserts a fixture
 *         vehicle chip target (AA-101 → NMR:Vehicle:101) absent live;
 *       'toggling a null-baseline Low Floor switch on then off should not dirty the form' —
 *         needs a null-lowFloor-baseline row (fixture Gamma) not reproducible live
 *       describe 2 (all tests): behavioural/fault-injection/lang-wire assertions over a stateful
 *         fixture; a real save would mutate dev data (real live round-trip → vehicle-type-save-live.spec.ts)
 */
test.describe('/vehicle-types editable sidebar deep-link (no-auth)', () => {
  test.beforeEach(async ({ page, context }) => {
    await seedAuth(context);
    if (!IS_LIVE) {
      await interceptVehicleTypesQuery(page);
    }
  });

  test('row click opens the sidebar and writes ?selected= to the URL', async ({ page }) => {
    if (IS_LIVE) {
      // Data-agnostic: open the org's first real row, assert the deep-link + the
      // Edit tab are present (fixture name/id don't exist live).
      await openFirstVtype(page);
      await expect(page.getByTestId('vtype-tab-edit')).toBeVisible();
      return;
    }

    await page.goto('/vehicle-types');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('table')).toBeVisible();

    await page.locator('table tr', { hasText: 'Type Alpha' }).click();

    await expect(page).toHaveURL(/selected=NMR%3AVehicleType%3A1/);
    await expect(page.getByTestId('vehicle-type-details-title')).toHaveText('Type Alpha');
    await expect(page.getByTestId('vtype-tab-edit')).toBeVisible();
  });

  test('tabs group the fields; Edit holds name + dimensions, others are reachable', async ({
    page,
  }) => {
    if (IS_LIVE) {
      // Live: assert tab *navigation* is structurally intact (each panel
      // renders). The concrete field values are fixture-pinned, so only the
      // mock run asserts them.
      await openFirstVtype(page);
      await expect(page.locator('#vtype-name')).toBeVisible();

      await page.getByRole('tab', { name: 'Propulsion/perf.' }).click();
      await expect(page.getByTestId('vtype-tab-propulsion')).toBeVisible();

      await page.getByRole('tab', { name: 'Environment' }).click();
      await expect(page.getByTestId('vtype-tab-environment')).toBeVisible();

      await page.getByRole('tab', { name: 'Vehicles' }).click();
      await expect(page.getByTestId('vtype-tab-vehicles')).toBeVisible();
      return;
    }

    await page.goto('/vehicle-types?selected=NMR:VehicleType:1');
    await page.waitForLoadState('networkidle');

    // Edit tab (default): name hydrated from the row, dimensions collapsed in here.
    await expect(page.locator('#vtype-name')).toHaveValue('Type Alpha');
    await expect(page.locator('#vtype-length')).toHaveValue('10');

    await page.getByRole('tab', { name: 'Propulsion/perf.' }).click();
    await expect(page.getByTestId('vtype-tab-propulsion')).toBeVisible();
    await expect(page.locator('#vtype-euro-class')).toHaveValue('EURO6');

    await page.getByRole('tab', { name: 'Environment' }).click();
    await expect(page.getByTestId('vtype-tab-environment')).toBeVisible();
    await expect(page.locator('#vtype-maximumEngineEffectKW')).toHaveValue('250');

    // Vehicles tab: flowing chips; regNo (opNum) links to the vehicles route.
    await page.getByRole('tab', { name: 'Vehicles' }).click();
    const vehChip = page.getByTestId('vtype-tab-vehicles').getByRole('link', { name: /AA-101/ });
    await expect(vehChip).toContainText('(OP-101)');
    await expect(vehChip).toHaveAttribute('href', '/vehicles?selected=NMR%3AVehicle%3A101');
  });

  test('vehicle chip in the row routes to /vehicles?selected= (not hijacked by row click)', async ({
    page,
  }) => {
    // The asserted chip targets a fixture vehicle (AA-101 → NMR:Vehicle:101);
    // live rows link to real ids, so this exact-target check is mock-only.
    test.skip(IS_LIVE, 'mock-only — asserts a fixture vehicle chip target');

    await page.goto('/vehicle-types');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('table')).toBeVisible();

    await page.locator('table').getByRole('link', { name: 'AA-101' }).click();

    await expect(page).toHaveURL(/\/vehicles\?selected=NMR%3AVehicle%3A101/);
    await expect(page).not.toHaveURL(/vehicle-types/);
  });

  test('collapse rail drops ?selected= and hides the sidebar', async ({ page }) => {
    if (IS_LIVE) {
      await openFirstVtype(page);
    } else {
      await page.goto('/vehicle-types?selected=NMR:VehicleType:1');
      await page.waitForLoadState('networkidle');
      await expect(page.getByTestId('vehicle-type-details-title')).toBeVisible();
    }

    await page.getByTestId('editor-rail-collapse').click();

    await expect(page).toHaveURL(/\/vehicle-types(\?|$)/);
    await expect(page).not.toHaveURL(/selected=/);
    await expect(page.getByTestId('vehicle-type-details-title')).not.toBeVisible();
  });

  // Regression guard: VehicleType:3 (Gamma) has lowFloor:null → the projection
  // omits it from the baseline, but the Switch writes a literal boolean, so
  // toggling on then off leaves form.lowFloor=false vs an absent baseline. A
  // no-op toggle must NOT dirty the form — the dirty-compare tolerates
  // undefined-vs-false (regressed once; this pins it).
  test('toggling a null-baseline Low Floor switch on then off should not dirty the form', async ({
    page,
  }) => {
    // Needs a row with a *null* lowFloor baseline (the fixture's Gamma); live
    // rows have arbitrary lowFloor values, so the null-baseline case isn't
    // reproducible against real data.
    test.skip(IS_LIVE, 'mock-only — needs a null-lowFloor-baseline row');

    await page.goto('/vehicle-types?selected=NMR:VehicleType:3');
    await page.waitForLoadState('networkidle');
    await page.getByTestId('editor-rail-edit').click();

    const lowFloor = page.locator('#vtype-low-floor');
    await lowFloor.click(); // on
    await lowFloor.click(); // off — back to the visual starting point

    await page.getByTestId('editor-rail-collapse').click();
    await expect(page.getByRole('button', { name: 'Discard' })).toHaveCount(0);
  });
});

/**
 * hathor#109/#15 — VehicleType sidebar SAVE now fires the
 * `createOrUpdateVehicleType` mutation (not a mock). The editor serialises the
 * full document (`serializeVehicleType`) so Sobek's full-document-replace does
 * not null untouched fields; on success the list refetch re-resolves the row
 * and re-hydrates the form (advancing the dirty baseline).
 *
 * Mock-only here: behavioural flow over a stateful fixture (success snackbar,
 * return-to-view, re-baseline) plus fault-injection (save error, stale post-save
 * refresh) and the lang-tag wire check — none reproducible against a real backend,
 * and a real save would mutate the dev DB. The full-document WIRE SHAPE is unit-
 * tested in serializeVehicleType.test.ts; the real live round-trip lives in
 * vehicle-type-save-live.spec.ts. So these skip under `E2E_BACKEND=true`.
 */
test.describe('/vehicle-types sidebar save (no-auth)', () => {
  test.beforeEach(async ({ context }) => {
    // Mock-only: behavioural + fault-injection + lang-wire assertions over a
    // stateful fixture; a real save would mutate dev data. The real live vtype
    // save round-trip lives in vehicle-type-save-live.spec.ts.
    test.skip(
      IS_LIVE,
      'Mock-only — fault-injection/wire assertions; a real save would mutate dev data'
    );
    await seedAuth(context);
  });

  test('edit name → save fires the mutation, shows success, returns to view', async ({ page }) => {
    await interceptVehicleTypesWithSave(page);
    await page.goto('/vehicle-types?selected=NMR:VehicleType:1');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('#vtype-name')).toBeDisabled();
    await page.getByTestId('editor-rail-edit').click();
    await page.locator('#vtype-name').fill('Type Alpha X');

    await page.getByTestId('editor-rail-save').click();

    await expect(page.getByText('Vehicle type saved')).toBeVisible();
    // Refetch re-resolves the row → re-hydrate → back to read-only view.
    await expect(page.getByTestId('vehicle-type-details-title')).toHaveText('Type Alpha X');
    await expect(page.locator('#vtype-name')).toBeDisabled();
  });

  // The full-document-replace WIRE SHAPE (untouched fields emitted, server-
  // managed version/vehicles excluded, blanks→null) is unit-tested in
  // src/data/vehicle-types/api/serializeVehicleType.test.ts — a pure function
  // belongs there, not in an e2e mutation-input spy. The behavioural round-trip
  // (a name-only save preserves a sibling field through Sobek) is covered live
  // in vehicle-type-save-live.spec.ts.

  test('after save the form re-baselines — collapse raises no discard dialog', async ({ page }) => {
    await interceptVehicleTypesWithSave(page);
    await page.goto('/vehicle-types?selected=NMR:VehicleType:1');
    await page.waitForLoadState('networkidle');

    await page.getByTestId('editor-rail-edit').click();
    await page.locator('#vtype-name').fill('Type Alpha X');
    await page.getByTestId('editor-rail-save').click();
    await expect(page.getByText('Vehicle type saved')).toBeVisible();

    await page.getByTestId('editor-rail-collapse').click();
    await expect(page.getByRole('button', { name: 'Discard' })).toHaveCount(0);
    await expect(page).not.toHaveURL(/selected=/);
  });

  test('save error surfaces in a snackbar and stays in edit mode', async ({ page }) => {
    await interceptVehicleTypesWithSave(page, { saveError: 'boom' });
    await page.goto('/vehicle-types?selected=NMR:VehicleType:1');
    await page.waitForLoadState('networkidle');

    await page.getByTestId('editor-rail-edit').click();
    await page.locator('#vtype-name').fill('Type Alpha X');
    await page.getByTestId('editor-rail-save').click();

    await expect(page.getByRole('alert')).toContainText('boom');
    // No success, and the editor stays editable (still dirty in edit mode).
    await expect(page.getByText('Vehicle type saved')).toHaveCount(0);
    await expect(page.locator('#vtype-name')).toBeEnabled();
  });

  // Regression guard: VehicleType:2's name carries lang 'nb'. Editing only the
  // text must keep the lang tag, else the full-replace clears it — the form's
  // name onChange merges the existing lang rather than rebuilding `{ value }`.
  test('editing the name text preserves the existing lang tag', async ({ page }) => {
    const { lastInput } = await interceptVehicleTypesWithSave(page);
    await page.goto('/vehicle-types?selected=NMR:VehicleType:2');
    await page.waitForLoadState('networkidle');

    await page.getByTestId('editor-rail-edit').click();
    await page.locator('#vtype-name').fill('Type Beta X');
    await page.getByTestId('editor-rail-save').click();
    await expect(page.getByText('Vehicle type saved')).toBeVisible();

    expect(lastInput()?.name).toEqual({ value: 'Type Beta X', lang: 'nb' });
  });

  // The mutation commits but the post-save list refresh 500s. The user must not
  // get a bare "saved" success over a stale table — the refresh failure should be
  // surfaced (handleSave awaits onSaved and catches → stale-list warning). This
  // works because useVehicleTypes.doFetch returns its fetch chain, so the awaited
  // onSaved() rejects on a failed refresh instead of resolving early (#117 fix).
  test('a failed post-save list refresh surfaces a stale-list warning, not a bare success', async ({
    page,
  }) => {
    await interceptVehicleTypesWithSave(page, { failRefetch: true });
    await page.goto('/vehicle-types?selected=NMR:VehicleType:1');
    await page.waitForLoadState('networkidle');

    await page.getByTestId('editor-rail-edit').click();
    await page.locator('#vtype-name').fill('Type Alpha X');
    await page.getByTestId('editor-rail-save').click();

    await expect(page.getByText(/list could not refresh/i)).toBeVisible();
    await expect(page.getByText('Vehicle type saved')).toHaveCount(0);
  });
});
