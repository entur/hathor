import { test, expect, type Page } from '@playwright/test';
import { interceptVehicleTypesQuery } from './autosys-helpers';
import { IS_LIVE, seedAuth, selectFirstOrg } from './live-auth-helpers';

/**
 * Deck-plan feature flag (#202) — `sandboxFeatures.DeckPlans` gates the deck-plan
 * screens and the references to them on /vehicle-types.
 *
 * Workflow:
 *   seedAuth with DeckPlans on (fixture default) or off (config override)
 *   → goto / and wait for the org-gated vehicles links → assert deck-plan
 *   links present / absent; goto /deck-plans with DeckPlans off → lands on /;
 *   goto /next/vehicle-types → assert the "Deck Plan" column header present / absent
 * Covers:
 *   - on: nav-rail item, Home's card and create action link to /next/deck-plans(/new);
 *     the vehicle-type collection shows the Deck Plan column
 *   - off: no link into deck plans anywhere; a direct visit redirects to /; no Deck Plan column
 *   - (the multi-import deck-plan count is covered in autosys-multi-import.spec.ts)
 * Modes:
 *   - mock (E2E_BACKEND unset): intercepts `vehicleTypes`; orgs come from seedAuth's lookups
 *   - live (E2E_BACKEND=true): same assertions against real Sobek data — the flag is
 *     client-side config, served by route interception in both modes
 */

// Replaces the fixture's flags whole: keep `Collections` on for /next/vehicle-types.
const DECK_PLANS_OFF = { sandboxFeatures: { DeckPlans: false, Collections: true } };
const DECK_PLAN_COLUMN = 'Deck Plan';

/** Any link into deck plans: the nav-rail item and Home's card and create action. */
const deckPlanLinks = (page: Page) => page.locator('a[href*="/deck-plans"]');

/** The nav-rail item for /next/deck-plans (`Collections` is on in the fixture config, #295). */
const navDeckPlanLink = (page: Page) =>
  page.getByTestId('nav-rail').locator('a[href="/next/deck-plans"]');

/** The vehicle-type collection's Deck Plan column header. */
const deckPlanColumn = (page: Page) => page.getByRole('columnheader', { name: DECK_PLAN_COLUMN });

/** Home with an organisation selected — the org-gated vehicles links mark the nav and cards as rendered. */
const openHome = async (page: Page) => {
  await page.goto('/');
  await selectFirstOrg(page);
  // /next/vehicles with `Collections` on (fixture default, #295); /vehicles when an override drops it.
  await expect(page.getByTestId('nav-rail').locator('a[href$="/vehicles"]')).toBeVisible();
  await expect(page.locator('.app-content a[href$="/vehicles"]')).toBeVisible();
};

/** /next/vehicle-types with its grid rendered. */
const openVehicleTypes = async (page: Page) => {
  if (!IS_LIVE) await interceptVehicleTypesQuery(page);
  await page.goto('/next/vehicle-types');
  await selectFirstOrg(page);
  await expect(page.getByRole('link', { name: /^Edit / }).first()).toBeVisible();
};

test.describe('sandboxFeatures.DeckPlans', () => {
  test('on: nav rail and Home link to /deck-plans', async ({ context, page }) => {
    await seedAuth(context);
    await openHome(page);
    await expect(navDeckPlanLink(page)).toBeVisible();
    await expect(page.locator('.app-content a[href="/next/deck-plans"]')).toBeVisible();
    await expect(page.locator('.app-content a[href="/next/deck-plans/new"]')).toBeVisible();
  });

  test('on: the vehicle-type collection shows the Deck Plan column', async ({ context, page }) => {
    await seedAuth(context);
    await openVehicleTypes(page);
    await expect(deckPlanColumn(page)).toBeVisible();
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

  test('off: the vehicle-type collection hides the Deck Plan column', async ({ context, page }) => {
    await seedAuth(context, DECK_PLANS_OFF);
    await openVehicleTypes(page);
    await expect(deckPlanColumn(page)).toHaveCount(0);
  });
});
