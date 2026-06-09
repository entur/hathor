import { test, expect, type Page } from '@playwright/test';
import {
  interceptStatefulVehicleListQuery,
  interceptVehicleByIdQuery,
  interceptVehicleSaveMutation,
  vehicleRow,
} from './vehicle-list-helpers';
import { IS_LIVE, writeConfig, seedAuth, liveVehicleTypeInt } from './live-auth-helpers';

const NEW_ID = 'NMR:Vehicle:NEW-1';
const ENCODED_NEW_ID = encodeURIComponent(NEW_ID);

/**
 * /vehicles/new — save → "View in list" feedback + slider redirect (regression
 * for the silent "fast close" save that previously landed deep-links on
 * "Vehicle not found" before the just-created id was in the refetched list).
 *
 * Workflow:
 *   /vehicles/new → fill reg + Vehicle Type ID → Save → success snackbar with
 *   "View in list" action (no auto-nav) → click action → navigate
 *   /vehicles?selected=<assignedId> → slider resolves the row (poll past read-after-write lag).
 * Covers:
 *   - Save surfaces a "View in list" snackbar and does NOT auto-navigate
 *   - Action navigates to the slider on the new id (zero-lag) and id-agnostically on whatever id the redirect mints
 *   - Name round-trips POST → persist → GET → parse → render (#80 item-1: bare <Name> w/o lang attr)
 *   - Action polls out replica lag, then the slider resolves
 *   - Lag beyond the poll budget still navigates; slider degrades to not-found
 *   - Deep-link straight to a known id resolves the slider (cross-route nav)
 * Modes:
 *   - mock (E2E_SUITE=no-auth): wireCreateFlow intercepts createOrUpdateVehicle + stateful
 *     list (addCreated + lag) + by-id (name 'Newly created'); simulates read-after-write race
 *   - live (E2E_BACKEND=true): seedAuth JWT + org auto-select (AtB) → real create with unique
 *     reg E2E-<ts> + real VehicleType int (liveVehicleTypeInt); runs the snackbar/no-auto-nav,
 *     id-agnostic redirect, and Name-round-trip tests against real Sobek
 *   - skip-live:
 *       'action navigates to the slider on the new id (zero-lag backend)' — pins mock-assigned NEW_ID
 *       'action waits out replica lag, then slider resolves (poll-until-found)' — simulated, uncontrollable live
 *       'lag exceeds polling budget…graceful degradation' — forces poll-budget exhaustion via mock lag
 *       'deep-link to a known id resolves the slider…' — deep-links the mock-assigned NEW_ID
 */
test.describe('/vehicles/new save feedback + redirect (no-auth)', () => {
  test.beforeAll(() => writeConfig());
  test.beforeEach(async ({ context }) => seedAuth(context));

  /** Wires the stateful list + `createOrUpdateVehicle` mutation + single-vehicle
   *  by-id fetch (mock only). No-op under live (requests hit Sobek). */
  const wireCreateFlow = async (page: Page, { lag = 0 } = {}) => {
    if (IS_LIVE) return null;
    const list = await interceptStatefulVehicleListQuery(page);
    await interceptVehicleByIdQuery(page, id =>
      id === NEW_ID ? vehicleRow(id, { name: { value: 'Newly created' } }) : null
    );
    interceptVehicleSaveMutation(page, NEW_ID, input => {
      const ref = (input.transportType as { netexId?: string } | undefined)?.netexId;
      if (ref && /^NMR:VehicleType:\d+$/.test(ref)) list.addCreated(NEW_ID, lag);
    });
    return list;
  };

  /** Fill the two save-gating fields. Live uses a unique reg + a real org-owned
   *  VehicleType id; mock uses fixed fixture values. */
  const fillRequiredFields = async (page: Page, over: { reg?: string; vtInt?: string } = {}) => {
    await page.getByLabel('Registration Number').fill(over.reg ?? 'NEW-001');
    await page.getByLabel(/Vehicle Type ID/).fill(over.vtInt ?? '2');
  };

  test('save shows success snackbar with a "View in list" action and does not auto-navigate', async ({
    page,
  }) => {
    const over = IS_LIVE ? { reg: `E2E-${Date.now()}`, vtInt: await liveVehicleTypeInt(page) } : {};
    await wireCreateFlow(page);
    await page.goto('/vehicles/new');
    await page.waitForLoadState('networkidle');

    await fillRequiredFields(page, over);
    await page.getByRole('button', { name: 'Save' }).click();

    const action = page.getByRole('button', { name: 'View in list' });
    await expect(action).toBeVisible();
    await expect(page).toHaveURL(/\/vehicles\/new$/);
  });

  test('action navigates to the slider on the new id (zero-lag backend)', async ({ page }) => {
    // Pins the mock-assigned NEW_ID; a live Sobek mints its own id.
    test.skip(IS_LIVE, 'asserts the mock-assigned NEW_ID; live mints its own id');

    await wireCreateFlow(page, { lag: 0 });
    await page.goto('/vehicles/new');
    await page.waitForLoadState('networkidle');

    await fillRequiredFields(page);
    await page.getByRole('button', { name: 'Save' }).click();
    await page.getByRole('button', { name: 'View in list' }).click();

    await expect.poll(() => page.url()).toContain(`selected=${ENCODED_NEW_ID}`);
    await expect(page.getByTestId('vehicle-details-title')).toBeVisible();
    await expect(page.getByText('Vehicle not found')).toHaveCount(0);
  });

  test('save → View in list resolves the slider on the assigned id (id-agnostic, backend-safe)', async ({
    page,
  }) => {
    // Reads back whatever id the redirect produced — valid against a live Sobek,
    // where the assigned id is unknown until the save responds.
    const over = IS_LIVE ? { reg: `E2E-${Date.now()}`, vtInt: await liveVehicleTypeInt(page) } : {};
    await wireCreateFlow(page, { lag: 0 });
    await page.goto('/vehicles/new');
    await page.waitForLoadState('networkidle');

    await fillRequiredFields(page, over);
    await page.getByRole('button', { name: 'Save' }).click();
    await page.getByRole('button', { name: 'View in list' }).click();

    await expect.poll(() => page.url(), { timeout: 15_000 }).toMatch(/[?&]selected=/);
    await expect(page.getByTestId('vehicle-details-title')).toBeVisible();
    await expect(page.getByText('Vehicle not found')).toHaveCount(0);
  });

  test('save with a Name → View in list → sidebar shows that Name (round-trip, backend-only)', async ({
    page,
  }) => {
    // Backend-only: the mock single-vehicle GET returns a fixed body, so a name
    // round-trip can only be proven against a live Sobek. End-to-end check for
    // the #80 item-1 parser fix — a bare <Name> with no lang attribute must
    // survive POST → persist → GET → parse → render.
    test.skip(!IS_LIVE, 'backend-only — needs real name persistence');

    const name = `E2E Name ${Date.now()}`;
    const vtInt = await liveVehicleTypeInt(page);
    await page.goto('/vehicles/new');
    await page.waitForLoadState('networkidle');

    await page.locator('#vehicle-name').fill(name);
    await fillRequiredFields(page, { reg: `E2E-${Date.now()}`, vtInt });
    await page.getByRole('button', { name: 'Save' }).click();
    await page.getByRole('button', { name: 'View in list' }).click();

    await expect.poll(() => page.url(), { timeout: 15_000 }).toMatch(/[?&]selected=/);
    await expect(page.getByTestId('vehicle-details-title')).toHaveText(name);
    await expect(page.getByText('Vehicle not found')).toHaveCount(0);
  });

  test('action waits out replica lag, then slider resolves (poll-until-found)', async ({
    page,
  }) => {
    // Models read-after-write replica lag via the stateful mock — a mock-only
    // construct (live timing isn't controllable).
    test.skip(IS_LIVE, 'mock-only — simulates controllable replica lag');

    const list = await wireCreateFlow(page, { lag: 3 });
    await page.goto('/vehicles/new');
    await page.waitForLoadState('networkidle');

    await fillRequiredFields(page);
    await page.getByRole('button', { name: 'Save' }).click();
    await page.getByRole('button', { name: 'View in list' }).click();

    await expect
      .poll(() => page.url(), { timeout: 10_000 })
      .toContain(`selected=${ENCODED_NEW_ID}`);
    await expect(page.getByTestId('vehicle-details-title')).toBeVisible();
    await expect(page.getByText('Vehicle not found')).toHaveCount(0);
    // Sanity: more than one list call happened (poll plus mount fetch).
    expect(list?.callCount() ?? 0).toBeGreaterThanOrEqual(2);
  });

  test('lag exceeds polling budget: navigation still happens; slider shows not-found (graceful degradation)', async ({
    page,
  }) => {
    // 99 lag calls exhaust the poll — a mock-only degradation scenario.
    test.skip(IS_LIVE, 'mock-only — forces poll-budget exhaustion via simulated lag');

    await wireCreateFlow(page, { lag: 99 });
    await page.goto('/vehicles/new');
    await page.waitForLoadState('networkidle');

    await fillRequiredFields(page);
    await page.getByRole('button', { name: 'Save' }).click();
    await page.getByRole('button', { name: 'View in list' }).click();

    await expect
      .poll(() => page.url(), { timeout: 10_000 })
      .toContain(`selected=${ENCODED_NEW_ID}`);
    await expect(page.getByText('Vehicle not found')).toBeVisible();
  });

  test('deep-link to a known id resolves the slider (regression for cross-route nav)', async ({
    page,
  }) => {
    // Deep-links the mock-assigned NEW_ID; live has no such fixed id.
    test.skip(IS_LIVE, 'deep-links the mock-assigned NEW_ID');

    const list = await wireCreateFlow(page, { lag: 0 });
    list?.addCreated(NEW_ID, 0);

    await page.goto(`/vehicles?selected=${ENCODED_NEW_ID}`);
    await page.waitForLoadState('networkidle');

    await expect(page.getByTestId('vehicle-details-title')).toBeVisible();
    await expect(page.getByText('Vehicle not found')).toHaveCount(0);
  });
});
