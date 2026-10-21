import { test, expect, type Page } from '@playwright/test';
import { interceptVehicleTypesQuery } from './autosys-helpers';
import { IS_LIVE, seedAuth, selectFirstOrg } from './live-auth-helpers';

/**
 * Deck-plan feature flags (#202) — `sandboxFeatures.DeckPlans` gates the
 * deck-plan screens, `enableDeckPlanRefs` the deck-plan column on /vehicle-types.
 *
 * Workflow:
 *   seedAuth with the flag on (fixture default) or off (config override)
 *   → goto / and wait for the org-gated `/vehicles` links → assert `/deck-plans`
 *   links present / absent; goto /deck-plans with DeckPlans off → lands on /;
 *   goto /vehicle-types → assert the "Deck Plan" column header present / absent
 * Covers:
 *   - DeckPlans on: nav-rail item and Home cards link to /deck-plans
 *   - DeckPlans off: no link into /deck-plans anywhere; a direct visit redirects to /
 *   - enableDeckPlanRefs on / off: vehicle-type list shows / hides the Deck Plan column
 *   - (the multi-import deck-plan count is covered in autosys-multi-import.spec.ts)
 * Modes:
 *   - mock (E2E_BACKEND unset): intercepts `vehicleTypes`; orgs come from seedAuth's lookups
 *   - live (E2E_BACKEND=true): same assertions against real Sobek data — the flags are
 *     client-side config, served by route interception in both modes
 */

const DECK_PLANS_OFF = { sandboxFeatures: { DeckPlans: false } };
const REFS_OFF = { enableDeckPlanRefs: false };
const DECK_PLAN_COLUMN = 'Deck Plan';

/** Any link into /deck-plans: the nav-rail item and Home's browse card and create action. */
const deckPlanLinks = (page: Page) => page.locator('a[href^="/deck-plans"]');

/** Home with an organisation selected — the org-gated `/vehicles` links mark the nav and cards as rendered. */
const openHome = async (page: Page) => {
  await page.goto('/');
  await selectFirstOrg(page);
  await expect(page.getByTestId('nav-rail').locator('a[href="/vehicles"]')).toBeVisible();
  await expect(page.locator('.app-content a[href="/vehicles"]')).toBeVisible();
};

/** /vehicle-types with its table rendered. */
const openVehicleTypes = async (page: Page) => {
  if (!IS_LIVE) await interceptVehicleTypesQuery(page);
  await page.goto('/vehicle-types');
  await selectFirstOrg(page);
  await expect(page.locator('table tbody tr').first()).toBeVisible();
};

test.describe('sandboxFeatures.DeckPlans', () => {
  test('on: nav rail and Home link to /deck-plans', async ({ context, page }) => {
    await seedAuth(context);
    await openHome(page);
    await expect(page.getByTestId('nav-rail').locator('a[href="/deck-plans"]')).toBeVisible();
    await expect(page.locator('.app-content a[href^="/deck-plans"]').first()).toBeVisible();
  });

  test('off: no link into /deck-plans', async ({ context, page }) => {
    await seedAuth(context, DECK_PLANS_OFF);
    await openHome(page);
    await expect(deckPlanLinks(page)).toHaveCount(0);
  });

  test('off: a direct visit to /deck-plans redirects to /', async ({ context, page }) => {
    await seedAuth(context, DECK_PLANS_OFF);
    await page.goto('/deck-plans');
    await expect(page).toHaveURL(url => url.pathname === '/');
  });
});

test.describe('enableDeckPlanRefs', () => {
  test('on: vehicle-type list shows the Deck Plan column', async ({ context, page }) => {
    await seedAuth(context);
    await openVehicleTypes(page);
    await expect(page.getByRole('columnheader', { name: DECK_PLAN_COLUMN })).toBeVisible();
  });

  test('off: vehicle-type list hides the Deck Plan column', async ({ context, page }) => {
    await seedAuth(context, REFS_OFF);
    await openVehicleTypes(page);
    await expect(page.getByRole('columnheader', { name: DECK_PLAN_COLUMN })).toHaveCount(0);
  });

  test('off leaves DeckPlans on: /deck-plans still linked', async ({ context, page }) => {
    await seedAuth(context, REFS_OFF);
    await openHome(page);
    await expect(page.getByTestId('nav-rail').locator('a[href="/deck-plans"]')).toBeVisible();
  });
});
