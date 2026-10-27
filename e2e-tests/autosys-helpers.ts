import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const fixturesDir = path.join(__dirname, 'fixtures');

/**
 * Read a JSON fixture file from `e2e-tests/fixtures/` synchronously at module init.
 * Test-only — Playwright workers each load fixtures once.
 *
 * @param name Fixture file name (e.g. 'vehicle-types-mock.json').
 * @returns Parsed JSON value.
 */
const loadFixture = (name: string): unknown =>
  JSON.parse(fs.readFileSync(path.join(fixturesDir, name), 'utf-8'));

type Row = Record<string, unknown>;
/** A GraphQL page response: `{ data: { <field>: { content, totalElements, … } } }`. */
type PageBody = { data: Record<string, { content: Row[]; totalElements: number }> };

/**
 * Answer a `filter.netexIds` query the way Sobek does: only the matching rows
 * (an unknown id ⇒ empty `content`). Without it, a by-id fetch — which takes
 * `content[0]` — would silently open the list's first row.
 *
 * @param body Full page response for the unfiltered list.
 * @param field The connection field (e.g. `vehicleTypes`, `deckPlans`).
 * @param netexIds `variables.filter.netexIds`, or `undefined` for a list query.
 * @returns `body` narrowed to the requested ids, or `body` itself when unfiltered.
 */
export const byNetexIds = (body: unknown, field: string, netexIds?: string[]): unknown => {
  if (!netexIds) return body;
  const conn = (body as PageBody).data[field];
  const content = conn.content.filter(r => netexIds.includes(r.netexId as string));
  return { data: { [field]: { ...conn, content, totalElements: content.length } } };
};

/** `variables.filter.netexIds` of a GraphQL POST, or `undefined` for a list query. */
const netexIdsOf = (postData: { variables?: { filter?: { netexIds?: string[] } } } | null) =>
  postData?.variables?.filter?.netexIds;

/**
 * Intercept any GraphQL request whose query body contains `queryName` and
 * fulfill it with `body` as JSON, narrowed to `filter.netexIds` when the
 * request carries one. Other requests pass through to the network.
 *
 * @param page Playwright Page instance.
 * @param queryName Substring to match against `postData.query` (e.g. 'vehicleTypes').
 * @param field Connection field in `body.data` (for the `netexIds` narrowing).
 * @param body JSON payload to return; will be `JSON.stringify`ed.
 */
const interceptGraphQLQuery = async (
  page: import('@playwright/test').Page,
  queryName: string,
  field: string,
  body: unknown
) => {
  await page.route('**/graphql', async route => {
    const postData = route.request().postDataJSON();
    if (postData?.query?.includes(queryName)) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(byNetexIds(body, field, netexIdsOf(postData))),
      });
    } else {
      // fallback (not continue) so unmatched queries — e.g. the mock
      // `organisations` query — reach the context-level interceptor in seedAuth.
      await route.fallback();
    }
  });
};

const MOCK_VEHICLE_TYPES = loadFixture('vehicle-types-mock.json');
const MOCK_DECK_PLANS = loadFixture('deck-plans-mock.json');

/**
 * Intercept the GraphQL vehicleTypes query and return mock data — the full
 * list, or the `filter.netexIds` rows for the editor's by-id fetch.
 * Required for tests that load /vehicle-types without a real backend.
 */
export const interceptVehicleTypesQuery = (page: import('@playwright/test').Page) =>
  interceptGraphQLQuery(page, 'vehicleTypes', 'vehicleTypes', MOCK_VEHICLE_TYPES);

/**
 * Intercept the GraphQL DeckPlans query and return mock data — the full
 * list, or the `filter.netexIds` rows for the editor's by-id fetch.
 * Required for tests that load /deck-plans without a real backend.
 */
export const interceptDeckPlansQuery = (page: import('@playwright/test').Page) =>
  interceptGraphQLQuery(page, 'DeckPlans', 'deckPlans', MOCK_DECK_PLANS);

/**
 * Read an XML fixture from `e2e-tests/fixtures/`.
 *
 * @param name Fixture file name (e.g. 'deck-plan-xml-mock.xml').
 * @returns Raw file contents.
 */
export const loadXmlFixture = (name: string): string =>
  fs.readFileSync(path.join(fixturesDir, name), 'utf-8');

/**
 * The deck plan's own `<Name>` / `<Description>` in a NeTEx document — read
 * between `<DeckPlan …>` and `<decks>`, so frame and deck texts are skipped.
 *
 * @param xml Posted NeTEx document.
 * @param tag Element to read.
 * @returns The element as a MultilingualString, or `null` when absent.
 */
const deckPlanText = (xml: string, tag: 'Name' | 'Description') => {
  const head = xml.slice(xml.indexOf('<DeckPlan ')).split(/<decks[\s/>]/)[0];
  const m = head.match(
    new RegExp(`<${tag}(?:\\s+lang="([^"]*)")?\\s*>\\s*<Text>([\\s\\S]*?)</Text>`)
  );
  return m ? { value: m[2], ...(m[1] ? { lang: m[1] } : {}) } : null;
};

/**
 * Intercept the NeTEx import POST that every deck-plan save routes through,
 * capturing the posted document. Like Sobek, the stored record then reflects
 * the write: a by-id `DeckPlans` query (`filter.netexIds`) for the posted id
 * answers with the posted name/description over the fixture row, so the
 * editor's post-save re-fetch re-baselines onto the saved values. List
 * queries fall through to {@link interceptDeckPlansQuery}.
 *
 * Sibling of {@link interceptVehicleTypesWithSave}: deck plans save by POSTing
 * a patched document rather than by GraphQL mutation, so the capture is the
 * raw body, not a mutation input. `saved()` is exposed because the two
 * post-save failure paths — a 500 on the list refetch, a 500 on the body
 * refetch — are both keyed on "has the write landed yet", and each is
 * registered on a route this helper does not own.
 *
 * @param page Playwright Page instance.
 * @param body XML to answer the POST with (normally the same fixture the body
 *   route serves).
 * @returns `posted()` — the most recent POST body, `''` before the first save;
 *   `saved()` — whether a POST has been answered.
 */
export async function interceptDeckPlanSave(
  page: import('@playwright/test').Page,
  body: string
): Promise<{ posted: () => string; saved: () => boolean }> {
  let posted = '';
  let saved = false;

  await page.route('**/services/vehicles/netex', async route => {
    posted = route.request().postData() ?? '';
    saved = true;
    await route.fulfill({ status: 200, contentType: 'application/xml', body });
  });

  await page.route('**/graphql', async route => {
    const postData = route.request().postDataJSON();
    const ids = netexIdsOf(postData);
    if (!saved || !ids || !postData?.query?.includes('DeckPlans')) return route.fallback();
    const savedId = posted.match(/<DeckPlan\b[^>]*\bid="([^"]+)"/)?.[1];
    const page0 = byNetexIds(MOCK_DECK_PLANS, 'deckPlans', ids) as PageBody;
    const content = page0.data.deckPlans.content.map(r =>
      r.netexId === savedId
        ? {
            ...r,
            name: deckPlanText(posted, 'Name'),
            description: deckPlanText(posted, 'Description'),
          }
        : r
    );
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ data: { deckPlans: { ...page0.data.deckPlans, content } } }),
    });
  });

  return { posted: () => posted, saved: () => saved };
}

interface VehicleTypeInputCapture {
  netexId?: string;
  name?: { value?: string } | null;
  [k: string]: unknown;
}

interface SaveInterceptOpts {
  /** When set, the mutation responds with this GraphQL error instead of succeeding. */
  saveError?: string;
  /** When true, the by-id vehicleTypes query (`filter.netexIds`) AFTER a save
   * fails (500) — exercises the post-save record re-fetch failure path. The
   * list query keeps answering. */
  failRefetch?: boolean;
}

/**
 * Stateful GraphQL mock for the VehicleType sidebar **save** flow. A single
 * `**\/graphql` route holds a mutable clone of the vehicleTypes fixture and
 * branches on the query body:
 *  - `createOrUpdateVehicleType` → capture `variables.input`, merge it into the
 *    matching row (bumping `version`), and return the row's netexId — or, when
 *    `saveError` is set, return a GraphQL error (drives `SaveErrorSnackbar`).
 *  - `vehicleTypes` → return the (possibly mutated) state — narrowed to
 *    `filter.netexIds` for the editor's by-id fetch — so the post-save re-fetch
 *    re-baselines on the persisted edit + bumped version.
 *
 * Checked mutation-first: `createOrUpdateVehicleType` does not contain the
 * substring `vehicleTypes`, so the branch order is unambiguous.
 *
 * @param page Playwright Page.
 * @param opts `{ saveError }` to exercise the failure path.
 * @returns `{ lastInput }` accessor for the most recent captured mutation input.
 */
export async function interceptVehicleTypesWithSave(
  page: import('@playwright/test').Page,
  opts: SaveInterceptOpts = {}
): Promise<{ lastInput: () => VehicleTypeInputCapture | null }> {
  const state = JSON.parse(JSON.stringify(MOCK_VEHICLE_TYPES));
  const content: Array<Record<string, unknown>> = state.data.vehicleTypes.content;
  let lastInput: VehicleTypeInputCapture | null = null;
  let saved = false;

  await page.route('**/graphql', async route => {
    const post = route.request().postDataJSON();
    const query: string = post?.query ?? '';

    if (query.includes('createOrUpdateVehicleType')) {
      const input: VehicleTypeInputCapture = post.variables?.input ?? {};
      lastInput = input;
      if (opts.saveError) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ data: null, errors: [{ message: opts.saveError }] }),
        });
        return;
      }
      const row = content.find(r => r.netexId === input.netexId);
      if (row) Object.assign(row, input, { version: (row.version as number) + 1 });
      saved = true;
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: { createOrUpdateVehicleType: input.netexId ?? 'NMR:VehicleType:1' },
        }),
      });
      return;
    }

    if (query.includes('vehicleTypes')) {
      const ids = netexIdsOf(post);
      if (opts.failRefetch && saved && ids) {
        await route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ errors: [{ message: 'refetch failed' }] }),
        });
        return;
      }
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(byNetexIds(state, 'vehicleTypes', ids)),
      });
      return;
    }

    // fallback (not continue) so the mock `organisations` query reaches the
    // context-level interceptor in seedAuth and the org auto-selects.
    await route.fallback();
  });

  return { lastInput: () => lastInput };
}

/** Registration number to query — default "A-1", override via E2E_AUTOSYS_REG_NR. */
export const REG_NR = process.env.E2E_AUTOSYS_REG_NR || 'A-1';

/** Fixture file for the Autosys response, keyed by registration number. */
const autosysFixturePath = path.join(fixturesDir, `autosys-response-${REG_NR}.xml`);

/**
 * Intercept the Autosys GET request and always serve from the static fixture.
 * The fixture uses "?" for transient values (frame ids, timestamps) that
 * change on every backend response — tests must not assert on those fields.
 */
export async function interceptAutosysQuery(page: import('@playwright/test').Page) {
  await page.route('**/autosys?registrationNumber=**', async route => {
    if (fs.existsSync(autosysFixturePath)) {
      const body = fs.readFileSync(autosysFixturePath, 'utf-8');
      await route.fulfill({
        status: 200,
        contentType: 'application/xml',
        body,
      });
    } else {
      await route.fulfill({
        status: 503,
        contentType: 'text/plain',
        body: `No fixture at ${autosysFixturePath}. Commit a static fixture XML for reg number "${REG_NR}".`,
      });
    }
  });
}
