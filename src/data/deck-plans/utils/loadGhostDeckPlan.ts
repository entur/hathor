/**
 * The SAMPLE ghost's NeTEx document, fetched rather than bundled.
 *
 * Rendered when a real plan carries an empty `<decks/>` — which, while Sobek
 * 500s on any plan that has decks, is every row a user can open. It is a
 * placeholder, so it must not cost the login screen anything: shipping it in
 * the main chunk made every user download and parse ~20 KB of NeTEx for a
 * branch only `/deck-plans` reaches.
 *
 * The file under `public/` is generated from `mkSampleDeckPlanXml` and kept
 * honest by `sampleDeckPlanAsset.test.ts`, so there is no hand-run step to
 * forget — the failure the previous inlined copy was exposed to.
 */

/** Served from `public/`; `BASE_URL` keeps it right under a non-root deploy. */
const GHOST_URL = `${import.meta.env.BASE_URL}sample-deck-plan.xml`;

/** NeTEx id inside that document. Distinct from any real plan's id. */
export const GHOST_PLAN_ID = 'GHOST:DeckPlan:1';

/** How a NeTEx document may open. Anything else is not one. */
const XML_OPENINGS = ['<?xml', '<PublicationDelivery'];

let pending: Promise<string> | null = null;

/**
 * Fetch the ghost document once per session.
 *
 * Memoised like {@link loadDeckRenderer}: concurrent callers share one
 * request, and a failure clears the memo so a later mount can retry rather
 * than replaying a rejected promise forever.
 *
 * `r.ok` is not enough on its own. A host with history fallback answers a
 * missing asset — or a wrong `BASE_URL` — with `200 text/html` and `index.html`
 * in the body, so the check passes and the failure surfaces a layer out as
 * `parseNeTEx` choking on `<!doctype html>`: an internal parser message where
 * the truth is "the file is not there". Checking how the body opens names it
 * here, at the fetch.
 *
 * @returns Resolves with the raw NeTEx XML.
 */
export function loadGhostDeckPlanXml(): Promise<string> {
  return (pending ??= fetch(GHOST_URL)
    .then(async r => {
      if (!r.ok) throw new Error(`Sample deck plan ${r.status}`);
      const body = await r.text();
      if (!XML_OPENINGS.some(o => body.trimStart().startsWith(o)))
        throw new Error(`Sample deck plan at ${GHOST_URL} is not NeTEx XML`);
      return body;
    })
    .catch(e => {
      pending = null;
      throw e;
    }));
}
