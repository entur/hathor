import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { interceptDeckPlansQuery } from './autosys-helpers';
import { IS_LIVE, seedAuth } from './live-auth-helpers';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * /deck-plans — sidebar editor (#129 / deck-plans-sidebar plan).
 *
 * Workflow:
 *   load /deck-plans → click the first deck-plan row → assert ?selected=<id>
 *   in URL + sidebar title testid visible → wait for the XML textarea to
 *   render (XML body fetch resolves) → click EditorRail collapse → assert
 *   ?selected= drops from the URL.
 * Covers:
 *   - row click writes ?selected=<id> (replaces the deprecated /deck-plans/:id
 *     route view)
 *   - sidebar fetches the NeTEx XML body via useDeckPlanXml and renders it
 *     in the textarea
 *   - editor-rail collapse closes the sidebar by clearing ?selected=
 * Modes:
 *   - mock (E2E_BACKEND unset): intercepts `DeckPlans` GraphQL with the 10-row
 *     fixture, plus a fulfill-route on `/deckplans/<id>` returning the XML mock
 *   - skip-live: this spec is mock-focused; live-backend behaviour is exercised
 *     by separate live specs once a live fixture deck-plan id is wired
 */
test.describe('/deck-plans — sidebar editor', () => {
  test.beforeEach(async ({ context }) => seedAuth(context));

  test.skip(IS_LIVE, 'sidebar slider behaviour is asserted against fixtures, not live data');

  test('row click opens sidebar; EditorRail collapse closes it', async ({ page }) => {
    await interceptDeckPlansQuery(page);

    // Stub the REST XML body fetch (`useDeckPlanXml` → fetchDeckPlanDetails).
    const xml = fs.readFileSync(path.join(__dirname, 'fixtures/deck-plan-xml-mock.xml'), 'utf8');
    await page.route(/\/deckplans\/[^/?#]+$/, route =>
      route.fulfill({ status: 200, contentType: 'application/xml', body: xml })
    );

    await page.goto('/deck-plans');
    await expect(page.locator('table')).toBeVisible();
    await expect(page.getByTestId('total-entries')).toHaveAttribute('data-count', '10');

    // Click the first deck-plan row (named "Plan Alpha" after the blanks-last
    // sort lands it at row 0). Don't click chrome — target the data row.
    await page.locator('table tbody tr').first().click();

    // Sidebar opens: URL carries ?selected=<id>, title testid + textarea visible.
    await expect(page).toHaveURL(/\?selected=NMR%3ADeckPlan%3A5/);
    await expect(page.getByTestId('deck-plan-details-title')).toBeVisible();
    await expect(page.getByTestId('deck-plan-xml-textarea')).toBeVisible();

    // Close via EditorRail collapse — same affordance VT/Vehicle sidebars use.
    await page.getByTestId('editor-rail-collapse').click();
    await expect(page).not.toHaveURL(/\?selected=/);
  });
});
