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

let pending: Promise<string> | null = null;

/**
 * Fetch the ghost document once per session.
 *
 * Memoised like {@link loadDeckRenderer}: concurrent callers share one
 * request, and a failure clears the memo so a later mount can retry rather
 * than replaying a rejected promise forever.
 *
 * @returns Resolves with the raw NeTEx XML.
 */
export function loadGhostDeckPlanXml(): Promise<string> {
  return (pending ??= fetch(GHOST_URL)
    .then(r => {
      if (!r.ok) throw new Error(`Sample deck plan ${r.status}`);
      return r.text();
    })
    .catch(e => {
      pending = null;
      throw e;
    }));
}
