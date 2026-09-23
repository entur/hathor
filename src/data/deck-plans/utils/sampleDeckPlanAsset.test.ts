import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { mkSampleDeckPlanXml } from './sampleDeckPlanXml.ts';
import { GHOST_PLAN_ID } from './loadGhostDeckPlan.ts';

/** Seats in the SAMPLE ghost — a full carriage, not a token row. */
const GHOST_SEATS = 46;

/** Served, not bundled; `loadGhostDeckPlanXml` fetches it from `public/`. */
const ASSET = 'public/sample-deck-plan.xml';

/**
 * The ghost document is a build artifact checked into `public/`, so it can be
 * fetched instead of bundled. That makes it the same class of thing as the
 * inlined copy it replaced — content duplicated away from its source — so it
 * gets the guard that copy never had.
 *
 * Regenerate with:
 *   node -e "…" is awkward for a .ts module; easiest is to let this test tell
 *   you what changed and paste the generator's output, or temporarily add a
 *   writeFileSync here.
 */
describe('public/sample-deck-plan.xml', () => {
  it('matches what mkSampleDeckPlanXml produces', () => {
    const expected = mkSampleDeckPlanXml([{ seats: GHOST_SEATS }], GHOST_PLAN_ID) + '\n';

    expect(readFileSync(ASSET, 'utf-8')).toBe(expected);
  });

  it('carries the id parseDecks selects and a full carriage of seats', () => {
    const xml = readFileSync(ASSET, 'utf-8');

    expect(xml).toContain(`id="${GHOST_PLAN_ID}"`);
    expect(xml.match(/<PassengerSpot\b/g)).toHaveLength(GHOST_SEATS);
  });
});
