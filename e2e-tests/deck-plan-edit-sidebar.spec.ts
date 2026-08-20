import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { interceptDeckPlansQuery } from './autosys-helpers';
import { IS_LIVE, seedAuth } from './live-auth-helpers';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * /deck-plans — sidebar editor (#129, realigned to the sibling pattern in #149).
 *
 * Workflow:
 *   load /deck-plans → click the first deck-plan row → assert ?selected=<id>
 *   in URL + sidebar title testid visible → Edit tab shows the trimmed name
 *   → switch to the XML tab and assert the read-only body rendered → back on
 *   Edit, edit the name and save → assert the intercepted import POST
 *   carries the patched <Name> and no <keyList> → click EditorRail collapse →
 *   assert ?selected= drops from the URL.
 * Covers:
 *   - row click writes ?selected=<id> (replaces the deprecated /deck-plans/:id
 *     route view)
 *   - Edit/XML tab split: name+description editable, XML body read-only
 *   - name/description save routes through the NeTEx import POST with a
 *     patched document (preserves deck geometry DeckPlanInput cannot carry)
 *   - keyList is stripped before POST so Sobek does not double it (sobek#180)
 *   - editor-rail collapse closes the sidebar by clearing ?selected=
 * Modes:
 *   - mock (E2E_BACKEND unset): intercepts `DeckPlans` GraphQL with the 10-row
 *     fixture, plus fulfill-routes on `/deckplans/<id>` for the XML body
 *   - skip-live: mutates a shared deck plan; live coverage needs its own fixture id
 */
test.describe('/deck-plans — sidebar editor', () => {
  test.beforeEach(async ({ context }) => seedAuth(context));

  test.skip(IS_LIVE, 'sidebar slider behaviour is asserted against fixtures, not live data');

  const xml = () =>
    fs.readFileSync(path.join(__dirname, 'fixtures/deck-plan-xml-mock.xml'), 'utf8');

  const openFirstRow = async (page: import('@playwright/test').Page) => {
    await interceptDeckPlansQuery(page);
    await page.route(/\/deckplans\/[^/?#]+$/, route =>
      route.fulfill({ status: 200, contentType: 'application/xml', body: xml() })
    );
    await page.goto('/deck-plans');
    await expect(page.locator('table')).toBeVisible();
    await expect(page.getByTestId('total-entries')).toHaveAttribute('data-count', '10');
    // First data row is "Plan Alpha" (NMR:DeckPlan:5) after the blanks-last sort.
    await page.locator('table tbody tr').first().click();
    await expect(page).toHaveURL(/\?selected=NMR%3ADeckPlan%3A5/);
    await expect(page.getByTestId('deck-plan-details-title')).toBeVisible();
  };

  test('row click opens sidebar; EditorRail collapse closes it', async ({ page }) => {
    await openFirstRow(page);
    await page.getByTestId('editor-rail-collapse').click();
    await expect(page).not.toHaveURL(/\?selected=/);
  });

  test('Edit tab holds the fields; XML tab holds the read-only body', async ({ page }) => {
    await openFirstRow(page);

    // Edit is the default tab: name arrives trimmed, not whitespace-padded.
    await expect(page.getByTestId('deck-plan-tab-edit')).toBeVisible();
    await expect(page.locator('#deckPlan-name')).toHaveValue('Plan Alpha');
    await expect(page.locator('#deckPlan-description')).toHaveValue('Alpha lower-deck variant');

    // XML body lives behind its own tab and is never editable.
    await page.getByRole('tab', { name: 'XML' }).click();
    await expect(page.getByTestId('deck-plan-tab-xml')).toBeVisible();
    const area = page.getByTestId('deck-plan-xml-textarea');
    await expect(area).toBeVisible();
    await expect(area).toHaveAttribute('readonly', '');
  });

  test('saving a renamed deck plan POSTs a patched document without keyList', async ({ page }) => {
    await openFirstRow(page);

    let posted = '';
    await page.route('**/services/vehicles/netex', async route => {
      posted = route.request().postData() ?? '';
      await route.fulfill({ status: 200, contentType: 'application/xml', body: xml() });
    });

    await page.getByTestId('editor-rail-edit').click();
    await page.locator('#deckPlan-name').fill('Plan Alpha renamed');
    await page.getByTestId('editor-rail-save').click();

    await expect.poll(() => posted).toContain('Plan Alpha renamed');
    // Geometry + envelope ride along; provenance keyList is stripped (sobek#180).
    expect(posted).toContain('NMR:DeckPlan:5');
    expect(posted).toContain('<decks/>');
    expect(posted).not.toContain('imported-id');
  });

  test('?selected=new renders the Edit panel bare and saves via the GQL mutation', async ({
    page,
  }) => {
    await interceptDeckPlansQuery(page);

    const NEW_ID = 'NMR:DeckPlan:99';
    let input: Record<string, unknown> | null = null;
    await page.route('**/graphql', async route => {
      const body = route.request().postDataJSON() as {
        query?: string;
        variables?: Record<string, unknown>;
      };
      if (!body?.query?.includes('createOrUpdateDeckPlan')) return route.fallback();
      input = body.variables?.input as Record<string, unknown>;
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data: { createOrUpdateDeckPlan: NEW_ID } }),
      });
    });

    await page.goto('/deck-plans?selected=new');
    await expect(page.getByTestId('deck-plan-tab-edit')).toBeVisible();
    // No persisted body yet, so no tab strip at all.
    await expect(page.getByRole('tab')).toHaveCount(0);

    await page.locator('#deckPlan-name').fill('Brand New Plan');
    await page.getByTestId('editor-rail-save').click();

    await expect.poll(() => input).not.toBeNull();
    expect(input!.name).toEqual({ value: 'Brand New Plan' });
  });
});
