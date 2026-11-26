import { test, expect, type Page } from '@playwright/test';
import { interceptDeckPlanSave, interceptDeckPlansQuery, loadXmlFixture } from './autosys-helpers';
import { IS_LIVE, firstEdit, seedAuth, selectFirstOrg } from './live-auth-helpers';

const LIST = '/deck-plans';
// deck-plans-mock.json: "Plan Alpha", name padded with whitespace.
const ALPHA = 'NMR:DeckPlan:5';
// deck-plans-mock.json: a plan with no name at all.
const UNNAMED = 'NMR:DeckPlan:2';

/** The form page's sticky footer Save. */
const footerSave = (page: Page) => page.getByRole('button', { name: 'Save', exact: true });
/** Serve a deck plan's XML body from a fixture. */
const serveBody = (page: Page, file = 'deck-plan-xml-with-decks-mock.xml') =>
  page.route(/\/deckplans\/[^/?#]+(\?|$)/, route =>
    route.fulfill({ status: 200, contentType: 'application/xml', body: loadXmlFixture(file) })
  );

/**
 * /deck-plans — the deck-plan pair (#287, epic #252): CollectionShell list ·
 * EntityDetailsShell form page, as /vehicles.
 *
 * Workflow:
 *   /deck-plans → collection grid with an Edit link per row → /deck-plans/<id>,
 *   ready to edit, decks in column 3 → Back returns to the list.
 * Covers:
 *   - Edit → form page (h1 focused, Save has nothing to save); Back → focus back on the row's Edit link
 *   - a plan without a name shows its id (U4); search narrows the rows by name (U1)
 *   - column 3: one deck per Deck, and a "Show XML" button (a no-op in epic #252)
 *   - a rename saves through the NeTEx import POST with the patched body
 *   - create: "No decks yet", no XML button
 *   - DeckPlans flag off: a direct visit lands on /
 * Modes:
 *   - mock (E2E_BACKEND unset): deck-plans-mock.json for the list and by-id reads; the
 *     XML body from deck-plan-xml-with-decks-mock.xml (two decks)
 *   - live (E2E_BACKEND=true): seedAuth JWT + org auto-select; Edit → Back on the first row
 *   - skip-live: fixture names and decks, the save (writes a shared plan), create
 */
test.describe('/deck-plans', () => {
  test.beforeEach(async ({ page, context }) => {
    await seedAuth(context);
    if (!IS_LIVE) {
      await interceptDeckPlansQuery(page);
      await serveBody(page);
    }
  });

  test('Edit opens the form page ready to edit; Back returns to the row', async ({ page }) => {
    await page.goto(LIST);
    await selectFirstOrg(page);
    const edit = firstEdit(page);
    await edit.click();

    await expect(page).toHaveURL(new RegExp(`${LIST}/[^/]+$`));
    const title = page.getByTestId('deck-plan-details-title');
    await expect(title).toBeFocused();
    await expect(title).toHaveJSProperty('tagName', 'H1');
    await expect(page.locator('#deckPlan-name')).toBeEditable();
    // Clean: Save stays enabled and says there is nothing to save, sending nothing (#293).
    await footerSave(page).click();
    await expect(page.getByText('No changes to save')).toBeVisible();

    await page.getByTestId('editor-page-back').click();
    await expect(page).toHaveURL(new RegExp(`${LIST}$`));
    await expect(edit).toBeFocused();
  });

  test('a plan without a name shows its id, its Edit link too; search narrows by name', async ({
    page,
  }) => {
    test.skip(IS_LIVE, 'fixture rows');
    await page.goto(LIST);
    // The Name cell; the id column itself shows the local part `2`.
    await expect(page.getByRole('gridcell', { name: UNNAMED, exact: true })).toHaveCount(1);
    await expect(page.getByRole('link', { name: `Edit ${UNNAMED}` })).toHaveCount(1);

    await page.getByPlaceholder('Search these rows').fill('Plan Alpha');
    await expect(page.getByRole('link', { name: /^Edit / })).toHaveCount(1);
  });

  test('column 3 draws the decks, with a Show XML button', async ({ page }) => {
    test.skip(IS_LIVE, 'fixture decks');
    await page.goto(`${LIST}/${encodeURIComponent(ALPHA)}`);
    await expect(page.locator('#deckPlan-name')).toHaveValue('Plan Alpha');
    const decks = page.getByTestId('deck-plan-decks');
    await expect(decks.getByText('Lower')).toBeVisible();
    await expect(decks.getByText('Upper')).toBeVisible();
    await expect(page.locator('[data-testid="deck-plan-deck-0"] g.seat')).toHaveCount(4);
    await expect(page.getByTestId('deck-plan-show-xml')).toBeVisible();
  });

  test('a rename saves through the import POST with the patched body', async ({ page }) => {
    test.skip(IS_LIVE, 'writes a shared deck plan');
    const { posted } = await interceptDeckPlanSave(
      page,
      loadXmlFixture('deck-plan-xml-with-decks-mock.xml')
    );
    await page.goto(`${LIST}/${encodeURIComponent(ALPHA)}`);
    await expect(page.getByTestId('deck-plan-decks')).toBeVisible();
    await page.locator('#deckPlan-name').fill('Plan Alpha renamed');
    await footerSave(page).click();

    await expect.poll(posted).toContain('Plan Alpha renamed');
    expect(posted()).toContain(ALPHA);
  });

  test('create: "No decks yet" and no XML button', async ({ page }) => {
    test.skip(IS_LIVE, 'nothing to read live');
    await page.goto(`${LIST}/new`);
    await expect(page.getByTestId('deck-plan-decks-placeholder')).toHaveText('No decks yet');
    await expect(page.getByTestId('deck-plan-show-xml')).toHaveCount(0);
  });

  test('DeckPlans off: a direct visit lands on /', async ({ page, context }) => {
    await seedAuth(context, { sandboxFeatures: { DeckPlans: false } });
    await page.goto(LIST);
    await expect(page).toHaveURL(url => url.pathname === '/');
  });
});
