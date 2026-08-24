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
 *   and a deck rendering per Deck → switch to the XML tab and assert the
 *   read-only body rendered → back on Edit, edit the name and save → assert the intercepted import POST
 *   carries the patched <Name> and no <keyList> → click EditorRail collapse →
 *   assert ?selected= drops from the URL.
 * Covers:
 *   - row click writes ?selected=<id> (replaces the deprecated /deck-plans/:id
 *     route view)
 *   - Edit/XML tab split: name+description editable, XML body read-only
 *   - Edit tab draws one read-only <deck-rendering> per Deck, captioned by
 *     name, with seats asserted through the element's shadow root
 *   - a plan with an empty <decks/> falls back to the SAMPLE ghost
 *   - name/description save routes through the NeTEx import POST with a
 *     patched document (preserves deck geometry DeckPlanInput cannot carry)
 *   - keyList is stripped before POST so Sobek does not double it (sobek#180)
 *   - save is gated until the XML body has loaded (an edit patches it)
 *   - a failed post-save list refresh warns but still re-baselines the form
 *   - cancelling a second edit restores the saved baseline, not the stale
 *     `deckPlan` prop useUrlEditorSelection never re-commits
 *   - the stored `lang` on <Name> survives a save round-trip
 *   - a failed post-save body refetch blocks a second save on the stale document
 *   - a deck rendering whose mount throws reports it instead of rendering
 *     nothing, and a shadow root without adoptedStyleSheets costs styling only
 *   - editor-rail collapse closes the sidebar by clearing ?selected=
 * Modes:
 *   - mock (E2E_BACKEND unset): intercepts `DeckPlans` GraphQL with the 10-row
 *     fixture, plus fulfill-routes on `/deckplans/<id>` for the XML body —
 *     `deck-plan-xml-mock.xml` (empty `<decks/>`, the SAMPLE case) or
 *     `deck-plan-xml-with-decks-mock.xml` (two decks, 4 + 2 seats)
 *   - skip-live: mutates a shared deck plan; live coverage needs its own fixture id
 */
test.describe('/deck-plans — sidebar editor', () => {
  test.beforeEach(async ({ context }) => seedAuth(context));

  test.skip(IS_LIVE, 'sidebar slider behaviour is asserted against fixtures, not live data');

  const xml = (file = 'deck-plan-xml-mock.xml') =>
    fs.readFileSync(path.join(__dirname, 'fixtures', file), 'utf8');

  const openFirstRow = async (page: import('@playwright/test').Page, body = xml()) => {
    await interceptDeckPlansQuery(page);
    await page.route(/\/deckplans\/[^/?#]+$/, route =>
      route.fulfill({ status: 200, contentType: 'application/xml', body })
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

  test('Edit tab renders one deck per Deck, captioned by name', async ({ page }) => {
    await openFirstRow(page, xml('deck-plan-xml-with-decks-mock.xml'));

    const strip = page.getByTestId('deck-plan-decks');
    await expect(strip).toBeVisible();
    // Two decks in the fixture — captions come from each <Deck><Name>.
    await expect(strip.getByText('Lower')).toBeVisible();
    await expect(strip.getByText('Upper')).toBeVisible();
    await expect(page.getByTestId('deck-plan-deck-0')).toBeVisible();
    await expect(page.getByTestId('deck-plan-deck-1')).toBeVisible();
    // No SAMPLE chrome when the plan actually carries decks.
    await expect(page.getByTestId('deck-plan-decks-sample')).toHaveCount(0);

    // Seats live inside the custom element's shadow root; Playwright's CSS
    // engine pierces it. 4 seats on the lower deck, 2 on the upper.
    await expect(page.locator('[data-testid="deck-plan-deck-0"] g.seat')).toHaveCount(4);
    await expect(page.locator('[data-testid="deck-plan-deck-1"] g.seat')).toHaveCount(2);
  });

  test('a plan with no decks renders the SAMPLE ghost', async ({ page }) => {
    // The default fixture carries an empty <decks/> — the shape real Sobek
    // data comes back with (NMR:DeckPlan:1 probed 2026-08-20).
    await openFirstRow(page);

    await expect(page.getByTestId('deck-plan-decks-sample')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'SAMPLE' })).toBeVisible();
    // Exactly one ghost deck, and it is populated — the ghost is Wagon_2's
    // deck (46 seats), not a bare outline.
    await expect(page.getByTestId('deck-plan-deck-0')).toBeVisible();
    await expect(page.getByTestId('deck-plan-deck-1')).toHaveCount(0);
    await expect(page.locator('[data-testid="deck-plan-deck-0"] g.seat')).toHaveCount(46);
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

  test('save stays disabled until the XML body has loaded', async ({ page }) => {
    await interceptDeckPlansQuery(page);

    // Hold the body fetch open so the editor is dirty while `xml` is still ''.
    let release!: () => void;
    const gate = new Promise<void>(r => (release = r));
    await page.route(/\/deckplans\/[^/?#]+$/, async route => {
      await gate;
      await route.fulfill({ status: 200, contentType: 'application/xml', body: xml() });
    });

    await page.goto('/deck-plans?selected=NMR:DeckPlan:5');
    await page.getByTestId('editor-rail-edit').click();
    await page.locator('#deckPlan-name').fill('Typed before the body arrived');

    // Dirty, but patchDeckPlanXml has nothing to patch yet — saving here would
    // throw a misleading "not found in document".
    await expect(page.getByTestId('editor-rail-save')).toBeDisabled();

    release();
    await expect(page.getByTestId('editor-rail-save')).toBeEnabled();
  });

  test('a failed post-save list refresh warns but still re-baselines the form', async ({
    page,
  }) => {
    // The import POST commits, then the list refetch 500s. The warning is
    // correct, but the write landed — collapsing must not offer to discard
    // changes that are already persisted.
    let saved = false;
    // Registered BEFORE the 500-override: Playwright runs route handlers LIFO,
    // so the override below gets first look and falls back to this one.
    await interceptDeckPlansQuery(page);
    await page.route('**/graphql', async route => {
      const body = route.request().postDataJSON() as { query?: string };
      if (body?.query?.includes('deckPlans') && saved) {
        return route.fulfill({ status: 500, contentType: 'application/json', body: '{}' });
      }
      return route.fallback();
    });
    await page.route(/\/deckplans\/[^/?#]+$/, route =>
      route.fulfill({ status: 200, contentType: 'application/xml', body: xml() })
    );
    await page.route('**/services/vehicles/netex', async route => {
      saved = true;
      await route.fulfill({ status: 200, contentType: 'application/xml', body: xml() });
    });

    await page.goto('/deck-plans?selected=NMR:DeckPlan:5');
    await expect(page.getByTestId('deck-plan-xml-textarea')).toHaveCount(0);
    await page.getByTestId('editor-rail-edit').click();
    await page.locator('#deckPlan-name').fill('Renamed then refresh fails');
    await page.getByTestId('editor-rail-save').click();

    await expect(page.getByText(/list could not refresh/i)).toBeVisible();

    await page.getByTestId('editor-rail-collapse').click();
    await expect(page.getByRole('button', { name: 'Discard' })).toHaveCount(0);
    await expect(page).not.toHaveURL(/\?selected=/);
  });

  test('cancelling an edit after a save keeps the saved values, not the stale row', async ({
    page,
  }) => {
    await openFirstRow(page);
    await page.route('**/services/vehicles/netex', route =>
      route.fulfill({ status: 200, contentType: 'application/xml', body: xml() })
    );

    await page.getByTestId('editor-rail-edit').click();
    await page.locator('#deckPlan-name').fill('Plan Alpha renamed');
    await page.getByTestId('editor-rail-save').click();
    await expect(page.getByTestId('deck-plan-details-title')).toHaveText('Plan Alpha renamed');

    // useUrlEditorSelection does not re-commit the editor for an unchanged id,
    // so the `deckPlan` prop still holds the pre-save row. Cancel must restore
    // the last saved baseline, not that stale prop.
    await page.getByTestId('editor-rail-edit').click();
    await page.getByTestId('editor-rail-cancel').click();

    await expect(page.locator('#deckPlan-name')).toHaveValue('Plan Alpha renamed');
    await expect(page.getByTestId('deck-plan-details-title')).toHaveText('Plan Alpha renamed');
  });

  test('saving preserves the lang attribute the document was stored with', async ({ page }) => {
    await openFirstRow(page);

    let posted = '';
    await page.route('**/services/vehicles/netex', async route => {
      posted = route.request().postData() ?? '';
      await route.fulfill({ status: 200, contentType: 'application/xml', body: xml() });
    });

    await page.getByTestId('editor-rail-edit').click();
    await page.locator('#deckPlan-name').fill('Plan Alpha renamed');
    await page.getByTestId('editor-rail-save').click();

    // patchDeckPlanXml rebuilds <Name> wholesale from the domain object, so a
    // `lang` missing from the domain value is dropped on the first save. The
    // route mock returns the whole fixture row regardless of the GraphQL
    // selection, so that the query actually *asks* for `lang` is guarded by
    // the unit test on the query document, not here.
    await expect.poll(() => posted).toContain('Plan Alpha renamed');
    expect(posted).toMatch(/<Name lang="nb">/);
  });

  test('a failed post-save body refetch blocks a second save on the stale document', async ({
    page,
  }) => {
    await interceptDeckPlansQuery(page);

    // Keyed on the write, not on a call count: the body effect re-runs on its
    // own before any save (auth/org identity churn), so a "second fetch" gate
    // would 500 the initial load instead.
    let saved = false;
    await page.route(/\/deckplans\/[^/?#]+$/, route =>
      saved
        ? route.fulfill({ status: 500, contentType: 'text/plain', body: 'body fetch failed' })
        : route.fulfill({ status: 200, contentType: 'application/xml', body: xml() })
    );
    await page.route('**/services/vehicles/netex', route => {
      saved = true;
      return route.fulfill({ status: 200, contentType: 'application/xml', body: xml() });
    });

    await page.goto('/deck-plans?selected=NMR:DeckPlan:5');
    await page.getByTestId('editor-rail-edit').click();
    await page.locator('#deckPlan-name').fill('First rename');
    await page.getByTestId('editor-rail-save').click();

    // The post-save refetch 500s, so the cached body is now the pre-save one.
    await expect(page.getByTestId('deck-plan-decks-fetch-error')).toBeVisible();

    // Patching that stale document and POSTing it would resurrect the old name.
    await page.getByTestId('editor-rail-edit').click();
    await page.locator('#deckPlan-name').fill('Second rename');
    await expect(page.getByTestId('editor-rail-save')).toBeDisabled();
  });

  test('a deck rendering that fails to mount says so instead of vanishing', async ({ page }) => {
    // The only live path into DeckRendering's failure branch: the shadow-sheet
    // adoption inside its mount promise throws, so the `.catch()` fires while
    // the strip around it is perfectly healthy.
    await page.addInitScript(() => {
      Object.defineProperty(ShadowRoot.prototype, 'adoptedStyleSheets', {
        configurable: true,
        get: () => ({
          includes: () => {
            throw new Error('adoptedStyleSheets unavailable');
          },
        }),
        set: () => {},
      });
    });
    await openFirstRow(page);

    await expect(page.getByTestId('deck-plan-decks')).toBeVisible();
    await expect(page.getByTestId('deck-plan-deck-0-error')).toBeVisible();
  });

  test('a deck still renders where constructable stylesheets are unavailable', async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(ShadowRoot.prototype, 'adoptedStyleSheets', {
        configurable: true,
        get: () => undefined,
        set: () => {},
      });
    });
    await openFirstRow(page);

    // Unstyled is a fair degradation; an empty slot is not.
    await expect(page.locator('[data-testid="deck-plan-deck-0"] g.seat')).toHaveCount(46);
  });
});
